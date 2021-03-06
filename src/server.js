import express from "express";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./apis/authors/index.js";
import blogPostsRouter from "./apis/blogPosts/index.js";
import authorDataRouter from "./apis/authors/authorData.js";
import cors from "cors";
import { join } from "path";
import {
  genericHandleError,
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
} from "./handleErrors.js";
import swaggerUIExpress from "swagger-ui-express";
import yaml from "yamljs";

const server = express();

const port = process.env.PORT || 3001;

const yamlDocument = yaml.load(
  join(process.cwd(), "./src/doc/apiDefinition.yml")
);
console.log("I AM YML ", yamlDocument);

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOptions = {
  origin: (origin, next) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      next(null, true);
    } else {
      next(
        createError(
          400,
          `Cors Error! your origin ${origin} is not in the list!`
        )
      );
    }
  },
};

server.use(cors(corsOptions));
server.use(express.json());

server.use("/authors", authorsRouter);
server.use("/blogPosts", blogPostsRouter);
server.use("/authorData", authorDataRouter);
server.use(
  "/doc",
  swaggerUIExpress.serve,
  swaggerUIExpress.setup(yamlDocument)
);

// *****************Error Handlers*****************
server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericHandleError);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`server is listening on port ${port} !`);
});

server.on("error", (erorr) => {
  console.log("ERror", error);
});
