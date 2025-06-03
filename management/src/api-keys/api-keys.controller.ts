import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Delete,
  Param,
  Patch,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiKeysService,
  ApiKeyInfo,
  NewApiKeyDetails,
} from './api-keys.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';
import { JwtOrApiKeyAuthGuard } from '../auth/guards/auth.guard';
import { AuthenticatedRequest } from 'src/auth/api-key.strategy';

@Controller('api-keys')
@UseGuards(JwtOrApiKeyAuthGuard) // Use the new guard that supports both JWT and API key
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createApiKeyDto: CreateApiKeyDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<NewApiKeyDetails> {
    return this.apiKeysService.create(req.user.id, createApiKeyDto);
  }

  @Get()
  async findAll(@Request() req: AuthenticatedRequest): Promise<ApiKeyInfo[]> {
    return this.apiKeysService.findAllForUser(req.user.id);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ): Promise<ApiKeyInfo> {
    return this.apiKeysService.findOneForUser(id, req.user.id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateApiKeyDto: UpdateApiKeyDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<ApiKeyInfo> {
    return this.apiKeysService.update(id, req.user.id, updateApiKeyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ): Promise<void> {
    await this.apiKeysService.remove(id, req.user.id);
  }
}
