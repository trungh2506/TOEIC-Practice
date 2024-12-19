import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class UploadGateway {
  @WebSocketServer()
  server: Server;

  // Khi một client kết nối, tham gia vào phòng (room) theo user_id
  handleConnection(@ConnectedSocket() client: Socket) {
    // Giả sử bạn có user_id từ token hoặc thông qua một phương thức xác thực
    const user_id = client.handshake.query.user_id;
    if (user_id) {
      client.join(user_id);
      // console.log(`User ${user_id} bắt đầu upload.`);
    }
  }

  @SubscribeMessage('uploading')
  handleUploading(@MessageBody() data: string): string {
    //Nhận dữ liệu trả về
    console.log('Upload status:', data);
    return data;
  }

  /// Phát sự kiện
  sendUploadingNotification(user_id: string, message: string) {
    this.server.to(user_id).emit('uploading', { message });
  }
}
