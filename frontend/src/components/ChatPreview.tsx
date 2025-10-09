"use client";
import React, { useState, FC, useRef, useEffect } from "react";

interface Message {
  text: string;
  isUser: boolean;
}

interface ChatPreviewProps {
  chatbotId: string;
}

export const ChatPreview: FC<ChatPreviewProps> = ({ chatbotId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! Ask me anything about this professional's resume.",
      isUser: false,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatbot_id: chatbotId, query: input }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const result = await response.json();
      const botMessage: Message = { text: result.answer, isUser: false };
      setMessages((prev) => [...prev, userMessage, botMessage]);
    } catch (error) {
      console.error("Chat API error:", error);
      const errorMessage: Message = {
        text: "Sorry, an error occurred. Please try again.",
        isUser: false,
      };
      setMessages((prev) => [...prev, userMessage, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-xl border border-gray-200">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">Bot Preview</h2>
        <p className="text-sm text-gray-500">
          Test your assistant's knowledge.
        </p>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${
              msg.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-lg whitespace-pre-wrap ${
                msg.isUser
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-lg bg-gray-200 text-gray-500">
              <span className="animate-pulse">Typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t flex items-center bg-gray-50">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-grow border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask your bot a question..."
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading}
          className="bg-blue-600 text-white p-3 rounded-r-lg font-bold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};
