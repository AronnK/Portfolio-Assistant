"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ExistingBotCard } from "./ExistingBotCard";
import { UpdateBotForm } from "./UpdateBotForm";
import { NewBotSection } from "./NewBotSection";
import { FadeIn } from "@/components/animations/FadeIn";
import { ChatbotData, ParsedResumeData } from "@/app/types";

interface DashboardViewProps {
  primaryChatbot: ChatbotData;
  isDark: boolean;
  onRefetch: () => void;
  onViewBot: (chatbotId: string) => void;
  onNewResumeUploaded: (data: ParsedResumeData, file: File) => void;
}

export const DashboardView = ({
  primaryChatbot,
  isDark,
  onRefetch,
  onViewBot,
  onNewResumeUploaded,
}: DashboardViewProps) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  return (
    <FadeIn>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2
            className={`text-2xl font-bold mb-2 ${
              isDark ? "text-gray-100" : "text-slate-900"
            }`}
          >
            Your AI Assistants
          </h2>
          <p
            className={`text-sm ${isDark ? "text-gray-500" : "text-slate-600"}`}
          >
            Manage and update your portfolio chatbots
          </p>
        </motion.div>

        <ExistingBotCard
          chatbot={primaryChatbot}
          isDark={isDark}
          onUpdate={() => setShowUpdateForm(true)}
          onViewBot={() => onViewBot(primaryChatbot.id.toString())}
        />

        {showUpdateForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <UpdateBotForm
              chatbotId={primaryChatbot.id}
              collectionName={primaryChatbot.collection_name}
              isDark={isDark}
              onSuccess={() => {
                setShowUpdateForm(false);
                onRefetch();
              }}
              onCancel={() => setShowUpdateForm(false)}
            />
          </motion.div>
        )}

        <NewBotSection isDark={isDark} onResumeUploaded={onNewResumeUploaded} />
      </div>
    </FadeIn>
  );
};
