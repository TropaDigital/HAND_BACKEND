import express, { Application } from 'express';

import { ExpressRouteAdapter } from '../../adapters/express/ExpressRouteAdapter';
import { IRouter } from '../../interfaces/http';
import { createRoleController } from './factories';
import { IRoleController } from './interfaces';

export default class RoleRouter implements IRouter {
  private static instance: RoleRouter;

  private readonly router = express.Router();

  private constructor(private readonly controller: IRoleController) {}

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
     * @summary get all the roles.
     * @description return a list of roles.
     * @response 200 - an array with the all the roles.
     * @responseContent { RoleResponse[]} 200.application/json
     * @responseExample { RoleResponse[]} 200.application/json.RoleResponse
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/roles')
      .get(
        ExpressRouteAdapter.adapt<IRoleController>(this.controller, 'getAll'),
      );
  }

  private getById(): void {
    /**
     * GET /roles/{id}
     * @tag Roles
     * @summary get a role by id.
     * @description return a role object.
     * @pathParam {int32} id id of the role
     * @response 200 - an object of role.
     * @responseContent { RoleResponse} 200.application/json
     * @responseExample { RoleResponse} 200.application/json.RoleResponse
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent { RoleBadRequestResponse} 400.application/json
     * @response 404 - An object with the error when the the resource is not found
     * @responseContent { RoleNotFoundResponse} 404.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/roles/:id')
      .get(
        ExpressRouteAdapter.adapt<IRoleController>(this.controller, 'getById'),
      );
  }

  private create(): void {
    /**
     * POST /roles
     * @tag Roles
     * @summary create a new role.
     * @description return the created role object.
     * @bodyContent {CreateRolePayload} application/json
     * @bodyRequired
     * @response 201 - an object of role.
     * @responseContent {CreateRoleResponse} 201.application/json
     * @responseExample {CreateRoleResponse} 200.application/json.CreateRoleResponse
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent { RoleBadRequestResponse} 400.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/roles')
      .post(
        ExpressRouteAdapter.adapt<IRoleController>(this.controller, 'create'),
      );
  }

  private updateById(): void {
    /**
     * PATCH /roles
     * @tag Roles
     * @summary update a role.
     * @description return no content when successfully update the resource.
     * @pathParam {int32} id id of the role
     * @bodyContent {UpdateRolePayload} application/json
     * @bodyRequired
     * @response 204 - no content
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent { RoleBadRequestResponse} 400.application/json
     * @response 404 - An object with the error when the the resource is not found
     * @responseContent { RoleNotFoundResponse} 404.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/roles/:id')
      .patch(
        ExpressRouteAdapter.adapt<IRoleController>(
          this.controller,
          'updateById',
        ),
      );
  }

  private deleteById(): void {
    /**
     * DELETE /roles
     * @tag Roles
     * @summary create a role.
     * @description return no content when successfully delete the resource.
     * @pathParam {int32} id id of the role
     * @bodyContent {UpdateRolePayload} application/json
     * @bodyRequired
     * @response 204 - no content
     * @response 400 - An object with the error when the payload provided is invalid
     * @responseContent { RoleBadRequestResponse} 400.application/json
     * @response 404 - An object with the error when the the resource is not found
     * @responseContent { RoleNotFoundResponse} 404.application/json
     * @response 500 - an object with internal server error details.
     * @responseContent {InternalServerErrorResponse} 500.application/json
     */
    this.router
      .route('/roles/:id')
      .delete(
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
