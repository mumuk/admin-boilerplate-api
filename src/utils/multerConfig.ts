import multer from 'multer';
import {join} from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, '../../public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
export const upload = multer({
    storage: storage,
    fileFilter: (
      req, file, cb) => {
      if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
        return cb(new Error('Invalid file type. Only JPEG and PNG are allowed'));
      }
      cb(null, true);
  },
  limits: { fileSize: 1e6 }  // 1 MB
});