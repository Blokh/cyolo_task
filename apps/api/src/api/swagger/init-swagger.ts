import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, type SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';

const SWAGGER_PATH = 'docs';

const SWAGGER_DOCUMENT_OPTIONS = new DocumentBuilder()
  .setTitle('Cyolo Image System')
  .setDescription('Cyolo Image Caching System')
  .setVersion('1.0')
  .build();

export const SWAGGER_SETUP_OPTIONS = {
  customCssUrl: './swagger.css',
  customfavIcon: './favicon.png',
  customSiteTitle: 'Cyolo Image System',
} satisfies SwaggerCustomOptions;

export const initSwagger = (app: INestApplication) => {
  const document = SwaggerModule.createDocument(app, SWAGGER_DOCUMENT_OPTIONS);
  SwaggerModule.setup(SWAGGER_PATH, app, document, SWAGGER_SETUP_OPTIONS);
};
