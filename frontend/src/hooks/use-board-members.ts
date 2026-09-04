import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
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
      api<BoardMember>(`/boards/${boardId}/members`, {
        method: "POST",
        body: JSON.stringify({ userId, role }),
      }),
    onSuccess: (_, { boardId }) => {
      qc.refetchQueries({ queryKey: ["boards", boardId], exact: true });
    },
  });
}

export function useUserByEmail(email: string | null) {
  return useQuery<User | null>({
    queryKey: ["user-by-email", email],
    queryFn: async () => {
      if (!email) return null;

      try {
        const res = await api<User | null>(
          `/boards/member/by-email?email=${encodeURIComponent(email)}`,
        );
        return res;
      } catch (e) {
        return null;
      }
    },
    enabled: !!email,
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
    },
  });
}
