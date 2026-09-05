import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Accessible overlay rendered inside the scenario stage (so it also works
 * convincingly inside the Phone Frame Simulator).
 */
export const StageOverlay = ({
  open,
  onEscape,
  children,
  testId,
  label,
  tone = "danger",
  className,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape" && onEscape) onEscape();
    };
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => {
      const el = ref.current?.querySelector(
        "button:not([disabled]), [href], input, select, textarea"
      );
      el?.focus({ preventScroll: true });
    }, 60);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onEscape]);

  const ring =
    tone === "danger"
      ? "border-red-500/30"
      : tone === "warn"
        ? "border-amber-500/30"
        : "border-emerald-500/30";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="tp-scrollbar absolute inset-0 z-30 overflow-y-auto bg-zinc-950/85 p-3 backdrop-blur-sm sm:p-5"
        >
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            data-testid={testId}
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "tp-elev-2 mx-auto w-full max-w-[440px] rounded-2xl border bg-zinc-950/95 p-4 sm:p-5",
              ring,
              className
            )}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const OverlayHeader = ({ icon: Icon, tone = "danger", eyebrow, title }) => {
  const tones = {
    danger: "border-red-500/25 bg-red-500/10 text-red-300",
    warn: "border-amber-500/25 bg-amber-500/10 text-amber-200",
    safe: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  };
  return (
    <div className="flex items-start gap-3">
      <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl border", tones[tone])}>
        {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-[0.16em] text-zinc-500">{eyebrow}</div>
        <h3
          className="text-base font-semibold leading-snug text-zinc-50 sm:text-lg"
          style={{ fontFamily: '"Space Grotesk", ui-sans-serif' }}
        >
          {title}
        </h3>
      </div>
    </div>
  );
};
