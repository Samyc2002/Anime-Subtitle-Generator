import * as multer from "multer";

//create storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./assets");
  },

  filename: function (req: any, file: any, cb: any) {
    cb(null, "video.mp4");
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

export default upload;
