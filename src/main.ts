import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, '..', 'cert.key')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'cert.crt')),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  app.use(cookieParser());

  app.enableCors({
    origin: 'https://localhost:3000', 
    credentials: true, 
  });

  await app.listen(4200); 
}
bootstrap();
