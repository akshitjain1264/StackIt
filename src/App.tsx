import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import AppContent from './AppContent';
import QuestionPage from './components/QuestionsPage'; // ⬅️ Create this file

// Clerk configuration
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isClerkConfigured = PUBLISHABLE_KEY && PUBLISHABLE_KEY !== 'your_clerk_publishable_key_here';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppContent />} />
      <Route path="/questions/:id" element={<QuestionPage darkMode={false} />} />
    </Routes>
  );
}

function App() {
  const content = (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );

  if (isClerkConfigured) {
    return <ClerkProvider publishableKey={PUBLISHABLE_KEY}>{content}</ClerkProvider>;
  }

  return content;
}

export default App;
