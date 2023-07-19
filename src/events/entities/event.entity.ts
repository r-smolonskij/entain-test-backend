import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  sport: 'football' | 'basketball' | 'hockey' | 'tennis';
  @Column()
  status: 'inactive' | 'active' | 'finished';
  @Column('time')
  startTime: Date;
  @Column('time')
  finishTime: Date;
}
