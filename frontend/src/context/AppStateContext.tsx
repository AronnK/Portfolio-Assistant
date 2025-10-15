"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ParsedResumeData } from "@/app/types";

interface AppState {
  parsedData: ParsedResumeData | null;
  resumeFileMeta: { name: string; size: number; type: string } | null;
}

interface AppStateContextType {
  appState: AppState;
  saveParsedData: (data: ParsedResumeData, file: File) => void;
  clearParsedData: () => void;
  getResumeFile: () => File | null;
}

const AppStateContext = createContext<AppStateContextType | null>(null);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [appState, setAppState] = useState<AppState>({
    parsedData: null,
    resumeFileMeta: null,
  });

  const [resumeFileCache, setResumeFileCache] = useState<File | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-parsed-data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAppState(parsed);
      } catch {
        console.error("Failed to load parsed data");
      }
    }
  }, []);

  const saveParsedData = (data: ParsedResumeData, file: File) => {
    const newState = {
      parsedData: data,
      resumeFileMeta: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
    };
    setAppState(newState);
    setResumeFileCache(file);
    localStorage.setItem("portfolio-parsed-data", JSON.stringify(newState));
  };

  const clearParsedData = () => {
    setAppState({ parsedData: null, resumeFileMeta: null });
    setResumeFileCache(null);
    localStorage.removeItem("portfolio-parsed-data");
  };

  const getResumeFile = () => resumeFileCache;

  return (
    <AppStateContext.Provider
      value={{ appState, saveParsedData, clearParsedData, getResumeFile }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context)
    throw new Error("useAppState must be used within AppStateProvider");
  return context;
};
