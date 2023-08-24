// fileUpload.service.ts
import {Request, Response} from '@loopback/rest';
import {upload} from "./multerConfig";
import multer from "multer";

interface UploadedFile {
  filename: string;
  path: string;

}
export class FileUploadService {
  async uploadFile(req: Request, res: Response): Promise<UploadedFile | null> {  // Возвращаем null при ошибке
    return new Promise((resolve) => {
      upload.single('thumbnail')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
          // Это ошибка Multer при загрузке.
          if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(400).send('File size exceeds the 1MB limit.');  // Отправляем ошибку напрямую
            resolve(null);
          } else {
            // Другие ошибки Multer
            res.status(400).send(err.message);  // Отправляем ошибку напрямую
            resolve(null);
          }
        } else if (err) {
          // Неизвестная ошибка
          res.status(500).send(err.message);  // Отправляем ошибку напрямую
          resolve(null);
        } else {
          resolve(req.file as UploadedFile);
        }
      });
    });
  }
}

