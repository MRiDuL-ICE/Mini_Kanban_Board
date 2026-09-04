import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { CreateTaskDto, MoveTaskDto, UpdateTaskDto } from "./dto/tasks.dto";
import { BoardPermissionGuard } from "@/common/guards/board-permission.guard";
import { RequireBoardRole } from "@/common/decorators/require-board-role.decorator";

@UseGuards(BoardPermissionGuard)
@ApiTags("Tasks")
@Controller("tasks")
@ApiBearerAuth("jwt")
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @RequireBoardRole("EDITOR")
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create task" })
  @ApiOkResponse({ description: "Task created" })
  createTask(@Body() dto: CreateTaskDto, @Req() req: any) {
    return this.tasksService.createTask(
      dto.columnId,
      dto.title,
      req.user.userId,
      dto.description,
      dto.assigneeId,
    );
  }

  @RequireBoardRole("EDITOR")
  @Patch(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Update task" })
  @ApiOkResponse({ description: "Task updated" })
  updateTask(
    @Param("id") id: string,
    @Query("boardId") boardId: string,
    @Body() dto: UpdateTaskDto,
    @Req() req: any,
  ) {
    return this.tasksService.updateTask(id, dto, req.user.userId);
  }

  @RequireBoardRole("EDITOR")
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete task" })
  @ApiOkResponse({ description: "Task deleted" })
  deleteTask(@Param("id") id: string, @Req() req: any) {
    return this.tasksService.deleteTask(id, req.user.userId);
  }

  @RequireBoardRole("EDITOR")
  @Post(":id/move")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Move task" })
  @ApiOkResponse({ description: "Task moved" })
  moveTask(
    @Param("id") id: string,
    @Query("boardId") boardId: string,
    @Body() dto: MoveTaskDto,
    @Req() req: any,
  ) {
    return this.tasksService.moveTask(
      id,
      dto.columnId,
      dto.position,
      req.user.userId,
    );
  }
}
