import { existsSync, mkdirSync } from 'fs';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';

export const storage = diskStorage({
  destination: (req, file, cb) => {
    const dateFolder = req.body.title;
    console.log(dateFolder);
    let uploadPath = `./uploads/${dateFolder}`;

    if (file.mimetype.startsWith('image/')) {
      uploadPath += '/images'; // Đường dẫn cho file ảnh
    } else if (file.mimetype.startsWith('audio/')) {
      uploadPath += '/audios'; // Đường dẫn cho file âm thanh
    }

    // Kiểm tra thư mục có tồn tại không, nếu chưa thì tạo mới
    if (!existsSync(uploadPath)) {
      mkdirSync(uploadPath, { recursive: true }); // Tạo thư mục nếu chưa tồn tại
    }

    // Trả về đường dẫn nơi lưu trữ file
    cb(null, uploadPath);
  },
  filename: (req, file, callback) => {
    callback(null, `${generateFilename(file)}`);
  },
});

// Cấu hình lưu trữ vào bộ nhớ
export const storageMemory = memoryStorage();

function generateFilename(file) {
  return file.originalname;
}
