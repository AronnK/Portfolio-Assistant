"use client";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "@/app/hooks/useTheme";
import { PageContainer } from "@/components/layout/container";
import { StepHeader } from "@/components/StepHeader";
import { ChatPreview } from "@/components/chatPreview";
import { Bot, ArrowLeft } from "lucide-react";

export default function BotViewPage() {
  const router = useRouter();
  const params = useParams();
  const { isDark, toggleTheme } = useTheme();

  const botId = params.id as string;

  return (
    <PageContainer isDark={isDark} currentStep={1} onThemeToggle={toggleTheme}>
      <div className="mb-4">
        <button
          onClick={() => router.push("/home")}
          className={`flex items-center gap-2 text-sm ${
            isDark
              ? "text-gray-400 hover:text-gray-200"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
      <StepHeader
        step={1}
        title="AI Assistant"
        description="Chat with your AI assistant"
        icon={Bot}
        isDark={isDark}
      />
      <ChatPreview chatbotId={botId} isDark={isDark} isTemporary={false} />
    </PageContainer>
  );
}
