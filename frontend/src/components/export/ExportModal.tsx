"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ExportOptions } from "./ExportOptions";
import { ExportGuide } from "./ExportGuide";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tempCollectionName: string;
  isDark: boolean;
  onComplete?: () => void;
}

export type ExportType = "byok" | "iframe" | "widget" | "api" | null;

export const ExportModal = ({
  isOpen,
  onClose,
  tempCollectionName,
  isDark,
  onComplete,
}: ExportModalProps) => {
  const [selectedExport, setSelectedExport] = useState<ExportType>(null);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[85vh] overflow-y-auto"
        >
          <GlassCard isDark={isDark}>
            {/* Header */}
            <div
              className={`sticky top-0 z-10 px-6 py-4 border-b backdrop-blur-xl ${
                isDark
                  ? "bg-slate-950/90 border-slate-800/50"
                  : "bg-white/90 border-slate-200/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2
                    className={`text-2xl font-bold ${
                      isDark ? "text-gray-100" : "text-slate-900"
                    }`}
                  >
                    Export Your AI Assistant
                  </h2>
                  <p
                    className={`text-sm mt-1 ${
                      isDark ? "text-gray-500" : "text-slate-600"
                    }`}
                  >
                    Choose how you want to deploy your chatbot
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark
                      ? "hover:bg-slate-800 text-gray-400"
                      : "hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            <div className="p-6">
              {!selectedExport ? (
                <ExportOptions onSelect={setSelectedExport} isDark={isDark} />
              ) : (
                <ExportGuide
                  exportType={selectedExport}
                  tempCollectionName={tempCollectionName}
                  onBack={() => setSelectedExport(null)}
                  isDark={isDark}
                  onComplete={onComplete}
                />
              )}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
