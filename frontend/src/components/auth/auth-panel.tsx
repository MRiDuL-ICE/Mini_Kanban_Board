"use client";

import { Layers3 } from "lucide-react";

interface AuthPanelProps {
  eyebrow: string;
  heading: string;
  subheading: string;
  features: string[];
}

export function AuthPanel({
  eyebrow,
  heading,
  subheading,
  features,
}: AuthPanelProps) {
  return (
    <section className="relative hidden overflow-hidden bg-[#0f1628] lg:flex lg:flex-col lg:justify-between p-10 xl:p-16">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow blob */}
      <div className="pointer-events-none absolute -top-32 -left-32 size-[500px] rounded-full bg-indigo-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 size-[400px] rounded-full bg-violet-600/15 blur-[100px]" />

      {/* Logo */}
      <div className="relative flex items-center gap-3 text-white">
        <span className="flex size-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
          <Layers3 className="size-4" />
        </span>
        <span className="font-semibold tracking-tight">Mini Kanban</span>
      </div>

      {/* Copy */}
      <div className="relative max-w-lg">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
          {eyebrow}
        </p>
        <h1 className="text-5xl font-semibold leading-[1.06] tracking-[-0.05em] text-white xl:text-6xl">
          {heading}
        </h1>
        <p className="mt-6 max-w-sm text-[15px] leading-7 text-white/50">
          {subheading}
        </p>
      </div>

      {/* Feature pills */}
      <div className="relative flex flex-wrap gap-2">
        {features.map((f) => (
          <span
            key={f}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-white/60 backdrop-blur-sm"
          >
            <span className="size-1.5 rounded-full bg-indigo-400" />
            {f}
          </span>
        ))}
      </div>
    </section>
  );
}
