import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "./App.css";

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Theme Toggle State

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", { code });
      setReview(response.data);
    } catch (error) {
      setReview("❌ Error fetching review. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className={`container ${darkMode ? "dark-theme" : "light-theme"}`}>
      {/* Header with Theme Toggle */}
      <header className="header">
        <h1 className="text-2xl">AI Code Reviewer</h1>
        <button className="theme-toggle-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      <div className="content">
        {/* Left Panel - Code Editor */}
        <div className="panel left-panel">
          <h2>Code Editor</h2>
          <div className="code-box">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: 16,
                backgroundColor: darkMode ? "#1e1e1e" : "#f5f5f5",
                color: darkMode ? "#ffffff" : "#333",
                borderRadius: "5px",
                minHeight: "300px",
                maxHeight: "450px",
                overflowY: "auto",
              }}
            />
          </div>
          <button onClick={reviewCode} className="review-btn">Review Code</button>
        </div>

        {/* Right Panel - AI Code Review */}
        <div className="panel right-panel">
          <h2>AI Code Review</h2>
          <div className="review-box">
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
