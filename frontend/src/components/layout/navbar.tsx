"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, LogOut, Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import toast from "react-hot-toast";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);
  const [open, setOpen] = useState(false);

  function signOut() {
    logout();
    toast.success("Signed out");
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 px-4 pt-5 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between rounded-full border border-border/30 bg-card px-4 py-2 shadow-sm backdrop-blur-sm min-h-[62px]">
        <button
          onClick={() => router.push("/boards")}
          className="flex min-w-0 items-center gap-3"
          aria-label="Go to boards"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-[0.45rem] bg-primary text-primary-foreground shadow-sm bg-[var(--color-primary)]">
            <LayoutGrid className="size-4 text-white" />
          </span>
          <span className="truncate text-sm font-semibold tracking-tight">
            Mini Kanban
          </span>
        </button>

        {/* Desktop */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          <button
            onClick={() => router.push("/boards")}
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              pathname?.startsWith("/boards")
                ? "bg-surface-2 font-medium text-text-primary"
                : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
            }`}
          >
            Boards
          </button>
          <button
            onClick={signOut}
            className="group relative ml-1 inline-flex items-center justify-center size-8 rounded-full border border-border text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors"
            aria-label="Log out"
          >
            <LogOut className="size-4" />
            <span
              role="tooltip"
              className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 translate-y-1 rounded-[0.45rem] bg-foreground px-2 py-1 text-xs whitespace-nowrap text-background opacity-0 shadow-md transition-all group-hover:translate-y-0 group-hover:opacity-100"
            >
              Sign out
            </span>
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-full p-2 text-text-secondary hover:bg-surface-2 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="mx-auto mt-1 max-w-[1440px] rounded-2xl border border-border/70 bg-surface-1 px-4 py-3 shadow-sm md:hidden">
          <button
            onClick={signOut}
            className="flex w-full items-center gap-2 rounded-full px-3 py-2 text-left text-sm text-text-secondary hover:bg-surface-2 hover:text-text-primary"
          >
            <LogOut className="size-4" /> Log out
          </button>
        </div>
      )}
    </header>
  );
}
export function PageSkeleton({ board = false }: { board?: boolean }) {
  const shimmerClass =
    "rounded-[0.45rem] bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:200%_100%] animate-shimmer";

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className={`h-8 w-48 ${shimmerClass}`} />
        <div className={`h-4 w-64 ${shimmerClass}`} />
      </div>

      {board ? (
        <div className="flex gap-4 overflow-hidden pt-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className={`h-64 w-64 shrink-0 ${shimmerClass}`} />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className={`h-32 w-full ${shimmerClass}`} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Spinner() {
  return (
    <span
      className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
      aria-label="Loading"
    />
  );
}
