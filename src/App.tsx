import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClerkProvider, useUser } from '@clerk/clerk-react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { QuestionCard } from './components/QuestionCard';
import { Pagination } from './components/Pagination';
import { Sidebar } from './components/Sidebar';
import { AskQuestion } from './components/AskQuestion';

// Clerk configuration
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = PUBLISHABLE_KEY && PUBLISHABLE_KEY !== 'your_clerk_publishable_key_here';

// Main App Component
const AppContent: React.FC = () => {
  const { isSignedIn } = isClerkConfigured ? useUser() : { isSignedIn: false };
  const [darkMode, setDarkMode] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Newest');
  const [selectedCategory, setSelectedCategory] = useState('home');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAskQuestion, setShowAskQuestion] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Mock data for questions
  const questions = [
    {
      id: 1,
      title: "How to join 2 columns in a data set to make a separate column in SQL",
      description: "I do not know the code for it as I am a beginner. As an example what I need to do is like there is a column Velvety Echidna first name, and column 2 consists of last name I want a column to combine...",
      username: "Adnan Arodiya",
      answers: 5,
      views: 234,
      votes: 12,
      tags: ["sql", "database", "beginner"],
      timeAgo: "2 hours ago",
      hasAcceptedAnswer: true
    },
    {
      id: 2,
      title: "Best practices for React component optimization",
      description: "What are the recommended patterns for optimizing React components performance? I'm working on a large application and noticing some performance issues...",
      username: "Sarah Johnson",
      answers: 3,
      views: 156,
      votes: 8,
      tags: ["react", "performance", "optimization"],
      timeAgo: "4 hours ago"
    },
    {
      id: 3,
      title: "Understanding JavaScript closures with practical examples",
      description: "Can someone explain closures in JavaScript with real-world examples? I've read the documentation but still struggling to understand when and how to use them effectively...",
      username: "Mike Chen",
      answers: 2,
      views: 89,
      votes: 15,
      tags: ["javascript", "closures", "fundamentals"],
      timeAgo: "6 hours ago"
    },
    {
      id: 4,
      title: "CSS Grid vs Flexbox: When to use which?",
      description: "I'm confused about when to use CSS Grid and when to use Flexbox. What are the specific use cases for each layout method?",
      username: "Emma Davis",
      answers: 7,
      views: 312,
      votes: 23,
      tags: ["css", "grid", "flexbox", "layout"],
      timeAgo: "8 hours ago",
      hasAcceptedAnswer: true
    },
    {
      id: 5,
      title: "Docker container networking best practices",
      description: "What are the best practices for setting up networking between Docker containers in a microservices architecture?",
      username: "Alex Rodriguez",
      answers: 1,
      views: 67,
      votes: 5,
      tags: ["docker", "networking", "microservices"],
      timeAgo: "12 hours ago"
    }
  ];

  const totalPages = 7;

  if (showAskQuestion) {
    return (
      <AskQuestion 
        darkMode={darkMode} 
        onClose={() => setShowAskQuestion(false)} 
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900 dark' : 'bg-gray-50'
    }`}>
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
      />
      
      <div className="flex">
        <Sidebar 
          darkMode={darkMode}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        
        <main className="flex-1">
          <FilterBar 
            darkMode={darkMode}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            onAskQuestion={() => setShowAskQuestion(true)}
          />
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <h2 className={`text-2xl font-bold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                All Questions
              </h2>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {questions.length * totalPages} questions
              </p>
            </motion.div>

            <div className="space-y-4">
              {questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  darkMode={darkMode}
                  index={index}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              darkMode={darkMode}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

// App wrapper with conditional Clerk provider
function App() {
  if (isClerkConfigured) {
    return (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <AppContent />
      </ClerkProvider>
    );
  }

  // Fallback when Clerk is not configured
  return <AppContent />;
}

export default App;