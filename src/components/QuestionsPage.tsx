import React, { useState } from "react";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";

type Answer = {
  id: number;
  text: string;
  votes: number;
  votedByUser: boolean;
};

interface QuestionPageProps {
  darkMode: boolean;
}

const QuestionPage: React.FC<QuestionPageProps> = ({ darkMode }) => {
  const { isSignedIn } = useUser();

  const [answers, setAnswers] = useState<Answer[]>([
    {
      id: 1,
      text: "The `||` Operator.\nThe `+` Operator.\nThe `CONCAT` Function.",
      votes: 1,
      votedByUser: false,
    },
    {
      id: 2,
      text: "Use `CONCAT(FirstName, ' ', LastName)`.",
      votes: 0,
      votedByUser: false,
    },
  ]);

  const [newAnswer, setNewAnswer] = useState("");

  const handleVote = (id: number) => {
    if (!isSignedIn) {
      alert("Please sign in to vote.");
      return;
    }

    setAnswers((prev) =>
      prev.map((a) =>
        a.id === id && !a.votedByUser
          ? { ...a, votes: a.votes + 1, votedByUser: true }
          : a
      )
    );
  };

  const handleSubmit = () => {
    if (!isSignedIn) {
      alert("Please sign in to submit your answer.");
      return;
    }

    if (newAnswer.trim() === "") return;

    const newAns: Answer = {
      id: Date.now(),
      text: newAnswer,
      votes: 0,
      votedByUser: false,
    };
    setAnswers((prev) => [...prev, newAns]);
    setNewAnswer("");
  };

  const containerClass = darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800";
  const cardClass = darkMode ? "bg-gray-800 text-gray-200" : "bg-gray-100 text-gray-800";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-300";
  const textareaClass = darkMode
    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-6 max-w-3xl mx-auto min-h-screen transition-colors duration-300 ${containerClass}`}
    >
      <div className="text-sm text-blue-500 mb-2 cursor-pointer underline">
        Question &gt; How to join 2 columns...
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl font-semibold mb-2"
      >
        How to join 2 columns in a data set to make a separate column in SQL
      </motion.h2>

      <p className="mb-4 text-gray-500 dark:text-gray-400">
        I do not know the code for it as I am a beginner. As an example, what I
        need to do is like there is a column 1 containing First name, and column
        2 consists of last name. I want a column to combine.
      </p>

      <div className="mt-6">
        <h3 className="text-xl font-medium mb-3">Answers</h3>
        {answers.map((answer) => (
          <motion.div
            key={answer.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex gap-4 items-start mb-4 p-3 rounded-lg ${cardClass} border ${borderColor}`}
          >
            <div className="flex flex-col items-center">
              <button
                onClick={() => handleVote(answer.id)}
                className={`text-lg hover:text-green-500 transition-all ${
                  answer.votedByUser ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={answer.votedByUser}
              >
                ↑
              </button>
              <span>{answer.votes}</span>
              <span className="text-gray-400">↓</span>
            </div>
            <div className="whitespace-pre-line">{answer.text}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Submit Your Answer</h3>
        {!isSignedIn && (
          <div className="mb-2 text-red-500">
            <SignInButton mode="modal">
              <span className="underline cursor-pointer">Sign in</span>
            </SignInButton>{" "}
            to post your answer.
          </div>
        )}
        <textarea
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          className={`w-full rounded p-3 min-h-[120px] border ${textareaClass}`}
          placeholder="Type your answer here..."
          disabled={!isSignedIn}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className={`mt-2 px-4 py-2 rounded font-medium transition-all duration-300 ${
            !isSignedIn
              ? "bg-gray-500 text-white cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          disabled={!isSignedIn}
        >
          Submit
        </motion.button>
      </div>
    </motion.div>
  );
};

export default QuestionPage;
