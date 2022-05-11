import express from "express";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./apis/authors/index.js";
import blogPostsRouter from "./apis/blogPosts/index.js";
import cors from "cors";

const server = express();

const port = 3001;

server.use(cors());
server.use(express.json());

server.use("/authors", authorsRouter);
server.use("/blogPosts", blogPostsRouter);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`server is listening on port ${port} !`);
});
