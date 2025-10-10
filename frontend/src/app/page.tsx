"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { ParsedResumeData } from "@/app/types";
import { useTheme } from "./hooks/useTheme";
import { PageContainer } from "@/components/layout/container";
import { StepHeader } from "@/components/StepHeader";
import { EnrichmentForm } from "../components/enrichmentForm";
import { ChatPreview } from "../components/chatPreview";
import { FadeIn } from "@/components/animations/FadeIn";
import { Bot, FileText, Sparkles } from "lucide-react";

const ResumeDropzone = dynamic(
  () => import("../components/dropResume").then((mod) => mod.ResumeDropzone),
  { ssr: false }
);

const STEPS = {
  UPLOAD: {
    step: 1,
    title: "Upload Resume",
    icon: FileText,
    description: "Upload your resume to get started",
  },
  ENRICH: {
    step: 2,
    title: "Knowledge Enrichment",
    icon: Sparkles,
    description: "Add context to make your assistant smarter",
  },
  PREVIEW: {
    step: 3,
    title: "Your Assistant is Live",
    icon: Bot,
    description: "Test and deploy your AI assistant",
  },
};

export default function Home() {
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [chatbotId, setChatbotId] = useState<string | null>(null);
  const { isDark, toggleTheme } = useTheme();

  const currentStepInfo = chatbotId
    ? STEPS.PREVIEW
    : parsedData
    ? STEPS.ENRICH
    : STEPS.UPLOAD;

  const handleParseComplete = (data: ParsedResumeData, file: File) => {
    setParsedData(data);
    setOriginalFile(file);
  };

  const handleBotBuilt = (id: string) => {
    setChatbotId(id);
  };

  const renderContent = () => {
    if (chatbotId) {
      return <ChatPreview chatbotId={chatbotId} isDark={isDark} />;
    }

    if (parsedData) {
      return (
        <EnrichmentForm
          parsedData={parsedData}
          resumeFile={originalFile}
          onBotBuilt={handleBotBuilt}
          isDark={isDark}
        />
      );
    }

    return <ResumeDropzone onParsed={handleParseComplete} isDark={isDark} />;
  };

  return (
    <PageContainer
      isDark={isDark}
      currentStep={currentStepInfo.step}
      onThemeToggle={toggleTheme}
    >
      <StepHeader
        step={currentStepInfo.step}
        title={currentStepInfo.title}
        description={currentStepInfo.description}
        icon={currentStepInfo.icon}
        isDark={isDark}
      />

      <AnimatePresence mode="wait">
        <FadeIn key={currentStepInfo.step}>{renderContent()}</FadeIn>
      </AnimatePresence>
    </PageContainer>
  );
}
