
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FileText, UserCog, BrainCircuit } from 'lucide-react';

const HomePage = () => {
  const { user, isAdmin } = useAuth();

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="text-center py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-extrabold text-white mb-2">Welcome, {user?.email.split('@')[0]}</h1>
        <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
          Unlock your potential. Upload your resume to get a skills analysis and take a personalized quiz to see where you stand.
        </p>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Link to="/upload" className="block p-8 bg-base-100/70 backdrop-blur-md rounded-xl shadow-lg border border-secondary/50 hover:border-accent transition-all duration-300 transform hover:-translate-y-1">
            <FileText className="h-16 w-16 mx-auto text-accent mb-4" />
            <h2 className="text-2xl font-bold mb-2">Upload Resume</h2>
            <p className="text-gray-400">Get an instant AI-powered analysis of your skills and experience.</p>
          </Link>
        </motion.div>
        
        {isAdmin && (
          <motion.div variants={itemVariants}>
            <Link to="/admin" className="block p-8 bg-base-100/70 backdrop-blur-md rounded-xl shadow-lg border border-secondary/50 hover:border-accent transition-all duration-300 transform hover:-translate-y-1">
              <UserCog className="h-16 w-16 mx-auto text-accent mb-4" />
              <h2 className="text-2xl font-bold mb-2">Admin Panel</h2>
              <p className="text-gray-400">View and manage candidate results and rankings.</p>
            </Link>
          </motion.div>
        )}
      </motion.div>
      
      <motion.div 
        className="py-16 px-8 bg-secondary/30 rounded-lg max-w-5xl mx-auto flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <BrainCircuit className="h-20 w-20 text-accent mb-6" />
        <h3 className="text-3xl font-bold mb-4">Ready to Test Your Skills?</h3>
        <p className="text-gray-300 max-w-xl mb-8">
          After analyzing your resume, our AI will generate a unique quiz tailored to your skill set. Prove your expertise and climb the ranks!
        </p>
        <Link to="/upload">
          <motion.button 
            className="px-8 py-3 bg-accent text-primary font-bold rounded-full shadow-lg text-lg"
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px #38BDF8" }}
            whileTap={{ scale: 0.95 }}
          >
            Analyze My Resume
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default HomePage;
