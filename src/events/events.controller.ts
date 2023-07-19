import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventEntity } from './entities/event.entity';

@Controller('/api/v1/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(
    @Body(new ValidationPipe()) createEventDto: CreateEventDto,
  ): Promise<EventEntity> {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll(
    @Query('status') status: string,
    @Query('sports') sports: string,
    @Query('searchText') searchText: string,
    @Query('activePage') activePage: string,
    @Query('itemsPerPage') itemsPerPage: string,
    @Query('orderBy') orderBy: string,
  ) {
    //ParseIntPipe returns  "Validation failed (numeric string is expected)" if activePage or itemsPerPage is not defined
    return this.eventsService.findAll(
      status,
      sports,
      searchText,
      activePage ? Number(activePage) : null,
      itemsPerPage ? Number(itemsPerPage) : null,
      orderBy,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.remove(id);
  }
}
