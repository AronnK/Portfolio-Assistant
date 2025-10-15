"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Loader2, CheckCircle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { UpdateFormData } from "@/app/types";

interface UpdateBotFormProps {
  chatbotId: number;
  collectionName: string;
  isDark: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

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
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Call your backend API to update the collection
      const response = await fetch("http://127.0.0.1:5001/api/chatbot/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection_name: collectionName,
          chunks: [
            `${formData.type.toUpperCase()}: ${formData.title}\n${
              formData.details
            }`,
          ],
          metadata: {
            type: formData.type,
            title: formData.title,
            added_at: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) throw new Error("Update failed");

      setSubmitStatus("success");
      setTimeout(() => {
        onSuccess();
        setFormData({ title: "", details: "", type: "project" });
      }, 1500);
    } catch (error) {
      console.error("Error updating bot:", error);
      setSubmitStatus("error");
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
              setFormData({ ...formData, type: e.target.value as any })
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

        {submitStatus === "success" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-green-500 text-sm font-medium"
          >
            <CheckCircle className="w-4 h-4" />
            Successfully added!
          </motion.div>
        )}

        {submitStatus === "error" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm font-medium"
          >
            Failed to update. Please try again.
          </motion.div>
        )}

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
