
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ResumeData } from '../types';
import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle } from 'lucide-react';

const UploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = () => {
    if (!file) return;

    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      const mockData: ResumeData = {
        name: 'Jane Doe',
        skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'System Design'],
        experience: [
          'Lead Frontend Developer at TechCorp (3 years)',
          'Software Engineer at Innovate LLC (2 years)',
        ],
      };
      setResumeData(mockData);
      localStorage.setItem('resumeData', JSON.stringify(mockData));
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 2500);
  };

  const handleStartQuiz = () => {
    navigate('/quiz');
  };
  
  return (
    <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-8 text-white">Upload Your Resume</h1>
      <p className="text-gray-300 mb-8">
        Upload your resume in PDF or DOCX format. Our AI will extract your skills and experience to generate a personalized quiz.
      </p>

      {!analysisComplete ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-base-100 p-8 rounded-lg shadow-xl border border-secondary/50">
            <div className="border-2 border-dashed border-primary/50 rounded-lg p-10 mb-6">
              <UploadCloud className="w-16 h-16 mx-auto text-accent mb-4" />
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                accept=".pdf,.docx"
                onChange={handleFileChange}
              />
              <label htmlFor="resume-upload" className="cursor-pointer font-semibold text-accent hover:text-sky-300">
                {file ? file.name : 'Click to upload your resume'}
              </label>
              <p className="text-xs text-gray-500 mt-1">PDF or DOCX, max 5MB</p>
            </div>

            <motion.button
              onClick={handleAnalyze}
              disabled={!file || isAnalyzing}
              className="w-full px-6 py-3 bg-primary text-white font-bold rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
              whileHover={{ scale: 1.03 }}
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                'Analyze Resume'
              )}
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-base-100 p-8 rounded-lg shadow-xl border border-accent/50 text-left"
        >
          <div className="flex items-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-400 mr-4" />
            <h2 className="text-3xl font-bold text-green-400">Analysis Complete!</h2>
          </div>
          <div className="mb-4">
            <h3 className="font-bold text-xl mb-2 text-accent">Extracted Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {resumeData?.skills.map((skill, index) => (
                <span key={index} className="bg-secondary text-sky-300 px-3 py-1 rounded-full text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <motion.button
            onClick={handleStartQuiz}
            className="w-full mt-8 px-6 py-3 bg-accent text-primary font-bold rounded-lg"
            whileHover={{ scale: 1.03 }}
          >
            Start Skill Quiz
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default UploadPage;
