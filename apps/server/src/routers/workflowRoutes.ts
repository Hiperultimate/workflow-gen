import prisma from "@/db";
import { auth } from "@/middleware/auth";
import { validWebHook } from "@/utils/schemas/webhookSchema";
import { workflowPut } from "@/utils/schemas/workflowSchema";
import type { InputJsonValue } from "@prisma/client/runtime/library";
import { Router } from "express";
import z, { type ZodSafeParseResult } from "zod";

const workflowRoutes = Router();

workflowRoutes.post("/workflow", auth, async (req, res) => {
  const user = req.user;
  const { workflowTitle } = req.body;

  const validateWorkFlowTitle = z.string().min(1).safeParse(workflowTitle);

  if (!validateWorkFlowTitle.success) {
    return res.status(400).send({ message: "Invalid title" });
  }

  const validTitle = validateWorkFlowTitle.data;

  const createWorkflow = await prisma.workflow.create({
    data: {
      title: validTitle,
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

workflowRoutes.get("/workflow", auth, async (req, res) => {
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

workflowRoutes.get("/workflow/:id", auth, async (req, res) => {
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

workflowRoutes.put("/workflow/:id", auth, async (req, res) => {
  // update existing workflow have id
  const workflowId = req.params.id;

  const { title, enabled, nodes, connections, webhook } = req.body;

  const existingWorkflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
    },
    select: {
      id: true,
      webhook: true,
    },
  });

  if (!existingWorkflow) {
    return res.status(404).send({ message: "Workflow not found" });
  }

  const validateNewWorkflowDetails = workflowPut.safeParse({
    title,
    enabled,
    nodes,
    connections,
  });
  if (!validateNewWorkflowDetails.success) {
    return res
      .status(404)
      .send({ message: "Invalid workflow details provided" });
  }
  const newWorkflowDetails = validateNewWorkflowDetails.data;

  let webhookExist = webhook !== undefined ? true : false;

  let validateWebhook: ZodSafeParseResult<z.infer<typeof validWebHook>> | null =
    null;
  if (webhookExist) {
    validateWebhook = validWebHook.safeParse(webhook);
  }

  const newWebhookData = validateWebhook?.data;

  const existingWebhook = existingWorkflow.webhook;

  const updateWorkflow = await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      title: newWorkflowDetails.title,
      enabled: newWorkflowDetails.enabled,
      nodes: newWorkflowDetails.nodes as InputJsonValue,
      connections: newWorkflowDetails.connections as InputJsonValue,
      ...(existingWebhook !== null &&
        newWebhookData !== undefined && {
          webhook: {
            disconnect: true,
            create: {
              header: newWebhookData.header,
              path: newWebhookData.path || `webhook/${existingWorkflow.id}`,
              title: newWebhookData.title,
              method: newWebhookData.method,
              secret: newWebhookData.secret,
            },
          },
        }),
    },
    select: {
      id: true,
    },
  });

  if (existingWebhook) {
    await prisma.webhook.delete({
      where: {
        id: existingWebhook.id,
      },
    });
  }

  return res
    .status(200)
    .send({ message: "Updated successfully", workflowId: updateWorkflow.id });
});

export default workflowRoutes;
