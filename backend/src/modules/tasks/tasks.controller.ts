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
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { ApiTags } from "@nestjs/swagger";
import { CreateTaskDto, MoveTaskDto, UpdateTaskDto } from "./dto/tasks.dto";

@ApiTags("Tasks")
@Controller("tasks")
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  createTask(
    @Body() dto: CreateTaskDto,
    @Body("columnId") columnId: string,
    @Req() req: any,
  ) {
    return this.tasksService.createTask(
      columnId,
      dto.title,
      req.user.userId,
      dto.description,
      dto.assigneeId,
    );
  }

  @Patch(":id")
  updateTask(
    @Param("id") id: string,
    @Body() dto: UpdateTaskDto,
    @Req() req: any,
  ) {
    return this.tasksService.updateTask(id, dto, req.user.userId);
  }

  @Delete(":id")
  deleteTask(@Param("id") id: string, @Req() req: any) {
    return this.tasksService.deleteTask(id, req.user.userId);
  }

  @Post(":id/move")
  moveTask(@Param("id") id: string, @Body() dto: MoveTaskDto, @Req() req: any) {
    return this.tasksService.moveTask(
      id,
      dto.columnId,
      dto.position,
      req.user.userId,
    );
  }
}
