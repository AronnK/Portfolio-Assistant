"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/context/AppStateContext";
import { useTheme } from "@/app/hooks/useTheme";
import { PageContainer } from "@/components/layout/container";
import { StepHeader } from "@/components/StepHeader";
import { EnrichmentForm } from "@/components/enrichmentForm";
import { Sparkles } from "lucide-react";

export default function EnrichPage() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const { appState, getResumeFile, clearParsedData } = useAppState();

  useEffect(() => {
    if (!appState.parsedData) {
      router.push("/home");
    }
  }, [appState.parsedData, router]);

  const handleBotBuilt = (tempCollectionName: string) => {
    router.push(`/home/preview/${tempCollectionName}`);
  };

  if (!appState.parsedData) {
    return null;
  }

  return (
    <PageContainer isDark={isDark} currentStep={2} onThemeToggle={toggleTheme}>
      <StepHeader
        step={2}
        title="Knowledge Enrichment"
        description="Add context to make your assistant smarter"
        icon={Sparkles}
        isDark={isDark}
      />
      <EnrichmentForm
        parsedData={appState.parsedData}
        resumeFile={getResumeFile()}
        onBotBuilt={handleBotBuilt}
        isDark={isDark}
      />
    </PageContainer>
  );
}
