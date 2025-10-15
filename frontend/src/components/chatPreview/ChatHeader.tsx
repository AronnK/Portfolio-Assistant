// "use client";
// import { motion } from "framer-motion";
// import { Bot, RefreshCw, Brain } from "lucide-react";

// interface ChatHeaderProps {
//   isDark: boolean;
//   onReset: () => void;
//   memoryInfo?: { exchanges: number; total_messages: number };
// }

// export const ChatHeader = ({
//   isDark,
//   onReset,
//   memoryInfo,
// }: ChatHeaderProps) => {
//   return (
//     <div
//       className={`px-6 py-4 border-b backdrop-blur-xl ${
//         isDark
//           ? "bg-slate-950/80 border-slate-800/50"
//           : "bg-white/30 border-white/30"
//       }`}
//     >
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-3">
//           <motion.div
//             animate={{ scale: [1, 1.1, 1] }}
//             transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
//             className={`p-2.5 rounded-xl ${
//               isDark
//                 ? "bg-gradient-to-br from-purple-600 to-blue-600"
//                 : "bg-gradient-to-br from-indigo-500 to-purple-500"
//             }`}
//           >
//             <Bot className="w-5 h-5 text-white" />
//           </motion.div>
//           <div>
//             <h2
//               className={`text-lg font-bold ${
//                 isDark ? "text-gray-100" : "text-slate-900"
//               }`}
//             >
//               Portfolio Assistant
//             </h2>
//             <div className="flex items-center space-x-2">
//               <motion.div
//                 animate={{ scale: [1, 1.3, 1] }}
//                 transition={{ duration: 1.5, repeat: Infinity }}
//                 className="w-2 h-2 rounded-full bg-green-500"
//               />
//               <p
//                 className={`text-xs ${
//                   isDark ? "text-gray-500" : "text-slate-500"
//                 }`}
//               >
//                 Online • Ready to help
//               </p>
//               {memoryInfo && memoryInfo.exchanges > 0 && (
//                 <>
//                   <span
//                     className={`text-xs ${
//                       isDark ? "text-gray-600" : "text-slate-400"
//                     }`}
//                   >
//                     •
//                   </span>
//                   <div
//                     className="flex items-center space-x-1"
//                     title={`${memoryInfo.exchanges} exchanges in memory`}
//                   >
//                     <Brain
//                       className={`w-3 h-3 ${
//                         isDark ? "text-purple-400" : "text-indigo-500"
//                       }`}
//                     />
//                     <span
//                       className={`text-xs ${
//                         isDark ? "text-gray-500" : "text-slate-500"
//                       }`}
//                     >
//                       {memoryInfo.exchanges} / 3
//                     </span>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//         <motion.button
//           whileHover={{ scale: 1.1, rotate: 180 }}
//           whileTap={{ scale: 0.9 }}
//           onClick={onReset}
//           className={`p-2 rounded-lg transition-colors ${
//             isDark
//               ? "hover:bg-slate-800 text-gray-400 hover:text-gray-300"
//               : "hover:bg-slate-100 text-slate-600 hover:text-slate-700"
//           }`}
//           title="Reset conversation"
//         >
//           <RefreshCw className="w-4 h-4" />
//         </motion.button>
//       </div>
//     </div>
//   );
// };

"use client";
import { motion } from "framer-motion";
import { Bot, RefreshCw, Brain, Download } from "lucide-react";

interface ChatHeaderProps {
  isDark: boolean;
  onReset: () => void;
  memoryInfo?: { exchanges: number; total_messages: number };
  isTemporary?: boolean;
  onExport?: () => void;
}

export const ChatHeader = ({
  isDark,
  onReset,
  memoryInfo,
  isTemporary = false,
  onExport,
}: ChatHeaderProps) => {
  return (
    <div
      className={`px-6 py-4 border-b backdrop-blur-xl ${
        isDark
          ? "bg-slate-950/80 border-slate-800/50"
          : "bg-white/30 border-white/30"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={`p-2.5 rounded-xl ${
              isDark
                ? "bg-gradient-to-br from-purple-600 to-blue-600"
                : "bg-gradient-to-br from-indigo-500 to-purple-500"
            }`}
          >
            <Bot className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h2
              className={`text-lg font-bold ${
                isDark ? "text-gray-100" : "text-slate-900"
              }`}
            >
              Portfolio Assistant
              {isTemporary && (
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    isDark
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-amber-500/20 text-amber-700"
                  }`}
                >
                  Preview Mode
                </span>
              )}
            </h2>
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-green-500"
              />
              <p
                className={`text-xs ${
                  isDark ? "text-gray-500" : "text-slate-500"
                }`}
              >
                Online • Ready to help
              </p>
              {memoryInfo && memoryInfo.exchanges > 0 && (
                <>
                  <span
                    className={`text-xs ${
                      isDark ? "text-gray-600" : "text-slate-400"
                    }`}
                  >
                    •
                  </span>
                  <div
                    className="flex items-center space-x-1"
                    title={`${memoryInfo.exchanges} exchanges in memory`}
                  >
                    <Brain
                      className={`w-3 h-3 ${
                        isDark ? "text-purple-400" : "text-indigo-500"
                      }`}
                    />
                    <span
                      className={`text-xs ${
                        isDark ? "text-gray-500" : "text-slate-500"
                      }`}
                    >
                      {memoryInfo.exchanges} / 3
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isTemporary && onExport && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExport}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isDark
                  ? "bg-purple-600 hover:bg-purple-500 text-white"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white"
              }`}
            >
              <Download className="w-4 h-4" />
              Export Bot
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            onClick={onReset}
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? "hover:bg-slate-800 text-gray-400 hover:text-gray-300"
                : "hover:bg-slate-100 text-slate-600 hover:text-slate-700"
            }`}
            title="Reset conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
