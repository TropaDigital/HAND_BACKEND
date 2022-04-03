import { Application } from 'express';

export interface IRouter {
  setupRoutes(app: Application): Promise<void> | void;
}
