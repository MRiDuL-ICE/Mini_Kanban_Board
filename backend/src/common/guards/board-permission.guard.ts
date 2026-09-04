import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "../../prisma/prisma.service";

export const REQUIRED_BOARD_ROLE_KEY = "requiredBoardRole";

export type BoardRole = "OWNER" | "EDITOR" | "VIEWER";

@Injectable()
export class BoardPermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.get<BoardRole | undefined>(
      REQUIRED_BOARD_ROLE_KEY,
      context.getHandler(),
    );

    if (!requiredRole) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId: string = request.user?.userId;
    if (!userId) {
      throw new ForbiddenException("Unauthorized");
    }

    const boardId: string =
      request.query.boardId || request.params.id || request.body?.boardId;

    if (!boardId) {
      throw new ForbiddenException("Board ID required for permission check");
    }

    const role = await this.getBoardRole(boardId, userId);

    if (!role) {
      throw new ForbiddenException("No access to this board");
    }

    if (!this.roleSatisfies(role, requiredRole)) {
      throw new ForbiddenException(
        "You do not have permission to perform this action.",
      );
    }

    request.boardRole = role;

    return true;
  }

  private async getBoardRole(
    boardId: string,
    userId: string,
  ): Promise<BoardRole | null> {
    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
      select: {
        ownerId: true,
        members: {
          where: { userId },
          select: { role: true },
        },
      },
    });

    if (!board) return null;
    if (board.ownerId === userId) return "OWNER";

    const member = board.members[0];
    return (member?.role as BoardRole) ?? null;
  }

  private roleSatisfies(actual: BoardRole, required: BoardRole): boolean {
    const hierarchy: Record<BoardRole, number> = {
      OWNER: 3,
      EDITOR: 2,
      VIEWER: 1,
    };
    return hierarchy[actual] >= hierarchy[required];
  }
}
