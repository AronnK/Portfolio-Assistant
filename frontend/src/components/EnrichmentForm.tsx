"use client";
import React, { FC, useState } from "react";
import { ParsedResumeData, ParsedItem } from "@/app/types";

interface EnrichmentFormProps {
  parsedData: ParsedResumeData;
  resumeFile: File | null;
  onBotBuilt: (chatbotId: string) => void;
}

export const EnrichmentForm: FC<EnrichmentFormProps> = ({
  parsedData,
  resumeFile,
  onBotBuilt,
}) => {
  const [enrichments, setEnrichments] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleEnrichmentChange = (key: string, value: string) => {
    setEnrichments((prev) => ({ ...prev, [key]: value }));
  };

  const handleBuildBot = async () => {
    if (!resumeFile) {
      alert("Resume file is missing!");
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append("resumeFile", resumeFile);
    formData.append("enrichments", JSON.stringify(enrichments));
    formData.append("parsedData", JSON.stringify(parsedData));

    try {
      const response = await fetch("http://127.0.0.1:5001/api/build-bot", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to build the bot.");
      const result = await response.json();
      onBotBuilt(result.chatbot_id);
    } catch (error) {
      console.error("Error building bot:", error);
      alert("An error occurred while building your bot.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-8 pb-32">
        {Object.entries(parsedData).map(([sectionTitle, items]) => (
          <section
            key={sectionTitle}
            className="bg-white border rounded-xl shadow-sm overflow-hidden"
          >
            <div className="bg-gray-800 px-6 py-4">
              <h3 className="text-xl font-bold text-white capitalize">
                {sectionTitle.toLowerCase()}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {items.map((item: ParsedItem, index) => {
                const key = `${sectionTitle}-${index}`;
                return (
                  <div key={key} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900 flex-1">
                        {item.title}
                      </h4>
                      {item.date && (
                        <span className="text-sm text-gray-500 ml-4 whitespace-nowrap">
                          {item.date}
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <p className="text-sm text-gray-600 mb-2">
                        {item.subtitle}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-sm text-gray-500 whitespace-pre-wrap mb-3">
                        {item.description}
                      </p>
                    )}
                    <textarea
                      className="w-full p-2 border rounded text-sm min-h-[60px] placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Add GitHub link, live demo, or clarify..."
                      value={enrichments[key] || ""}
                      onChange={(e) =>
                        handleEnrichmentChange(key, e.target.value)
                      }
                    />
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-center z-10">
        <button
          onClick={handleBuildBot}
          disabled={isLoading}
          className="w-full max-w-lg bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {isLoading ? "Building your bot..." : "Build My Bot & Start Preview"}
        </button>
      </footer>
    </>
  );
};
