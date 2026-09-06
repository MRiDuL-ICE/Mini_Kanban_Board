import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
  @IsString()
  @ApiProperty({ example: "column_id" })
  columnId!: string;

  @IsString()
  @ApiProperty({ example: "title" })
  title!: string;

  @IsString()
  @ApiProperty({ example: "description" })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: "user_id" })
  assigneeId?: string;
}

export class UpdateTaskDto {
  @IsString()
  @ApiProperty({ example: "title" })
  title?: string;

  @IsString()
  @ApiProperty({ example: "description" })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: "user_id" })
  assigneeId?: string;
}

export class MoveTaskDto {
  @IsString()
  @ApiProperty({ example: "column_id" })
  columnId!: string;

  @ApiProperty({ example: 0 })
  @IsNumber()
  position!: number;
}
