"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import toast from "react-hot-toast";
import { ParsedResumeData } from "@/app/types";

interface ResumeDropzoneProps {
  onParsed?: (data: ParsedResumeData, file: File) => void;
  isDark?: boolean;
}

export const ResumeDropzone = ({
  onParsed,
  isDark = false,
}: ResumeDropzoneProps) => {
  const router = useRouter();
  const { saveParsedData } = useAppState();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleFileUpload = async (file: File) => {
    if (!file.type.includes("pdf")) {
      toast.error("Please upload a PDF file");
      return;
    }

    setIsUploading(true);
    setUploadStatus("idle");

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await fetch("http://127.0.0.1:5001/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to parse resume");
      }

      const parsedData = await response.json();
      console.log("Resume parsed successfully:", parsedData);

      saveParsedData(parsedData, file);

      setUploadStatus("success");
      toast.success("Resume parsed successfully!");

      if (onParsed) {
        onParsed(parsedData, file);
      }

      setTimeout(() => {
        router.push("/home/enrich");
      }, 500);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      const message =
        error instanceof Error ? error.message : "An unknown error occurred.";
      toast.error(message || "Failed to parse resume");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 transition-all ${
          isDragging
            ? isDark
              ? "border-purple-500 bg-purple-500/10"
              : "border-indigo-500 bg-indigo-500/10"
            : isDark
            ? "border-slate-700 hover:border-slate-600"
            : "border-slate-300 hover:border-slate-400"
        } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
          id="resume-upload"
          disabled={isUploading}
        />

        <label
          htmlFor="resume-upload"
          className="flex flex-col items-center cursor-pointer"
        >
          <AnimatePresence mode="wait">
            {isUploading ? (
              <motion.div
                key="uploading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center"
              >
                <Loader2
                  className={`w-16 h-16 mb-4 animate-spin ${
                    isDark ? "text-purple-400" : "text-indigo-600"
                  }`}
                />
                <p
                  className={`text-lg font-medium ${
                    isDark ? "text-gray-200" : "text-slate-900"
                  }`}
                >
                  Parsing your resume...
                </p>
                <p
                  className={`text-sm mt-2 ${
                    isDark ? "text-gray-500" : "text-slate-600"
                  }`}
                >
                  This may take a few seconds
                </p>
              </motion.div>
            ) : uploadStatus === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
              >
                <CheckCircle2 className="w-16 h-16 mb-4 text-green-500" />
                <p
                  className={`text-lg font-medium ${
                    isDark ? "text-gray-200" : "text-slate-900"
                  }`}
                >
                  Resume parsed successfully!
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center"
              >
                <div
                  className={`p-6 rounded-full mb-6 ${
                    isDark ? "bg-purple-600/20" : "bg-indigo-600/20"
                  }`}
                >
                  <FileText
                    className={`w-12 h-12 ${
                      isDark ? "text-purple-400" : "text-indigo-600"
                    }`}
                  />
                </div>
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    isDark ? "text-gray-100" : "text-slate-900"
                  }`}
                >
                  Upload your resume
                </h3>
                <p
                  className={`text-center mb-6 ${
                    isDark ? "text-gray-400" : "text-slate-600"
                  }`}
                >
                  Drag and drop or click to select a PDF file
                </p>
                <div
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
                    isDark
                      ? "bg-purple-600 hover:bg-purple-500 text-white"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                >
                  <Upload className="w-5 h-5" />
                  Choose File
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </label>
      </motion.div>
    </div>
  );
};
