"use client";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { ExportType } from "./ExportModal";
import { BYOKGuide } from "./guides/BYOKGuide";
import { IFrameGuide } from "./guides/IFrameGuide";
import { WidgetGuide } from "./guides/WidgetGuide";
import { APIGuide } from "./guides/APIGuide";

interface ExportGuideProps {
  exportType: ExportType;
  tempCollectionName: string;
  onBack: () => void;
  isDark: boolean;
}

export const ExportGuide = ({
  exportType,
  tempCollectionName,
  onBack,
  isDark,
}: ExportGuideProps) => {
  const renderGuide = () => {
    switch (exportType) {
      case "byok":
        return (
          <BYOKGuide tempCollectionName={tempCollectionName} isDark={isDark} />
        );
      case "iframe":
        return (
          <IFrameGuide
            tempCollectionName={tempCollectionName}
            isDark={isDark}
          />
        );
      case "widget":
        return (
          <WidgetGuide
            tempCollectionName={tempCollectionName}
            isDark={isDark}
          />
        );
      case "api":
        return (
          <APIGuide tempCollectionName={tempCollectionName} isDark={isDark} />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -5 }}
        onClick={onBack}
        className={`flex items-center gap-2 mb-6 text-sm font-medium transition-colors ${
          isDark
            ? "text-gray-400 hover:text-gray-300"
            : "text-slate-600 hover:text-slate-700"
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to options
      </motion.button>

      {renderGuide()}
    </div>
  );
};
