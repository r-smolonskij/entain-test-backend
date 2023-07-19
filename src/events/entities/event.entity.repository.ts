import { Repository } from 'typeorm';
import { EventEntity } from './event.entity';

export class EventEntityRepository extends Repository<EventEntity> {}
