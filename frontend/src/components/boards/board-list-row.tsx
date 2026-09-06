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

export default function BoardListRow({
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
      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
    </button>
  );
}
