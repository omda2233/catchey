import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Catchy Fabric Market API',
    version: '1.0.0',
    description: 'API documentation for the Catchy Fabric Market backend.',
  },
  servers: [
    {
      url: 'http://localhost:8080',
      description: 'Local development server',
    },
    {
        url: 'https://catchey-copy-copy-production.up.railway.app',
        description: 'Production server'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;