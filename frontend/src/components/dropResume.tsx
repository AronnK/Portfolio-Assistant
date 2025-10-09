"use client";
import React, { FC, useState } from "react";
import { useDropzone, Accept } from "react-dropzone";
import { ParsedResumeData } from "@/app/types";

interface ResumeDropzoneProps {
  onParsed: (data: ParsedResumeData, originalFile: File) => void;
}

export const ResumeDropzone: FC<ResumeDropzoneProps> = ({ onParsed }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await fetch("http://127.0.0.1:5001/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const parsedData: ParsedResumeData = await response.json();
      onParsed(parsedData, file);
    } catch (err) {
      setError(
        "Failed to parse the PDF via the backend. Is the server running?"
      );
      console.error("Error parsing resume via backend:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptConfig: Accept = { "application/pdf": [".pdf"] };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptConfig,
    multiple: false,
  });

  return (
    <div className="flex flex-col items-center">
      <div
        {...getRootProps()}
        className={`w-full border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50"
        }`}
      >
        <input {...getInputProps()} />
        {isLoading ? (
          <p className="text-gray-600">Analyzing your resume with AI...</p>
        ) : isDragActive ? (
          <p className="text-blue-600">Drop the file here ...</p>
        ) : (
          <p className="text-gray-600">
            Drag 'n' drop your resume here, or click to select a PDF
          </p>
        )}
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};
