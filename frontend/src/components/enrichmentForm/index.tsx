// "use client";
// import { useState } from "react";
// import { ParsedResumeData } from "@/app/types";
// import { AnimatePresence } from "framer-motion";
// import { FadeIn } from "@/components/animations/FadeIn";
// import { SectionCard } from "./SectionCard";
// import { BuildBotFooter } from "./BuildBotFooter";

// interface EnrichmentFormProps {
//   parsedData: ParsedResumeData;
//   resumeFile: File | null;
//   onBotBuilt: (tempCollectionName: string) => void;
//   isDark?: boolean;
// }

// export const EnrichmentForm = ({
//   parsedData,
//   resumeFile,
//   onBotBuilt,
//   isDark = false,
// }: EnrichmentFormProps) => {
//   const [enrichments, setEnrichments] = useState<Record<string, string>>({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [focusedField, setFocusedField] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const handleEnrichmentChange = (key: string, value: string) => {
//     setEnrichments((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleBuildBot = async () => {
//     if (!resumeFile) {
//       setError("Resume file is missing!");
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       const formData = new FormData();
//       formData.append("resumeFile", resumeFile);
//       formData.append("enrichments", JSON.stringify(enrichments));
//       formData.append("parsedData", JSON.stringify(parsedData));

//       formData.append("provider_name", "google");
//       formData.append("api_key", "");

//       console.log("Sending build request with enrichments:", enrichments);

//       const response = await fetch("http://127.0.0.1:5001/api/build-bot", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(
//           errorData.error || `API request failed: ${response.status}`
//         );
//       }

//       const result = await response.json();
//       console.log("Bot built successfully:", result);

//       // Pass the temp collection name to parent (for preview)
//       onBotBuilt(result.collection_name);
//     } catch (error: any) {
//       console.error("Error building bot:", error);
//       setError(
//         error.message ||
//           "An error occurred while building your bot. Please try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const totalItems = Object.keys(parsedData).reduce(
//     (acc, key) => acc + parsedData[key].length,
//     0
//   );
//   const enrichedItems = Object.keys(enrichments).filter((k) =>
//     enrichments[k]?.trim()
//   ).length;

//   return (
//     <>
//       <FadeIn>
//         <div className="space-y-6 pb-32">
//           {error && (
//             <div
//               className={`p-4 rounded-lg border ${
//                 isDark
//                   ? "bg-red-900/20 border-red-800/50 text-red-400"
//                   : "bg-red-50 border-red-200 text-red-600"
//               }`}
//             >
//               <p className="text-sm font-medium">❌ {error}</p>
//             </div>
//           )}

//           <AnimatePresence>
//             {Object.entries(parsedData).map(
//               ([sectionTitle, items], sectionIndex) => (
//                 <SectionCard
//                   key={sectionTitle}
//                   sectionTitle={sectionTitle}
//                   items={items}
//                   sectionIndex={sectionIndex}
//                   enrichments={enrichments}
//                   focusedField={focusedField}
//                   onEnrichmentChange={handleEnrichmentChange}
//                   onFocusChange={setFocusedField}
//                   isDark={isDark}
//                 />
//               )
//             )}
//           </AnimatePresence>
//         </div>
//       </FadeIn>

//       <BuildBotFooter
//         enrichedItems={enrichedItems}
//         totalItems={totalItems}
//         isLoading={isLoading}
//         onBuildBot={handleBuildBot}
//         isDark={isDark}
//       />
//     </>
//   );
// };

"use client";
import { useState } from "react";
import { ParsedResumeData } from "@/app/types";
import { AnimatePresence } from "framer-motion";
import { FadeIn } from "../animations/FadeIn";
import { SectionCard } from "./SectionCard";
import { BuildBotFooter } from "./BuildBotFooter";

interface EnrichmentFormProps {
  parsedData: ParsedResumeData;
  resumeFile: File | null;
  onBotBuilt: (tempCollectionName: string) => void;
  isDark?: boolean;
}

export const EnrichmentForm = ({
  parsedData,
  resumeFile,
  onBotBuilt,
  isDark = false,
}: EnrichmentFormProps) => {
  const [enrichments, setEnrichments] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEnrichmentChange = (key: string, value: string) => {
    setEnrichments((prev) => ({ ...prev, [key]: value }));
  };

  const handleBuildBot = async () => {
    if (!resumeFile) {
      setError("Resume file is missing!");
      return;
    }
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("resumeFile", resumeFile);
    formData.append("enrichments", JSON.stringify(enrichments));
    formData.append("parsedData", JSON.stringify(parsedData));
    formData.append("provider_name", "google");
    formData.append("api_key", "");

    try {
      const response = await fetch("http://127.0.0.1:5001/api/build-bot", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `API request failed: ${response.status}`
        );
      }

      const result = await response.json();
      onBotBuilt(result.collection_name);
    } catch (error: any) {
      setError(error.message || "An error occurred while building your bot.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- FIX: Filter out sections that are not arrays (like personal_details) ---
  const renderableSections = Object.entries(parsedData).filter(
    ([key, value]) => Array.isArray(value) && value.length > 0
  );

  const totalItems = renderableSections.reduce(
    (acc, [, items]) => acc + items.length,
    0
  );

  const enrichedItems = Object.keys(enrichments).filter((k) =>
    enrichments[k]?.trim()
  ).length;

  return (
    <>
      <FadeIn>
        <div className="space-y-6 pb-32">
          {error && (
            <div
              className={`p-4 rounded-lg border ${
                isDark
                  ? "bg-red-900/20 border-red-800/50 text-red-400"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              <p className="text-sm font-medium">❌ {error}</p>
            </div>
          )}

          <AnimatePresence>
            {/* --- FIX: Map over the filtered 'renderableSections' --- */}
            {renderableSections.map(([sectionTitle, items], sectionIndex) => (
              <SectionCard
                key={sectionTitle}
                sectionTitle={sectionTitle}
                items={items}
                sectionIndex={sectionIndex}
                enrichments={enrichments}
                focusedField={focusedField}
                onEnrichmentChange={handleEnrichmentChange}
                onFocusChange={setFocusedField}
                isDark={isDark}
              />
            ))}
          </AnimatePresence>
        </div>
      </FadeIn>

      <BuildBotFooter
        enrichedItems={enrichedItems}
        totalItems={totalItems}
        isLoading={isLoading}
        onBuildBot={handleBuildBot}
        isDark={isDark}
      />
    </>
  );
};
