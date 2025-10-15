"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  isDark: boolean;
}

export const CodeBlock = ({
  code,
  language = "html",
  isDark,
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  console.log(language);

  return (
    <div className="relative">
      <div className={`absolute top-2 right-2 z-10`}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={copyToClipboard}
          className={`p-2 rounded-lg transition-colors ${
            isDark
              ? "bg-slate-800 hover:bg-slate-700 text-gray-300"
              : "bg-slate-200 hover:bg-slate-300 text-slate-700"
          }`}
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </motion.button>
      </div>
      <pre
        className={`p-4 rounded-lg overflow-x-auto text-sm ${
          isDark ? "bg-slate-950 text-gray-300" : "bg-slate-100 text-slate-800"
        }`}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
};
