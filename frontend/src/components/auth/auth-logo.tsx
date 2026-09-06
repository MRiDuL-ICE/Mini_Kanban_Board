"use client";

import { Layers3 } from "lucide-react";

export function AuthLogo() {
  return (
    <div className="mb-10 flex items-center gap-3 font-semibold lg:hidden">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Layers3 className="size-4" />
      </span>
      Mini Kanban
    </div>
  );
}
