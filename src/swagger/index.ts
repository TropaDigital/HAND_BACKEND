import { OpenApiObject } from 'openapi-comment-parser';

import { associatedExamples, associatedSchemas } from './associated';
import { authExamples, authSchemas } from './auth';
import { consultantExamples, consultantSchemas } from './consultant';
import { healthcheckExamples, healthcheckSchemas } from './healthcheck';
import {
  loanSimulationExamples,
  loanSimulationSchemas,
} from './loanSimulation';
import { securitySchemas, sharedSchemas } from './shared';

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
      name: 'Consultants',
      description:
        'Consultant endpoints that contains all the operations of the consultants',
    },
    {
      name: 'LoanSimulations',
      description:
        'Loan Simulation endpoints that contains all the operations of the loan simulations',
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
    },
    schemas: {
      ...sharedSchemas,
      ...healthcheckSchemas,
      ...loanSimulationSchemas,
      ...consultantSchemas,
      ...authSchemas,
      ...associatedSchemas,
    },
  },
} as OpenApiObject;
