import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EventEntityRepository } from './entities/event.entity.repository';
import { UpdateEventDto } from './dto/update-event.dto';

describe('EventsService', () => {
  let eventsService: EventsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(EventEntity),
          useClass: EventEntityRepository,
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
    it('should throw error, because null is passed as event', async () => {
      await expect(eventsService.create(null)).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should return error, because name is shorter than 4 chars', async () => {
      const event: CreateEventDto = {
        name: 'Ev',
        sport: 'basketball',
        status: 'active',
        startTime: new Date('2000-07-25T00:00:01.967'),
        finishTime: new Date('2000-07-28T00:00:01.967'),
      };
      await expect(eventsService.create(event)).rejects.toThrow(
        BadRequestException,
      );
    });
    it('should return error, because finishTime is smaller than startTime', async () => {
      const event: CreateEventDto = {
        name: 'Event 1',
        sport: 'basketball',
        status: 'active',
        startTime: new Date('2000-07-29T00:00:01.967'),
        finishTime: new Date('2000-07-28T00:00:01.967'),
      };
      await expect(eventsService.create(event)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
  describe('update event', () => {
    it('should throw error, because not existing event id is passed', async () => {
      const event: UpdateEventDto = {
        name: 'Event 1',
        sport: 'basketball',
        status: 'active',
        startTime: new Date('2000-07-27T00:00:01.967'),
        finishTime: new Date('2000-07-28T00:00:01.967'),
      };
      const invalidId = 111;
      await expect(eventsService.update(invalidId, event)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
