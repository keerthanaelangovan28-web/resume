
import React from 'react';
import { Link } from 'react-router-dom';
import type { QuizResult } from '../types';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ResultPage = () => {
  const resultStr = localStorage.getItem('latestResult');
  
  if (!resultStr) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">No result found</h1>
        <Link to="/" className="text-accent hover:underline">Go to Home</Link>
      </div>
    );
  }

  const result: QuizResult = JSON.parse(resultStr);

  const data = [
    { name: 'Correct', value: result.correctAnswers, fill: '#38BDF8' },
    { name: 'Incorrect', value: result.totalQuestions - result.correctAnswers, fill: '#F87171' },
  ];
  
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-base-100 p-8 rounded-lg shadow-2xl border border-primary/40 text-center"
      >
        <h1 className="text-4xl font-extrabold text-accent mb-4">Quiz Complete!</h1>
        <p className="text-lg text-gray-300 mb-8">Here's how you performed.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-white">
          <div className="bg-secondary/50 p-6 rounded-lg">
            <p className="text-sm text-gray-400">Total Score</p>
            <p className="text-4xl font-bold text-accent">{result.score}</p>
          </div>
          <div className="bg-secondary/50 p-6 rounded-lg">
            <p className="text-sm text-gray-400">Time Taken</p>
            <p className="text-4xl font-bold">{result.timeTaken}s</p>
          </div>
          <div className="bg-secondary/50 p-6 rounded-lg">
            <p className="text-sm text-gray-400">Accuracy</p>
            <p className="text-4xl font-bold">
              {((result.correctAnswers / result.totalQuestions) * 100).toFixed(0)}%
            </p>
          </div>
        </div>

        <div className="mb-10 h-64 w-full">
            <h2 className="text-2xl font-bold mb-4 text-white">Answer Summary</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                    <XAxis type="number" stroke="#9CA3AF" />
                    <YAxis type="category" dataKey="name" stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }} />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" barSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </div>

        <Link to="/">
          <motion.button 
            className="px-8 py-3 bg-primary text-white font-bold rounded-full shadow-lg text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default ResultPage;
