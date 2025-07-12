import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import AppContent from './AppContent';
import QuestionPage from './components/QuestionsPage'; // Ensure path is correct
import { Header } from './components/Header';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = PUBLISHABLE_KEY && PUBLISHABLE_KEY !== 'your_clerk_publishable_key_here';

function AppRoutes({ darkMode }: { darkMode: boolean }) {
  return (
    <Routes>
      <Route path="/" element={<AppContent />} />
      <Route path="/questions/:id" element={<QuestionPage darkMode={darkMode} />} />
    </Routes>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const content = (
    <BrowserRouter>
      {/* Global Header */}
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* Main Routes */}
      <AppRoutes darkMode={darkMode} />
    </BrowserRouter>
  );

  return isClerkConfigured ? (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>{content}</ClerkProvider>
  ) : (
    content
  );
}

export default App;
