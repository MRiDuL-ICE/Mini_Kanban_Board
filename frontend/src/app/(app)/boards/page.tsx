"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useBoards, useCreateBoard } from "@/hooks/use-boards";
import { useAuthStore } from "@/store/auth-store";

export default function BoardsPage() {
  const { user, loading: authLoading, requireAuth } = useAuth();
  const { boards, loading, error } = useBoards();
  const createBoard = useCreateBoard();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!authLoading) {
      requireAuth();
    }
  }, [authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-secondary">
        Failed to load boards.
      </div>
    );
  }

  async function handleCreate() {
    const title = prompt("Board title");
    if (!title) return;
    try {
      await createBoard.mutateAsync(title);
    } catch {
      alert("Failed to create board");
    }
  }

  return (
    <div className="min-h-screen bg-surface-0">
      <header className="border-b border-border bg-surface-1">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-text-primary">My Boards</h1>
          <div className="flex gap-2">
            <button onClick={handleCreate} className="btn-primary">
              New Board
            </button>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="btn-ghost"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-6">
        {boards.length === 0 ? (
          <p className="text-text-secondary">No boards yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((b) => (
              <a
                key={b.id}
                href={`/boards/${b.id}`}
                className="card p-4 hover:shadow-elevated transition-shadow"
              >
                <h2 className="font-semibold text-text-primary">{b.title}</h2>
                <p className="text-sm text-text-secondary">Open board</p>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
