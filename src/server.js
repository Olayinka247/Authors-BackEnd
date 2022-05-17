import express from "express";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./apis/authors/index.js";
import blogPostsRouter from "./apis/blogPosts/index.js";
import cors from "cors";
import {
  genericHandleError,
  badRequestHandler,
  unauthorizedHandler,
  notFoundHandler,
} from "./handleErrors.js";

const server = express();

const port = process.env.PORT || 3001;

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL];

const corsOptions = {
  origin: (origin, next) => {
    console.log("CURRENT ORIGIN: ", origin);

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
