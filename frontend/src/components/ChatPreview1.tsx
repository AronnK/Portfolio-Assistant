"use client";
import React, { useState, FC, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  User,
  Send,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
} from "lucide-react";

interface Message {
  text: string;
  isUser: boolean;
  timestamp?: string;
}

interface ChatPreviewProps {
  chatbotId: string;
  isDark?: boolean;
}

export const ChatPreview1: FC<ChatPreviewProps> = ({
  chatbotId,
  isDark = false,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your AI portfolio assistant. Ask me anything about this professional's experience, skills, projects, or education!",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const dummyResponses = [
    "Based on the resume, this professional has a B.Tech in Artificial Intelligence and Data Science from Panimalar Engineering College with a CGPA of 8.5. They have strong expertise in AI/ML, embedded systems, and full-stack development.",
    "This candidate has worked on several impressive projects including an AI-powered 2048 game solver using reinforcement learning with DQN/DDQN architectures, and various 8051 microcontroller applications. They've also built full-stack web applications.",
    "Their technical skills include Python, C#, C, Assembly Language, JavaScript, React, Next.js, and Node.js. They have experience with AI/ML frameworks, embedded programming, and modern web technologies like Tailwind CSS and Vercel deployment.",
    "The candidate has demonstrated strong problem-solving abilities through their technical interview preparation for companies like CTS, and their hands-on experience with reinforcement learning, CNN architectures, and microcontroller programming.",
    "They're actively seeking opportunities at major IT companies and have a proven track record of completing complex projects from concept to deployment, including AI agents, web applications, and embedded systems.",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      text: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const randomResponse =
        dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
      const botMessage: Message = {
        text: randomResponse,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);

    // Uncomment when backend is ready
    // try {
    //   const response = await fetch("http://127.0.0.1:5001/api/chat", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ chatbot_id: chatbotId, query: input }),
    //   });
    //   if (!response.ok) throw new Error("API request failed");
    //   const result = await response.json();
    //   const botMessage: Message = {
    //     text: result.answer,
    //     isUser: false,
    //     timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    //   };
    //   setMessages((prev) => [...prev, botMessage]);
    // } catch (error) {
    //   console.error("Chat API error:", error);
    //   const errorMessage: Message = {
    //     text: "Sorry, an error occurred. Please try again.",
    //     isUser: false,
    //     timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    //   };
    //   setMessages((prev) => [...prev, errorMessage]);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleReset = () => {
    setMessages([
      {
        text: "Hello! I'm your AI portfolio assistant. Ask me anything about this professional's experience, skills, projects, or education!",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col h-[600px] rounded-2xl border overflow-hidden backdrop-blur-xl transition-all duration-300 ${
        isDark
          ? "bg-slate-900/50 border-slate-800/50 shadow-2xl shadow-purple-900/20"
          : "bg-white/40 border-white/40 shadow-2xl shadow-indigo-500/10"
      }`}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`px-6 py-4 border-b backdrop-blur-xl ${
          isDark
            ? "bg-slate-950/80 border-slate-800/50"
            : "bg-white/30 border-white/30"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={`p-2.5 rounded-xl ${
                isDark
                  ? "bg-gradient-to-br from-purple-600 to-blue-600"
                  : "bg-gradient-to-br from-indigo-500 to-purple-500"
              }`}
            >
              <Bot className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h2
                className={`text-lg font-bold ${
                  isDark ? "text-gray-100" : "text-slate-900"
                }`}
              >
                Portfolio Assistant
              </h2>
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-green-500"
                />
                <p
                  className={`text-xs ${
                    isDark ? "text-gray-500" : "text-slate-500"
                  }`}
                >
                  Online • Ready to help
                </p>
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleReset}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? "hover:bg-slate-800 text-gray-400 hover:text-gray-300"
                : "hover:bg-slate-100 text-slate-600 hover:text-slate-700"
            }`}
            title="Reset conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      <div
        className={`flex-1 p-6 overflow-y-auto space-y-4 ${
          isDark ? "bg-slate-950/20" : "bg-white/10"
        }`}
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, type: "spring" }}
              className={`flex items-start gap-3 ${
                msg.isUser ? "justify-end" : "justify-start"
              }`}
            >
              {!msg.isUser && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className={`p-2 rounded-lg shrink-0 ${
                    isDark
                      ? "bg-purple-600/20 text-purple-400"
                      : "bg-indigo-500/20 text-indigo-600"
                  }`}
                >
                  <Bot className="w-4 h-4" />
                </motion.div>
              )}

              <div className="flex flex-col max-w-[70%]">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-2xl relative group ${
                    msg.isUser
                      ? isDark
                        ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-br-none shadow-lg shadow-purple-900/30"
                        : "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-none shadow-lg shadow-indigo-500/30"
                      : isDark
                      ? "bg-slate-800/70 text-gray-200 rounded-bl-none border border-slate-700/50"
                      : "bg-white/60 text-slate-900 rounded-bl-none border border-white/50"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>

                  {!msg.isUser && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute -bottom-8 left-0 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCopyMessage(msg.text)}
                        className={`p-1.5 rounded-lg ${
                          isDark
                            ? "bg-slate-800 text-gray-400 hover:text-gray-300"
                            : "bg-white text-slate-600 hover:text-slate-700"
                        }`}
                        title="Copy message"
                      >
                        <Copy className="w-3 h-3" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-1.5 rounded-lg ${
                          isDark
                            ? "bg-slate-800 text-gray-400 hover:text-green-400"
                            : "bg-white text-slate-600 hover:text-green-600"
                        }`}
                        title="Good response"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-1.5 rounded-lg ${
                          isDark
                            ? "bg-slate-800 text-gray-400 hover:text-red-400"
                            : "bg-white text-slate-600 hover:text-red-600"
                        }`}
                        title="Bad response"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </motion.button>
                    </motion.div>
                  )}
                </motion.div>

                <span
                  className={`text-xs mt-1 ${
                    msg.isUser ? "text-right" : "text-left"
                  } ${isDark ? "text-gray-600" : "text-slate-400"}`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.isUser && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className={`p-2 rounded-lg shrink-0 ${
                    isDark
                      ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white"
                      : "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
                  }`}
                >
                  <User className="w-4 h-4" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3"
          >
            <div
              className={`p-2 rounded-lg ${
                isDark
                  ? "bg-purple-600/20 text-purple-400"
                  : "bg-indigo-500/20 text-indigo-600"
              }`}
            >
              <Bot className="w-4 h-4" />
            </div>
            <div
              className={`p-4 rounded-2xl rounded-bl-none ${
                isDark
                  ? "bg-slate-800/70 border border-slate-700/50"
                  : "bg-white/60 border border-white/50"
              }`}
            >
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -8, 0],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                    className={`w-2 h-2 rounded-full ${
                      isDark ? "bg-gray-500" : "bg-slate-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`p-4 border-t backdrop-blur-xl ${
          isDark
            ? "bg-slate-950/80 border-slate-800/50"
            : "bg-white/30 border-white/30"
        }`}
      >
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className={`w-full px-4 py-3 rounded-xl resize-none transition-all duration-300 ${
                isDark
                  ? "bg-slate-900/70 border border-slate-800/70 text-gray-200 placeholder-gray-600 focus:border-purple-600/70 focus:ring-2 focus:ring-purple-600/30"
                  : "bg-white/50 border border-slate-200/50 text-slate-900 placeholder-slate-400 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
              } focus:outline-none`}
              placeholder="Ask about skills, experience, projects..."
              disabled={isLoading}
              rows={1}
            />
            <div
              className={`absolute bottom-2 right-2 text-xs ${
                isDark ? "text-gray-600" : "text-slate-400"
              }`}
            >
              <Sparkles className="w-3 h-3" />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className={`p-3 rounded-xl font-semibold transition-all duration-300 ${
              isLoading || !input.trim()
                ? isDark
                  ? "bg-slate-800 text-gray-600 cursor-not-allowed"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
                : isDark
                ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-900/30"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/30"
            }`}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
        <p
          className={`text-xs mt-2 text-center ${
            isDark ? "text-gray-600" : "text-slate-400"
          }`}
        >
          Press Enter to send • Shift + Enter for new line
        </p>
      </motion.div>
    </motion.div>
  );
};
