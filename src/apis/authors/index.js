import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const authorsRouter = express.Router();

const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);

const getAuthors = () => JSON.parse(fs.readFileSync(authorsJSONPath));
const writeAuthors = (authorsArray) =>
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));

authorsRouter.post("/", (req, res) => {
  try {
    const newAuthor = { ...req.body, id: uniqid(), createdAt: new Date() };
    const authors = getAuthors();
    authors.push(newAuthor);
    writeAuthors(authors);
    res.send(201).send({ id: newAuthor.id });
  } catch (error) {
    console.log("error");
  }
});

authorsRouter.get("/", (req, res) => {
  try {
    const authors = getAuthors();
    if (req.query && req.query.category) {
      const filteredAuthors = authors.filter(
        (author) => author.category === req.query.category
      );
      res.send(filteredAuthors);
    } else {
      res.send(authors);
    }
  } catch (error) {
    console.log("error");
  }
});

authorsRouter.get("/:authorId", (req, res) => {
  try {
    const authors = getAuthors();
    const foundAuthor = authors.find(
      (author) => author.id === req.params.authorId
    );
    if (foundAuthor) {
      res.send(foundAuthor);
    } else {
    }
  } catch (error) {
    console.log("error");
  }
});

authorsRouter.put("/:authorId", (req, res) => {
  try {
    const authors = getAuthors();
    const index = authors.findIndex(
      (author) => author.id === req.params.authorId
    );
    const oldAuthor = authors[index];
    const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() };
    authors[index] = updatedAuthor;
    writeAuthors(authors);
    res.send(updatedAuthor);
  } catch (error) {
    console.log("error");
  }
});

authorsRouter.delete("/:authorId", (req, res) => {
  try {
    const authors = getAuthors();
    const remainingAuthors = authors.filter(
      (author) => author.id !== req.params.authorId
    );
    writeAuthors(remainingAuthors);
    res.status(204).send();
  } catch (error) {
    console.log("error");
  }
});

export default authorsRouter;
