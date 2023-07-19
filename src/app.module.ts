import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from './events/entities/event.entity';

@Module({
  imports: [
    EventsModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './data/database.db',
      synchronize: true,
      entities: [EventEntity],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
