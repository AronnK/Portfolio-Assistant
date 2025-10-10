"use client";
import React, { FC, useState } from "react";
import { ParsedResumeData, ParsedItem } from "@/app/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Award,
  Code,
  BookOpen,
  Sparkles,
  Check,
  Loader2,
} from "lucide-react";

interface EnrichmentFormProps {
  parsedData: ParsedResumeData;
  resumeFile: File | null;
  onBotBuilt: (chatbotId: string) => void;
  isDark?: boolean;
}

const sectionIcons: Record<string, any> = {
  education: GraduationCap,
  experience: Briefcase,
  projects: Code,
  skills: Award,
  certifications: Award,
  achievements: Sparkles,
};

export const EnrichmentForm1: FC<EnrichmentFormProps> = ({
  parsedData,
  resumeFile,
  onBotBuilt,
  isDark = false,
}) => {
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

    const formData = new FormData();
    formData.append("resumeFile", resumeFile);
    formData.append("enrichments", JSON.stringify(enrichments));
    formData.append("parsedData", JSON.stringify(parsedData));

    setTimeout(() => {
      const dummyBotId = `bot_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      console.log("✅ Bot built with ID:", dummyBotId);
      console.log("📊 Enrichments:", enrichments);
      console.log("📄 Parsed Data:", parsedData);
      setIsLoading(false);
      onBotBuilt(dummyBotId);
    }, 2500);
    return;

    // try {
    //   const response = await fetch("http://127.0.0.1:5001/api/build-bot", {
    //     method: "POST",
    //     body: formData,
    //   });
    //   if (!response.ok) throw new Error("Failed to build the bot.");
    //   const result = await response.json();
    //   onBotBuilt(result.chatbot_id);
    // } catch (error) {
    //   console.error("Error building bot:", error);
    //   alert("An error occurred while building your bot.");
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 pb-32"
      >
        {Object.entries(parsedData).map(
          ([sectionTitle, items], sectionIndex) => {
            const IconComponent =
              sectionIcons[sectionTitle.toLowerCase()] || BookOpen;

            return (
              <motion.section
                key={sectionTitle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: sectionIndex * 0.1 }}
                className={`backdrop-blur-xl rounded-2xl border overflow-hidden transition-all duration-300 ${
                  isDark
                    ? "bg-slate-900/50 border-slate-800/50 shadow-xl shadow-purple-900/10"
                    : "bg-white/40 border-white/40 shadow-xl shadow-indigo-500/5"
                }`}
              >
                <div
                  className={`px-6 py-4 border-b flex items-center space-x-3 ${
                    isDark
                      ? "bg-slate-950/80 border-slate-800/50"
                      : "bg-white/30 border-white/30"
                  }`}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className={`p-2 rounded-lg ${
                      isDark
                        ? "bg-purple-600/20 text-purple-400"
                        : "bg-indigo-500/20 text-indigo-600"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </motion.div>
                  <h3
                    className={`text-lg font-semibold capitalize ${
                      isDark ? "text-gray-100" : "text-slate-900"
                    }`}
                  >
                    {sectionTitle.toLowerCase()}
                  </h3>
                  <div
                    className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${
                      isDark
                        ? "bg-slate-800/70 text-gray-400"
                        : "bg-slate-100/50 text-slate-600"
                    }`}
                  >
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <AnimatePresence>
                    {items.map((item: ParsedItem, index) => {
                      const key = `${sectionTitle}-${index}`;
                      const isFocused = focusedField === key;
                      const hasContent = enrichments[key]?.trim().length > 0;

                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className={`rounded-xl p-4 transition-all duration-300 ${
                            isFocused
                              ? isDark
                                ? "bg-slate-800/70 border-2 border-purple-600/50 shadow-lg shadow-purple-900/20"
                                : "bg-white/60 border-2 border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                              : isDark
                              ? "bg-slate-900/40 border border-slate-800/50"
                              : "bg-white/30 border border-white/30"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h4
                                className={`font-semibold text-base mb-1 flex items-center ${
                                  isDark ? "text-gray-100" : "text-slate-900"
                                }`}
                              >
                                {item.title}
                                {hasContent && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="ml-2 p-1 rounded-full bg-green-500/20"
                                  >
                                    <Check className="w-3 h-3 text-green-500" />
                                  </motion.span>
                                )}
                              </h4>
                              {item.subtitle && (
                                <p
                                  className={`text-sm ${
                                    isDark ? "text-gray-400" : "text-slate-600"
                                  }`}
                                >
                                  {item.subtitle}
                                </p>
                              )}
                            </div>
                            {item.date && (
                              <span
                                className={`text-sm ml-4 whitespace-nowrap px-3 py-1 rounded-full ${
                                  isDark
                                    ? "bg-slate-800/70 text-gray-400"
                                    : "bg-slate-100/50 text-slate-600"
                                }`}
                              >
                                {item.date}
                              </span>
                            )}
                          </div>

                          {item.description && (
                            <p
                              className={`text-sm whitespace-pre-wrap mb-3 ${
                                isDark ? "text-gray-500" : "text-slate-600"
                              }`}
                            >
                              {item.description}
                            </p>
                          )}

                          <div className="relative">
                            <motion.textarea
                              whileFocus={{ scale: 1.01 }}
                              transition={{ duration: 0.2 }}
                              className={`w-full p-3 rounded-lg text-sm min-h-[80px] resize-none transition-all duration-300 ${
                                isDark
                                  ? "bg-slate-950/70 border border-slate-800/70 text-gray-200 placeholder-gray-600 focus:border-purple-600/70 focus:ring-2 focus:ring-purple-600/30"
                                  : "bg-white/50 border border-slate-200/50 text-slate-900 placeholder-slate-400 focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                              } focus:outline-none`}
                              placeholder="✨ Add GitHub link, live demo, achievements, or any additional context..."
                              value={enrichments[key] || ""}
                              onChange={(e) =>
                                handleEnrichmentChange(key, e.target.value)
                              }
                              onFocus={() => setFocusedField(key)}
                              onBlur={() => setFocusedField(null)}
                            />
                            {enrichments[key] && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`absolute bottom-2 right-2 text-xs ${
                                  isDark ? "text-gray-600" : "text-slate-400"
                                }`}
                              >
                                {enrichments[key].length} chars
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </motion.section>
            );
          }
        )}
      </motion.div>

      <motion.footer
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className={`fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t z-50 transition-colors duration-300 ${
          isDark
            ? "bg-slate-950/90 border-slate-800/50"
            : "bg-white/80 border-white/30"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div
              className={`text-sm ${
                isDark ? "text-gray-500" : "text-slate-600"
              }`}
            >
              <span className="font-medium">
                {
                  Object.keys(enrichments).filter((k) => enrichments[k]?.trim())
                    .length
                }
              </span>{" "}
              of{" "}
              {Object.keys(parsedData).reduce(
                (acc, key) => acc + parsedData[key].length,
                0
              )}{" "}
              items enriched
            </div>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`text-xs flex items-center space-x-1 ${
                isDark ? "text-gray-600" : "text-slate-400"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>More context = Smarter AI</span>
            </motion.div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBuildBot}
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
              isLoading
                ? "bg-slate-700 cursor-not-allowed"
                : isDark
                ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-900/30"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/30"
            } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Building Your AI Assistant...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Build My Bot & Start Preview</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.footer>
    </>
  );
};
