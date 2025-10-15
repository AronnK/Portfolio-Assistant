"use client";
import { motion } from "framer-motion";
import { Key, Code, Puzzle, Zap, Check } from "lucide-react";
import { ExportType } from "./ExportModal";

interface ExportOptionsProps {
  onSelect: (type: ExportType) => void;
  isDark: boolean;
}

interface ExportOption {
  type: ExportType;
  icon: any;
  title: string;
  description: string;
  features: string[];
  difficulty: "Easy" | "Medium" | "Advanced";
  badge?: string;
}

const options: ExportOption[] = [
  {
    type: "byok",
    icon: Key,
    title: "BYOK (Bring Your Own Key)",
    description: "Use your own AI API key - No ongoing costs from us!",
    features: [
      "Use your Google/OpenAI/Groq API key",
      "Full control over AI model",
      "No monthly subscription",
      "Direct API integration",
    ],
    difficulty: "Easy",
    badge: "Recommended",
  },
  {
    type: "iframe",
    icon: Code,
    title: "iFrame Embed",
    description: "Embed the chat directly in your website",
    features: [
      "Copy & paste HTML code",
      "Works on any website",
      "Responsive design",
      "No coding knowledge needed",
    ],
    difficulty: "Easy",
  },
  {
    type: "widget",
    icon: Puzzle,
    title: "Chat Widget",
    description: "Floating chat bubble on your website",
    features: [
      "Small bubble in corner",
      "Expands when clicked",
      "Customizable colors",
      "Professional look",
    ],
    difficulty: "Easy",
  },
  {
    type: "api",
    icon: Zap,
    title: "REST API",
    description: "Integrate into your own application",
    features: [
      "Full API access",
      "Build custom interfaces",
      "Mobile app integration",
      "Complete flexibility",
    ],
    difficulty: "Advanced",
  },
];

export const ExportOptions = ({ onSelect, isDark }: ExportOptionsProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {options.map((option, index) => (
        <motion.button
          key={option.type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(option.type)}
          className={`relative p-6 rounded-xl border-2 text-left transition-all ${
            isDark
              ? "bg-slate-900/50 border-slate-800 hover:border-purple-600"
              : "bg-white/50 border-slate-200 hover:border-indigo-500"
          }`}
        >
          {option.badge && (
            <div
              className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${
                isDark
                  ? "bg-purple-600/20 text-purple-400"
                  : "bg-indigo-600/20 text-indigo-600"
              }`}
            >
              {option.badge}
            </div>
          )}

          <div
            className={`inline-flex p-3 rounded-xl mb-4 ${
              isDark
                ? "bg-purple-600/20 text-purple-400"
                : "bg-indigo-500/20 text-indigo-600"
            }`}
          >
            <option.icon className="w-6 h-6" />
          </div>

          <h3
            className={`text-lg font-bold mb-2 ${
              isDark ? "text-gray-100" : "text-slate-900"
            }`}
          >
            {option.title}
          </h3>

          <p
            className={`text-sm mb-4 ${
              isDark ? "text-gray-500" : "text-slate-600"
            }`}
          >
            {option.description}
          </p>

          <div className="space-y-2 mb-4">
            {option.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-2">
                <Check
                  className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    isDark ? "text-green-400" : "text-green-600"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-slate-600"
                  }`}
                >
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <div
            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
              option.difficulty === "Easy"
                ? isDark
                  ? "bg-green-500/20 text-green-400"
                  : "bg-green-500/20 text-green-700"
                : option.difficulty === "Medium"
                ? isDark
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-amber-500/20 text-amber-700"
                : isDark
                ? "bg-red-500/20 text-red-400"
                : "bg-red-500/20 text-red-700"
            }`}
          >
            {option.difficulty}
          </div>
        </motion.button>
      ))}
    </div>
  );
};
