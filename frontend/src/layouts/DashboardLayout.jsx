import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar — always visible on md+ screens */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile top bar — visible only below md */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-surface/90 backdrop-blur-lg border-b border-border flex items-center justify-between px-4 z-40">
        <span className="font-display font-semibold text-text-primary">InterviewIQ</span>
        <button onClick={() => setMobileOpen(true)} className="text-text-primary">
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/40 z-50"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="md:hidden fixed top-0 left-0 bottom-0 z-50"
            >
              <div className="relative h-full">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="absolute top-4 -right-10 text-white"
                >
                  <X size={22} />
                </button>
                <Sidebar />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 bg-bg min-h-screen p-4 md:p-8 pt-20 md:pt-8 w-full">
        <Outlet />
      </main>
    </div>
  );
}