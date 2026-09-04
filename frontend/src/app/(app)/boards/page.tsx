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

const BOARD_ACCENTS = [
  {
    bg: "bg-indigo-500/10",
    dot: "bg-indigo-500",
    text: "text-indigo-600 dark:text-indigo-400",
    bar: "bg-indigo-500",
  },
  {
    bg: "bg-emerald-500/10",
    dot: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    bar: "bg-emerald-500",
  },
  {
    bg: "bg-amber-500/10",
    dot: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    bar: "bg-amber-500",
  },
  {
    bg: "bg-rose-500/10",
    dot: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-400",
    bar: "bg-rose-500",
  },
  {
    bg: "bg-violet-500/10",
    dot: "bg-violet-500",
    text: "text-violet-600 dark:text-violet-400",
    bar: "bg-violet-500",
  },
  {
    bg: "bg-sky-500/10",
    dot: "bg-sky-500",
    text: "text-sky-600 dark:text-sky-400",
    bar: "bg-sky-500",
  },
] as const;

function getAccent(index: number) {
  return BOARD_ACCENTS[index % BOARD_ACCENTS.length];
}

function getInitial(title: string) {
  return title.trim().charAt(0).toUpperCase();
}

function BoardGridCard({
  board,
  index,
  onClick,
}: {
  board: any;
  index: number;
  onClick: () => void;
}) {
  const accent = getAccent(index);
  const columnCount = board.columns?.length ?? 0;
  const taskCount =
    board.columns?.reduce(
      (n: number, c: any) => n + (c.tasks?.length ?? 0),
      0,
    ) ?? 0;

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card text-left transition-all duration-200 hover:-translate-y-1 hover:border-border hover:shadow-lg"
    >
      {/* Accent bar at top */}
      <div className={`h-1 w-full ${accent.bar}`} />

      <div className="flex flex-1 flex-col p-5">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${accent.bg}`}
          >
            <span className={`text-sm font-bold ${accent.text}`}>
              {getInitial(board.title)}
            </span>
          </div>
          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
        </div>

        <h2 className="mb-1 truncate font-semibold tracking-tight">
          {board.title}
        </h2>

        <p className="mb-4 text-xs text-muted-foreground">
          {board.role === "OWNER"
            ? "You own this board"
            : board.role === "EDITOR"
              ? "You can edit"
              : "View access"}
        </p>

        {/* Stats row */}
        <div className="mt-auto flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <LayoutDashboard className="size-3" />
            {columnCount} {columnCount === 1 ? "column" : "columns"}
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1">
            <CheckSquare className="size-3" />
            {taskCount} {taskCount === 1 ? "task" : "tasks"}
          </span>
        </div>
      </div>
    </button>
  );
}

function BoardListRow({
  board,
  index,
  onClick,
}: {
  board: any;
  index: number;
  onClick: () => void;
}) {
  const accent = getAccent(index);
  const columnCount = board.columns?.length ?? 0;
  const taskCount =
    board.columns?.reduce(
      (n: number, c: any) => n + (c.tasks?.length ?? 0),
      0,
    ) ?? 0;

  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-4 rounded-xl border border-border/60 bg-card px-5 py-4 text-left transition-all hover:border-border hover:shadow-sm"
    >
      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${accent.bg}`}
      >
        <span className={`text-sm font-bold ${accent.text}`}>
          {getInitial(board.title)}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium tracking-tight">{board.title}</p>
        <p className="text-xs text-muted-foreground">
          {board.role === "OWNER"
            ? "Owner"
            : board.role === "EDITOR"
              ? "Editor"
              : "Viewer"}
        </p>
      </div>
      <div className="hidden items-center gap-4 text-xs text-muted-foreground sm:flex">
        <span>{columnCount} columns</span>
        <span>{taskCount} tasks</span>
      </div>
      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
    </button>
  );
}

function CreateBoardModal({
  open,
  onClose,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
  isPending: boolean;
}) {
  const [title, setTitle] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit(title.trim());
    setTitle("");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex size-9 items-center justify-center rounded-xl bg-primary/10">
              <FolderKanban className="size-4 text-primary" />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"
          >
            <X className="size-4" />
          </button>
        </div>
        <h2 className="mb-1 text-lg font-semibold tracking-tight">
          Create a new board
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Give your next project a place to land.
        </p>
        <div className="mb-5">
          <label
            htmlFor="board-title"
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            Board name
          </label>
          <input
            id="board-title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Product launch Q4"
            className="input"
          />
        </div>
        <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button type="button" className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button disabled={isPending || !title.trim()} className="btn-primary">
            {isPending ? (
              <>
                <Spinner /> Creating…
              </>
            ) : (
              <>
                <Plus className="size-4" /> Create board
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function BoardsPage() {
  const { user, loading: authLoading, requireAuth } = useAuth();
  const { boards, loading, error } = useBoards();
  const createBoard = useCreateBoard();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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
    } catch {
      window.alert("Failed to create board");
    }
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

  console.log("user", user);
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
        <div className="flex min-h-10 w-full max-w-sm items-center gap-2 rounded-xl border border-border bg-card px-3 text-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30">
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
                ? "bg-foreground text-background"
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
                ? "bg-foreground text-background"
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
