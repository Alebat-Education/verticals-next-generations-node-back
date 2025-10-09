import type { Options } from 'swagger-jsdoc';

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Verticals Next Generations Node Back API',
      version: '1.0.0',
      description: 'Modern REST API built with Node.js, TypeScript, Express and TypeORM',
    },
    tags: [
      {
        name: 'Health',
        description: 'Health and server status endpoints',
      },
      {
        name: 'Products',
        description: 'Product management',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token in format: Bearer {token}',
        },
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API Key for authentication',
        },
      },
      responses: {
        BadRequest: {
          description: 'Bad request - Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidationError',
              },
            },
          },
        },
        Unauthorized: {
          description: 'Unauthorized - Invalid or missing token',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Unauthorized',
                error: 'Invalid or expired JWT token',
                code: 'UNAUTHORIZED',
              },
            },
          },
        },
        Forbidden: {
          description: 'Forbidden - Insufficient permissions',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        NotFound: {
          description: 'Not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Resource not found',
                code: 'NOT_FOUND',
              },
            },
          },
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Internal server error',
                error: 'An unexpected error occurred',
                code: 'INTERNAL_ERROR',
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  // Paths where to look for JSDoc annotations to document
  apis: ['./src/api/**/*.ts', './src/app.ts'],
};
