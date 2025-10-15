"use client";
import { motion } from "framer-motion";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { ResumeDropzone } from "@/components/dropResume";
import { ParsedResumeData } from "@/app/types";

interface NewBotSectionProps {
  isDark: boolean;
  onResumeUploaded: (data: ParsedResumeData, file: File) => void;
}

export const NewBotSection = ({
  isDark,
  onResumeUploaded,
}: NewBotSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-4">
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 border-dashed transition-all ${
          isDark
            ? "border-slate-700 hover:border-purple-600 bg-slate-900/50"
            : "border-slate-300 hover:border-indigo-500 bg-white/50"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isDark ? "bg-purple-600" : "bg-indigo-600"
            }`}
          >
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <h3
              className={`font-bold ${
                isDark ? "text-gray-100" : "text-slate-900"
              }`}
            >
              Create New Bot
            </h3>
            <p
              className={`text-sm ${
                isDark ? "text-gray-500" : "text-slate-500"
              }`}
            >
              Upload a new resume to create another AI assistant
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className={isDark ? "text-gray-400" : "text-slate-400"} />
        ) : (
          <ChevronDown
            className={isDark ? "text-gray-400" : "text-slate-400"}
          />
        )}
      </motion.button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <ResumeDropzone onParsed={onResumeUploaded} isDark={isDark} />
        </motion.div>
      )}
    </div>
  );
};
