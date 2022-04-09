module.exports = function plopFunction(plop) {
  plop.setGenerator('module', {
    description: 'create new module structure',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Module name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: '../src/modules/{{lowerCase name}}/index.ts',
        templateFile: 'templates/index.ts.hbs',
      },
      {
        type: 'add',
        path: '../src/modules/{{lowerCase name}}/routes.ts',
        templateFile: 'templates/routes.ts.hbs',
      },
      {
        type: 'add',
        path: '../src/modules/{{lowerCase name}}/interfaces.ts',
        templateFile: 'templates/interfaces.ts.hbs',
      },
      {
        type: 'add',
        path: '../src/modules/{{lowerCase name}}/repository.ts',
        templateFile: 'templates/repository.ts.hbs',
      },
      {
        type: 'add',
        path: '../src/modules/{{lowerCase name}}/schemas.ts',
        templateFile: 'templates/schemas.ts.hbs',
      },
      {
        type: 'add',
        path: '../src/modules/{{lowerCase name}}/controller.ts',
        templateFile: 'templates/controller.ts.hbs',
      },
      {
        type: 'add',
        path: '../src/modules/{{lowerCase name}}/factories.ts',
        templateFile: 'templates/factories.ts.hbs',
      },
      {
        type: 'add',
        path: '../src/modules/{{lowerCase name}}/service.ts',
        templateFile: 'templates/service.ts.hbs',
      },
      {
        type: 'add',
        path: '../src/modules/{{lowerCase name}}/__tests__/service.spec.ts',
        templateFile: 'templates/service.spec.ts.hbs',
      },
      {
        type: 'add',
        path: '../src/modules/{{lowerCase name}}/__tests__/controller.spec.ts',
        templateFile: 'templates/controller.spec.ts.hbs',
      },
      {
        type: 'add',
        path: '../src/modules/{{lowerCase name}}/__tests__/factory.spec.ts',
        templateFile: 'templates/factory.spec.ts.hbs',
      },
      {
        type: 'add',
        path: '../src/modules/{{lowerCase name}}/__tests__/schemas.spec.ts',
        templateFile: 'templates/schemas.spec.ts.hbs',
      },
      {
        type: 'add',
        path: '../src/modules/{{lowerCase name}}/__tests__/repository.spec.ts',
        templateFile: 'templates/repository.spec.ts.hbs',
      },
      {
        type: 'add',
        path: '../src/modules/{{lowerCase name}}/__tests__/helpers/test-helper.ts',
        templateFile: 'templates/test-helper.ts.hbs',
      },
    ],
  });
};
