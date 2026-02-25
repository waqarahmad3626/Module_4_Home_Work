import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

function App() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const CHAT_EXPIRY_DAYS = 30;

  const chatEndRef = useRef(null);

  // Load chats
 useEffect(() => {
  const saved = localStorage.getItem("rag_chats");

  if (saved) {
    const parsed = JSON.parse(saved);

    const now = new Date().getTime();
    const THIRTY_DAYS = CHAT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    // Remove expired chats
    const validChats = parsed.filter(
      (chat) => now - chat.createdAt < THIRTY_DAYS
    );

    if (validChats.length > 0) {
      setChats(validChats);
      setActiveChatId(validChats[0].id);
    } else {
      createNewChat();
    }
  } else {
    createNewChat();
  }
}, []);

  // Save chats
useEffect(() => {
  if (chats.length > 0) {
    localStorage.setItem("rag_chats", JSON.stringify(chats));
  }
}, [chats]);
  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, loading]);

  const createNewChat = () => {
  const newChat = {
    id: uuidv4(),
    title: "New Chat",
    messages: [],
    createdAt: new Date().getTime(),   // 👈 IMPORTANT
  };

  setChats((prev) => [newChat, ...prev]);
  setActiveChatId(newChat.id);
};

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const updateMessages = (newMessages) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: newMessages }
          : chat
      )
    );
  };

  const handleSend = async () => {
    if (!input.trim() || !activeChat) return;

    const userMessage = { role: "user", content: input };

    setChats((prevChats) =>
  prevChats.map((chat) =>
    chat.id === activeChatId
      ? { ...chat, createdAt: new Date().getTime() }
      : chat
  )
);

    // Auto-generate title from first message
    if (activeChat.messages.length === 0) {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === activeChatId
            ? { ...chat, title: input.substring(0, 25) + "..." }
            : chat
        )
      );
    }

    updateMessages([...activeChat.messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      const data = await response.json();

      const botMessage = {
        role: "assistant",
        content: data.answer,
      };

      updateMessages([
        ...activeChat.messages,
        userMessage,
        botMessage,
      ]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const renameChat = (chatId) => {
    const newTitle = prompt("Enter new chat name:");
    if (!newTitle) return;

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
  };

  const deleteChat = (chatId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this chat?"
    );
    if (!confirmDelete) return;

    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    setChats(updatedChats);

    if (updatedChats.length > 0) {
      setActiveChatId(updatedChats[0].id);
    } else {
      createNewChat();
    }
  };

  return (
    <div className={`d-flex vh-100 ${darkMode ? "bg-dark text-white" : "bg-light"}`}>

      {/* Sidebar */}
      <div
        className={`sidebar p-3 border-end ${
          sidebarOpen ? "" : "collapsed"
        } ${darkMode ? "bg-secondary" : "bg-white"}`}
        style={{ width: "360px" }}
      >
        <button className="btn btn-primary w-100 mb-3" onClick={createNewChat}>
          + New Chat
        </button>

        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`d-flex justify-content-between align-items-center p-2 rounded mb-2 ${
              chat.id === activeChatId
                ? "bg-primary text-white"
                : darkMode
                ? "bg-dark border"
                : "bg-light"
            }`}
          >
            <span
              style={{ cursor: "pointer" }}
              onClick={() => setActiveChatId(chat.id)}
            >
              {chat.title}
            </span>

            <div className="d-flex gap-2">
              <i
                className="bi bi-pencil icon-btn"
                style={{ cursor: "pointer" }}
                onClick={() => renameChat(chat.id)}
              ></i>

              <i
                className="bi bi-trash text-danger icon-btn"
                style={{ cursor: "pointer" }}
                onClick={() => deleteChat(chat.id)}
              ></i>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="flex-grow-1 d-flex flex-column position-relative">

        {/* Sidebar Toggle */}
        <button
          className="btn btn-light position-absolute"
          style={{ top: "15px", left: "15px", zIndex: 1000 }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <i className="bi bi-list"></i>
        </button>

        {/* Messages */}
        <div className="flex-grow-1 overflow-auto p-4">

          {activeChat?.messages.length === 0 && (
            <div className="text-center mt-5">
              <h2>Welcome to Waqar Chat AI 🤖</h2>
              <p className="text-muted">
                Ask anything about your uploaded documents.
              </p>
            </div>
          )}

          {activeChat?.messages.map((msg, index) => (
            <div
              key={index}
              className={`d-flex mb-3 ${
                msg.role === "user"
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
            >
              <div
                className={`p-3 rounded-4 shadow-sm message-bubble ${
                  msg.role === "user"
                    ? "bg-primary text-white"
                    : darkMode
                    ? "bg-secondary text-white"
                    : "bg-white"
                }`}
                style={{ maxWidth: "70%" }}
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-muted">Assistant is typing...</div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* GPT Style Input */}
        <div className={`p-4 ${darkMode ? "bg-dark" : "bg-light"}`}>
          <div className="position-relative">
            <input
              className="form-control rounded-pill pe-5 py-3 shadow-sm"
              value={input}
              placeholder="Message Waqar Chat AI..."
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />

            <button
              className="btn btn-primary rounded-circle position-absolute"
              style={{
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "40px",
                height: "40px",
              }}
              onClick={handleSend}
            >
              <i className="bi bi-arrow-up"></i>
            </button>
          </div>
        </div>

        {/* Floating Dark Mode Toggle */}
        <button
          className="btn btn-dark rounded-circle position-absolute shadow floating-btn"
          style={{
            bottom: "100px",
            right: "20px",
            width: "50px",
            height: "50px",
          }}
          onClick={() => setDarkMode(!darkMode)}
        >
          <i className={`bi ${darkMode ? "bi-sun" : "bi-moon"}`}></i>
        </button>

      </div>
    </div>
  );
}

export default App;