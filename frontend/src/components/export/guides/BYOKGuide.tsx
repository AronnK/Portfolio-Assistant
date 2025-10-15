"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { GuideStep } from "../shared/GuideStep";
import { APIKeyInput } from "../shared/APIKeyInput";
import { WarningBanner } from "../shared/WarningBanner";
import { ExternalLink } from "../shared/ExternalLink";
import { ChatbotService } from "@/lib/supabase/chatbot";
import { createClient } from "@/lib/supabase/client";
import { EncryptionService } from "@/lib/utils/encryption";

interface BYOKGuideProps {
  tempCollectionName: string;
  isDark: boolean;
  onComplete?: () => void;
}

export const BYOKGuide = ({
  tempCollectionName,
  isDark,
  onComplete,
}: BYOKGuideProps) => {
  const [provider, setProvider] = useState<"google" | "openai" | "groq">(
    "google"
  );
  const [apiKey, setApiKey] = useState("");
  const [isActivating, setIsActivating] = useState(false);

  const providerInfo = {
    google: {
      name: "Google Gemini",
      url: "https://makersuite.google.com/app/apikey",
      steps: [
        "Go to Google AI Studio",
        "Sign in with your Google account",
        "Click 'Get API Key' or 'Create API Key'",
        "Copy the key and paste it below",
      ],
    },
    openai: {
      name: "OpenAI",
      url: "https://platform.openai.com/api-keys",
      steps: [
        "Go to OpenAI API Keys",
        "Sign in or create an OpenAI account",
        "Click '+ Create new secret key'",
        "Copy the key (you won't see it again!)",
      ],
    },
    groq: {
      name: "Groq",
      url: "https://console.groq.com/keys",
      steps: [
        "Go to Groq Console",
        "Sign up for a free Groq account",
        "Click 'Create API Key'",
        "Copy your API key",
      ],
    },
  };

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://portfolio-assistant-1ush.onrender.com";

  const handleActivate = async () => {
    if (!apiKey.trim()) {
      toast.error("Please enter your API key");
      return;
    }

    setIsActivating(true);
    const loadingToast = toast.loading("Activating your bot...");

    try {
      const response = await fetch(`${BACKEND_URL}/api/collections/finalize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temp_collection_name: tempCollectionName,
          permanent_collection_name: `prod_${tempCollectionName}`,
          provider_name: provider,
          api_key: apiKey,
        }),
      });

      if (!response.ok) throw new Error("Failed to finalize collection");

      const result = await response.json();
      console.log("Collection finalized:", result);

      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      console.log("Encrypting API key...");
      const encryptedApiKey = await EncryptionService.encrypt(apiKey);
      console.log("API key encrypted");

      const supabaseResult = await ChatbotService.finalizeNewChatbot({
        userId: user.id,
        collectionName: result.new_collection_name,
        llmProvider: provider,
        encryptedApiKey: encryptedApiKey,
        projectName: "default",
      });

      if (!supabaseResult.success) {
        throw new Error(supabaseResult.error || "Failed to update database");
      }

      console.log("Supabase updated:", supabaseResult.chatbot);

      toast.success("Bot activated successfully! 🎉", { id: loadingToast });

      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500);
    } catch (error: unknown) {
      console.error("Activation error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to activate bot";
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3
          className={`text-2xl font-bold mb-2 ${
            isDark ? "text-gray-100" : "text-slate-900"
          }`}
        >
          Bring Your Own API Key
        </h3>
        <p className={`text-sm ${isDark ? "text-gray-500" : "text-slate-600"}`}>
          Use your own AI provider&apos;s API key - no recurring charges from
          us!
        </p>
      </div>

      <div className="space-y-4">
        <GuideStep
          stepNumber={1}
          title="Choose Your AI Provider"
          description="Select which AI service you want to use for your chatbot"
          isDark={isDark}
        >
          <div className="grid grid-cols-3 gap-3">
            {(["google", "openai", "groq"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setProvider(p)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  provider === p
                    ? isDark
                      ? "border-purple-600 bg-purple-600/10"
                      : "border-indigo-600 bg-indigo-600/10"
                    : isDark
                    ? "border-slate-800 hover:border-slate-700"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div
                  className={`text-sm font-medium ${
                    isDark ? "text-gray-200" : "text-slate-800"
                  }`}
                >
                  {providerInfo[p].name}
                </div>
              </button>
            ))}
          </div>
        </GuideStep>

        <GuideStep
          stepNumber={2}
          title="Get Your API Key"
          description={`Follow these steps to get your API key from ${providerInfo[provider].name}:`}
          isDark={isDark}
          delay={0.1}
        >
          <ol
            className={`space-y-3 text-sm ${
              isDark ? "text-gray-400" : "text-slate-600"
            }`}
          >
            {providerInfo[provider].steps.map((step, i) => (
              <li key={i} className="flex gap-2">
                <span className="font-medium">{i + 1}.</span>
                <span>
                  {i === 0 ? (
                    <>
                      Go to{" "}
                      <ExternalLink
                        href={providerInfo[provider].url}
                        isDark={isDark}
                      >
                        {providerInfo[provider].name}
                      </ExternalLink>
                    </>
                  ) : (
                    step
                  )}
                </span>
              </li>
            ))}
          </ol>
        </GuideStep>

        <GuideStep
          stepNumber={3}
          title="Paste Your API Key"
          description="Your key is encrypted and stored securely"
          isDark={isDark}
          delay={0.2}
        >
          <APIKeyInput value={apiKey} onChange={setApiKey} isDark={isDark} />
          <div className="mt-3">
            <WarningBanner
              message="Your API key is encrypted with AES-256 before storage and never shared. We recommend creating a separate key with limited permissions."
              isDark={isDark}
            />
          </div>
        </GuideStep>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleActivate}
        disabled={!apiKey.trim() || isActivating}
        className={`w-full py-4 rounded-xl font-semibold transition-all ${
          isDark
            ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white"
            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isActivating ? "Activating..." : "Activate My Bot"}
      </motion.button>
    </div>
  );
};
