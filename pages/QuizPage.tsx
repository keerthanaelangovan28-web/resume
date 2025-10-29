
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Question } from '../types';
import { getQuizQuestions } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

const TIMER_SECONDS = 60;

const QuizPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const [startTime, setStartTime] = useState(Date.now());
  const navigate = useNavigate();

  const fetchQuestions = useCallback(async () => {
    const resumeDataStr = localStorage.getItem('resumeData');
    if (!resumeDataStr) {
      setError('Resume data not found. Please upload your resume first.');
      setLoading(false);
      return;
    }
    const resumeData = JSON.parse(resumeDataStr);
    try {
      const generatedQuestions = await getQuizQuestions(resumeData.skills);
      setQuestions(generatedQuestions);
    } catch (err) {
      setError('Failed to generate quiz questions. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading || questions.length === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return TIMER_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, questions.length, currentQuestionIndex]);

  const handleNextQuestion = () => {
    const newAnswers = [...answers, selectedAnswer || ''];
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimer(TIMER_SECONDS);
    } else {
      // Quiz finished
      const endTime = Date.now();
      const timeTaken = Math.round((endTime - startTime) / 1000);
      let correctAnswers = 0;
      questions.forEach((q, i) => {
        if (q.correctAnswer === newAnswers[i]) {
          correctAnswers++;
        }
      });
      const score = correctAnswers * 10 - Math.round(timeTaken / questions.length); // Example scoring
      
      const resumeData = JSON.parse(localStorage.getItem('resumeData') || '{}');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      const result = {
        userId: user.id || 'unknown',
        userName: user.email || 'unknown',
        score: Math.max(0, score),
        timeTaken,
        correctAnswers,
        totalQuestions: questions.length,
        skills: resumeData.skills || []
      };

      // Store results in localStorage (simulating DB)
      const allResults = JSON.parse(localStorage.getItem('allResults') || '[]');
      allResults.push(result);
      localStorage.setItem('allResults', JSON.stringify(allResults));
      localStorage.setItem('latestResult', JSON.stringify(result));
      
      navigate('/result');
    }
  };

  if (loading) return <div className="text-center text-accent text-xl">Generating your personalized quiz...</div>;
  if (error) return <div className="text-center text-red-500 text-xl">{error}</div>;
  if (questions.length === 0) return <div className="text-center text-xl">No questions available.</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-base-100 p-8 rounded-lg shadow-2xl border border-secondary/50">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-accent">Question {currentQuestionIndex + 1}/{questions.length}</span>
            <span className="text-lg font-bold text-red-400">Time left: {timer}s</span>
          </div>
          <div className="w-full bg-base-200 rounded-full h-2.5">
            <motion.div 
              className="bg-accent h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            ></motion.div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-8 min-h-[100px] text-white">{currentQuestion.question}</h2>
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedAnswer(option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors text-lg ${
                    selectedAnswer === option
                      ? 'bg-secondary border-accent'
                      : 'bg-base-200 border-secondary hover:border-sky-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.button
          onClick={handleNextQuestion}
          disabled={!selectedAnswer}
          className="w-full mt-8 py-3 bg-primary text-white font-bold rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
          whileHover={selectedAnswer ? { scale: 1.02 } : {}}
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </motion.button>
      </div>
    </div>
  );
};

export default QuizPage;
