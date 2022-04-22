import express, { Application } from 'express';

import { ExpressRouteAdapter } from '../../adapters/express/ExpressRouteAdapter';
import { IRouter } from '../../interfaces/http';
import { createLoginController } from './factories';
import { ILoginController } from './interfaces';

export default class LoginRouter implements IRouter {
  private static instance: LoginRouter;

  private readonly router = express.Router();

  private constructor(private readonly controller: ILoginController) {}

  public static getInstance(
    controller: ILoginController = createLoginController(),
  ): LoginRouter {
    if (!this.instance) {
      this.instance = new LoginRouter(controller);
    }

    return this.instance;
  }

  private checkApplicationStatus(): void {
    /**
     * GET /login
     * @tag Login
     * @summary get the status of the application considering the status of all the required resources.
     * @description return an object with the status of the resources.
     * @response 200 - an object with a message when user is authenticated with success.
     * @responseContent {LoginResponse} 200.application/json
     * @responseExample {LoginSuccessResponse} 200.application/json.LoginSuccessResponse
     * @response 401 - an object with a message when user is not authenticated with success.
     * @responseContent {LoginResponse} 401.application/json
     * @responseExample {LoginUnauthorizedResponse} 401.application/json.LoginUnauthorizedResponse
     */
    this.router
      .route('/login')
      .get(
        ExpressRouteAdapter.adapt<ILoginController>(this.controller, 'login'),
      );
  }

  setupRoutes(app: Application): void {
    this.checkApplicationStatus();
    app.use(this.router);
  }
}
