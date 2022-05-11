import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const blogPostsRouter = express.Router();

const blogPostsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogPosts.json"
);

const getBlogPosts = () => JSON.parse(fs.readFileSync(blogPostsJSONPath));
const writeBlogPosts = (blogPostsArray) =>
  fs.writeFileSync(blogPostsJSONPath, JSON.stringify(blogPostsArray));

blogPostsRouter.post("/", (req, res) => {
  try {
    const newBlogPost = { ...req.body, id: uniqid(), createdAt: new Date() };
    const blogPosts = getBlogPosts();
    blogPosts.push(newBlogPost);
    writeBlogPosts(blogPosts);
    res.status(201).send({ id: newBlogPost.id });
  } catch (error) {}
});
blogPostsRouter.get("/", (req, res) => {
  try {
    const blogPosts = getBlogPosts();
    if (req.query && req.query.category) {
      const filteredBlogPosts = blogPosts.filter(
        (blogPost) => blogPost.category === req.query.category
      );
      res.send(filteredBlogPosts);
    } else {
      res.send(blogPosts);
    }
  } catch (error) {}
});
blogPostsRouter.get("/:blogPostId", (req, res) => {
  try {
    const blogPosts = getBlogPosts();
    const foundBlogPost = blogPosts.find(
      (blogPost) => blogPost.id === req.params.blogPostId
    );
    if (foundBlogPost) {
      res.send(foundBlogPost);
    } else {
    }
  } catch (error) {}
});
blogPostsRouter.put("/:blogPostId", (req, res) => {
  try {
    const blogPosts = getBlogPosts();

    const indexPost = blogPosts.findIndex(
      (blogPost) => blogPost.id === req.params.blogPostId
    );
    if (indexPost !== -1) {
      const oldBlogPost = blogPosts[indexPost];
      const updatedBlogPost = {
        ...oldBlogPost,
        ...req.body,
        updatedAt: new Date(),
      };
      blogPosts[indexPost] = updatedBlogPost;
      writeBlogPosts(blogPosts);
    } else {
    }
  } catch (error) {}
});
blogPostsRouter.delete("/:blogPostId", (req, res) => {
  try {
    const blogPosts = getBlogPosts();
    const remainingBlogPosts = blogPosts.filter(
      (blogPost) => blogPost.id !== req.params.blogPostId
    );
    writeBlogPosts(remainingBlogPosts);
    res.status(204).send();
  } catch (error) {}
});

export default blogPostsRouter;
