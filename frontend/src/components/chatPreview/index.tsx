"use client";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ChatHeader } from "./ChatHeader";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { ChatInput } from "./ChatInput";
import { FadeIn } from "@/components/animations/FadeIn";

interface Message {
  text: string;
  isUser: boolean;
  timestamp?: string;
}

interface ChatPreviewProps {
  chatbotId: string;
  isDark?: boolean;
}

const DUMMY_RESPONSES = [
  "Based on the resume, this professional has a B.Tech in Artificial Intelligence and Data Science from Panimalar Engineering College with a CGPA of 8.5. They have strong expertise in AI/ML, embedded systems, and full-stack development.",
  "This candidate has worked on several impressive projects including an AI-powered 2048 game solver using reinforcement learning with DQN/DDQN architectures, and various 8051 microcontroller applications.",
  "Their technical skills include Python, C#, C, Assembly Language, JavaScript, React, Next.js, and Node.js. They have experience with AI/ML frameworks, embedded programming, and modern web technologies.",
  "The candidate has demonstrated strong problem-solving abilities through their technical interview preparation and hands-on experience with reinforcement learning, CNN architectures, and microcontroller programming.",
  "They're actively seeking opportunities at major IT companies and have a proven track record of completing complex projects from concept to deployment.",
];

export const ChatPreview = ({
  chatbotId,
  isDark = false,
}: ChatPreviewProps) => {
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

    // Dummy mode
    setTimeout(() => {
      const randomResponse =
        DUMMY_RESPONSES[Math.floor(Math.random() * DUMMY_RESPONSES.length)];
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
    <FadeIn>
      <GlassCard
        isDark={isDark}
        className="flex flex-col h-[600px] overflow-hidden"
      >
        <ChatHeader isDark={isDark} onReset={handleReset} />

        <div
          className={`flex-1 p-6 overflow-y-auto space-y-4 ${
            isDark ? "bg-slate-950/20" : "bg-white/10"
          }`}
        >
          <AnimatePresence mode="popLayout">
            {messages.map((msg, index) => (
              <MessageBubble key={index} message={msg} isDark={isDark} />
            ))}
          </AnimatePresence>

          {isLoading && <TypingIndicator isDark={isDark} />}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSendMessage}
          isLoading={isLoading}
          isDark={isDark}
        />
      </GlassCard>
    </FadeIn>
  );
};
