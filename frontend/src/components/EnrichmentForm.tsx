"use client";
import React, { FC, useState } from "react";
import { ParsedResumeData, ParsedItem } from "@/utils/resumeParser";

interface EnrichmentFormProps {
  parsedData: ParsedResumeData;
  resumeFile: File | null;
}

export const EnrichmentForm: FC<EnrichmentFormProps> = ({
  parsedData,
  resumeFile,
}) => {
  const [enrichments, setEnrichments] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleEnrichmentChange = (key: string, value: string) => {
    setEnrichments((prev) => ({ ...prev, [key]: value }));
  };

  const handleBuildBot = async () => {
    setIsLoading(true);
    console.log("Building bot with data:");
    console.log({ resumeFile, parsedData, enrichments });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    alert("Bot built successfully!");
  };

  return (
    <>
      <div className="space-y-8 pb-24">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Enrich Your Portfolio
          </h2>
          <p className="text-gray-500 mt-2">
            Add GitHub links, live demos, or additional context to each item
          </p>
        </div>

        {Object.entries(parsedData).map(([sectionTitle, items]) => (
          <section
            key={sectionTitle}
            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
              <h3 className="text-xl font-bold text-white capitalize">
                {sectionTitle.toLowerCase()}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              {items.map((item: ParsedItem, index) => {
                const key = `${sectionTitle}-${index}`;
                return (
                  <div
                    key={key}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-gray-900 flex-1">
                        {item.title}
                      </h4>
                      {item.date && (
                        <span className="text-sm text-gray-500 ml-4">
                          {item.date}
                        </span>
                      )}
                    </div>

                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 text-sm 
                               focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                               placeholder-gray-400 transition-all resize-none"
                      placeholder="Add GitHub link, live demo, or clarify..."
                      rows={3}
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

      <footer
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 
                       border-t border-gray-700 p-4 shadow-2xl z-50"
      >
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBuildBot}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-4 px-8 rounded-lg 
                     hover:bg-blue-700 active:bg-blue-800 
                     disabled:bg-gray-500 disabled:cursor-not-allowed
                     transition-all duration-200 shadow-lg hover:shadow-xl
                     transform hover:-translate-y-0.5"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Building Your Bot...
              </span>
            ) : (
              "Build My Bot & Start Preview"
            )}
          </button>
        </div>
      </footer>
    </>
  );
};
