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
import { ChatbotService } from "@/lib/supabase/chatbot";
import { EncryptionService } from "@/lib/utils/encryption";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

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

  const [chatbotConfig, setChatbotConfig] = useState<{
    provider: string;
    apiKey: string;
  } | null>(null);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://portfolio-assistant-1ush.onrender.com";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    const fetchChatbotConfig = async () => {
      if (isTemporary) {
        setChatbotConfig({
          provider: "google",
          apiKey: "",
        });
        return;
      }

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const result = await ChatbotService.getUserChatbots(user.id);

        if (result.success && result.chatbots.length > 0) {
          const bot = result.chatbots.find(
            (b) => b.collection_name === chatbotId
          );

          if (bot && bot.encrypted_api_key) {
            const decryptedKey = await EncryptionService.decrypt(
              bot.encrypted_api_key
            );

            setChatbotConfig({
              provider: bot.llm_provider || "google",
              apiKey: decryptedKey,
            });

            console.log("Chatbot config loaded and decrypted");
          }
        }
      } catch (error: unknown) {
        console.error("Error fetching chatbot config:", error);
        toast.error("Failed to load bot configuration");
      }
    };

    fetchChatbotConfig();
  }, [chatbotId, isTemporary]);

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
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection_name: chatbotId,
          query: currentInput,
          provider_name: chatbotConfig?.provider || "google",
          api_key: chatbotConfig?.apiKey || "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "API request failed");
      }

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
    } catch (error: unknown) {
      console.error("Chat API error:", error);
      let errorMessage = "Sorry, an error occurred. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
        toast.error(error.message);
      } else if (typeof error === "string") {
        errorMessage = error;
        toast.error(error);
      } else {
        toast.error("Chat failed");
      }

      const errorMsg: Message = {
        text: errorMessage,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMsg]);
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
            onExport={isTemporary ? handleExportClick : undefined}
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
