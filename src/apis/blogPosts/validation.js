import { checkSchema, validationResult } from "express-validator";
import createError from "http-errors";

const blogPostsSchema = {
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title is a mandatory field and needs to be a string!",
    },
  },

  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is a mandatory field and should be a string!",
    },
  },

  cover: {
    in: ["body"],
    isString: {
      errorMessage: "Cover is a mandatory field and should be in URL!",
    },
  },
  " readTime.value": {
    in: ["body"],
    isInt: {
      errorMessage: "Value is a mandatory field and must be in unit",
    },
  },

  "readTime.unit": {
    in: ["body"],
    isString: {
      errorMessage: "Unit is a mandatory field and must be a string",
    },
  },

  content: {
    in: ["body"],
    isString: {
      errorMessage: "Content is a mandatory field and needs to be a string!",
    },
  },
  "author.name": {
    in: ["body"],
    isString: {
      errorMessage: "Name is a mandatory field and needs to be a string!",
    },

    "author.avatar": {
      in: ["body"],
      isString: {
        errorMessage: "Avatar is a mandatory field and needs to be in URL!",
      },
    },
  },
};

export const checkblogPostsSchema = checkSchema(blogPostsSchema);

export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(
      createError(400, "Validation errors!", { errorsList: errors.array() })
    );
  } else {
    next();
  }
};
