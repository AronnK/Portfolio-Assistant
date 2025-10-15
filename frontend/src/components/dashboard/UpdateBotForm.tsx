"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Plus, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { UpdateFormData } from "@/app/types";
import { ChatbotService } from "@/lib/supabase/chatbot";
import { EncryptionService } from "@/lib/utils/encryption";
import { createClient } from "@/lib/supabase/client";

interface UpdateBotFormProps {
  chatbotId: number;
  collectionName: string;
  isDark: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

type FormType = "project" | "education" | "internship" | "experience" | "other";

export const UpdateBotForm = ({
  chatbotId,
  collectionName,
  isDark,
  onSuccess,
  onCancel,
}: UpdateBotFormProps) => {
  const [formData, setFormData] = useState<UpdateFormData>({
    title: "",
    details: "",
    type: "project",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [botConfig, setBotConfig] = useState<{
    provider: string;
    apiKey: string;
  } | null>(null);

  useEffect(() => {
    const fetchBotConfig = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const result = await ChatbotService.getUserChatbots(user.id);

        if (result.success && result.chatbots.length > 0) {
          const bot = result.chatbots.find((b) => b.id === chatbotId);

          if (bot && bot.encrypted_api_key) {
            const decryptedKey = await EncryptionService.decrypt(
              bot.encrypted_api_key
            );

            setBotConfig({
              provider: bot.llm_provider || "google",
              apiKey: decryptedKey,
            });

            console.log("Bot config loaded and decrypted");
          }
        }
      } catch (error) {
        console.error("Error fetching bot config:", error);
        toast.error("Failed to load bot configuration");
      }
    };

    fetchBotConfig();
  }, [chatbotId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading("Adding information...");
    const BACKEND_URL =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      "https://portfolio-assistant-1ash.onrender.com";

    try {
      const response = await fetch(`${BACKEND_URL}/api/add-to-bot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection_name: collectionName,
          text: `${formData.type.toUpperCase()}: ${formData.title}\n${
            formData.details
          }`,
          provider_name: botConfig?.provider || "google",
          api_key: botConfig?.apiKey || "",
        }),
      });

      if (!response.ok) throw new Error("Update failed");

      await ChatbotService.updateChatbot({
        chatbotId: chatbotId,
      });

      toast.success("Information added successfully!", { id: loadingToast });

      setTimeout(() => {
        onSuccess();
        setFormData({ title: "", details: "", type: "project" });
      }, 1000);
    } catch (error) {
      console.error("Error updating bot:", error);
      toast.error("Failed to update. Please try again.", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard isDark={isDark}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h3
            className={`text-xl font-bold mb-4 ${
              isDark ? "text-gray-100" : "text-slate-900"
            }`}
          >
            Add New Information
          </h3>
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-slate-700"
            }`}
          >
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as FormType })
            }
            className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
              isDark
                ? "bg-slate-800 border-slate-700 text-gray-100 focus:border-purple-500"
                : "bg-white border-slate-300 text-slate-900 focus:border-indigo-500"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDark ? "focus:ring-purple-500" : "focus:ring-indigo-500"
            }`}
          >
            <option value="project">Project</option>
            <option value="education">Education</option>
            <option value="internship">Internship</option>
            <option value="experience">Experience</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-slate-700"
            }`}
          >
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="e.g., Machine Learning Project, Internship at Company"
            required
            className={`w-full px-4 py-2.5 rounded-lg border transition-colors ${
              isDark
                ? "bg-slate-800 border-slate-700 text-gray-100 placeholder-gray-500 focus:border-purple-500"
                : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDark ? "focus:ring-purple-500" : "focus:ring-indigo-500"
            }`}
          />
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? "text-gray-300" : "text-slate-700"
            }`}
          >
            Details
          </label>
          <textarea
            value={formData.details}
            onChange={(e) =>
              setFormData({ ...formData, details: e.target.value })
            }
            placeholder="GitHub links, duration, technologies used, achievements, etc."
            rows={6}
            required
            className={`w-full px-4 py-2.5 rounded-lg border transition-colors resize-none ${
              isDark
                ? "bg-slate-800 border-slate-700 text-gray-100 placeholder-gray-500 focus:border-purple-500"
                : "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isDark ? "focus:ring-purple-500" : "focus:ring-indigo-500"
            }`}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              isDark
                ? "bg-purple-600 hover:bg-purple-500 text-white"
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {isSubmitting ? "Adding..." : "Add Information"}
          </motion.button>

          <motion.button
            type="button"
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700 text-gray-100"
                : "bg-slate-200 hover:bg-slate-300 text-slate-900"
            }`}
          >
            Cancel
          </motion.button>
        </div>
      </form>
    </GlassCard>
  );
};
