import {
  ConnectedSocket,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class TestExpiredGateway {
  @WebSocketServer()
  server: Server;

  // Khi một client kết nối, tham gia vào phòng (room) theo user_id
  handleConnection(@ConnectedSocket() client: Socket) {
    // Giả sử bạn có user_id từ token hoặc thông qua một phương thức xác thực
    const user_id = client.handshake.query.user_id;
    if (user_id) {
      client.join(user_id);
      // console.log(`User ${user_id} bắt đầu thi thử.`);
    }
  }

  // Phát sự kiện bài thi hết hạn
  notifyTestExpired(user_id: string) {
    this.server.to(user_id).emit('test_expired', { user_id });
  }
  notifyTimeRemaining(user_id: string, remainingTime: number) {
    this.server.to(user_id).emit('time_update', {
      user_id,
      remainingTime,
    });
  }
}
