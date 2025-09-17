import "dotenv/config";
import cors from "cors";
import express from "express";
import authRoutes from "./routers/authRoutes";
import cookieParser from "cookie-parser";
import credentialRoutes from "./routers/credentialRoutes";
import workflowRoutes from "./routers/workflowRoutes";
import webhookRoutes from "./routers/webhookRoutes";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "",
    methods: ["GET", "POST", "OPTIONS", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/workflow", workflowRoutes);
app.use("/credential", credentialRoutes);

app.get("/health-check", (_req, res) => {
  res.status(200).send("Server healthy...");
});

app.use("/webhook", webhookRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
