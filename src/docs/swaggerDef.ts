import config from "../config/config";

interface SwaggerDefinition {
  openapi: string;
  info: {
    title: string;
    version: string;
    license: {
      name: string;
      url: string;
    };
  };
  servers: Array<{
    url: string;
  }>;
}

const swaggerDef: SwaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Timesheet management",
    version: "1.0",
    license: {
      name: "MIT",
      url: "",
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
};

export default swaggerDef;
