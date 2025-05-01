import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AppGateway } from './app.gateway';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @Inject('BLOG_SERVICE') private readonly blogClient: ClientKafka,
    private readonly gateway: AppGateway,
  ) {}

  async onModuleInit() {
    this.blogClient.subscribeToResponseOf('blog.request');
    this.blogClient.subscribeToResponseOf('weather.request');
    await this.blogClient.connect();
  }

  async fetchPosts(clientId: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const response = await firstValueFrom(
        this.blogClient.send('blog.request', { action: 'getAll' }),
      );
      this.gateway.emitPosts(clientId, 'post.get', response);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      this.gateway.emitError(clientId, error.message);
    }
  }

  async fetchWeather(clientId: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const response = await firstValueFrom(
        this.blogClient.send('weather.request', { city: 'Bilaspur' }),
      );
      this.gateway.emitPosts(clientId, 'weather.get', response);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      this.gateway.emitError(clientId, error.message);
    }
  }
}
