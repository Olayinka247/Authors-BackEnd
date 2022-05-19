import express from "express";
import { getAuthorsReadableStream } from "../../lib/fs-tools.js";
import json2csv from "json2csv";
import { pipeline } from "stream";
import { getAuthors } from "../../lib/fs-tools.js";
import { getPDFReadableStream } from "../../lib/pdf-tools.js";

const authorDataRouter = express.Router();

// how to get csv files
authorDataRouter.get("/authorsCSV", async (req, res) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=authors.csv");

    const source = getAuthorsReadableStream();
    const destination = res;
    const transform = new json2csv.Transform({
      fields: ["id", "email", "name"],
    });
    pipeline(source, transform, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    console.log(error);
  }
});

authorDataRouter.get("/:authorId/pdf", async (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachments; filename=authors.pdf");
    const authors = await getAuthors();
    const foundauthor = authors.findIndex(
      (author) => author.id === req.params.authorId
    );
    if (foundauthor === -1) {
      throw new Error("Author not found");
    }
    const author = authors[foundauthor];
    const source = await getPDFReadableStream(author);

    const destination = res;

    pipeline(source, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    next(error);
  }
});

export default authorDataRouter;
