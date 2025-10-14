"use client";
import { motion } from "framer-motion";
import { ParsedItem } from "@/app/types";
import { Check } from "lucide-react";

interface EnrichmentItemProps {
  item: ParsedItem;
  itemKey: string;
  index: number;
  enrichments: Record<string, string>;
  focusedField: string | null;
  onEnrichmentChange: (key: string, value: string) => void;
  onFocusChange: (key: string | null) => void;
  isDark: boolean;
}

export const EnrichmentItem = ({
  item,
  itemKey,
  index,
  enrichments,
  focusedField,
  onEnrichmentChange,
  onFocusChange,
  isDark,
}: EnrichmentItemProps) => {
  const isFocused = focusedField === itemKey;
  const hasContent = enrichments[itemKey]?.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
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
          value={enrichments[itemKey] || ""}
          onChange={(e) => onEnrichmentChange(itemKey, e.target.value)}
          onFocus={() => onFocusChange(itemKey)}
          onBlur={() => onFocusChange(null)}
        />
        {enrichments[itemKey] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`absolute bottom-2 right-2 text-xs ${
              isDark ? "text-gray-600" : "text-slate-400"
            }`}
          >
            {enrichments[itemKey].length} chars
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
