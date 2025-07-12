import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Filter, ChevronDown } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';

interface FilterBarProps {
  darkMode: boolean;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  onAskQuestion: () => void;
}

// Check if Clerk is configured
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = PUBLISHABLE_KEY && PUBLISHABLE_KEY !== 'your_clerk_publishable_key_here';

export const FilterBar: React.FC<FilterBarProps> = ({ darkMode, selectedFilter, setSelectedFilter, onAskQuestion }) => {
  // Only import and use useUser if Clerk is configured
  let isSignedIn = false;
  if (isClerkConfigured) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { isSignedIn: clerkSignedIn } = useUser();
    isSignedIn = clerkSignedIn;
  }
  
  const filters = ['Newest', 'Unanswered', 'Active', 'Hot', 'Week', 'Month'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`border-b transition-colors duration-300 ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAskQuestion}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              <span>Ask New Question</span>
            </motion.button>

            <div className="flex items-center space-x-2">
              <Filter className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Filters:
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {filters.map((filter) => (
              <motion.button
                key={filter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  selectedFilter === filter
                    ? 'bg-blue-500 text-white'
                    : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              className={`p-1.5 rounded-lg transition-colors duration-300 ${
                darkMode 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};