
import React, { useEffect, useState } from 'react';
import type { QuizResult } from '../types';
import { motion } from 'framer-motion';

const AdminPanelPage = () => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<QuizResult[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof QuizResult; direction: 'asc' | 'desc' } | null>({ key: 'score', direction: 'desc' });
  const [skillFilter, setSkillFilter] = useState('');
  
  useEffect(() => {
    const allResults = JSON.parse(localStorage.getItem('allResults') || '[]');
    setResults(allResults);
    setFilteredResults(allResults);
  }, []);
  
  useEffect(() => {
    let sortedResults = [...results];
    if (sortConfig !== null) {
      sortedResults.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    if (skillFilter) {
      sortedResults = sortedResults.filter(result => 
        result.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()))
      );
    }

    setFilteredResults(sortedResults);
  }, [results, sortConfig, skillFilter]);
  
  const requestSort = (key: keyof QuizResult) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIndicator = (key: keyof QuizResult) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-white">Admin Panel</h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-100 p-6 rounded-lg shadow-2xl border border-secondary/50"
      >
        <div className="mb-4">
            <input 
                type="text"
                placeholder="Filter by skill..."
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full max-w-xs px-4 py-2 bg-base-200 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
            />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-secondary">
                <th className="p-4 cursor-pointer" onClick={() => requestSort('userName')}>Name {getSortIndicator('userName')}</th>
                <th className="p-4 cursor-pointer text-center" onClick={() => requestSort('score')}>Score {getSortIndicator('score')}</th>
                <th className="p-4 cursor-pointer text-center" onClick={() => requestSort('timeTaken')}>Time (s) {getSortIndicator('timeTaken')}</th>
                <th className="p-4">Skills</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result) => (
                <tr key={result.userId + result.score} className="border-b border-secondary/50 hover:bg-base-200/50">
                  <td className="p-4 font-medium">{result.userName}</td>
                  <td className="p-4 text-center font-bold text-accent">{result.score}</td>
                  <td className="p-4 text-center">{result.timeTaken}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                        {result.skills.map((skill, i) => (
                            <span key={i} className="bg-secondary text-sky-300 px-2 py-1 rounded text-xs">{skill}</span>
                        ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredResults.length === 0 && <p className="text-center p-8 text-gray-400">No results found.</p>}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPanelPage;
