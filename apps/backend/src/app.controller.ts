import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('posts')
  getPosts(@Query('clientId') clientId: string) {
    void this.appService.fetchPosts(clientId);
    return { status: 'processing', clientId };
  }

  @Get('weather')
  getWeather(@Query('clientId') clientId: string) {
    void this.appService.fetchWeather(clientId);
    return { status: 'processing', clientId };
  }
}
