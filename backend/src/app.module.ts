import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { BoardsModule } from "./boards/boards.module";
import { ColumnsModule } from "./columns/columns.module";
import { TasksModule } from "./tasks/tasks.module";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { AppController } from "./app.controller";

@Module({
  imports: [
    // Load .env — must be first
    ConfigModule.forRoot({ isGlobal: true }),

    PrismaModule,
    AuthModule,
    BoardsModule,
    ColumnsModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
