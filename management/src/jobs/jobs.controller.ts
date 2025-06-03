import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobDto } from './dto/job.dto';
import { JwtOrApiKeyAuthGuard } from 'src/auth/guards/auth.guard';

@Controller('jobs')
@UseGuards(JwtOrApiKeyAuthGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async create(@Body() jobDto: JobDto) {
    return this.jobsService.create(jobDto);
  }

  @Get()
  async findAll() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.jobsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() jobDto: JobDto) {
    return this.jobsService.update(id, jobDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.jobsService.remove(id);
  }
}
