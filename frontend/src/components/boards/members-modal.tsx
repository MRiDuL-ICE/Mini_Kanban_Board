"use client";

import { useState } from "react";
import { X, UserPlus, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import {
  useAddMember,
  useRemoveMember,
  useUserByEmail,
} from "@/hooks/use-board-members";
import type { Board, BoardMember } from "@/types/domain";
import { Spinner } from "../layout/navbar";
import toast from "react-hot-toast";

export function MembersModal({
  open,
  onClose,
  board,
  role: boardRole,
  currentUserId,
}: {
  open: boolean;
  onClose: () => void;
  board: Board | null;
  role: "OWNER" | "EDITOR" | "VIEWER" | null;
  currentUserId: string | null;
}) {
  const [emailInput, setEmailInput] = useState("");
  const [role, setRole] = useState<"EDITOR" | "VIEWER">("EDITOR");

  const addMember = useAddMember();
  const removeMember = useRemoveMember();

  const emailTrimmed = emailInput.trim();
  const emailQuery: string | null =
    emailTrimmed.length >= 3 ? emailTrimmed : null;

  const {
    data: foundUser,
    isLoading: searchingUser,
    error,
  } = useUserByEmail(emailQuery, board?.id);

  if (!board) return null;

  const currentBoard = board;
  const isOwner =
    boardRole === "OWNER" || currentBoard.ownerId === currentUserId;
  async function handleAdd() {
    if (!foundUser) {
      toast.error("No user found with that email");
      return;
    }
    try {
      await addMember.mutateAsync({
        boardId: currentBoard.id,
        userId: foundUser.id,
        role,
      });
      setEmailInput("");
    } catch {}
  }

  return (
    <Modal open={open} onClose={onClose} title="Board members">
      <div className="space-y-4">
        {/* Current members */}
        <div>
          <h3 className="mb-2 text-sm font-medium">Members</h3>
          <div className="max-h-48 space-y-2 overflow-auto">
            {/* Owner row */}
            <div className="flex items-center justify-between rounded border border-border p-2">
              <div>
                <div className="text-sm font-medium">
                  {board.owner.name || board.owner.email}
                </div>
                <div className="text-xs text-muted-foreground">OWNER</div>
              </div>
              <span className="text-xs text-muted-foreground">
                {board.owner.email}
              </span>
            </div>

            {/* Members rows */}
            {board?.members?.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No additional members yet.
              </p>
            ) : (
              board.members.map((m: BoardMember) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded border border-border p-2"
                >
                  <div className={`${removeMember.isPending && "opacity-50"}`}>
                    <div className="text-sm font-medium">
                      {m.user?.name || m.user?.email || m.userId} (
                      {m.user?.email})
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {m.role}
                    </div>
                  </div>
                  {isOwner && m.userId !== board.ownerId && (
                    <button
                      onClick={() =>
                        removeMember.mutate({
                          boardId: board.id,
                          userId: m.userId,
                        })
                      }
                      className={`rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground ${
                        removeMember.isPending && "opacity-50"
                      }`}
                      title="Remove"
                      disabled={removeMember.isPending}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add member (owner only) */}
        {isOwner && (
          <div className="rounded border border-border p-3">
            <h4 className="mb-2 text-sm font-medium">Add member</h4>
            <div className="space-y-3">
              <input
                className="input"
                placeholder="Email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />

              {/* Status / debug info */}
              {emailQuery && (
                <p className="text-xs text-muted-foreground">
                  Searching: {emailQuery} | Found: {foundUser ? "yes" : "no"} |
                  Loading: {searchingUser ? "yes" : "no"}
                </p>
              )}

              {emailInput.trim().length >= 3 &&
                !foundUser &&
                !searchingUser && (
                  <p className="text-xs text-muted-foreground">
                    No user found with this email.
                  </p>
                )}

              {foundUser && (
                <div className="text-xs text-muted-foreground">
                  Found:{" "}
                  <span className="font-medium">
                    {foundUser.name || foundUser.email}
                  </span>
                </div>
              )}

              <select
                className="input"
                value={role}
                onChange={(e) => setRole(e.target.value as "EDITOR" | "VIEWER")}
              >
                <option value="EDITOR">Editor</option>
                <option value="VIEWER">Viewer</option>
              </select>

              <button
                className="btn-primary w-full"
                onClick={handleAdd}
                disabled={addMember.isPending || !foundUser || searchingUser}
              >
                {addMember.isPending
                  ? "Adding..."
                  : searchingUser
                    ? "Searching..."
                    : "Add member"}
                <UserPlus className="ml-2 inline size-4" />
              </button>
            </div>
          </div>
        )}

        {!isOwner && (
          <p className="text-xs text-muted-foreground">
            Only the board owner can manage members.
          </p>
        )}

        <div className="flex justify-end">
          <button className="btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
