import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import { swaggerSpec } from "./config/swagger.js";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "TechStore API Docs",
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
);

app.get("/api-docs.json", (_req, res) => {
  res.json(swaggerSpec);
});

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
