"use client";
import { motion } from "framer-motion";
import { Bot, Calendar, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ChatbotData } from "@/app/types";

interface ExistingBotCardProps {
  chatbot: ChatbotData;
  isDark: boolean;
  onUpdate: () => void;
  onViewBot: () => void;
}

export const ExistingBotCard = ({
  chatbot,
  isDark,
  onUpdate,
  onViewBot,
}: ExistingBotCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <GlassCard isDark={isDark}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div
            className={`p-3 rounded-xl ${
              isDark
                ? "bg-gradient-to-br from-purple-600 to-blue-600"
                : "bg-gradient-to-br from-indigo-500 to-purple-500"
            }`}
          >
            <Bot className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1">
            <h3
              className={`text-lg font-bold ${
                isDark ? "text-gray-100" : "text-slate-900"
              }`}
            >
              {chatbot.project_name || "Your AI Assistant"}
            </h3>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <Calendar
                  className={`w-4 h-4 ${
                    isDark ? "text-gray-500" : "text-slate-400"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-500" : "text-slate-500"
                  }`}
                >
                  Created {formatDate(chatbot.created_at)}
                </span>
              </div>

              <div
                className={`px-2 py-1 rounded-md text-xs font-medium ${
                  isDark
                    ? "bg-green-500/20 text-green-400"
                    : "bg-green-500/20 text-green-700"
                }`}
              >
                Active
              </div>
            </div>

            {chatbot.last_updated !== chatbot.created_at && (
              <p
                className={`text-xs mt-1 ${
                  isDark ? "text-gray-600" : "text-slate-400"
                }`}
              >
                Last updated {formatDate(chatbot.last_updated)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onUpdate}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
            isDark
              ? "bg-purple-600 hover:bg-purple-500 text-white"
              : "bg-indigo-600 hover:bg-indigo-500 text-white"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Update Bot
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewBot}
          className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
            isDark
              ? "bg-slate-800 hover:bg-slate-700 text-gray-100"
              : "bg-slate-200 hover:bg-slate-300 text-slate-900"
          }`}
        >
          View Bot
        </motion.button>
      </div>
    </GlassCard>
  );
};
