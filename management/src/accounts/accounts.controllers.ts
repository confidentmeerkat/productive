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
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/account.dto';
import { JwtOrApiKeyAuthGuard } from 'src/auth/guards/auth.guard';
import { AuthenticatedRequest } from 'src/auth/api-key.strategy';

@Controller('accounts')
@UseGuards(JwtOrApiKeyAuthGuard)
export class AccountController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(
    @Body() createAccountDto: CreateAccountDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.accountsService.create(createAccountDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.accountsService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.accountsService.findOne(id, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccountDto: CreateAccountDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.accountsService.update(id, req.user.id, updateAccountDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.accountsService.remove(id, req.user.id);
  }
}
