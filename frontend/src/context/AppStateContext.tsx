// "use client";
// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
// } from "react";

// interface AppState {
//   parsedData: any | null;
//   resumeFile: File | null;
//   tempCollectionName: string | null;
//   currentStep: "upload" | "enrich" | "preview" | "dashboard";
// }

// interface AppStateContextType {
//   appState: AppState;
//   setParsedData: (data: any, file: File) => void;
//   setTempCollection: (name: string) => void;
//   clearState: () => void;
// }

// const AppStateContext = createContext<AppStateContextType | null>(null);

// export const AppStateProvider = ({ children }: { children: ReactNode }) => {
//   const [appState, setAppState] = useState<AppState>({
//     parsedData: null,
//     resumeFile: null,
//     tempCollectionName: null,
//     currentStep: "upload",
//   });

//   useEffect(() => {
//     const saved = sessionStorage.getItem("app-state");
//     if (saved) {
//       try {
//         const parsed = JSON.parse(saved);
//         setAppState((prev) => ({ ...prev, ...parsed }));
//       } catch (e) {
//         console.error("Failed to load app state");
//       }
//     }
//   }, []);

//   useEffect(() => {
//     sessionStorage.setItem(
//       "app-state",
//       JSON.stringify({
//         parsedData: appState.parsedData,
//         tempCollectionName: appState.tempCollectionName,
//         currentStep: appState.currentStep,
//       })
//     );
//   }, [appState]);

//   const setParsedData = (data: any, file: File) => {
//     setAppState((prev) => ({
//       ...prev,
//       parsedData: data,
//       resumeFile: file,
//       currentStep: "enrich",
//     }));
//   };

//   const setTempCollection = (name: string) => {
//     setAppState((prev) => ({
//       ...prev,
//       tempCollectionName: name,
//       currentStep: "preview",
//     }));
//   };

//   const clearState = () => {
//     setAppState({
//       parsedData: null,
//       resumeFile: null,
//       tempCollectionName: null,
//       currentStep: "upload",
//     });
//     sessionStorage.removeItem("app-state");
//   };

//   return (
//     <AppStateContext.Provider
//       value={{ appState, setParsedData, setTempCollection, clearState }}
//     >
//       {children}
//     </AppStateContext.Provider>
//   );
// };

// export const useAppState = () => {
//   const context = useContext(AppStateContext);
//   if (!context)
//     throw new Error("useAppState must be used within AppStateProvider");
//   return context;
// };

"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface AppState {
  parsedData: any | null;
  // ✅ Store file metadata, not the File object itself
  resumeFileMeta: { name: string; size: number; type: string } | null;
}

interface AppStateContextType {
  appState: AppState;
  saveParsedData: (data: any, file: File) => void;
  clearParsedData: () => void;
  getResumeFile: () => File | null;
}

const AppStateContext = createContext<AppStateContextType | null>(null);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [appState, setAppState] = useState<AppState>({
    parsedData: null,
    resumeFileMeta: null,
  });

  // ✅ Store resume file in memory (will be lost on refresh, but we'll handle that)
  const [resumeFileCache, setResumeFileCache] = useState<File | null>(null);

  useEffect(() => {
    // Load parsed data from localStorage on mount
    const saved = localStorage.getItem("portfolio-parsed-data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAppState(parsed);
      } catch (e) {
        console.error("Failed to load parsed data");
      }
    }
  }, []);

  const saveParsedData = (data: any, file: File) => {
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
