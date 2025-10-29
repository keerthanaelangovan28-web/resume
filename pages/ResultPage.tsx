import React from 'react';
import { Link } from 'react-router-dom';
import type { QuizResult } from '../types';
import { motion } from 'framer-motion';

const ResultPage = () => {
  const resultStr = localStorage.getItem('latestResult');
  const resumeImageData = localStorage.getItem('resumeImageData');

  const handleDownloadImage = () => {
    if (!resumeImageData) return;
    const link = document.createElement('a');
    link.href = resumeImageData;
    link.download = 'resume.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (!resultStr) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">No result found</h1>
        <Link to="/" className="text-accent hover:underline">Go to Home</Link>
      </div>
    );
  }

  const result: QuizResult = JSON.parse(resultStr);
  
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-base-100 p-8 rounded-lg shadow-2xl border border-primary/40 text-center"
      >
        <h1 className="text-4xl font-extrabold text-accent mb-4">Quiz Complete!</h1>
        <p className="text-lg text-gray-300 mb-8">Here's your AI-evaluated performance.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-white">
          <div className="bg-secondary/50 p-6 rounded-lg">
            <p className="text-sm text-gray-400">AI-Calculated Score</p>
            <p className="text-4xl font-bold text-accent">{result.score}</p>
          </div>
          <div className="bg-secondary/50 p-6 rounded-lg">
            <p className="text-sm text-gray-400">Time Taken</p>
            <p className="text-4xl font-bold">{result.timeTaken}s</p>
          </div>
        </div>

        <div className="mb-10 p-4 bg-base-200/50 rounded-lg">
          <h2 className="text-2xl font-bold mb-2 text-white">Evaluation Summary</h2>
          <p className="text-gray-400">
            Your total score is based on an AI analysis of your answers, considering factors like correctness, clarity, and depth of understanding. This reflects your grasp of the conceptual topics related to your skills.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
            <Link to="/">
                <motion.button 
                    className="px-8 py-3 bg-primary text-white font-bold rounded-full shadow-lg text-lg w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Back to Home
                </motion.button>
            </Link>
            {resumeImageData && (
                <motion.button 
                    onClick={handleDownloadImage}
                    className="px-8 py-3 bg-accent text-primary font-bold rounded-full shadow-lg text-lg w-full sm:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Download Resume Image
                </motion.button>
            )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResultPage;