import { OpenApiObject } from 'openapi-comment-parser';

import { associatedExamples, associatedSchemas } from './associated';
import { authExamples, authSchemas } from './auth';
import { consultantExamples, consultantSchemas } from './consultant';
import { healthcheckExamples, healthcheckSchemas } from './healthcheck';
import {
  loanSimulationExamples,
  loanSimulationSchemas,
} from './loanSimulation';
import { roleExamples, roleSchemas } from './role';
import { securitySchemas, sharedSchemas } from './shared';
import { userExamples, userSchemas } from './user';

export default {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'haand-bib Web Service',
    description: 'haand-bib is webservice to provide features to haand-bib.',
    contact: { email: 'brunohafonso@gmail.com' },
  },
  servers: [
    // {
    //   url: 'https://haand-bib-backend.herokuapp.com/',
    //   description: 'Homolog server',
    // },
    { url: 'http://localhost:3001/', description: 'Local server' },
  ],
  tags: [
    {
      name: 'Healthcheck',
      description:
        'Healthcheck endpoints that contains all the operations of the healthcheck',
    },
    {
      name: 'Auth',
      description:
        'Auth endpoints that contains all the operations of the auth',
    },
    {
      name: 'Users',
      description:
        'Users endpoints that contains all the operations of the users',
    },
    {
      name: 'Consultants',
      description:
        'Consultant endpoints that contains all the operations of the consultants',
    },
    {
      name: 'LoanSimulations',
      description:
        'Loan Simulation endpoints that contains all the operations of the loan simulations',
    },
    {
      name: 'Roles',
      description:
        'Roles endpoints that contains all the operations of the roles',
    },
  ],
  components: {
    securitySchemes: {
      ...securitySchemas,
    },
    examples: {
      ...healthcheckExamples,
      ...loanSimulationExamples,
      ...consultantExamples,
      ...authExamples,
      ...associatedExamples,
      ...roleExamples,
      ...userExamples,
    },
    schemas: {
      ...sharedSchemas,
      ...healthcheckSchemas,
      ...loanSimulationSchemas,
      ...consultantSchemas,
      ...authSchemas,
      ...associatedSchemas,
      ...roleSchemas,
      ...userSchemas,
    },
  },
} as OpenApiObject;
