import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  fullWidth = false,
  loading = false,
}) {
  const base =
    "relative py-2.5 px-6 rounded-lg font-semibold text-sm tracking-tight transition-all duration-300 inline-flex items-center justify-center gap-2 overflow-hidden";

  const variants = {
    primary:
      "bg-gradient-to-b from-[#6366F1] to-[#4338CA] text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_4px_12px_-2px_rgba(79,70,229,0.5)] hover:shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_8px_24px_-4px_rgba(79,70,229,0.65)] hover:from-[#6d70f5] hover:to-[#4c3fd6]",
    secondary:
      "bg-surface border border-border text-text-primary shadow-sm hover:border-primary/40 hover:bg-primary/5",
    danger:
      "bg-gradient-to-b from-[#EF4444] to-[#DC2626] text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_4px_12px_-2px_rgba(220,38,38,0.5)] hover:shadow-[0_8px_24px_-4px_rgba(220,38,38,0.65)]",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.03, y: disabled || loading ? 0 : -2 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${
        disabled || loading ? "opacity-50 cursor-not-allowed shadow-none" : ""
      }`}
    >
      {/* Shine sweep effect on hover */}
      {!disabled && !loading && (
        <motion.span
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          whileHover={{ translateX: "100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      )}
      {loading && <Loader2 size={16} className="animate-spin" />}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}