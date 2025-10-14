"use client";
import { useState } from "react";
import { ParsedResumeData } from "@/app/types";
import { AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/animations/FadeIn";
import { SectionCard } from "./SectionCard";
import { BuildBotFooter } from "./BuildBotFooter";

interface EnrichmentFormProps {
  parsedData: ParsedResumeData;
  resumeFile: File | null;
  onBotBuilt: (chatbotId: string) => void;
  isDark?: boolean;
}

export const EnrichmentForm = ({
  parsedData,
  resumeFile,
  onBotBuilt,
  isDark = false,
}: EnrichmentFormProps) => {
  const [enrichments, setEnrichments] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleEnrichmentChange = (key: string, value: string) => {
    setEnrichments((prev) => ({ ...prev, [key]: value }));
  };

  const handleBuildBot = async () => {
    if (!resumeFile) {
      alert("Resume file is missing!");
      return;
    }
    setIsLoading(true);

    //dummy mode
    // setTimeout(() => {
    //   const dummyBotId = `bot_${Date.now()}_${Math.random()
    //     .toString(36)
    //     .substr(2, 9)}`;
    //   console.log("Bot built with ID:", dummyBotId);
    //   console.log("Enrichments:", enrichments);
    //   console.log("Parsed Data:", parsedData);
    //   setIsLoading(false);
    //   onBotBuilt(dummyBotId);
    // }, 2500);
    // return;

    // Uncomment this section when backend is ready
    const formData = new FormData();
    formData.append("resumeFile", resumeFile);
    formData.append("enrichments", JSON.stringify(enrichments));
    formData.append("parsedData", JSON.stringify(parsedData));

    try {
      const response = await fetch("http://127.0.0.1:5001/api/build-bot", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      console.log("Bot built successfully:", result);

      setIsLoading(false);
      onBotBuilt(result.chatbot_id);
    } catch (error) {
      console.error("Error building bot:", error);
      setIsLoading(false);
      alert("An error occurred while building your bot. Please try again.");
    }
  };

  const totalItems = Object.keys(parsedData).reduce(
    (acc, key) => acc + parsedData[key].length,
    0
  );
  const enrichedItems = Object.keys(enrichments).filter((k) =>
    enrichments[k]?.trim()
  ).length;

  return (
    <>
      <FadeIn>
        <div className="space-y-6 pb-32">
          <AnimatePresence>
            {Object.entries(parsedData).map(
              ([sectionTitle, items], sectionIndex) => (
                <SectionCard
                  key={sectionTitle}
                  sectionTitle={sectionTitle}
                  items={items}
                  sectionIndex={sectionIndex}
                  enrichments={enrichments}
                  focusedField={focusedField}
                  onEnrichmentChange={handleEnrichmentChange}
                  onFocusChange={setFocusedField}
                  isDark={isDark}
                />
              )
            )}
          </AnimatePresence>
        </div>
      </FadeIn>

      <BuildBotFooter
        enrichedItems={enrichedItems}
        totalItems={totalItems}
        isLoading={isLoading}
        onBuildBot={handleBuildBot}
        isDark={isDark}
      />
    </>
  );
};
