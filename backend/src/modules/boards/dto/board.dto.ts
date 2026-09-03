import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateBoardDto {
  @IsString()
  @ApiProperty({ example: "title" })
  title!: string;
}

export class AddMemberDto {
  @IsString()
  @ApiProperty({ example: "user_id" })
  userId!: string;

  @IsString()
  @ApiProperty({ example: "VIEWER" })
  role!: "OWNER" | "EDITOR" | "VIEWER";
}

export class CreateColumnDto {
  @IsString()
  @ApiProperty({ example: "title" })
  title!: string;
}

export class UpdateColumnDto {
  @IsString()
  @ApiProperty({ example: "title" })
  title!: string;
}
