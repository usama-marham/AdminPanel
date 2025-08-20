import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Add global prefix
  app.setGlobalPrefix('v1');
  
  // Enable CORS
  app.enableCors();
  
  // Add global error handling
  app.useGlobalFilters();
  
  // Add global exception filter for logging
  app.useGlobalInterceptors();
  
  // Add request logging
  app.use((req: any, res: any, next: any) => {
    console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
    next();
  });
  
  const port = process.env.PORT ?? 3333;
  console.log(`Starting NestJS application on port ${port}`);
  
  await app.listen(port);
  console.log(`NestJS application started successfully on port ${port}`);
}
bootstrap();
