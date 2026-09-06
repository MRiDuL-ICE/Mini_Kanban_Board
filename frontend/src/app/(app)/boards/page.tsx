"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FolderKanban,
  Grid2X2,
  List,
  Plus,
  Search,
  ArrowUpRight,
  LayoutDashboard,
  Clock,
  CheckSquare,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useBoards, useCreateBoard } from "@/hooks/use-boards";
import { PageSkeleton, Spinner } from "@/components/layout/navbar";
import BoardGridCard from "@/components/boards/board-grid-card";
import BoardListRow from "@/components/boards/board-list-row";
import CreateBoardModal from "@/components/boards/create-board-modal";
import toast from "react-hot-toast";

export default function BoardsPage() {
  const { user, loading: authLoading, requireAuth } = useAuth();
  const { boards, loading, error } = useBoards();
  const createBoard = useCreateBoard();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    if (error) toast.error("Failed to load boards");
  }, [error]);

  useEffect(() => {
    if (!authLoading) requireAuth();
  }, [authLoading, requireAuth]);

  const filteredBoards = useMemo(
    () =>
      boards.filter((b) => b.title.toLowerCase().includes(query.toLowerCase())),
    [boards, query],
  );

  async function handleCreate(title: string) {
    try {
      await createBoard.mutateAsync(title);
      setIsCreateOpen(false);
    } catch {}
  }

  if (authLoading || loading) {
    return (
      <main className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10">
        <PageSkeleton />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-[1440px] px-4 py-20 text-center text-sm text-muted-foreground">
        Failed to load boards. Please try again.
      </main>
    );
  }

  // console.log("user", user);
  const firstName = user?.name?.split(" ")[0] || "there";
  const totalTasks = boards.reduce(
    (n, b) =>
      n +
      (b.columns?.reduce(
        (m: number, c: any) => m + (c.tasks?.length ?? 0),
        0,
      ) ?? 0),
    0,
  );
  const ownedCount = boards.filter((b) => b.role === "OWNER").length;

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-12 lg:px-10 lg:py-14">
      {/* Hero */}
      <section className="mb-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Welcome back
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              {firstName}'s workspace
            </h1>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="btn-primary w-full sm:w-auto"
          >
            <Plus className="size-4" /> New board
          </button>
        </div>

        {/* Stats strip */}
        {boards.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-6 border-t border-border pt-6 text-sm">
            <div>
              <span className="text-2xl font-semibold tracking-tight">
                {boards.length}
              </span>
              <span className="ml-2 text-muted-foreground">
                {boards.length === 1 ? "board" : "boards"}
              </span>
            </div>
            <div>
              <span className="text-2xl font-semibold tracking-tight">
                {totalTasks}
              </span>
              <span className="ml-2 text-muted-foreground">total tasks</span>
            </div>
            {ownedCount > 0 && (
              <div>
                <span className="text-2xl font-semibold tracking-tight">
                  {ownedCount}
                </span>
                <span className="ml-2 text-muted-foreground">owned</span>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-h-10 w-full max-w-sm items-center gap-2 rounded-full border border-border bg-card px-3 text-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search boards"
            aria-label="Search boards"
            className="w-full bg-transparent py-2 outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex self-end overflow-hidden rounded-xl border border-border bg-card">
          <button
            onClick={() => setView("grid")}
            aria-label="Grid view"
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
              view === "grid"
                ? "bg-[var(--color-primary)] text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Grid2X2 className="size-3.5" />
            Grid
          </button>
          <button
            onClick={() => setView("list")}
            aria-label="List view"
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors ${
              view === "list"
                ? "bg-[var(--color-primary)] text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="size-3.5" />
            List
          </button>
        </div>
      </div>

      {/* Results label */}
      {query && (
        <p className="mb-4 text-sm text-muted-foreground">
          {filteredBoards.length === 0
            ? `No boards match "${query}"`
            : `${filteredBoards.length} result${filteredBoards.length !== 1 ? "s" : ""} for "${query}"`}
        </p>
      )}

      {/* Empty state */}
      {filteredBoards.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-20 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-muted">
            <FolderKanban className="size-5 text-muted-foreground" />
          </div>
          <h2 className="text-base font-semibold">
            {query ? "No boards found" : "No boards yet"}
          </h2>
          <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
            {query
              ? "Try a different search term or clear the filter."
              : "Create your first board to start organizing tasks and projects."}
          </p>
          {!query && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="btn-primary mt-5"
            >
              <Plus className="size-4" /> Create your first board
            </button>
          )}
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBoards.map((board, i) => (
            <BoardGridCard
              key={board.id}
              board={board}
              index={i}
              onClick={() => router.push(`/boards/${board.id}`)}
            />
          ))}
          {/* Ghost add card */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex min-h-[148px] items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/50 text-sm text-muted-foreground transition-colors hover:border-border hover:bg-card hover:text-foreground"
          >
            <Plus className="size-4" /> New board
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filteredBoards.map((board, i) => (
            <BoardListRow
              key={board.id}
              board={board}
              index={i}
              onClick={() => router.push(`/boards/${board.id}`)}
            />
          ))}
        </div>
      )}

      <CreateBoardModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
        isPending={createBoard.isPending}
      />
    </main>
  );
}
