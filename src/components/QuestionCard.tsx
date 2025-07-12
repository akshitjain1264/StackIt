import React from 'react';
import { useNavigate } from 'react-router-dom'; // ← import navigate hook
import { motion } from 'framer-motion';
import { Eye, ArrowUp, Clock } from 'lucide-react';

interface Question {
  id: number;
  title: string;
  description: string;
  username: string;
  answers: number;
  views: number;
  votes: number;
  tags: string[];
  timeAgo: string;
  hasAcceptedAnswer?: boolean;
}

interface QuestionCardProps {
  question: Question;
  darkMode: boolean;
  index: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, darkMode, index }) => {
  const navigate = useNavigate(); // ← initialize navigate

  const handleClick = () => {
    navigate(`/questions/${question.id}`);
  };

  return (
    <motion.div
      onClick={handleClick} // ← add click handler
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
        darkMode 
          ? 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-750' 
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold mb-2 line-clamp-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {question.title}
          </h3>
          <p className={`text-sm line-clamp-2 mb-3 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {question.description}
          </p>
        </div>
        
        <div className={`ml-4 text-right ${
          question.hasAcceptedAnswer 
            ? 'text-green-500' 
            : question.answers > 0 
              ? 'text-blue-500' 
              : darkMode ? 'text-gray-500' : 'text-gray-400'
        }`}>
          <div className="text-lg font-bold">{question.answers}</div>
          <div className="text-xs">ans</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white bg-gradient-to-br ${
              index % 3 === 0 ? 'from-blue-500 to-purple-600' :
              index % 3 === 1 ? 'from-green-500 to-teal-600' :
              'from-orange-500 to-red-600'
            }`}>
              {question.username.charAt(0).toUpperCase()}
            </div>
            <span className={`text-sm font-medium ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {question.username}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <Clock className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              {question.timeAgo}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <ArrowUp className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {question.votes}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Eye className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {question.views}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {question.tags.map((tag) => (
          <motion.span
            key={tag}
            whileHover={{ scale: 1.05 }}
            className={`px-2 py-1 text-xs rounded-md font-medium transition-colors duration-300 ${
              darkMode 
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tag}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};
