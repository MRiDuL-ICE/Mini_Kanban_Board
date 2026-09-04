import { PrismaService } from "@/prisma/prisma.service";
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";

type Role = "OWNER" | "EDITOR" | "VIEWER";

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  async listBoards(userId: string) {
    const boards = await this.prisma.board.findMany({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      include: {
        owner: { select: { id: true, email: true, name: true } },
        members: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return boards.map((board) => ({
      ...board,
      role:
        board.ownerId === userId
          ? "OWNER"
          : (board.members.find((member) => member.userId === userId)?.role ??
            null),
    }));
  }

  async getBoardWithAccess(boardId: string, userId: string) {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
      include: {
        columns: {
          orderBy: { position: "asc" },
          include: {
            tasks: { orderBy: { position: "asc" } },
          },
        },
        members: {
          select: {
            userId: true,
            role: true,
            user: { select: { email: true, name: true } },
          },
        },
        owner: { select: { id: true, email: true, name: true } },
      },
    });

    if (!board) throw new NotFoundException("Board not found");
    const role = await this.resolveRole(board, userId);
    if (!role) throw new ForbiddenException("Access denied");
    return { board, role };
  }

  async resolveRole(board: any, userId: string): Promise<Role | null> {
    if (board.ownerId === userId) return "OWNER";
    const member = board.members.find((m: any) => m.userId === userId);
    return member ? (member.role as Role) : null;
  }

  async createBoard(title: string, ownerId: string) {
    const board = await this.prisma.board.create({
      data: { title, ownerId },
    });
    return board;
  }

  async addMember(
    boardId: string,
    userId: string,
    requesterId: string,
    role: Role,
  ) {
    const { board, role: requesterRole } = await this.getBoardWithAccess(
      boardId,
      requesterId,
    );
    if (requesterRole !== "OWNER")
      throw new ForbiddenException("Only owner can manage members");
    if (board.ownerId === userId)
      throw new ForbiddenException("Cannot change owner membership");
    return this.prisma.boardMember.upsert({
      where: { boardId_userId: { boardId, userId } },
      create: { boardId, userId, role },
      update: { role },
    });
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  async removeMember(boardId: string, userId: string, requesterId: string) {
    const { role: requesterRole } = await this.getBoardWithAccess(
      boardId,
      requesterId,
    );
    if (requesterRole !== "OWNER")
      throw new ForbiddenException("Only owner can manage members");
    return this.prisma.boardMember.deleteMany({
      where: { boardId, userId },
    });
  }

  async createColumn(boardId: string, title: string, userId: string) {
    const { board, role } = await this.getBoardWithAccess(boardId, userId);
    if (role === "VIEWER")
      throw new ForbiddenException("Viewers cannot create columns");
    const maxPos = await this.prisma.column.aggregate({
      where: { boardId },
      _max: { position: true },
    });
    const nextPos = (maxPos._max.position ?? -1) + 1;
    return this.prisma.column.create({
      data: { boardId, title, position: nextPos },
    });
  }

  async updateColumn(columnId: string, title: string, userId: string) {
    const col = await this.prisma.column.findUnique({
      where: { id: columnId },
      include: { board: true },
    });
    if (!col) throw new NotFoundException("Column not found");
    const { role } = await this.getBoardWithAccess(col.boardId, userId);
    if (role === "VIEWER")
      throw new ForbiddenException("Viewers cannot edit columns");
    return this.prisma.column.update({
      where: { id: columnId },
      data: { title },
    });
  }

  async deleteColumn(columnId: string, userId: string) {
    const col = await this.prisma.column.findUnique({
      where: { id: columnId },
      include: { board: true },
    });
    if (!col) throw new NotFoundException("Column not found");
    const { role } = await this.getBoardWithAccess(col.boardId, userId);
    if (role === "VIEWER")
      throw new ForbiddenException("Viewers cannot delete columns");
    return this.prisma.column.delete({ where: { id: columnId } });
  }
}
