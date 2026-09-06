import { ArrowUpRight, CheckSquare, LayoutDashboard } from "lucide-react";

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

export default function BoardGridCard({
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
  //   console.log("board", board);
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
      </div>
    </button>
  );
}
