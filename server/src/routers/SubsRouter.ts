import { Router } from 'express';
import { SubsController } from '../controllers/SubsController';

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
