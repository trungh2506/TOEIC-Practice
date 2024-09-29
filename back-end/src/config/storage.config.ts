import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';

// export const storage = diskStorage({
//   destination: './uploads',
//   filename: (req, file, callback) => {
//     callback(null, generateFilename(file));
//   },
// });

export const storage = diskStorage({
  destination: (req, file, cb) => {
    const dateFolder = req.body.title;

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
    callback(null, generateFilename(file));
  },
});

function generateFilename(file) {
  return `${Date.now()}.${extname(file.originalname)}`;
}
