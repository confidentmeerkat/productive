import { Controller, Post, Body, UseGuards, Request, Get, Delete, Param } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('api-keys')
export class ApiKeysController {
    constructor(private readonly apiKeysService: ApiKeysService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    create(@Body() createApiKeyDto: CreateApiKeyDto, @Request() req) {
        console.log(req.user);
        return this.apiKeysService.create(req.user.id, createApiKeyDto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    findAll(@Request() req) {
        return this.apiKeysService.findAllForUser(req.user.id);
    }


    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    remove(@Request() req, @Param('id') id: string) {
        return this.apiKeysService.remove(req.user.id, +id);
    }
} 