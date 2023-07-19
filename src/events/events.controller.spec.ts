import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventEntity } from './entities/event.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockEventEntityRepository } from './entities/mock-event.entity.repository';

describe('EventsController', () => {
  let controller: EventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(EventEntity),
          useClass: MockEventEntityRepository,
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
