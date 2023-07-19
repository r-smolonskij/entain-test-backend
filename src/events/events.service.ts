import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './entities/event.entity';
import { EventEntityRepository } from './entities/event.entity.repository';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: EventEntityRepository,
  ) {}

  async findAll(
    status?: string,
    sports?: string,
    searchText?: string,
    activePage?: number,
    itemsPerPage?: number,
    orderBy?: string,
  ) {
    try {
      const aPage = activePage || 1;
      const iPerPage = itemsPerPage || 10;
      const skipItems = (aPage - 1) * iPerPage;

      const query = this.eventRepository.createQueryBuilder('event');
      if ((!status && sports) || (status && !sports)) {
        return [];
      } else if (status && sports) {
        const statusList = status.split(',');
        const sportsList = sports.split(',');
        query
          .where('event.status IN (:...status)', { status: statusList })
          .andWhere('event.sport IN (:...sports)', { sports: sportsList });
        if (searchText && searchText.length > 2) {
          query.andWhere('event.name LIKE :searchText', {
            searchText: `%${searchText}%`,
          });
        }
      }

      const totalItems = await query.getCount();
      const totalPages = Math.ceil(totalItems / iPerPage);
      const orderByParameter =
        orderBy && ['finishTimeAsc', 'finishTimeDesc'].includes(orderBy)
          ? 'finishTime'
          : 'startTime';
      const order =
        orderBy && ['startTimeDesc', 'finishTimeDesc'].includes(orderBy)
          ? 'DESC'
          : 'ASC';
      query.skip(skipItems).take(iPerPage);

      query.orderBy(`event.${orderByParameter}`, order);
      const events = await query.getMany();
      return { totalItems, totalPages, events };
    } catch (error) {
      throw new BadRequestException('Invalid data exception', {
        cause: new Error(),
        description: 'Invalid data provided',
      });
    }
  }

  async create(createEventDto: CreateEventDto) {
    try {
      const entity = this.eventRepository.create(createEventDto);
      return await this.eventRepository.save(entity);
    } catch (error) {
      throw new BadRequestException('Invalid data exception', {
        cause: new Error(),
        description: 'Invalid data provided',
      });
    }
  }

  async findOne(id: number) {
    const event = await this.eventRepository.findOneBy({ id: id });
    if (!event) {
      throw new NotFoundException();
    }
    return event;
  }

  async update(id: number, updateEventDto: UpdateEventDto) {
    try {
      const event = await this.eventRepository.findOneBy({ id: id });
      if (!event) {
        throw new NotFoundException();
      }
      if (event.status === 'finished' && updateEventDto.status !== 'finished') {
        throw new BadRequestException('Invalid data exception', {
          description: 'Finished events cannot change status',
        });
      }
      await this.eventRepository.update(id, updateEventDto);
      return await this.findOne(id);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new NotFoundException();
      }
    }
  }

  async remove(id: number) {
    try {
      //Check if event exists, if not throw error as delete "Does not check if entity exist in the database".
      const event = await this.eventRepository.findOneBy({ id: id });
      if (event) {
        return await this.eventRepository.delete(id);
      }
      throw new NotFoundException();
    } catch (error) {
      throw error;
    }
  }
}
