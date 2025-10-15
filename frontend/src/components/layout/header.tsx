"use client";
import { SlideIn } from "@/components/animations/SlideIn";
import { RotatingIcon } from "@/components/animations/RotatingIcon";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { StepIndicator } from "@/components/StepIndicator";
import { Bot, LogIn, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

interface AppHeaderProps {
  isDark: boolean;
  onThemeToggle: () => void;
  currentStep: number;
}

const UserMenu = ({ isDark }: { isDark: boolean }) => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <img
          src={
            user.user_metadata?.avatar_url ||
            `https://ui-avatars.com/api/?name=${user.email}&background=random`
          }
          alt="User Avatar"
          className="w-9 h-9 rounded-full border-2 border-slate-400"
        />
      </motion.button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 ${
            isDark
              ? "bg-slate-800 border border-slate-700"
              : "bg-white border border-slate-200"
          }`}
        >
          <div className="px-4 py-2 text-sm">
            <p
              className={`font-medium ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Signed in as
            </p>
            <p
              className={`truncate ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {user.email}
            </p>
          </div>
          <div className="border-t border-slate-700/50 my-1"></div>
          <button
            onClick={signOut}
            className={`w-full text-left flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
              isDark
                ? "text-slate-300 hover:bg-slate-700"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </motion.div>
      )}
    </div>
  );
};

export const AppHeader = ({
  isDark,
  onThemeToggle,
  currentStep,
}: AppHeaderProps) => {
  const { user, signInWithGoogle, loading } = useAuth();

  return (
    <SlideIn direction="top">
      <header
        className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
          isDark
            ? "bg-slate-950/90 border-slate-800/50"
            : "bg-white/80 border-slate-200/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:grid md:grid-cols-3 items-center h-16 gap-4">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <RotatingIcon
                className={`p-2 rounded-xl ${
                  isDark
                    ? "bg-gradient-to-br from-purple-600 to-blue-600"
                    : "bg-gradient-to-br from-indigo-500 to-purple-500"
                }`}
              >
                <Bot className="w-5 h-5 text-white" />
              </RotatingIcon>
              <div>
                <h1
                  className={`text-xl font-bold ${
                    isDark ? "text-gray-100" : "text-slate-900"
                  }`}
                >
                  Portfolio AI
                </h1>
              </div>
            </motion.div>

            <div className="flex justify-center">
              <StepIndicator
                currentStep={currentStep}
                isDark={isDark}
                showOnMobile={false}
              />
            </div>

            <div className="flex items-center justify-end gap-4">
              <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
              {!loading && (
                <div>
                  {user ? (
                    <UserMenu isDark={isDark} />
                  ) : (
                    <motion.button
                      onClick={signInWithGoogle}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                        isDark
                          ? "bg-slate-800 hover:bg-slate-700 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                      }`}
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </motion.button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="md:hidden flex items-center justify-between h-16">
            <motion.div className="flex items-center space-x-3">
              <RotatingIcon
                className={`p-2 rounded-xl ${
                  isDark
                    ? "bg-gradient-to-br from-purple-600 to-blue-600"
                    : "bg-gradient-to-br from-indigo-500 to-purple-500"
                }`}
              >
                <Bot className="w-5 h-5 text-white" />
              </RotatingIcon>
            </motion.div>
            <div className="flex items-center gap-4">
              <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
              {!loading && (
                <div>
                  {user ? (
                    <UserMenu isDark={isDark} />
                  ) : (
                    <motion.button
                      onClick={signInWithGoogle}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <LogIn className="w-6 h-6 text-slate-500" />
                    </motion.button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="md:hidden pb-4 flex justify-center">
            <StepIndicator
              currentStep={currentStep}
              isDark={isDark}
              showOnMobile={true}
            />
          </div>
        </div>
      </header>
    </SlideIn>
  );
};
