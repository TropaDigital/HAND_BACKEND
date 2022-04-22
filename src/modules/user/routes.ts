import express, { Application } from 'express';

import { ExpressRouteAdapter } from '../../adapters/express/ExpressRouteAdapter';
import { IRouter } from '../../interfaces/http';
import { createUserController } from './factories';
import { IUserController } from './interfaces';

export default class UserRouter implements IRouter {
  private static instance: UserRouter;

  private readonly router = express.Router();

  private constructor(private readonly controller: IUserController) {}

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
     * @description return a list of users.
     * @response 200 - an array with the all the users.
     * @responseContent { UserResponse[]} 200.application/json
     * @responseExample { UserResponse[]} 200.application/json.UserResponse
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/users')
      .get(
        ExpressRouteAdapter.adapt<IUserController>(this.controller, 'getAll'),
      );
  }

  private getByEmail(): void {
    /**
     * GET /users/{email}
     * @tag Users
     * @summary get a user by email.
     * @description return a user object.
     * @pathParam {int32} id id of the user
     * @response 200 - an object of user.
     * @responseContent { UserResponse} 200.application/json
     * @responseExample { UserResponse} 200.application/json.UserResponse
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent { UserBadRequestResponse} 400.application/json
     * @response 404 - An object with the error when the the resource is not found
     * @responseContent { UserNotFoundResponse} 404.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/users/:email')
      .get(
        ExpressRouteAdapter.adapt<IUserController>(
          this.controller,
          'getByEmail',
        ),
      );
  }

  private create(): void {
    /**
     * POST /users
     * @tag Users
     * @summary create a new user.
     * @description return the created user object.
     * @bodyContent {CreateUserPayload} application/json
     * @bodyRequired
     * @response 201 - an object of user.
     * @responseContent {CreateUserResponse} 201.application/json
     * @responseExample {CreateUserResponse} 200.application/json.CreateUserResponse
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent { UserBadRequestResponse} 400.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/users')
      .post(
        ExpressRouteAdapter.adapt<IUserController>(this.controller, 'create'),
      );
  }

  private updateById(): void {
    /**
     * PATCH /users
     * @tag Users
     * @summary update a user.
     * @description return no content when successfully update the resource.
     * @pathParam {int32} id id of the user
     * @bodyContent {UpdateUserPayload} application/json
     * @bodyRequired
     * @response 204 - no content
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent { UserBadRequestResponse} 400.application/json
     * @response 404 - An object with the error when the the resource is not found
     * @responseContent { UserNotFoundResponse} 404.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/users/:id')
      .patch(
        ExpressRouteAdapter.adapt<IUserController>(
          this.controller,
          'updateById',
        ),
      );
  }

  private deleteById(): void {
    /**
     * DELETE /users
     * @tag Users
     * @summary create a user.
     * @description return no content when successfully delete the resource.
     * @pathParam {int32} id id of the user
     * @bodyContent {UpdateUserPayload} application/json
     * @bodyRequired
     * @response 204 - no content
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent { UserBadRequestResponse} 400.application/json
     * @response 404 - An object with the error when the the resource is not found
     * @responseContent { UserNotFoundResponse} 404.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/users/:id')
      .delete(
        ExpressRouteAdapter.adapt<IUserController>(
          this.controller,
          'deleteById',
        ),
      );
  }

  setupRoutes(app: Application): void {
    this.create();
    this.getAll();
    this.getByEmail();
    this.updateById();
    this.deleteById();

    app.use(this.router);
  }
}
