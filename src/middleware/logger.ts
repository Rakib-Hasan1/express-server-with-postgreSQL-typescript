import { NextFunction, Request, Response } from "express";

// logger middleware
const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(
    `${new Date().toISOString()} Method: ${req.method} Path: ${req.path} \n`
  );
  next();
};

export default logger;