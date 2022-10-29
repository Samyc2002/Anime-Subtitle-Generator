import { Request, Response, NextFunction } from 'express';
import * as multer from 'multer';

const uploadFile = (req: Request, res: Response, next: NextFunction) => {
  const upload = multer().single('file');

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
    } else if (err) {
      // An unknown error occurred when uploading.
    }
    // Everything went fine.
    next();
  });
};

export default uploadFile;
