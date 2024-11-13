import { Injectable } from '@nestjs/common';
import { Dropbox } from 'dropbox';

@Injectable()
export class DropboxService {
  private dbx: Dropbox;
  private accessToken: string;
  private refreshToken: string;

  constructor() {
    this.dbx = new Dropbox({
      accessToken: process.env.DROPBOX_ACCESS_TOKEN,
    });
  }

  async uploadFile(fileBuffer: Buffer, path: string) {
    try {
      const uploadResponse = await this.dbx.filesUpload({
        path: path,
        contents: fileBuffer,
      });

      try {
        const sharedLinkResponse =
          await this.dbx.sharingCreateSharedLinkWithSettings({
            path: uploadResponse.result.path_display,
          });

        return sharedLinkResponse.result.url;
      } catch (innerError) {
        // Kiểm tra nếu lỗi là do liên kết đã tồn tại
        if (innerError.error && innerError.error.shared_link_already_exists) {
          console.log(
            'Shared link already exists. Returning the existing link.',
          );
          // Trả về liên kết chia sẻ đã tồn tại và tiếp tục
          return innerError.error.shared_link_already_exists.url;
        } else {
          // Nếu lỗi khác, ném lỗi để xử lý ngoài
          console.error(
            'Unexpected error while creating shared link:',
            innerError,
          );
          throw innerError;
        }
      }
    } catch (error) {
      // Xử lý các lỗi tải lên tệp hoặc các lỗi khác
      console.error('Lỗi khi tải tệp lên Dropbox:', error);
      if (error.response) {
        console.error('Chi tiết lỗi từ Dropbox:', error.response);
      }
      throw new Error(`Lỗi khi tải tệp lên Dropbox: ${error.message}`);
    }
  }
}
