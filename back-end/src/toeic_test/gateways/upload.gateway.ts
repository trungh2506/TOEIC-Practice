import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class UploadGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('uploading')
  handleUploading(@MessageBody() data: string): string {
    //Nhận dữ liệu trả về
    console.log('Upload status:', data);
    return data;
  }

  /// Phát sự kiện
  sendUploadingNotification(message: string) {
    this.server.emit('uploading', { message });
  }
}
