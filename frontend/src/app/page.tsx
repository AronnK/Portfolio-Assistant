"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import {
  Bot,
  Sparkles,
  Lock,
  Zap,
  Code,
  Globe,
  ArrowRight,
  CheckCircle2,
  Github,
  Linkedin,
  Mail,
  Sun,
  Moon,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem("portfolio-theme");
    setIsDark(theme === "dark" || theme === null);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("portfolio-theme", newTheme ? "dark" : "light");
  };

  const handleGetStarted = () => {
    router.push(user ? "/home" : "/auth");
  };

  const features = [
    {
      icon: Bot,
      title: "AI-Powered Portfolio Assistant",
      description:
        "Transform your resume into an intelligent chatbot that answers questions about your experience, skills, and projects.",
    },
    {
      icon: Sparkles,
      title: "Knowledge Enrichment",
      description:
        "Add context and details to make your AI assistant smarter and more informative about your background.",
    },
    {
      icon: Lock,
      title: "Bring Your Own Key (BYOK)",
      description:
        "Use your own AI provider API key for full control and zero recurring costs from us.",
    },
    {
      icon: Zap,
      title: "Instant Deployment",
      description:
        "Deploy your AI assistant in minutes with iframe embed, API access, or script integration.",
    },
    {
      icon: Code,
      title: "Multiple Integration Options",
      description:
        "Embed on your website, integrate via API, or use our hosted solution - you choose what works best.",
    },
    {
      icon: Globe,
      title: "Share Anywhere",
      description:
        "Get a shareable link to your AI assistant that you can add to your portfolio, LinkedIn, or resume.",
    },
  ];

  const steps = [
    {
      step: 1,
      title: "Upload Your Resume",
      description:
        "Upload your PDF resume and our AI will parse it automatically.",
    },
    {
      step: 2,
      title: "Enrich Your Knowledge Base",
      description:
        "Add context, links, and additional details to make your assistant smarter.",
    },
    {
      step: 3,
      title: "Deploy & Share",
      description:
        "Get your AI assistant live and share it with potential employers or clients.",
    },
  ];

  const pricingFeatures = [
    "Unlimited resume uploads",
    "AI-powered parsing",
    "Knowledge enrichment tools",
    "Multiple integration methods",
    "Shareable public links",
    "No hidden fees with BYOK",
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
          : "bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900"
      }`}
    >
      <nav
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b ${
          isDark
            ? "bg-slate-950/80 border-slate-800"
            : "bg-white/80 border-slate-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg ${
                isDark ? "bg-purple-600/20" : "bg-indigo-600/20"
              }`}
            >
              <Bot
                className={`w-5 h-5 ${
                  isDark ? "text-purple-400" : "text-indigo-600"
                }`}
              />
            </div>
            <span className="text-xl font-bold">Portfolio AI</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? "hover:bg-slate-800 text-gray-400"
                  : "hover:bg-slate-100 text-slate-600"
              }`}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            {user ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/home")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isDark
                    ? "bg-purple-600 hover:bg-purple-500 text-white"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white"
                }`}
              >
                Dashboard
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/auth")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  isDark
                    ? "bg-purple-600 hover:bg-purple-500 text-white"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white"
                }`}
              >
                Sign In
              </motion.button>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-600/30 mb-8">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium">
                AI-Powered Portfolio Assistants
              </span>
            </div>
            <h1
              className={`text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r ${
                isDark
                  ? "from-white via-purple-200 to-blue-200"
                  : "from-slate-900 via-indigo-600 to-purple-600"
              } bg-clip-text text-transparent`}
            >
              Your Resume,
              <br />
              Powered by AI
            </h1>
            <p
              className={`text-xl lg:text-2xl mb-12 max-w-3xl mx-auto ${
                isDark ? "text-gray-400" : "text-slate-600"
              }`}
            >
              Transform your resume into an intelligent chatbot that answers
              questions about your experience, skills, and projects. Deploy
              anywhere in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStarted}
                className={`px-8 py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 ${
                  isDark
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
                }`}
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className={`px-8 py-4 rounded-xl font-semibold text-lg border-2 ${
                  isDark
                    ? "border-slate-700 hover:bg-slate-800 text-white"
                    : "border-slate-300 hover:bg-slate-50 text-slate-900"
                }`}
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </section>

        <section
          id="features"
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Powerful Features
            </h2>
            <p
              className={`text-xl ${
                isDark ? "text-gray-400" : "text-slate-600"
              }`}
            >
              Everything you need to create an intelligent portfolio assistant
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-2xl border backdrop-blur-sm ${
                  isDark
                    ? "bg-slate-900/50 border-slate-800 hover:border-purple-600/50"
                    : "bg-white/50 border-slate-200 hover:border-indigo-600/50"
                } transition-all`}
              >
                <div
                  className={`p-3 rounded-lg w-fit mb-4 ${
                    isDark
                      ? "bg-purple-600/20 text-purple-400"
                      : "bg-indigo-600/20 text-indigo-600"
                  }`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className={isDark ? "text-gray-400" : "text-slate-600"}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p
              className={`text-xl ${
                isDark ? "text-gray-400" : "text-slate-600"
              }`}
            >
              Get your AI assistant live in 3 simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 ${
                    isDark
                      ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white"
                      : "bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
                  }`}
                >
                  {step.step}
                </div>
                <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
                <p className={isDark ? "text-gray-400" : "text-slate-600"}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t ${
            isDark ? "border-slate-800" : "border-slate-200"
          }`}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Simple Pricing
            </h2>
            <p
              className={`text-xl ${
                isDark ? "text-gray-400" : "text-slate-600"
              }`}
            >
              Free to use with your own API key
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-lg mx-auto"
          >
            <div
              className={`p-8 rounded-2xl border-2 ${
                isDark
                  ? "bg-slate-900/50 border-purple-600"
                  : "bg-white border-indigo-600"
              }`}
            >
              <h3 className="text-3xl font-bold mb-2">Free Forever</h3>
              <p
                className={`mb-6 ${
                  isDark ? "text-gray-400" : "text-slate-600"
                }`}
              >
                Use your own AI provider API key
              </p>
              <div className="mb-8">
                <span className="text-5xl font-bold">$0</span>
                <span className={isDark ? "text-gray-400" : "text-slate-600"}>
                  /month
                </span>
              </div>
              <ul className="space-y-4 mb-8">
                {pricingFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        isDark ? "text-purple-400" : "text-indigo-600"
                      }`}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGetStarted}
                className={`w-full py-4 rounded-xl font-semibold ${
                  isDark
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
                }`}
              >
                Get Started Now
              </motion.button>
            </div>
          </motion.div>
        </section>
      </main>

      <footer
        className={`border-t ${
          isDark
            ? "border-slate-800 bg-slate-950/50"
            : "border-slate-200 bg-slate-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-lg ${
                  isDark ? "bg-purple-600/20" : "bg-indigo-600/20"
                }`}
              >
                <Bot
                  className={`w-5 h-5 ${
                    isDark ? "text-purple-400" : "text-indigo-600"
                  }`}
                />
              </div>
              <span className="font-bold">Portfolio AI</span>
            </div>
            <p className={isDark ? "text-gray-400" : "text-slate-600"}>
              © 2025 Portfolio AI. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "hover:bg-slate-800 text-gray-400 hover:text-white"
                    : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "hover:bg-slate-800 text-gray-400 hover:text-white"
                    : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@portfolioai.com"
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "hover:bg-slate-800 text-gray-400 hover:text-white"
                    : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                }`}
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
