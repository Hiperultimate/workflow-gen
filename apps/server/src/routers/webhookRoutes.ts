import { prisma, type Methods } from "@workflow-gen/db";
import { Router } from "express";


const webhookRoutes = Router();

webhookRoutes.all("/:id", async (req, res) => {
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
})

export default webhookRoutes;