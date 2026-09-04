import { SetMetadata } from "@nestjs/common";
import {
  REQUIRED_BOARD_ROLE_KEY,
  BoardRole,
} from "../guards/board-permission.guard";

export const RequireBoardRole = (role: BoardRole) =>
  SetMetadata(REQUIRED_BOARD_ROLE_KEY, role);
