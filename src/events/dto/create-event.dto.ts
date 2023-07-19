import { IsEnum, MinLength, IsDateString } from 'class-validator';
import { IsFinishTimeGreaterThanStartTime } from '../validators/finish-time.validator';

export class CreateEventDto {
  id?: number;
  @MinLength(4)
  name: string;
  @IsEnum(['football', 'basketball', 'hockey', 'tennis'], {
    message: 'Use correct sport',
  })
  sport: 'football' | 'basketball' | 'hockey' | 'tennis';
  @IsEnum(['inactive', 'active', 'finished'], {
    message: 'Use correct status',
  })
  status: 'inactive' | 'active' | 'finished';
  @IsDateString()
  startTime: Date;
  @IsFinishTimeGreaterThanStartTime('startTime', 'finishTime')
  @IsDateString()
  finishTime: Date;
}
