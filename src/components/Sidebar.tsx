import React from 'react';
import { motion } from 'framer-motion';
import { Home, TrendingUp, Clock, Star, Users, Settings, HelpCircle } from 'lucide-react';

interface SidebarProps {
  darkMode: boolean;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ darkMode, selectedCategory, setSelectedCategory }) => {
  const categories = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'featured', label: 'Featured', icon: Star },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'help', label: 'Help Center', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className={`w-64 h-screen sticky top-16 p-4 border-r transition-colors duration-300 ${
        darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}
    >
      <nav className="space-y-2">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCategory(category.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-300 ${
              selectedCategory === category.id
                ? 'bg-blue-500 text-white'
                : darkMode
                  ? 'text-gray-300 hover:bg-gray-800'
                  : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <category.icon className="w-5 h-5" />
            <span className="font-medium">{category.label}</span>
          </motion.button>
        ))}
      </nav>

      <div className={`mt-8 p-4 rounded-lg ${
        darkMode ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Quick Stats
        </h3>
        <div className="space-y-2 text-sm">
          <div className={`flex justify-between ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <span>Questions</span>
            <span className="font-medium">2,847</span>
          </div>
          <div className={`flex justify-between ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <span>Answers</span>
            <span className="font-medium">5,123</span>
          </div>
          <div className={`flex justify-between ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <span>Users</span>
            <span className="font-medium">1,205</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};