import express from "express";
import { getAuthorsReadableStream } from "../../lib/fs-tools.js";
import json2csv from "json2csv";
import { pipeline } from "stream";

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

export default authorDataRouter;
