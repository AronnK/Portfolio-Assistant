"use client";
import { ExternalLink as ExternalLinkIcon } from "lucide-react";

interface ExternalLinkProps {
  href: string;
  children: string;
  isDark: boolean;
}

export const ExternalLink = ({ href, children, isDark }: ExternalLinkProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 hover:underline ${
        isDark ? "text-purple-400" : "text-indigo-600"
      }`}
    >
      {children}
      <ExternalLinkIcon className="w-3 h-3" />
    </a>
  );
};
