import prisma from "@/db";
import { auth } from "@/middleware/auth";
import { validWebHook } from "@/utils/schemas/webhookSchema";
import type { InputJsonValue } from "@prisma/client/runtime/library";
import { Router } from "express";
import z from "zod";

const workflowRoutes = Router();

workflowRoutes.post("/", auth, async (req, res) => {
  const user = req.user;
  const { workflowTitle } = req.body;

  const validateWorkFlowTitle = z.string().min(1).safeParse(workflowTitle);

  if (!validateWorkFlowTitle.success || !user) {
    return res.status(400).send({ message: "Invalid title" });
  }

  const validTitle = validateWorkFlowTitle.data;

  console.log("Checking user ID ; ", user?.id, validTitle);
  const createWorkflow = await prisma.workflow.create({
    data: {
      title: validTitle,
      // userId: user.id,
      User: {
        connect: {
          id: user?.id,
        },
      },
    },
  });

  return res
    .status(200)
    .send({ message: "Workflow successfully created", id: createWorkflow.id });
});

workflowRoutes.get("/", auth, async (req, res) => {
  // get all workflow from the current user
  const user = req.user;
  try {
    const allUserWorkflows = await prisma.workflow.findMany({
      where: {
        userId: user?.id,
      },
      select: {
        id: true,
        title: true,
        enabled: true,
        nodes: true,
        connections: true,
      },
    });

    return res.status(200).send({ workflows: allUserWorkflows });
  } catch (error) {
    return res.status(400).send({ message: "User does not exist" });
  }
});

workflowRoutes.get("/:id", auth, async (req, res) => {
  // get specific workflow from a user
  const retrieveWorkflowId = req.params.id;
  try {
    const workflow = await prisma.workflow.findUnique({
      where: {
        id: retrieveWorkflowId,
      },
      select: {
        id: true,
        title: true,
        enabled: true,
        nodes: true,
        connections: true,
      },
    });

    return res.status(200).send({ workflow });
  } catch (error) {
    return res.status(400).send({
      message: `Unable to find workflow with id : ${retrieveWorkflowId}`,
    });
  }
});

workflowRoutes.put("/:id", auth, async (req, res) => {
  const workflowId = req.params.id;
  const { title, enabled, nodes, connections, webhooks } = req.body;

  const validateWebhooks = z.array(validWebHook).safeParse(webhooks);
  if (!validateWebhooks.success) {
    return res.status(400).send({ message: "Invalid webhook data provided" });
  }

  const newWebhooks = validateWebhooks.data;

  const existingWorkflow = await prisma.workflow.findUnique({
    where: { id: workflowId },
    include: { webhook: true },
  });

  if (!existingWorkflow) {
    return res.status(404).send({ message: "Workflow not found" });
  }

  const transaction = await prisma.$transaction(async (prisma) => {
    // Delete all existing webhooks associated with the workflow
    await prisma.webhook.deleteMany({
      where: { workflowId: workflowId },
    });

    const createdWebhooks = await prisma.webhook.createMany({
      data: newWebhooks.map((wh) => ({
        ...wh,
        path: `webhook/${existingWorkflow.id}`,
        workflowId: workflowId,
      })),
    });

    const updatedWorkflow = await prisma.workflow.update({
      where: { id: workflowId },
      data: {
        title,
        enabled,
        nodes: nodes as InputJsonValue,
        connections: connections as InputJsonValue,
      },
    });

    return { updatedWorkflow, createdWebhooks };
  });

  return res.status(200).send({
    message: "Workflow and webhooks updated successfully",
    workflowId: transaction.updatedWorkflow.id,
    webhooks: transaction.createdWebhooks,
  });
});

export default workflowRoutes;
