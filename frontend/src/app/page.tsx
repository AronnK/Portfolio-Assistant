"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { EnrichmentForm } from "@/components/EnrichmentForm";
import { ParsedResumeData } from "@/app/types";
import { ChatPreview } from "../components/ChatPreview";

const ResumeDropzone = dynamic(
  () => import("../components/dropResume").then((mod) => mod.ResumeDropzone),
  { ssr: false }
);

export default function Home() {
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [chatbotId, setChatbotId] = useState<string | null>(null);

  const handleParseComplete = (data: ParsedResumeData, file: File) => {
    setParsedData(data);
    setOriginalFile(file);
  };

  const handleBotBuilt = (id: string) => {
    setChatbotId(id);
  };

  const getHeaderText = () => {
    if (chatbotId) return "Preview Your New Assistant!";
    if (parsedData) return "Enrich Your Bot's Knowledge";
    return "Upload Your Resume to Get Started";
  };

  const renderContent = () => {
    if (chatbotId) {
      return <ChatPreview chatbotId={chatbotId} />;
    }
    if (parsedData) {
      return (
        <EnrichmentForm
          parsedData={parsedData}
          resumeFile={originalFile}
          onBotBuilt={handleBotBuilt}
        />
      );
    }
    return <ResumeDropzone onParsed={handleParseComplete} />;
  };

  return (
    <div className="font-sans flex flex-col h-screen bg-gray-50">
      <header className="text-center py-6 px-4 border-b bg-white shadow-sm shrink-0">
        <h1 className="text-3xl font-bold">Create Your Portfolio Assistant</h1>
        <p className="text-md text-gray-600 mt-1">{getHeaderText()}</p>
      </header>
      <main className="flex-grow overflow-y-auto p-4 sm:p-8">
        <div className="max-w-4xl mx-auto h-full">{renderContent()}</div>
      </main>
    </div>
  );
}
