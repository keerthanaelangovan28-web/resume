import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserCog, UploadCloud, CheckCircle } from 'lucide-react';
import type { ResumeData } from '../types';
import { analyzeResumeImage } from '../services/geminiService';

declare const pdfjsLib: any;

const HomePage = () => {
  const { user, isAdmin } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (!event.target?.result) {
            setError('Failed to read the file.');
            setIsAnalyzing(false);
            return;
        }
        
        try {
            const typedarray = new Uint8Array(event.target.result as ArrayBuffer);
            const pdf = await pdfjsLib.getDocument(typedarray).promise;
            const page = await pdf.getPage(1); // Process first page only
            
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport: viewport }).promise;
            
            const imageData = canvas.toDataURL('image/jpeg');
            localStorage.setItem('resumeImageData', imageData); // Store image for download later
            const base64Image = imageData.split(',')[1];

            const data = await analyzeResumeImage(base64Image);
            setResumeData(data);
            localStorage.setItem('resumeData', JSON.stringify(data));
            setAnalysisComplete(true);
        } catch (e) {
            console.error(e);
            setError('Failed to process resume. The file might be corrupted or in an unsupported format.');
        } finally {
            setIsAnalyzing(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      console.error("Error analyzing resume:", err);
      setError('An unexpected error occurred.');
      setIsAnalyzing(false);
    }
  };

  const handleStartQuiz = () => {
    navigate('/quiz');
  };

  return (
    <div className="py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold text-white mb-2">Welcome, {user?.email.split('@')[0]}</h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Ready to prove your skills? Upload your resume to begin the analysis and take your personalized quiz.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Main content: Upload and analysis */}
        <div className="md:col-span-2">
            <div className="max-w-3xl mx-auto text-center">
                {!analysisComplete ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="bg-base-100 p-8 rounded-lg shadow-xl border border-secondary/50">
                            <h2 className="text-3xl font-bold mb-4 text-white">Upload Your Resume</h2>
                            <p className="text-gray-300 mb-6">
                                Upload your resume in PDF format. Our AI will analyze an image of your resume to extract skills and generate a quiz.
                            </p>
                            <div className="border-2 border-dashed border-primary/50 rounded-lg p-10 mb-6">
                            <UploadCloud className="w-16 h-16 mx-auto text-accent mb-4" />
                            <input
                                type="file"
                                id="resume-upload"
                                className="hidden"
                                accept=".pdf"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="resume-upload" className="cursor-pointer font-semibold text-accent hover:text-sky-300">
                                {file ? file.name : 'Click to upload your resume'}
                            </label>
                            <p className="text-xs text-gray-500 mt-1">PDF only, max 5MB</p>
                            </div>

                            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

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
                                Analyzing Resume...
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
        </div>

        {/* Side content: Admin Panel */}
        {isAdmin && (
          <motion.div 
            className="md:col-span-1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
          >
            <Link to="/admin" className="block p-8 h-full bg-base-100/70 backdrop-blur-md rounded-xl shadow-lg border border-secondary/50 hover:border-accent transition-all duration-300 transform hover:-translate-y-1">
              <UserCog className="h-16 w-16 mx-auto text-accent mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-center">Admin Panel</h2>
              <p className="text-gray-400 text-center">View and manage candidate results and rankings.</p>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HomePage;