import express from "express";
import uniqid from "uniqid";
import multer from "multer";
import createError from "http-errors";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { pipeline } from "stream";

import { getAuthors, writeAuthors } from "../../lib/fs-tools.js";
import { getAuthorsPDFReadableStream } from "../../lib/pdf-tools.js";

const authorsRouter = express.Router();

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "strive/authors",
    },
  }),
  fileFilter: (req, file, multerNext) => {
    if (file.mimetype !== "image/jpeg") {
      multerNext(createError(400, "Only jpeg allowed!"));
    } else {
      multerNext(null, true);
    }
  },
  limits: { fileSize: 1 * 1024 * 1024 }, // file size
}).single("avatar");

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = { ...req.body, id: uniqid(), createdAt: new Date() };
    const authors = await getAuthors();
    authors.push(newAuthor);
    await writeAuthors(authors);
    res.send(201).send({ id: newAuthor.id });
  } catch (error) {
    next("error");
  }
});

authorsRouter.get("/", async (req, res) => {
  try {
    const authors = await getAuthors();
    res.send(authors);
  } catch (error) {
    console.log("error");
  }
});

authorsRouter.get("/:authorId", async (req, res) => {
  try {
    const authors = await getAuthors();
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

authorsRouter.put("/:authorId", async (req, res) => {
  try {
    const authors = await getAuthors();
    const index = authors.findIndex(
      (author) => author.id === req.params.authorId
    );
    const oldAuthor = authors[index];
    const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() };
    authors[index] = updatedAuthor;
    await writeAuthors(authors);
    res.send(updatedAuthor);
  } catch (error) {
    console.log("error");
  }
});

authorsRouter.delete("/:authorId", async (req, res) => {
  try {
    const authors = await getAuthors();
    const remainingAuthors = authors.filter(
      (author) => author.id !== req.params.authorId
    );
    await writeAuthors(remainingAuthors);
    res.status(204).send();
  } catch (error) {
    console.log("error");
  }
});

//***********POST IMAGE AVATAR ************* */
authorsRouter.post(
  "/:authorId/avatar",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      console.log("FILE: ", req.file);
      res.send();
    } catch (error) {
      next("error");
    }
  }
);

authorsRouter.get("/:authorId/pdf", async (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachments; filename=authors.pdf");
    const authors = await getAuthors();

    const findauthor = authors.findIndex(
      (author) => author.id === req.params.authorId
    );
    if (findauthor === -1) {
      throw new Error("Author not found");
    }
    const author = authors[findauthor];
    const source = getAuthorsPDFReadableStream(author);
    const destination = res;
    pipeline(source, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
