import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/api";
import toast from "react-hot-toast";
import type { BoardMember, BoardResponse, User } from "@/types/domain";

type AddMemberVars = {
  boardId: string;
  userId: string;
  role: "EDITOR" | "VIEWER";
};

type RemoveMemberVars = {
  boardId: string;
  userId: string;
};

export function useAddMember() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, userId, role }: AddMemberVars) =>
      api<BoardMember>(
        `/boards/members?boardId=${encodeURIComponent(boardId)}`,
        {
          method: "POST",
          body: JSON.stringify({ userId, role }),
        },
      ),
    onSuccess: (_, { boardId }) => {
      qc.refetchQueries({ queryKey: ["boards", boardId], exact: true });
      toast.success("Member added");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to add member"));
    },
  });
}

export function useUserByEmail(
  email: string | null,
  boardId: string | undefined,
) {
  return useQuery<User | null>({
    queryKey: ["user-by-email", boardId, email],
    queryFn: async () => {
      if (!email || !boardId) return null;

      try {
        return await api<User | null>(
          `/boards/member/by-email?boardId=${encodeURIComponent(boardId)}&email=${encodeURIComponent(email)}`,
        );
      } catch {
        return null;
      }
    },
    enabled: Boolean(email && boardId),
    retry: false,
  });
}

export function useRemoveMember() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ boardId, userId }: RemoveMemberVars) =>
      api(`/boards/${boardId}/members/${userId}`, {
        method: "DELETE",
      }),
    onSuccess: (_, { boardId, userId }) => {
      qc.setQueryData<BoardResponse>(["boards", boardId], (old) => {
        if (!old) return old;
        return {
          ...old,
          board: {
            ...old.board,
            members: old.board.members.filter((m) => m.userId !== userId),
          },
        };
      });
      toast.success("Member removed");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to remove member"));
    },
  });
}
