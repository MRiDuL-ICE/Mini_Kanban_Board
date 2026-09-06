import { NestFactory } from "@nestjs/core";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix("api", {
    exclude: ["api/docs", "api/docs-json", "api/docs/(.*)", "health"],
  });
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: "1" });

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  });

  // Global pipes & filters
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown fields
      forbidNonWhitelisted: true,
      transform: true, // auto-cast primitives from route params
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger (dev only)
  if (
    process.env.NODE_ENV !== "production" ||
    process.env.SWAGGER_ENABLED === "true"
  ) {
    const config = new DocumentBuilder()
      .setTitle("Mini Kanban API")
      .setDescription("REST API for the Mini Kanban Board application")
      .setVersion("1.0")
      .addBearerAuth(
        {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          in: "header",
        },
        "jwt",
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);
  }

  const port = process.env.BACKEND_PORT ?? 4000;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}/api/v1`);
  if (process.env.NODE_ENV !== "production") {
    console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
  }
}

bootstrap();
