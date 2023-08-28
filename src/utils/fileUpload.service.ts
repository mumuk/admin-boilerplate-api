import {Request, Response} from '@loopback/rest';
import {upload} from "./multerConfig";
import multer from "multer";

interface UploadedFile {
  filename: string;
  path: string;

}
export class FileUploadService {
  async uploadFile(req: Request, res: Response): Promise<UploadedFile | null> {
    return new Promise((resolve) => {
      upload.single('thumbnail')(req, res, (err) => {
        if (err instanceof multer.MulterError) {

          if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(400).send('File size exceeds the 1MB limit.');
            resolve(null);
          } else {

            res.status(400).send(err.message);
            resolve(null);
          }
        } else if (err) {

          res.status(500).send(err.message);
          resolve(null);
        } else {
          resolve(req.file as UploadedFile);
        }
      });
    });
  }
}

