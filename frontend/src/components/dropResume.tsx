"use client";
import { useState, useCallback } from "react";
import { useDropzone, Accept } from "react-dropzone";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ParsedResumeData } from "@/app/types";
import { dummyResumeData } from "@/utils/dummyData";

interface ResumeDropzoneProps {
  onParsed: (data: ParsedResumeData, originalFile: File) => void;
  isDark?: boolean;
}

export const ResumeDropzone = ({
  onParsed,
  isDark = false,
}: ResumeDropzoneProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsLoading(true);
      setError(null);
      setUploadStatus("idle");

      setTimeout(() => {
        console.log("DUMMY MODE: Returning mock parsed data");
        console.log("File:", file.name);
        setIsLoading(false);
        setUploadStatus("success");
        setTimeout(() => onParsed(dummyResumeData, file), 500);
      }, 2000);
      return; // Remove this return when switching to real API

      // Uncomment when backend is ready
      // const formData = new FormData();
      // formData.append("resume", file);

      // try {
      //   const response = await fetch("http://127.0.0.1:5001/api/parse-resume", {
      //     method: "POST",
      //     body: formData,
      //   });

      //   if (!response.ok) {
      //     throw new Error(`Server responded with ${response.status}`);
      //   }

      //   const parsedData: ParsedResumeData = await response.json();
      //   console.log("Resume parsed successfully:", parsedData);

      //   setIsLoading(false);
      //   setUploadStatus("success");
      //   setTimeout(() => onParsed(parsedData, file), 500);
      // } catch (err) {
      //   console.error("Error parsing resume:", err);
      //   setError("Failed to parse the PDF. Is the server running?");
      //   setIsLoading(false);
      //   setUploadStatus("error");
      // }
    },
    [onParsed]
  );

  const acceptConfig: Accept = { "application/pdf": [".pdf"] };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptConfig,
    multiple: false,
    disabled: isLoading,
  });

  const {
    onClick,
    onKeyDown,
    onFocus,
    onBlur,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDrop: _,
    ...rootProps
  } = getRootProps();

  return (
    <GlassCard isDark={isDark} padding={false}>
      <div
        onClick={onClick}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        {...rootProps}
      >
        <motion.div
          whileHover={!isLoading ? { scale: 1.01 } : {}}
          className={`p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
            isDragActive
              ? isDark
                ? "border-purple-500 bg-purple-500/10"
                : "border-indigo-500 bg-indigo-500/10"
              : uploadStatus === "error"
              ? isDark
                ? "border-red-500 bg-red-500/10"
                : "border-red-500 bg-red-500/10"
              : isDark
              ? "border-slate-700 hover:border-purple-600"
              : "border-slate-300 hover:border-indigo-500"
          } ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center text-center space-y-4">
            {isLoading ? (
              <Loader2
                className={`w-16 h-16 animate-spin ${
                  isDark ? "text-purple-400" : "text-indigo-600"
                }`}
              />
            ) : uploadStatus === "success" ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <CheckCircle className="w-16 h-16 text-green-500" />
              </motion.div>
            ) : uploadStatus === "error" ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <AlertCircle className="w-16 h-16 text-red-500" />
              </motion.div>
            ) : isDragActive ? (
              <Upload
                className={`w-16 h-16 ${
                  isDark ? "text-purple-400" : "text-indigo-600"
                }`}
              />
            ) : (
              <FileText
                className={`w-16 h-16 ${
                  isDark ? "text-gray-500" : "text-slate-400"
                }`}
              />
            )}

            <div>
              <h3
                className={`text-xl font-bold mb-2 ${
                  isDark ? "text-gray-100" : "text-slate-900"
                }`}
              >
                {isLoading
                  ? "Analyzing your resume with AI..."
                  : uploadStatus === "success"
                  ? "Resume parsed successfully!"
                  : uploadStatus === "error"
                  ? "Upload failed"
                  : isDragActive
                  ? "Drop your resume here"
                  : "Upload your resume"}
              </h3>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-500" : "text-slate-600"
                }`}
              >
                {isLoading
                  ? "This may take a few seconds"
                  : uploadStatus === "success"
                  ? "Redirecting to enrichment..."
                  : uploadStatus === "error"
                  ? error || "Something went wrong"
                  : "Drag and drop or click to select a PDF file"}
              </p>
            </div>

            {!isLoading && uploadStatus === "idle" && (
              <div className="space-y-2">
                <div
                  className={`text-xs ${
                    isDark ? "text-gray-600" : "text-slate-400"
                  }`}
                >
                  Supported format: PDF (Max 10MB)
                </div>
                <div
                  className={`flex items-center justify-center space-x-2 text-xs ${
                    isDark ? "text-gray-600" : "text-slate-400"
                  }`}
                >
                  <span>🤖</span>
                  <span>AI-powered resume parsing</span>
                </div>
              </div>
            )}

            {uploadStatus === "error" && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadStatus("idle");
                  setError(null);
                }}
                className={`mt-4 px-6 py-2 rounded-lg font-medium transition-colors ${
                  isDark
                    ? "bg-purple-600 hover:bg-purple-500 text-white"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white"
                }`}
              >
                Try Again
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </GlassCard>
  );
};
