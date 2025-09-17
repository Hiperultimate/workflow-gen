import "dotenv/config";
import cors from "cors";
import express from "express";
import authRoutes from "./routers/authRoutes";
import cookieParser from "cookie-parser";
import credentialRoutes from "./routers/credentialRoutes";
import workflowRoutes from "./routers/workflowRoutes";
import { prisma } from "@workflow-gen/db";
import { Methods } from "@workflow-gen/db";

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

app.all("/webhook/:id", async (req, res) => {
  const { id : webhookId } = req.params;
  const method = req.method as Methods;

  // Log the request method and ID
  console.log(`Received ${method} request for /webhook/${webhookId}`);

  const webhookRecord = await prisma.webhook.findUnique({ where: { id: webhookId , method : method}, include: {workflow : true} });

  if (!webhookRecord) {
    return res.status(400).send({ message: "Invalid webhook id. Workflow not found." });
  }

  const workflowData = webhookRecord.workflow;

  console.log("Checking out workflow data : ", workflowData);


  res.status(200).send({ message: "Recieved webhook request, initiating..." });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
