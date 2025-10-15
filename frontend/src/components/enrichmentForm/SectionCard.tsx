"use client";
import { motion } from "framer-motion";
import { ParsedItem } from "@/app/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { EnrichmentItem } from "./EnrichmentItem";
import {
  GraduationCap,
  Briefcase,
  Award,
  Code,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { ComponentType } from "react";

const sectionIcons: Record<string, ComponentType<{ className: string }>> = {
  education: GraduationCap,
  experience: Briefcase,
  projects: Code,
  skills: Award,
  certifications: Award,
  achievements: Sparkles,
};

interface SectionCardProps {
  sectionTitle: string;
  items: ParsedItem[];
  sectionIndex: number;
  enrichments: Record<string, string>;
  focusedField: string | null;
  onEnrichmentChange: (key: string, value: string) => void;
  onFocusChange: (key: string | null) => void;
  isDark: boolean;
}

export const SectionCard = ({
  sectionTitle,
  items,
  sectionIndex,
  enrichments,
  focusedField,
  onEnrichmentChange,
  onFocusChange,
  isDark,
}: SectionCardProps) => {
  const IconComponent = sectionIcons[sectionTitle.toLowerCase()] || BookOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: sectionIndex * 0.1 }}
    >
      <GlassCard isDark={isDark}>
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
            {sectionTitle.toLowerCase().replace("_", " ")}
          </h3>
          <div
            className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${
              isDark
                ? "bg-slate-800/70 text-gray-400"
                : "bg-slate-100/50 text-slate-600"
            }`}
          >
            {Array.isArray(items)
              ? `${items.length} ${items.length === 1 ? "item" : "items"}`
              : "Details"}
          </div>
        </div>

        <div className="p-6 space-y-4">
          {Array.isArray(items) &&
            items.map((item, index) => (
              <EnrichmentItem
                key={`${sectionTitle}-${index}`}
                item={item}
                itemKey={`${sectionTitle}-${index}`}
                index={index}
                enrichments={enrichments}
                focusedField={focusedField}
                onEnrichmentChange={onEnrichmentChange}
                onFocusChange={onFocusChange}
                isDark={isDark}
              />
            ))}
        </div>
      </GlassCard>
    </motion.div>
  );
};
