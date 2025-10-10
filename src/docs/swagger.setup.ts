import type { Express } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from '@docs/swagger.config.js';
import { SERVER_ENVIRONMENTS } from '@constants/common/server.js';
import { CONFIG } from '@config/index.js';
import { logger } from '@config/logger.js';

const swaggerUiOptions: swaggerUi.SwaggerUiOptions = {
  explorer: true,
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info { margin: 20px 0; }
    .swagger-ui .scheme-container { padding: 20px 0; }
  `,
  customSiteTitle: 'Verticals Next Generations Node Back API Docs',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    syntaxHighlight: {
      theme: 'monokai',
    },
  },
};

export const setupSwagger = (app: Express): void => {
  const swaggerSpec = swaggerJSDoc(swaggerOptions);

  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

  if (CONFIG.NODE_ENV === SERVER_ENVIRONMENTS.DEVELOPMENT) {
    logger.info('📚 Swagger docs available at: http://localhost:3000/api-docs');
  }
};
