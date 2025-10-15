"use client";
import { Key } from "lucide-react";

interface APIKeyInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isDark: boolean;
}

export const APIKeyInput = ({
  value,
  onChange,
  placeholder = "sk-...",
  isDark,
}: APIKeyInputProps) => {
  return (
    <div className="relative">
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 pr-12 rounded-lg border transition-colors ${
          isDark
            ? "bg-slate-950 border-slate-800 text-gray-100 placeholder-gray-600"
            : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
        } focus:outline-none focus:ring-2 ${
          isDark ? "focus:ring-purple-600" : "focus:ring-indigo-500"
        }`}
      />
      <Key
        className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
          isDark ? "text-gray-600" : "text-slate-400"
        }`}
      />
    </div>
  );
};
