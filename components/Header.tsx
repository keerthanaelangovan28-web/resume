
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-base-100/50 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/">
          <motion.h1 
            className="text-2xl font-bold text-accent"
            whileHover={{ scale: 1.05 }}
          >
            AI Resume Ranker
          </motion.h1>
        </Link>
        <nav className="flex items-center space-x-4">
          {user && (
            <>
               {isAdmin && <Link to="/admin" className="text-gray-300 hover:text-accent transition-colors">Admin Panel</Link>}
              <motion.button
                onClick={handleLogout}
                className="bg-accent text-primary font-semibold px-4 py-2 rounded-md shadow-md hover:bg-sky-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
