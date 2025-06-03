import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationDto } from './dto/application.dto';
import { JwtOrApiKeyAuthGuard } from 'src/auth/guards/auth.guard';
import { AuthenticatedRequest } from 'src/auth/api-key.strategy';

@Controller('applications')
@UseGuards(JwtOrApiKeyAuthGuard)
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationsService) {}

  @Post()
  async create(
    @Body() applicationDto: ApplicationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.applicationService.create(applicationDto, req.user.id);
  }

  @Get()
  async findAll(@Req() req: AuthenticatedRequest) {
    return this.applicationService.findAll(req.user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.applicationService.findOne(id, req.user.id);
  }

  @Put(':id')
  async update(
    @Body() updateApplicationDto: ApplicationDto,
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.applicationService.update(
      id,
      req.user.id,
      updateApplicationDto,
    );
  }

  @Delete(':id')
  async remove(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.applicationService.remove(id, req.user.id);
  }
}
