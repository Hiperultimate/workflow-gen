import { Router } from "express";
import { reqSignUp } from "@/utils/schemas/authSchema";
import prisma from "@/db";
import { compare, hash } from "bcrypt";
import env from "@/utils/env";
import jwt from "jsonwebtoken";

const authRoutes = Router();

const saltRounds = 5;

authRoutes.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const validate = reqSignUp.safeParse({ email, password });
  if (!validate.success) {
    return res
      .status(400)
      .json({ message: "Invalid email or password entered" });
  }

  const enteredCreds = validate.data;

  const checkRecord = await prisma.user.findUnique({
    where: { email: enteredCreds.email },
  });
  if (checkRecord) {
    return res.status(400).json({ message: "Email already taken" });
  }

  const hashPassword = await hash(enteredCreds.password, saltRounds);

  try {
    const createUser = await prisma.user.create({
      data: { email: email, password: hashPassword },
      select: { email: true },
    });
    return res
      .status(200)
      .json({ message: "User registered succesfully!", email: createUser });
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong..." });
  }
});

authRoutes.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const validate = reqSignUp.safeParse({ email, password });
  if (!validate.success) {
    return res
      .status(400)
      .json({ message: "Invalid email or password entered" });
  }

  const enteredCreds = validate.data;

  const checkUserRecord = await prisma.user.findUnique({
    where: { email: enteredCreds.email },
  });

  if (!checkUserRecord) {
    return res
      .status(400)
      .json({ message: "User not found, please enter valid details" });
  }

  const isPasswordValid = await compare(
    enteredCreds.password,
    checkUserRecord.password
  );
  if (!isPasswordValid)
    return res.status(400).json({ message: "Invalid password" });

  const expireTime = 60 * 60 * 24;
  const auth_token = jwt.sign(checkUserRecord, env.JWT_KEY, {
    expiresIn: expireTime,
  });
  res.cookie("auth_token", auth_token, { httpOnly: false, maxAge: expireTime });
  return res.status(200).json({ message: "Signed in succesfully" });
});

export default authRoutes;
