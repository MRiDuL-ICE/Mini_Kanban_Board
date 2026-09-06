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
  HttpCode,
  HttpStatus,
  Query,
} from "@nestjs/common";
import { BoardsService } from "./boards.service";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import {
  AddMemberDto,
  CreateBoardDto,
  CreateColumnDto,
  UpdateColumnDto,
} from "./dto/board.dto";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { Public } from "@/common/decorators/public.decorator";
import { BoardPermissionGuard } from "@/common/guards/board-permission.guard";
import { RequireBoardRole } from "@/common/decorators/require-board-role.decorator";

@UseGuards(BoardPermissionGuard)
@ApiTags("Boards")
@Controller("boards")
@ApiBearerAuth("jwt")
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "List boards" })
  @ApiOkResponse({ description: "Boards found" })
  listBoards(@Req() req: any) {
    const userId = req.user.userId;
    return this.boardsService.listBoards(userId);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get board by id" })
  @ApiOkResponse({ description: "Board found" })
  async getBoard(@Param("id") id: string, @Req() req: any) {
    const { board, role } = await this.boardsService.getBoardWithAccess(
      id,
      req.user.userId,
    );
    return { board, role };
  }

  // @RequireBoardRole("OWNER")
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create board" })
  @ApiOkResponse({ description: "Board created" })
  createBoard(@Body() dto: CreateBoardDto, @Req() req: any) {
    return this.boardsService.createBoard(dto.title, req.user.userId);
  }

  @RequireBoardRole("OWNER")
  @Post("/members")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Add member to board" })
  @ApiOkResponse({ description: "Member added" })
  addMember(
    @Query("boardId") id: string,
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

  @RequireBoardRole("OWNER")
  @Get("member/by-email")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Get user by email" })
  @ApiOkResponse({ description: "Returns a user" })
  async getByEmail(
    @Query("email") email: string,
    @Query("boardId") id: string,
  ) {
    return this.boardsService.findByEmail(email);
  }

  @RequireBoardRole("OWNER")
  @Delete(":id/members/:userId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remove member from board" })
  @ApiOkResponse({ description: "Member removed" })
  removeMember(
    @Param("id") id: string,
    @Param("userId") userId: string,
    @Req() req: any,
  ) {
    return this.boardsService.removeMember(id, userId, req.user.userId);
  }

  @RequireBoardRole("EDITOR")
  @Post(":id/columns")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create column" })
  @ApiOkResponse({ description: "Column created" })
  createColumn(
    @Param("id") id: string,
    @Body() dto: CreateColumnDto,
    @Req() req: any,
  ) {
    return this.boardsService.createColumn(id, dto.title, req.user.userId);
  }

  @RequireBoardRole("EDITOR")
  @Patch("columns/:columnId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update column" })
  @ApiOkResponse({ description: "Column updated" })
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

  @RequireBoardRole("EDITOR")
  @Delete("columns/:columnId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete column" })
  @ApiOkResponse({ description: "Column deleted" })
  deleteColumn(@Param("columnId") columnId: string, @Req() req: any) {
    return this.boardsService.deleteColumn(columnId, req.user.userId);
  }
}
