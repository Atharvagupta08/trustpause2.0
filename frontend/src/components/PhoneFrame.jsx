import React from "react";
import { Signal, Wifi, BatteryFull } from "lucide-react";

export const PhoneFrame = ({ children, carrier = "Airtel", time = "9:41" }) => {
  return (
    <div className="mx-auto w-full max-w-[420px]" data-testid="phone-frame">
      <div className="tp-noise relative rounded-[2.25rem] border border-zinc-800 bg-zinc-950 p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
        <div className="pointer-events-none absolute -left-[3px] top-28 h-14 w-[3px] rounded-l bg-zinc-800" />
        <div className="pointer-events-none absolute -right-[3px] top-24 h-20 w-[3px] rounded-r bg-zinc-800" />
        <div className="relative overflow-hidden rounded-[1.9rem] bg-zinc-950">
          <div className="relative z-10 flex items-center justify-between px-5 pb-1 pt-3 text-[11px] text-zinc-300">
            <span className="font-medium tabular-nums">{time}</span>
            <span className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full border border-zinc-800 bg-zinc-900" />
            <span className="flex items-center gap-1.5">
              <span className="hidden text-[10px] text-zinc-400 sm:inline">{carrier}</span>
              <Signal className="h-3 w-3" aria-hidden="true" />
              <Wifi className="h-3 w-3" aria-hidden="true" />
              <BatteryFull className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </div>
          <div className="relative min-h-[620px] pb-6">{children}</div>
          <div className="absolute bottom-2 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-zinc-700/70" />
        </div>
      </div>
    </div>
  );
};
