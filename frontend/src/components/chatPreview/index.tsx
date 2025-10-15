"use client";
import { useState, useRef, useEffect, FC } from "react";
import { AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ChatHeader } from "./ChatHeader";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { ChatInput } from "./ChatInput";
import { FadeIn } from "@/components/animations/FadeIn";
import { ExportModal } from "@/components/export/ExportModal";

interface Message {
  text: string;
  isUser: boolean;
  timestamp?: string;
}

interface ChatPreviewProps {
  chatbotId: string;
  isDark?: boolean;
  isTemporary?: boolean;
  onFinalize?: () => void;
}

export const ChatPreview: FC<ChatPreviewProps> = ({
  chatbotId,
  isDark = false,
  isTemporary = false,
  onFinalize,
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
  const [showExportModal, setShowExportModal] = useState(false);
  const [memoryInfo, setMemoryInfo] = useState({
    exchanges: 0,
    total_messages: 0,
  });
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
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection_name: chatbotId,
          query: currentInput,
          provider_name: "google",
          api_key: "",
        }),
      });

      if (!response.ok) throw new Error("API request failed");
      const result = await response.json();

      if (result.memory) {
        setMemoryInfo(result.memory);
        console.log(`Memory: ${result.memory.exchanges} exchanges`);
      }

      const botMessage: Message = {
        text: result.answer,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat API error:", error);
      const errorMessage: Message = {
        text: "Sorry, an error occurred. Please try again.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setMessages([
      {
        text: "Hello! I'm starting fresh. Ask me anything!",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setMemoryInfo({ exchanges: 0, total_messages: 0 });
  };

  const handleExportClick = () => {
    setShowExportModal(true);
  };

  const handleExportComplete = () => {
    setShowExportModal(false);
    if (onFinalize) onFinalize();
  };

  return (
    <>
      <FadeIn>
        <GlassCard
          isDark={isDark}
          className="flex flex-col h-[600px] overflow-hidden"
        >
          <ChatHeader
            isDark={isDark}
            onReset={handleReset}
            memoryInfo={memoryInfo}
            isTemporary={isTemporary}
            onExport={isTemporary ? handleExportClick : undefined} // ✅ Pass export handler
          />
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

      {isTemporary && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          tempCollectionName={chatbotId}
          isDark={isDark}
          onComplete={handleExportComplete}
        />
      )}
    </>
  );
};
