import express, { Application } from 'express';

import { ExpressRouteAdapter } from '../../adapters/express/ExpressRouteAdapter';
import { IRouter } from '../../interfaces/http';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { createAuthController } from './factories';
import { IAuthController } from './interfaces';

export default class AuthRouter implements IRouter {
  private static instance: AuthRouter;

  private readonly router = express.Router();

  private constructor(private readonly controller: IAuthController) {}

  public static getInstance(
    controller: IAuthController = createAuthController(),
  ): AuthRouter {
    if (!this.instance) {
      this.instance = new AuthRouter(controller);
    }

    return this.instance;
  }

  private me(): void {
    /**
     * GET /users/me
     * @tag Users
     * @summary get user info
     * .
     * @description return info from logger user.
     * @response 200 - an array with the all the users.
     * @responseContent { UserResponse[]} 200.application/json
     * @responseExample { UserResponse[]} 200.application/json.UserResponse
     * @response 401 - an object with a message when user is not authenticated with success.
     * @responseContent {AuthResponse} 401.application/json
     * @responseExample {AuthUnauthorizedResponse} 401.application/json.LoginUnauthorizedResponse
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/auth/me')
      .get(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IAuthController>(this.controller, 'me'),
      );
  }

  private auth(): void {
    /**
     * POST /auth/token
     * @tag Login
     * @summary authenticate user by userName and password
     * @description return an object with the status of the resources.
     * @response 200 - an object with a message when user is authenticated with success.
     * @responseContent {AuthResponse} 200.application/json
     * @responseExample {AuthSuccessResponse} 200.application/json.LoginSuccessResponse
     * @response 401 - an object with a message when user is not authenticated with success.
     * @responseContent {AuthResponse} 401.application/json
     * @responseExample {AuthUnauthorizedResponse} 401.application/json.LoginUnauthorizedResponse
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/auth/token')
      .post(
        ExpressRouteAdapter.adapt<IAuthController>(this.controller, 'login'),
      );
  }

  setupRoutes(app: Application): void {
    this.auth();
    this.me();
    app.use(this.router);
  }
}
