import { type NextFunction, type Request, type Response } from "express";
import bcryptjs from "bcryptjs";
import User from "../../database/models/User.js";
import { CustomError } from "../../CustomError.ts/CustomError.js";

export const registerUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserDataStructure
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password, email } = req.body;

    const hashedPassword = await bcryptjs.hash(password, 8);

    const avatar = req.file?.filename;

    await User.create({
      username,
      password: hashedPassword,
      avatar,
      email,
    });

    const message = "User registered successfully";

    res.status(201).json({ username, message });
  } catch (error) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Couldn't register the user"
    );

    next(customError);
  }
};
