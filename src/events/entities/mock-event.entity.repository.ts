import { Repository } from 'typeorm';
import { EventEntity } from './event.entity';

export class MockEventEntityRepository extends Repository<EventEntity> {
  // Implement mock methods or behaviors here if needed
  // For example, you might implement a custom find method to mock the database behavior
  //   async findMockEvents(): Promise<EventEntity[]> {
  //     return [
  //       { id: 1, name: 'Mock Event 1', status: 'active', startTime: new Date(), finishTime: new Date() },
  //       { id: 2, name: 'Mock Event 2', status: 'inactive', startTime: new Date(), finishTime: new Date() },
  //       // Add more mock events as needed for testing
  //     ];
  //   }
}
