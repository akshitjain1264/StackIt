import React from 'react';
import { motion } from 'framer-motion';
import { Search, Moon, Sun, User, Plus, LogOut } from 'lucide-react';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { NotificationDropdown } from './NotificationDropdown';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

// Check if Clerk is configured
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = PUBLISHABLE_KEY && PUBLISHABLE_KEY !== 'your_clerk_publishable_key_here';

export const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  // Only use Clerk hooks if Clerk is properly configured
  const clerkData = isClerkConfigured ? useUser() : { isSignedIn: false, user: null };
  const { isSignedIn, user } = clerkData;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
        darkMode 
          ? 'bg-gray-900/90 border-gray-700' 
          : 'bg-white/90 border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white bg-gradient-to-br from-blue-500 to-purple-600`}>
              S
            </div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              StackIt
            </h1>
          </motion.div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                placeholder="Search questions..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <NotificationDropdown darkMode={darkMode} />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors duration-300 ${
                darkMode 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {isClerkConfigured && isSignedIn ? (
              <div className="flex items-center space-x-3">
                <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Welcome, {user?.firstName || user?.username}!
                </div>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      userButtonPopoverCard: darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200",
                      userButtonPopoverText: darkMode ? "text-gray-300" : "text-gray-700"
                    }
                  }}
                />
              </div>
            ) : isClerkConfigured ? (
              <div className="flex items-center space-x-3">
                <SignInButton mode="modal">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                      darkMode 
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600' 
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    Login
                  </motion.button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                  >
                    Sign Up
                  </motion.button>
                </SignUpButton>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                    darkMode 
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  Login
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                  Sign Up
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};