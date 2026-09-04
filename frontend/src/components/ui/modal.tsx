"use client";

import { X } from "lucide-react";
import { ReactNode } from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative z-10 max-h-[90dvh] w-full overflow-y-auto rounded-t-2xl border border-border bg-[var(--surface-0)] p-5 shadow-2xl sm:max-w-md sm:rounded-[0.45rem] sm:p-6">
        <div>
          <h3
            id="modal-title"
            className="mb-4 text-lg font-semibold text-text-primary"
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-2 text-muted-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
