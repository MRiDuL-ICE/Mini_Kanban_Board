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

@ApiTags("Boards")
@Controller("boards")
@ApiBearerAuth("jwt")
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
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create board" })
  @ApiOkResponse({ description: "Board created" })
  createBoard(@Body() dto: CreateBoardDto, @Req() req: any) {
    console.log(req.user);
    return this.boardsService.createBoard(dto.title, req.user.userId);
  }

  @Post(":id/members")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Add member to board" })
  @ApiOkResponse({ description: "Member added" })
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

  @Delete("columns/:columnId")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Delete column" })
  @ApiOkResponse({ description: "Column deleted" })
  deleteColumn(@Param("columnId") columnId: string, @Req() req: any) {
    return this.boardsService.deleteColumn(columnId, req.user.userId);
  }
}
