"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { EnrichmentForm } from "@/components/EnrichmentForm";
import { ParsedResumeData } from "@/utils/resumeParser";

const ResumeDropzone = dynamic(
  () => import("../components/dropResume").then((mod) => mod.ResumeDropzone),
  { ssr: false }
);

export default function Home() {
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const handleParseComplete = (data: ParsedResumeData, file: File) => {
    setParsedData(data);
    setOriginalFile(file);
  };

  return (
    <div className="font-sans flex flex-col h-screen">
      <header className="text-center py-6 px-4 border-b">
        <h1 className="text-3xl font-bold">Create Your Portfolio Assistant</h1>
        <p className="text-md text-gray-600 mt-1">
          Upload your resume to get started.
        </p>
      </header>
      <main className="flex-grow overflow-y-auto p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          {!parsedData ? (
            <ResumeDropzone onParsed={handleParseComplete} />
          ) : (
            <EnrichmentForm parsedData={parsedData} resumeFile={originalFile} />
          )}
        </div>
      </main>
    </div>
  );
}
