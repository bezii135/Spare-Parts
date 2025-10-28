import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433, // change to 5432 if default Postgres port
      username: 'postgres',
      password: 'God2025',
      database: 'spare_parts',
      autoLoadEntities: true,
      synchronize: true, // ⚠️ only for development
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
