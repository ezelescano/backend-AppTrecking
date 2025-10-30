// src/server.ts
import express from "express";
import router from "./routes";
const morgan = require( "morgan");
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { OpenAPIV3 } from "openapi-types";
import cors from "cors";



const server = express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AppTracking",
      version: "1.0.0",
    },
  },
  apis: [
    "./src/routes/*.ts",
    "./src/swagger/*.ts",
  ],
};




const swaggerSpec = swaggerJsdoc(options) as OpenAPIV3.Document;
console.log("Swagger loaded schemas:", Object.keys(swaggerSpec.components?.schemas || {}));

server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middlewares y rutas

server.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));
server.use(morgan("dev"));
server.use(express.json());
server.use("/", router);

export default server;

