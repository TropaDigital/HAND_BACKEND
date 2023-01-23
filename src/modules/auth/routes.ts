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
     * GET /auth/me
     * @tag Auth
     * @summary get user info
     * @security apiKey
     * @description return info from logger user.
     * @response 200 - an array with the all the users.
     * @responseContent {AuthenticatedUserResponse} 200.application/json
     * @responseExample {AuthenticatedUserResponse} 200.application/json.AuthenticatedUserResponse
     * @response 401 - an object with a message when user is not authenticated with success.
     * @responseContent {UnauthorizedResponse} 401.application/json
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
     * @tag Auth
     * @summary authenticate user by userName and password
     * @description return an object with the status of the resources.
     * @bodyContent {AuthenticatePayload} application/json
     * @bodyRequired
     * @response 200 - an object with a message when user is authenticated with success.
     * @responseContent {AuthResponse} 200.application/json
     * @responseExample {AuthSuccessResponse} 200.application/json.AuthSuccessResponse
     * @response 401 - an object with a message when user is not authenticated with success.
     * @responseContent {UnauthorizedResponse} 401.application/json
     * @responseExample {InvalidCredentialsResponse} 401.application/json.LoginUnauthorizedResponse
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/auth/token')
      .post(
        ExpressRouteAdapter.adapt<IAuthController>(this.controller, 'login'),
      );
  }

  private generateAndSendLinkOfResetPassword(): void {
    /**
     * GET /auth/forgot-password
     * @tag Auth
     * @summary generate and send link to email to reset the password.
     * @description return an user object.
     * @queryParam {string} email - the email that belongs to the user
     * @response 204 - no content.
     * @response 400 - An object with the error when the email provided does not exists
     * @responseContent {ValidationError} 400.application/json
     * @responseExample {EmailDoesNotExists} 400.application/json.EmailDoesNotExists
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/auth/forgot-password')
      .get(
        ExpressRouteAdapter.adapt<IAuthController>(
          this.controller,
          'generateAndSendLinkOfResetPassword',
        ),
      );
  }

  private resetPassword(): void {
    /**
     * PATCH /auth/reset-password
     * @tag Auth
     * @summary reset the password.
     * @description reset the password.
     * @queryParam {string} token - the token that will be used to validate the link of reset password
     * @bodyContent {UpdatePasswordPayload} application/json
     * @bodyRequired
     * @response 204 - no content.
     * @response 401 - An object with the error when the email provided does not exists
     * @responseContent {ValidationError} 401.application/json
     * @responseExample {TokenInvalid} 400.application/json.TokenInvalid
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/auth/reset-password')
      .patch(
        ExpressRouteAdapter.adapt<IAuthController>(
          this.controller,
          'updateUserPassword',
        ),
      );
  }

  setupRoutes(app: Application): void {
    this.auth();
    this.me();
    this.generateAndSendLinkOfResetPassword();
    this.resetPassword();

    app.use(this.router);
  }
}
