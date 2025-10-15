"use client";
import { useRouter, useParams } from "next/navigation";
import { useTheme } from "@/app/hooks/useTheme";
import { useAppState } from "@/context/AppStateContext";
import { PageContainer } from "@/components/layout/container";
import { StepHeader } from "@/components/StepHeader";
import { ChatPreview } from "@/components/chatPreview";
import { Bot } from "lucide-react";

export default function PreviewPage() {
  const router = useRouter();
  const params = useParams();
  const { isDark, toggleTheme } = useTheme();
  const { clearParsedData } = useAppState();

  const tempCollectionName = params.id as string;

  const handleFinalize = () => {
    clearParsedData();
    router.push("/home");
  };

  return (
    <PageContainer isDark={isDark} currentStep={3} onThemeToggle={toggleTheme}>
      <StepHeader
        step={3}
        title="Your Assistant is Live"
        description="Test and deploy your AI assistant"
        icon={Bot}
        isDark={isDark}
      />
      <ChatPreview
        chatbotId={tempCollectionName}
        isDark={isDark}
        isTemporary={true}
        onFinalize={handleFinalize}
      />
    </PageContainer>
  );
}
