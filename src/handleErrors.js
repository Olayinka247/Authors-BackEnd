export const badRequestHandler = (err, req, res, next) => {
  if (err.status === 400) {
    res.status(400).send(err);
  } else {
    next(err);
  }
};

export const unauthorizedHandler = (err, req, res, next) => {
  if (err.status === 401) {
    res.status(401).send({ status: "error", message: err.message });
  } else {
    next(err);
  }
};

export const notFoundHandler = (err, req, res, next) => {
  if (err.status === 404) {
    res.status(404).send({ status: "error", message: err.message });
  } else {
    next(err);
  }
};

export const genericHandleError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({
    message: "Internal Server Error ! Will be fixed soon check back in a bit !",
  });
};
