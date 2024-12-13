import axios from "axios";
import React, { useState } from "react";

const App = () => {
  const [question, setQuestion] = useState("");
  const [chatLog, setChatLog] = useState([]);

  async function getResponse() {
    if (!question.trim()) return; // Empty check

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${process.env.REACT_APP_API_KEY}`,
        {
          prompt: { text: question },
          temperature: 0.7,
          maxOutputTokens: 256,
        }
      );

      const aiResponse =
        response.data?.candidates?.[0]?.output || "No response";

      setChatLog((prevChat) => [
        ...prevChat,
        { sender: "You", text: question },
        { sender: "AI", text: aiResponse },
      ]);
      setQuestion(""); // Reset the input
    } catch (error) {
      console.error("Error fetching response:", error?.response || error);
    }
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-[#e0e0e0] font-mono">
      <div className="flex-1 p-4 overflow-y-scroll">
        {chatLog.map((message, index) => (
          <div
            key={index}
            className={`mb-7 ${
              message.sender === "AI" ? "text-left" : "text-right"
            }`}
          >
            <p
              className={`inline-block p-3 rounded-lg ${
                message.sender === "AI"
                  ? "bg-purple-400 text-black shadow-[7px_7px_11px_#bebebe,-7px_-7px_11px_#ffffff]"
                  : "bg-pink-400 text-black shadow-[7px_7px_11px_#bebebe,-7px_-7px_11px_#ffffff]"
              }`}
            >
              <strong>{message.sender}: </strong>
              {message.text}
            </p>
          </div>
        ))}
      </div>
      <div className="w-full h-16 bg-[#e0e0e0] flex items-center px-4">
        <input
          type="text"
          placeholder="Type your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 h-10 px-4 rounded-md shadow-[inset_7px_7px_19px_#bebebe,inset_-7px_-7px_19px_#ffffff]"
        />
        <button
          onClick={getResponse}
          className="ml-4 bg-pink-400 text-white px-4 py-2 rounded-lg shadow-[7px_7px_11px_#bebebe,-7px_-7px_11px_#ffffff] hover:bg-purple-400 ease-in-out transition-[600ms]"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
