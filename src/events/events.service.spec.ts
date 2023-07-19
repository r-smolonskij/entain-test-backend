import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { MockEventEntityRepository } from './entities/mock-event.entity.repository';
import { CreateEventDto } from './dto/create-event.dto';

describe('EventsService', () => {
  let eventsService: EventsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(EventEntity),
          useClass: MockEventEntityRepository,
        },
      ],
    }).compile();

    eventsService = module.get<EventsService>(EventsService);
  });

  describe('get events', () => {
    it('should return empty list, because only status is defined', () => {
      const result = () => {
        return eventsService.findAll('active');
      };
      expect(result).toHaveLength(0);
    });
    it('should return empty list, because only sports is defined', () => {
      const result = () => {
        return eventsService.findAll(null, 'basketball');
      };
      expect(result).toHaveLength(0);
    });
  });
  describe('create event', () => {
    it('should return error, because null is passed as event', async () => {
      expect(async () => {
        eventsService.create(null);
      }).toThrowError();
    });
    it('should return error, because name is shorter than 4 chars', async () => {
      const event: CreateEventDto = {
        name: 'Ev',
        sport: 'basketball',
        status: 'active',
        startTime: new Date('2000-07-25T00:00:01.967'),
        finishTime: new Date('2000-07-28T00:00:01.967'),
      };
      expect(async () => {
        await eventsService.create(event);
      }).toThrowError();
    });
  });
});
