import express from "express";
import morgan from "morgan";
import cors from "cors";
import userRouter from "../routers/usersRouter.js";

export const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));

app.use(cors());

app.use(express.json());

app.use("/users", userRouter);
