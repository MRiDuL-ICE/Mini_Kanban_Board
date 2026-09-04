export type User = {
  id: string;
  email: string;
  name?: string | null;
};

export type Board = {
  id: string;
  title: string;
  ownerId: string;
  columns: Column[];
  members: BoardMember[];
  owner: User;
  createdAt: string;
  updatedAt: string;
};

export type BoardListItem = Board & {
  role: "OWNER" | "EDITOR" | "VIEWER";
};

export type BoardResponse = {
  board: Board;
  role: "OWNER" | "EDITOR" | "VIEWER";
};

export type BoardMember = {
  id: string;
  boardId: string;
  userId: string;
  user: User;
  role: "OWNER" | "EDITOR" | "VIEWER";
};

export type Column = {
  id: string;
  title: string;
  boardId: string;
  position: number;
  tasks: Task[];
};

export type Task = {
  id: string;
  title: string;
  description?: string | null;
  columnId: string;
  position: number;
  assignee?: User | null;
};
