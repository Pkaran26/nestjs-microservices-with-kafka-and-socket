import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway {
  @WebSocketServer()
  server: Server;

  emitPosts(clientId: string, emittor: string, data: any) {
    this.server.to(clientId).emit(emittor, data);
  }

  emitError(clientId: string, error: string) {
    this.server.to(clientId).emit('postsError', error);
  }
}
