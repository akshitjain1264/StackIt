import React, { useEffect, useState } from "react";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom"; // ← assumes react‑router‑dom

/* ---------- types ---------- */

type Answer = {
  id: string | number;
  text: string;
  votes: number;
  votedByUser: boolean;
};

type Question = {
  id: string | number;
  title: string;
  body: string;
  answers: Answer[];
};

interface QuestionPageProps {
  darkMode: boolean;
}

/* ---------- component ---------- */

const QuestionPage: React.FC<QuestionPageProps> = ({ darkMode }) => {
  const { id } = useParams<{ id: string }>();
  const { isSignedIn, user } = useUser();

  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAnswer, setNewAnswer] = useState("");

  // Define sample fallback
  const sampleQuestion: Question = {
    id: "sample",
    title:
      "How to join 2 columns in a data set to make a separate column in SQL",
    body: "I do not know the code for it as I am a beginner. As an example, what I need to do is like there is a column 1 containing First name, and column 2 consists of last name. I want a column to combine.",
    answers: [
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
    ],
  };

  /* ----- fetch question + answers ----- */
  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}/question/${id}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const q: Question = await res.json();

        // fallback if no question or empty answers
        if (!q || !q.title || !q.body || (q.answers?.length ?? 0) === 0) {
          setQuestion(sampleQuestion);
        } else {
          setQuestion(q);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error(err);
          setQuestion(sampleQuestion); // fallback on error too
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id]);

  /* ----- optimistic vote handler ----- */
  const handleVote = async (answerId: Answer["id"]) => {
    if (!isSignedIn) return alert("Please sign in to vote.");

    setQuestion((prev) =>
      prev
        ? {
            ...prev,
            answers: prev.answers.map((a) =>
              a.id === answerId && !a.votedByUser
                ? { ...a, votes: a.votes + 1, votedByUser: true }
                : a
            ),
          }
        : prev
    );

    // fire‑and‑forget – handle failures as you prefer
    fetch(
      `${
        import.meta.env.VITE_API_ENDPOINT
      }/question/${id}/answers/${answerId}/vote`,
      { method: "POST", credentials: "include" }
    ).catch(() => null);
  };

  /* ----- submit answer ----- */
  const handleSubmit = async () => {
    if (!isSignedIn) return alert("Please sign in to submit your answer.");
    if (!newAnswer.trim()) return;

    // create temp answer so the UI feels instant
    const tempAnswer: Answer = {
      id: Date.now(),
      text: newAnswer,
      votes: 0,
      votedByUser: false,
    };
    setQuestion((prev) =>
      prev ? { ...prev, answers: [...prev.answers, tempAnswer] } : prev
    );
    setNewAnswer("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/question/${id}/answers`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ text: newAnswer }),
        }
      );
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const saved: Answer = await res.json();

      // swap temp answer with saved copy
      setQuestion((prev) =>
        prev
          ? {
              ...prev,
              answers: prev.answers.map((a) =>
                a.id === tempAnswer.id ? saved : a
              ),
            }
          : prev
      );
    } catch (err) {
      alert("Could not submit your answer. Please try again.");
      // roll back optimistic insert
      setQuestion((prev) =>
        prev
          ? {
              ...prev,
              answers: prev.answers.filter((a) => a.id !== tempAnswer.id),
            }
          : prev
      );
    }
  };

  /* ---------- styling helpers ---------- */

  const containerClass = darkMode
    ? "bg-gray-900 text-white"
    : "bg-white text-gray-800";
  const cardClass = darkMode
    ? "bg-gray-800 text-gray-200"
    : "bg-gray-100 text-gray-800";
  const borderColor = darkMode ? "border-gray-700" : "border-gray-300";
  const textareaClass = darkMode
    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500";

  /* ---------- render ---------- */

  if (loading)
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${containerClass}`}
      >
        Loading…
      </div>
    );

  if (error || !question)
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${containerClass}`}
      >
        {error ? `Error: ${error}` : "Question not found"}
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`p-6 max-w-3xl mx-auto min-h-screen transition-colors duration-300 ${containerClass}`}
    >
      {/* 🧭 breadcrumb */}
      <div className="text-sm text-blue-500 mb-2 cursor-pointer underline">
        Question &gt; {question.title.slice(0, 40)}…
      </div>

      {/* 📝 title */}
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl font-semibold mb-2"
      >
        {question.title}
      </motion.h2>

      {/* 💬 body */}
      <p className="mb-4 text-gray-500 dark:text-gray-400 whitespace-pre-line">
        {question.body}
      </p>

      {/* ----- answers list ----- */}
      <div className="mt-6">
        <h3 className="text-xl font-medium mb-3">Answers</h3>
        {question.answers.map((answer) => (
          <motion.div
            key={answer.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex gap-4 items-start mb-4 p-3 rounded-lg ${cardClass} border ${borderColor}`}
          >
            {/* votes column */}
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

            {/* answer text */}
            <div className="whitespace-pre-line">{answer.text}</div>
          </motion.div>
        ))}
      </div>

      {/* ----- new answer form ----- */}
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
