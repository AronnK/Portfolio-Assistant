"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useChatbot } from "../hooks/useChatBot";
import { useTheme } from "../hooks/useTheme";
import { PageContainer } from "@/components/layout/container";
import { StepHeader } from "@/components/StepHeader";
import { DashboardView } from "@/components/dashboard/DashBoardView";
import { ResumeDropzone } from "@/components/dropResume";
import { Loader2, Bot, FileText } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const {
    primaryChatbot,
    hasExisting,
    isLoading: chatbotLoading,
    refetchChatbots,
  } = useChatbot(user?.id || null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleResumeProcessed = () => {
    router.push("/home/enrich");
  };

  const handleViewBot = (botId: string) => {
    router.push(`/home/bot/${botId}`);
  };

  if (authLoading || chatbotLoading) {
    return (
      <PageContainer
        isDark={isDark}
        currentStep={1}
        onThemeToggle={toggleTheme}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2
            className={`w-8 h-8 animate-spin ${
              isDark ? "text-purple-400" : "text-indigo-600"
            }`}
          />
        </div>
      </PageContainer>
    );
  }

  // Show dashboard if user has existing bots, else show upload
  if (hasExisting && primaryChatbot) {
    return (
      <PageContainer
        isDark={isDark}
        currentStep={1}
        onThemeToggle={toggleTheme}
      >
        <StepHeader
          step={1}
          title="Dashboard"
          description="Manage your AI assistants"
          icon={Bot}
          isDark={isDark}
        />
        <DashboardView
          primaryChatbot={primaryChatbot}
          isDark={isDark}
          onRefetch={refetchChatbots}
          onViewBot={handleViewBot}
          onNewResumeUploaded={handleResumeProcessed}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer isDark={isDark} currentStep={1} onThemeToggle={toggleTheme}>
      <StepHeader
        step={1}
        title="Upload Resume"
        description="Upload your resume to get started"
        icon={FileText}
        isDark={isDark}
      />
      <ResumeDropzone onParsed={handleResumeProcessed} isDark={isDark} />
    </PageContainer>
  );
}
