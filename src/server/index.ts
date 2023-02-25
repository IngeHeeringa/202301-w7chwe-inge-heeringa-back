import express from "express";
import morgan from "morgan";
import cors from "cors";
import userRouter from "./routers/usersRouter.js";
import {
  generalError,
  notFoundError,
} from "./middlewares/errorMiddlewares/errorMiddlewares.js";

export const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));

app.use(cors());

app.use(express.json());

app.get("/", (req, res, next) =>
  res
    .status(200)
    .json({ message: "Under construction, please come back later" })
);

app.use("/users", userRouter);

app.use(notFoundError);
app.use(generalError);
