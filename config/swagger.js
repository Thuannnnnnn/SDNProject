import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Swagger Express API",
      version: "1.0.0",
      description: "A simple Express API with Swagger documentation",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Format của token, thường là JWT
        },
      },
      schemas: {
        Users: {
          // Định nghĩa schema cho User
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "User ID",
            },
            name: {
              type: "string",
              description: "User's name",
            },
            email: {
              type: "string",
              description: "User's email address",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Account creation timestamp",
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Bảo mật bằng Bearer Token cho tất cả các routes
      },
    ],
  },
  apis: ["./router/*.js"], // Đường dẫn tới file định nghĩa các routes
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };
