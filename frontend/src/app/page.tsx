"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { ParsedResumeData } from "@/app/types";
import { useTheme } from "./hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { useChatbot } from "./hooks/useChatBot";
import { PageContainer } from "@/components/layout/container";
import { StepHeader } from "@/components/StepHeader";
import { EnrichmentForm } from "../components/enrichmentForm";
import { ChatPreview } from "../components/chatPreview";
import { DashboardView } from "@/components/dashboard/DashBoardView";
import { FadeIn } from "@/components/animations/FadeIn";
import { Bot, FileText, Sparkles, Loader2 } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";

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
  DASHBOARD: {
    step: 1,
    title: "Dashboard",
    icon: Bot,
    description: "Manage your AI assistants",
  },
};

export default function Home() {
  const { appState, setParsedData, setTempCollection, clearState } =
    useAppState();
  const { parsedData, resumeFile, tempCollectionName } = appState;

  const [viewedBotId, setViewedBotId] = useState<string | null>(null);
  const { isDark, toggleTheme } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const {
    primaryChatbot,
    hasExisting,
    isLoading: chatbotLoading,
    refetchChatbots,
  } = useChatbot(user?.id || null);

  const handleParseComplete = (data: ParsedResumeData, file: File) => {
    setParsedData(data, file);
  };

  const handleBotBuilt = (tempCollection: string) => {
    setTempCollection(tempCollection);
  };

  const handleViewBot = (botId: string) => {
    setViewedBotId(botId);
  };

  const handleFinalize = () => {
    refetchChatbots();
    clearState();
  };

  const getCurrentView = () => {
    if (authLoading || chatbotLoading) {
      return "loading";
    }
    if (viewedBotId) {
      return "viewingPermanent";
    }
    if (tempCollectionName) {
      return "preview";
    }
    if (parsedData) {
      return "enrich";
    }
    if (user && hasExisting) {
      return "dashboard";
    }
    return "upload";
  };

  const currentView = getCurrentView();

  const currentStepInfo =
    currentView === "dashboard"
      ? STEPS.DASHBOARD
      : currentView === "preview"
      ? STEPS.PREVIEW
      : currentView === "enrich"
      ? STEPS.ENRICH
      : STEPS.UPLOAD;

  const renderContent = () => {
    switch (currentView) {
      case "loading":
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2
              className={`w-8 h-8 animate-spin ${
                isDark ? "text-purple-400" : "text-indigo-600"
              }`}
            />
          </div>
        );
      case "preview":
        return (
          <ChatPreview
            chatbotId={tempCollectionName!}
            isDark={isDark}
            isTemporary={true}
            onFinalize={handleFinalize}
          />
        );
      case "viewingPermanent":
        return <ChatPreview chatbotId={viewedBotId!} isDark={isDark} />;
      case "enrich":
        return (
          <EnrichmentForm
            parsedData={parsedData!}
            resumeFile={resumeFile}
            onBotBuilt={handleBotBuilt}
            isDark={isDark}
          />
        );
      case "dashboard":
        return (
          <DashboardView
            primaryChatbot={primaryChatbot!}
            isDark={isDark}
            onRefetch={refetchChatbots}
            onViewBot={handleViewBot}
            onNewResumeUploaded={handleParseComplete}
          />
        );
      case "upload":
      default:
        return (
          <ResumeDropzone onParsed={handleParseComplete} isDark={isDark} />
        );
    }
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
        <FadeIn key={currentView}>{renderContent()}</FadeIn>
      </AnimatePresence>
    </PageContainer>
  );
}
