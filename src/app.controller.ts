import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  getHello(): string {
    return 'V1 API is running!';
  }

  @Public()
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      uptime: process.uptime(),
    };
  }
}
