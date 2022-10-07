import express, { Application } from 'express';

import { ExpressRouteAdapter } from '../../adapters/express/ExpressRouteAdapter';
import { IRouter } from '../../interfaces/http';
import { authMiddleware } from '../../middlewares';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { createUserController } from './factories';
import { IUserController } from './interfaces';

export default class UserRouter implements IRouter {
  private static instance: UserRouter;

  private readonly router = express.Router();

  private constructor(private readonly controller: IUserController) { }

  public static getInstance(
    controller: IUserController = createUserController(),
  ): UserRouter {
    if (!this.instance) {
      this.instance = new UserRouter(controller);
    }

    return this.instance;
  }

  private getAll(): void {
    /**
     * GET /users
     * @tag Users
     * @summary get all the users.
     * @security apiKey
     * @description return a list of users.
     * @response 200 - an array with the all the users.
     * @responseContent {GetAllUsersResponse} 200.application/json
     * @responseExample {GetAllUsersResponse} 200.application/json.GetAllUsersResponse
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/users')
      .get(
        authMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IUserController>(this.controller, 'getAll'),
      );
  }

  private getByUserName(): void {
    /**
     * GET /users/{userName}
     * @tag Users
     * @summary get a user by userName.
     * @security apiKey
     * @description return a user object.
     * @pathParam {string} userName the name of the user
     * @response 200 - an object of user.
     * @responseContent {GetUserByUsernameResponse} 200.application/json
     * @responseExample {GetUserByUsernameResponse} 200.application/json.GetUserByUsernameResponse
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent {BadRequestResponse} 400.application/json
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
     * @response 404 - An object with the error when the the resource is not found
     * @responseContent {NotFoundResponse} 404.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/users/:userName')
      .get(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IUserController>(
          this.controller,
          'getByUserName',
        ),
      );
  }

  private create(): void {
    /**
     * POST /users
     * @tag Users
     * @summary creates a new user.
     * @security apiKey
     * @description return the created user object.
     * @bodyContent {CreateUserPayload} application/json
     * @bodyRequired
     * @response 201 - an object of user.
     * @responseContent {CreateUserResponse} 201.application/json
     * @responseExample {CreateUserResponse} 201.application/json.CreateUserResponse
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent {BadRequestResponse} 400.application/json
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
     * @response 409 - an object with conflict error details.
     * @responseContent {ConflictResponse} 409.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/users')
      .post(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IUserController>(this.controller, 'create'),
      );
  }

  private updateById(): void {
    /**
     * PATCH /users/{id}
     * @tag Users
     * @summary update an user.
     * @security apiKey
     * @description return no content when successfully update the resource.
     * @pathParam {int32} id id of the user
     * @bodyContent {UpdateUserByIdPayload} application/json
     * @bodyRequired
     * @response 204 - no content
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent {BadRequestResponse} 400.application/json
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
     * @response 404 - An object with the error when the the resource is not found
     * @responseContent {NotFoundResponse} 404.application/json
     * @response 409 - an object with conflict error details.
     * @responseContent {ConflictResponse} 409.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/users/:id')
      .patch(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IUserController>(
          this.controller,
          'updateById',
        ),
      );
  }

  private deleteById(): void {
    /**
     * DELETE /users/{id}
     * @tag Users
     * @summary deletes an user.
     * @security apiKey
     * @description return no content when successfully delete the resource.
     * @pathParam {int32} id id of the user
     * @response 204 - no content
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent {BadRequestResponse} 400.application/json
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
     * @response 404 - An object with the error when the the resource is not found
     * @responseContent {NotFoundResponse} 404.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/users/:id')
      .delete(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IUserController>(
          this.controller,
          'deleteById',
        ),
      );
  }

  setupRoutes(app: Application): void {
    this.create();
    this.getAll();
    this.getByUserName();
    this.updateById();
    this.deleteById();

    app.use(this.router);
  }
}
