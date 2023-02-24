import { Router } from "express";

const userRouter = Router();

userRouter.get("/register", (req, res, next) => {
  res.status(200).json({});
});

export default userRouter;
