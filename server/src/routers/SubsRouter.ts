import { Router } from 'express';
import { SubsController } from '../controllers/SubsController';
import * as multer from 'multer';

//create storage for uploaded files
var storage = multer.memoryStorage();
// multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'src/assets/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });
var upload = multer({
  storage: storage
});

// The file is responsible to process the api requests and call the required middleware, validator and controller in a centralized place

//@Route: /auth
//@AUTH not required
//@FUNCTIONS all auth related work

class SubsRouter {
  public router: Router;
  constructor() {
    this.router = Router();
    this.getRoutes();
    this.postRoutes();
    this.putRoutes();
    this.deleteRoutes();
  }
  getRoutes(): void {
    // add all get routes here
  }
  postRoutes(): void {
    // add all post routes here
    this.router.post(
      '/', // path of api request
      upload.single('file'), // middleware to handle file upload
      SubsController.generateSubs // Main business logic of the server that returns the required response.
    );
  }
  putRoutes(): void {
    // add all get routes here
    // this.router.put()
  }
  deleteRoutes(): void {
    // add all get routes here
    // this.router.delete()
  }
}
export default new SubsRouter().router;
