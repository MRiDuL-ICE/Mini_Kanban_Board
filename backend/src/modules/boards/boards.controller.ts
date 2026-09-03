import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from "@nestjs/common";
import { BoardsService } from "./boards.service";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import {
  AddMemberDto,
  CreateBoardDto,
  CreateColumnDto,
  UpdateColumnDto,
} from "./dto/board.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Boards")
@Controller("boards")
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get(":id")
  async getBoard(@Param("id") id: string, @Req() req: any) {
    const { board, role } = await this.boardsService.getBoardWithAccess(
      id,
      req.user.userId,
    );
    return { board, role };
  }

  @Post()
  createBoard(@Body() dto: CreateBoardDto, @Req() req: any) {
    return this.boardsService.createBoard(dto.title, req.user.userId);
  }

  @Post(":id/members")
  addMember(
    @Param("id") id: string,
    @Body() dto: AddMemberDto,
    @Req() req: any,
  ) {
    return this.boardsService.addMember(
      id,
      dto.userId,
      req.user.userId,
      dto.role,
    );
  }

  @Delete(":id/members/:userId")
  removeMember(
    @Param("id") id: string,
    @Param("userId") userId: string,
    @Req() req: any,
  ) {
    return this.boardsService.removeMember(id, userId, req.user.userId);
  }

  @Post(":id/columns")
  createColumn(
    @Param("id") id: string,
    @Body() dto: CreateColumnDto,
    @Req() req: any,
  ) {
    return this.boardsService.createColumn(id, dto.title, req.user.userId);
  }

  @Patch("columns/:columnId")
  updateColumn(
    @Param("columnId") columnId: string,
    @Body() dto: UpdateColumnDto,
    @Req() req: any,
  ) {
    return this.boardsService.updateColumn(
      columnId,
      dto.title,
      req.user.userId,
    );
  }

  @Delete("columns/:columnId")
  deleteColumn(@Param("columnId") columnId: string, @Req() req: any) {
    return this.boardsService.deleteColumn(columnId, req.user.userId);
  }
}
