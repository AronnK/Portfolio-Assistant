// "use client";
// import { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
// import { AnimatePresence } from "framer-motion";
// import { ParsedResumeData } from "@/app/types";
// import { useTheme } from "./hooks/useTheme";
// import { useAuth } from "@/context/AuthContext";
// import { useChatbot } from "./hooks/useChatBot";
// import { PageContainer } from "@/components/layout/container";
// import { StepHeader } from "@/components/StepHeader";
// import { EnrichmentForm } from "../components/enrichmentForm";
// import { ChatPreview } from "../components/chatPreview";
// import { DashboardView } from "@/components/dashboard/DashBoardView";
// import { FadeIn } from "@/components/animations/FadeIn";
// import { Bot, FileText, Sparkles, Loader2 } from "lucide-react";

// const ResumeDropzone = dynamic(
//   () => import("../components/dropResume").then((mod) => mod.ResumeDropzone),
//   { ssr: false }
// );

// const STEPS = {
//   UPLOAD: {
//     step: 1,
//     title: "Upload Resume",
//     icon: FileText,
//     description: "Upload your resume to get started",
//   },
//   ENRICH: {
//     step: 2,
//     title: "Knowledge Enrichment",
//     icon: Sparkles,
//     description: "Add context to make your assistant smarter",
//   },
//   PREVIEW: {
//     step: 3,
//     title: "Your Assistant is Live",
//     icon: Bot,
//     description: "Test and deploy your AI assistant",
//   },
//   DASHBOARD: {
//     step: 1,
//     title: "Dashboard",
//     icon: Bot,
//     description: "Manage your AI assistants",
//   },
// };

// export default function Home() {
//   const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
//   const [originalFile, setOriginalFile] = useState<File | null>(null);
//   const [chatbotId, setChatbotId] = useState<string | null>(null);

//   const { isDark, toggleTheme } = useTheme();
//   const { user, loading: authLoading } = useAuth();
//   const {
//     primaryChatbot,
//     hasExisting,
//     isLoading: chatbotLoading,
//     refetchChatbots,
//   } = useChatbot(user?.id || null);

//   const handleParseComplete = (data: ParsedResumeData, file: File) => {
//     setParsedData(data);
//     setOriginalFile(file);
//   };

//   const handleBotBuilt = (id: string) => {
//     setChatbotId(id);
//     refetchChatbots();
//   };

//   const handleViewBot = (botId: string) => {
//     setChatbotId(botId);
//   };

//   // Determine current view
//   const getCurrentView = () => {
//     if (authLoading || chatbotLoading) {
//       return "loading";
//     }

//     if (chatbotId) {
//       return "preview";
//     }

//     if (parsedData) {
//       return "enrich";
//     }

//     if (user && hasExisting && primaryChatbot) {
//       return "dashboard";
//     }

//     return "upload";
//   };

//   const currentView = getCurrentView();

//   const currentStepInfo =
//     currentView === "dashboard"
//       ? STEPS.DASHBOARD
//       : currentView === "preview"
//       ? STEPS.PREVIEW
//       : currentView === "enrich"
//       ? STEPS.ENRICH
//       : STEPS.UPLOAD;

//   const renderContent = () => {
//     if (authLoading || chatbotLoading) {
//       return (
//         <div className="flex items-center justify-center min-h-[400px]">
//           <Loader2
//             className={`w-8 h-8 animate-spin ${
//               isDark ? "text-purple-400" : "text-indigo-600"
//             }`}
//           />
//         </div>
//       );
//     }

//     if (currentView === "preview" && chatbotId) {
//       return <ChatPreview chatbotId={chatbotId} isDark={isDark} />;
//     }

//     if (currentView === "enrich" && parsedData) {
//       return (
//         <EnrichmentForm
//           parsedData={parsedData}
//           resumeFile={originalFile}
//           onBotBuilt={handleBotBuilt}
//           isDark={isDark}
//         />
//       );
//     }

//     if (currentView === "dashboard" && primaryChatbot) {
//       return (
//         <DashboardView
//           primaryChatbot={primaryChatbot}
//           isDark={isDark}
//           onRefetch={refetchChatbots}
//           onViewBot={handleViewBot}
//           onNewResumeUploaded={handleParseComplete}
//         />
//       );
//     }

//     return <ResumeDropzone onParsed={handleParseComplete} isDark={isDark} />;
//   };

//   return (
//     <PageContainer
//       isDark={isDark}
//       currentStep={currentStepInfo.step}
//       onThemeToggle={toggleTheme}
//     >
//       <StepHeader
//         step={currentStepInfo.step}
//         title={currentStepInfo.title}
//         description={currentStepInfo.description}
//         icon={currentStepInfo.icon}
//         isDark={isDark}
//       />

//       <AnimatePresence mode="wait">
//         <FadeIn key={currentView}>{renderContent()}</FadeIn>
//       </AnimatePresence>
//     </PageContainer>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { ParsedResumeData } from "@/app/types";
import { useTheme } from "./hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { useChatbot } from "./hooks/useChatBot";
import { ChatbotService } from "@/lib/supabase/chatbot";
import { PageContainer } from "@/components/layout/container";
import { StepHeader } from "@/components/StepHeader";
import { EnrichmentForm } from "../components/enrichmentForm";
import { ChatPreview } from "../components/chatPreview";
import { DashboardView } from "@/components/dashboard/DashBoardView";
import { FadeIn } from "@/components/animations/FadeIn";
import { Bot, FileText, Sparkles, Loader2 } from "lucide-react";

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
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [tempCollectionName, setTempCollectionName] = useState<string | null>(
    null
  );
  const [chatbotId, setChatbotId] = useState<string | null>(null);

  const { isDark, toggleTheme } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const {
    primaryChatbot,
    hasExisting,
    isLoading: chatbotLoading,
    refetchChatbots,
  } = useChatbot(user?.id || null);

  const handleParseComplete = (data: ParsedResumeData, file: File) => {
    setParsedData(data);
    setOriginalFile(file);
  };

  const handleBotBuilt = (tempCollection: string) => {
    console.log("Temp collection created:", tempCollection);
    setTempCollectionName(tempCollection);
  };

  const handleViewBot = (botId: string) => {
    setChatbotId(botId);
  };

  const handleFinalize = async () => {
    console.log("Bot finalized! Redirecting to dashboard...");

    await refetchChatbots();

    setTempCollectionName(null);
    setParsedData(null);
    setOriginalFile(null);
  };

  const getCurrentView = () => {
    if (authLoading || chatbotLoading) {
      return "loading";
    }

    if (tempCollectionName) {
      return "preview";
    }

    if (chatbotId) {
      return "preview";
    }

    if (parsedData) {
      return "enrich";
    }

    if (user && hasExisting && primaryChatbot) {
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
    if (authLoading || chatbotLoading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2
            className={`w-8 h-8 animate-spin ${
              isDark ? "text-purple-400" : "text-indigo-600"
            }`}
          />
        </div>
      );
    }

    if (currentView === "preview" && tempCollectionName) {
      return (
        <ChatPreview
          chatbotId={tempCollectionName}
          isDark={isDark}
          isTemporary={true}
          onFinalize={handleFinalize}
        />
      );
    }

    if (currentView === "preview" && chatbotId) {
      return <ChatPreview chatbotId={chatbotId} isDark={isDark} />;
    }

    if (currentView === "enrich" && parsedData) {
      return (
        <EnrichmentForm
          parsedData={parsedData}
          resumeFile={originalFile}
          onBotBuilt={handleBotBuilt}
          isDark={isDark}
        />
      );
    }

    if (currentView === "dashboard" && primaryChatbot) {
      return (
        <DashboardView
          primaryChatbot={primaryChatbot}
          isDark={isDark}
          onRefetch={refetchChatbots}
          onViewBot={handleViewBot}
          onNewResumeUploaded={handleParseComplete}
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
        <FadeIn key={currentView}>{renderContent()}</FadeIn>
      </AnimatePresence>
    </PageContainer>
  );
}
