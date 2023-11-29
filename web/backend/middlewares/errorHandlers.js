import dotenv from "dotenv";
dotenv.config({});

export const notFound = async (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = async (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    error: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
