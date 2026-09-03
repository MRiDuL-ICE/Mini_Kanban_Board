import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { BoardsService } from "../boards/boards.service";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private boardsService: BoardsService,
  ) {}

  async createTask(
    columnId: string,
    title: string,
    userId: string,
    description?: string,
    assigneeId?: string,
  ) {
    const col = await this.prisma.column.findUnique({
      where: { id: columnId },
      include: { board: true },
    });
    if (!col) throw new NotFoundException("Column not found");
    const { role } = await this.boardsService.getBoardWithAccess(
      col.boardId,
      userId,
    );
    if (role === "VIEWER")
      throw new ForbiddenException("Viewers cannot create tasks");

    const maxPos = await this.prisma.task.aggregate({
      where: { columnId },
      _max: { position: true },
    });
    const nextPos = (maxPos._max.position ?? -1) + 1;

    return this.prisma.task.create({
      data: { columnId, title, description, assigneeId, position: nextPos },
    });
  }

  async updateTask(
    taskId: string,
    data: { title?: string; description?: string; assigneeId?: string },
    userId: string,
  ) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { column: { include: { board: true } } },
    });
    if (!task) throw new NotFoundException("Task not found");
    const { role } = await this.boardsService.getBoardWithAccess(
      task.column.boardId,
      userId,
    );
    if (role === "VIEWER")
      throw new ForbiddenException("Viewers cannot edit tasks");

    return this.prisma.task.update({ where: { id: taskId }, data });
  }

  async deleteTask(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { column: { include: { board: true } } },
    });
    if (!task) throw new NotFoundException("Task not found");
    const { role } = await this.boardsService.getBoardWithAccess(
      task.column.boardId,
      userId,
    );
    if (role === "VIEWER")
      throw new ForbiddenException("Viewers cannot delete tasks");

    return this.prisma.task.delete({ where: { id: taskId } });
  }

  async moveTask(
    taskId: string,
    columnId: string,
    position: number,
    userId: string,
  ) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { column: { include: { board: true } } },
    });
    if (!task) throw new NotFoundException("Task not found");

    const targetCol = await this.prisma.column.findUnique({
      where: { id: columnId },
      include: { board: true },
    });
    if (!targetCol) throw new NotFoundException("Target column not found");

    // Ensure same board
    if (task.column.boardId !== targetCol.boardId) {
      throw new ForbiddenException("Cannot move task across boards");
    }

    const { role } = await this.boardsService.getBoardWithAccess(
      task.column.boardId,
      userId,
    );
    if (role === "VIEWER")
      throw new ForbiddenException("Viewers cannot move tasks");

    const sameColumn = task.columnId === columnId;

    // Load tasks in target column
    const tasksInTarget = await this.prisma.task.findMany({
      where: { columnId },
      orderBy: { position: "asc" },
    });

    // Remove self if moving within same column
    let list = tasksInTarget.map((t) => t.id);
    if (sameColumn) {
      list = list.filter((id) => id !== taskId);
    }

    // Insert at position
    const clampedPos = Math.max(0, Math.min(position, list.length));
    list.splice(clampedPos, 0, taskId);

    // Build updates
    const updates = list.map((id, idx) =>
      this.prisma.task.update({
        where: { id },
        data: { columnId, position: idx },
      }),
    );

    await this.prisma.$transaction(updates);

    return this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        column: true,
        assignee: { select: { id: true, email: true, name: true } },
      },
    });
  }
}
