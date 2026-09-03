import { Controller, Get } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Public } from "./common/decorators/public.decorator";

@ApiTags("Health")
@Controller()
export class AppController {
  @Public()
  @Get("health")
  @ApiOperation({ summary: "Health check — used by Docker healthcheck" })
  health(): { status: string; timestamp: string } {
    return { status: "ok", timestamp: new Date().toISOString() };
  }
}
