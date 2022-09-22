import express, { Application } from 'express';

import { ExpressRouteAdapter } from '../../adapters/express/ExpressRouteAdapter';
import { IRouter } from '../../interfaces/http';
import AuthMiddleware from '../../middlewares/AuthMiddleware';
import { createRoleController } from './factories';
import { IRoleController } from './interfaces';

export default class RoleRouter implements IRouter {
  private static instance: RoleRouter;

  private readonly router = express.Router();

  private constructor(private readonly controller: IRoleController) { }

  public static getInstance(
    controller: IRoleController = createRoleController(),
  ): RoleRouter {
    if (!this.instance) {
      this.instance = new RoleRouter(controller);
    }

    return this.instance;
  }

  private getAll(): void {
    /**
     * GET /roles
     * @tag Roles
     * @security apiKey
     * @summary get all the roles.
     * @description return a list of roles.
     * @response 200 - an array with the all the roles.
     * @responseContent {GetAllRolesResponse} 200.application/json
     * @responseExample {GetAllRolesResponse} 200.application/json.GetAllRolesResponse
     * @responseContent {BadRequestResponse} 400.application/json
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/roles')
      .get(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IRoleController>(this.controller, 'getAll'),
      );
  }

  private getById(): void {
    /**
     * GET /roles/{id}
     * @tag Roles
     * @security apiKey
     * @summary get a role by id.
     * @description return a role object.
     * @pathParam {int32} id id of the role
     * @response 200 - an object of role.
     * @responseContent {GetRoleByIdResponse} 200.application/json
     * @responseExample {GetRoleByIdResponse} 200.application/json.GetRoleByIdResponse
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
      .route('/roles/:id')
      .get(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IRoleController>(this.controller, 'getById'),
      );
  }

  private create(): void {
    /**
     * POST /roles
     * @tag Roles
     * @security apiKey
     * @summary create a new role.
     * @description return the created role object.
     * @bodyContent {CreateRolePayload} application/json
     * @bodyRequired
     * @response 201 - an object of role.
     * @responseContent {CreateRoleResponse} 201.application/json
     * @responseExample {CreateRoleResponse} 201.application/json.CreateRoleResponse
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent {BadRequestResponse} 400.application/json
     * @responseExample {CreateRoleBadRequestResponse} 400.application/json.CreateRoleBadRequestResponse
     * @response 401 - an object with unauthorized error details.
     * @responseContent {UnauthorizedResponse} 401.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/roles')
      .post(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IRoleController>(this.controller, 'create'),
      );
  }

  private updateById(): void {
    /**
     * PATCH /roles/{id}
     * @tag Roles
     * @security apiKey
     * @summary update a role.
     * @description return no content when successfully update the resource.
     * @pathParam {int32} id id of the role
     * @bodyContent {UpdateRolePayload} application/json
     * @bodyRequired
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
      .route('/roles/:id')
      .patch(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IRoleController>(
          this.controller,
          'updateById',
        ),
      );
  }

  private deleteById(): void {
    /**
     * DELETE /roles/{id}
     * @tag Roles
     * @security apiKey
     * @summary delete a role.
     * @description return no content when successfully delete the resource.
     * @pathParam {int32} id id of the role
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
      .route('/roles/:id')
      .delete(
        AuthMiddleware.authenticationMiddleware.bind(AuthMiddleware),
        ExpressRouteAdapter.adapt<IRoleController>(
          this.controller,
          'deleteById',
        ),
      );
  }

  setupRoutes(app: Application): void {
    this.create();
    this.getAll();
    this.getById();
    this.updateById();
    this.deleteById();

    app.use(this.router);
  }
}
