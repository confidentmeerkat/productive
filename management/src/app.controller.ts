import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { WebhookService } from './webhook.service';
import { JwtOrApiKeyAuthGuard } from './auth/guards/auth.guard';
import { AuthenticatedRequest } from './auth/api-key.strategy';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly webhookService: WebhookService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('webhook')
  @UseGuards(JwtOrApiKeyAuthGuard)
  webhook(@Body() body: any, @Req() req: AuthenticatedRequest) {
    return this.webhookService.handleWebhook(req.user.id, body);
  }
}
