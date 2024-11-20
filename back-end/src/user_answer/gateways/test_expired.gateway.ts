import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class TestExpiredGateway {
  @WebSocketServer()
  server: Server;

  // Phát sự kiện bài thi hết hạn
  notifyTestExpired(user_id: string) {
    this.server.emit('test_expired', { user_id });
  }
  notifyTimeRemaining(user_id: string, remaining_time: number) {
    this.server.emit('time_update', { user_id, remaining_time })
  }
}
