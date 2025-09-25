import {
  NodeStates,
  NodeTypes,
  type IConnection,
  type INode,
} from "@/types/types";
import { prisma, type Methods } from "@workflow-gen/db";
import { Router } from "express";
import sendTelegramMessage from "@/services/sendTelegramMessage";
import { sendMail } from "@/services/sendMail";
import updateNodeStateIfConnected from "@/utils/updateNodeStateIfConnected";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import bs58 from "bs58";
import {
  getAssociatedTokenAddressSync,
  getMint,
  getOrCreateAssociatedTokenAccount,
  transfer,
} from "@solana/spl-token";
import { success } from "zod";

const webhookRoutes = Router();

webhookRoutes.all("/:path", async (req, res) => {
  const { path: webhookPath } = req.params;
  const method = req.method as Methods;

  // Log the request method and ID
  console.log(`Received ${method} request for /webhook/${webhookPath}`);

  const webhookRecord = await prisma.webhook.findFirst({
    where: { path: webhookPath, method: method },
    include: { workflow: true },
  });

  if (!webhookRecord) {
    return res
      .status(400)
      .send({ message: "Invalid webhook path. Workflow not found." });
  }

  const workflowData = webhookRecord.workflow;

  const webhookId = webhookRecord.id;
  const nodes = workflowData.nodes as INode[];
  const connections = workflowData.connections as IConnection[];

  const processNodeArr: { node: INode; passingData: any }[] = [];
  const firstNode = nodes.filter((node) => node.id === webhookId)[0];
  const passingData = getWebhookPassingData(
    firstNode,
    Object.keys(req.body || {}).length > 0 ? req.body : req.query
  );

  processNodeArr.push({ node: firstNode, passingData: passingData });

  updateNodeStateIfConnected({
    workflowId: workflowData.id,
    node: firstNode,
    nodeState: NodeStates.InProgress,
  });

  let iter = 0;
  while (iter < processNodeArr.length) {
    const { node: currentNode, passingData: currentNodePassingData } =
      processNodeArr[iter];

    const passingData = await processNode(
      currentNode,
      currentNodePassingData,
      workflowData.id
    ); // Write code here to return processed data
    const nextNodes = getConnectedNodesFromNode(
      currentNode.id,
      nodes,
      connections
    );

    nextNodes.forEach((node) => {
      processNodeArr.push({ node: node, passingData: passingData });

      // Changing live states to InProgress if required
      updateNodeStateIfConnected({
        workflowId: workflowData.id,
        node: node,
        nodeState: NodeStates.InProgress,
      });
    });
    iter++;
  }

  res.status(200).send({ message: "Recieved webhook request, initiating..." });
});

function getConnectedNodesFromNode(
  nodeId: string,
  nodes: INode[],
  connections: IConnection[]
) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  const connectedNodes = connections
    .filter((connection) => connection.source === nodeId)
    .map((connection) => nodeMap.get(connection.target))
    .filter((node): node is INode => node !== undefined);

  return connectedNodes;
}

function getWebhookPassingData(
  webhookNode: INode,
  reqObj: Record<string, any>
) {
  const nodeData = webhookNode.data;
  const headerData: string[] = nodeData?.fieldData?.header;
  if (!headerData) return [];

  const reqData: Record<string, string> = {};

  headerData.forEach((keyword) => {
    reqData[keyword] = reqObj[keyword];
  });

  return { header: reqData };
}

function getSourcesOfNode(
  nodeId: string,
  nodes: INode[],
  connections: IConnection[]
) {
  const connectionOfNodesConnectedToNodeId = connections.filter(
    (connection) => {
      return connection.target === nodeId;
    }
  );
  const nodesConnectedToNodeId = connectionOfNodesConnectedToNodeId.flatMap(
    (connection) => {
      const node = nodes.find((node) => node.id === connection.source);
      return node ? [node] : [];
    }
  );

  return nodesConnectedToNodeId;
}

async function processNode(
  // nodeId: string,
  node: INode,
  inputData: Record<any, any>,
  workflowId: string
): Promise<{ success: boolean; passingData: any; message?: string }> {
  const nodeType = node.type;
  switch (nodeType) {
    case NodeTypes.Webhook: {
      console.log("Processing Webhook : ", nodeType);
      updateNodeStateIfConnected({
        workflowId: workflowId,
        node: node,
        nodeState: NodeStates.Loading,
      });

      const webhookData = getWebhookPassingData(node, inputData.header);

      updateNodeStateIfConnected({
        workflowId: workflowId,
        node: node,
        nodeState: NodeStates.Completed,
      });
      return { success: true, passingData: webhookData };
    }
    case NodeTypes.Email: {
      console.log("Processing Email : ", nodeType);

      updateNodeStateIfConnected({
        workflowId: workflowId,
        node: node,
        nodeState: NodeStates.Loading,
      });

      const emailFieldData = node.data?.fieldData;
      const subjectRaw = emailFieldData.subject;
      const toEmailRaw = emailFieldData.toEmail;
      const htmlMailRaw = emailFieldData.htmlMail;
      const emailCredentials = emailFieldData?.selectedCred;
      const headerData = inputData?.passingData?.header;

      const headerAndPrevData = {
        ...emailFieldData.previousNodesData,
        ...headerData,
      };

      const subject = interpolate(subjectRaw || "", headerAndPrevData);
      const toEmail = interpolate(toEmailRaw || "", headerAndPrevData);
      const htmlMail = interpolate(htmlMailRaw || "", headerAndPrevData);
      const fromEmail = emailCredentials?.data?.email;
      const resendApiKey = emailCredentials?.data?.api;

      // console.log("Checking email data :", {
      //   subject: subject,
      //   toEmail: toEmail,
      //   htmlMail: htmlMail,
      //   emailCredentials: emailCredentials,
      //   headerData: headerData,
      //   fromEmail: fromEmail,
      //   resendApiKey: resendApiKey,
      // });

      if (!emailCredentials || !resendApiKey || !fromEmail) {
        const message = "No credentials found";
        updateNodeStateIfConnected({
          workflowId,
          node,
          nodeState: NodeStates.Failed,
          message: message,
        });
        return {
          success: false,
          passingData: {},
          message: message,
        };
      }

      const { success, message: mailMessage } = await sendMail({
        // from: fromEmail, // Currently using default email because of resend restrictions
        to: toEmail,
        subject: subject,
        htmlMail: htmlMail,
        resendApi: resendApiKey,
      });
      console.log("Checking send mail response : ", success, mailMessage);
      if (success === false) {
        updateNodeStateIfConnected({
          workflowId,
          node,
          nodeState: NodeStates.Failed,
          message: mailMessage,
        });
        return { success: false, passingData: {}, message: mailMessage };
      }

      updateNodeStateIfConnected({
        workflowId,
        node,
        nodeState: NodeStates.Completed,
      });
      return { success: true, passingData: {} };
    }
    case NodeTypes.Telegram: {
      console.log("Processing Telegram");

      updateNodeStateIfConnected({
        workflowId,
        node,
        nodeState: NodeStates.Loading,
      });

      const fieldData = node.data?.fieldData;
      const chatIdForm = fieldData.chatId;
      const chatMessageForm = fieldData.chatMessage;
      const telegramCredentials = fieldData.selectedCred;

      const headerData = inputData?.passingData?.header;
      const finalChatId = interpolate(chatIdForm || "", headerData);
      const finalChatMessage = interpolate(chatMessageForm || "", headerData);

      const telegramBotApi = telegramCredentials?.data?.botApi;
      const response = await sendTelegramMessage({
        chatId: finalChatId,
        message: finalChatMessage,
        telegramApi: telegramBotApi || "",
      });

      if (response.success === false) {
        updateNodeStateIfConnected({
          workflowId,
          node,
          nodeState: NodeStates.Failed,
          message: response.message,
        });
      } else {
        updateNodeStateIfConnected({
          workflowId,
          node,
          nodeState: NodeStates.Completed,
        });
      }

      return { success: response.success, passingData: {} };
    }
    case NodeTypes.SolanaSendTokenNode: {
      console.log("Processing Solana Send Token Node");

      const fieldData = node.data?.fieldData;
      const senderPrivateKeyRaw = fieldData.senderPrivateKey;
      const receiversPublicKey = fieldData.receiversPublicKey;
      const tokenMintAddress = fieldData.tokenMintAddress;
      const sendTokenAmount = Number(fieldData.sendTokenAmount);

      const connection = new Connection(
        process.env.SOLANA_CONNECTION_URL || "",
        "confirmed"
      );
      let senderPrivateKey;
      let senderKeyPair;
      let senderPubkey;
      let receiverPubkey;

      let message: string;

      try {
        senderPrivateKey = bs58.decode(senderPrivateKeyRaw);
      } catch (e) {
        message = "Invalid private key received";
        updateNodeStateIfConnected({
          workflowId,
          node,
          nodeState: NodeStates.Failed,
          message,
        });
        return {
          success: false,
          passingData: {},
          message: "Invalid private key received",
        };
      }

      try {
        senderKeyPair = Keypair.fromSecretKey(senderPrivateKey);
      } catch (e) {
        message = "Failed to create keypair from secret key";
        updateNodeStateIfConnected({
          workflowId,
          node,
          nodeState: NodeStates.Failed,
          message,
        });
        return {
          success: false,
          passingData: {},
          message,
        };
      }

      try {
        senderPubkey = senderKeyPair.publicKey;
      } catch (e) {
        message = "Failed to retrieve public key from keypair";
        updateNodeStateIfConnected({
          workflowId,
          node,
          nodeState: NodeStates.Failed,
          message,
        });
        return {
          success: false,
          passingData: {},
          message,
        };
      }

      try {
        receiverPubkey = new PublicKey(receiversPublicKey);
      } catch (e) {
        message = "Invalid receiver public key";
        updateNodeStateIfConnected({
          workflowId,
          node,
          nodeState: NodeStates.Failed,
          message,
        });
        return {
          success: false,
          passingData: {},
          message,
        };
      }

      if (!tokenMintAddress) {
        // User wants to transfer SOL
        try {
          const tx = new Transaction();
          tx.add(
            SystemProgram.transfer({
              fromPubkey: senderPubkey,
              toPubkey: receiverPubkey,
              lamports: sendTokenAmount * LAMPORTS_PER_SOL,
            })
          );
          tx.feePayer = senderPubkey;
          const recentBlockhash = await connection.getLatestBlockhash();
          tx.recentBlockhash = recentBlockhash.blockhash;
          tx.lastValidBlockHeight = recentBlockhash.lastValidBlockHeight;
          const transactionSignature = await sendAndConfirmTransaction(
            connection,
            tx,
            [senderKeyPair]
          ); // Maybe we also need receiver pub key in signers

          updateNodeStateIfConnected({
            workflowId,
            node,
            nodeState: NodeStates.Completed,
          });

          return { success: true, passingData: { transactionSignature } };
        } catch (error) {
          return {
            success: false,
            passingData: {},
            message: "Something went wrong during transfer of balance.",
          };
        }
      } else {
        try {
          const tokenMint = new PublicKey(tokenMintAddress);

          const mintDetails = await getMint(connection, tokenMint);

          // Get token details if needed
          const senderAtaAddress = getAssociatedTokenAddressSync(
            tokenMint,
            senderPubkey
          );
          const receiverAtaAddress = await getOrCreateAssociatedTokenAccount(
            connection,
            senderKeyPair,
            tokenMint,
            receiverPubkey
          );

          const transactionSignature = await transfer(
            connection,
            senderKeyPair,
            senderAtaAddress,
            receiverAtaAddress.address,
            senderPubkey,
            sendTokenAmount * 10 ** mintDetails.decimals
          );

          const getBlockData = await connection.getLatestBlockhash();
          const confirmTx = await connection.confirmTransaction({
            blockhash: getBlockData.blockhash,
            lastValidBlockHeight: getBlockData.lastValidBlockHeight,
            signature: transactionSignature,
          });

          console.log("Check confirm tx : ", confirmTx);

          updateNodeStateIfConnected({
            workflowId,
            node,
            nodeState: NodeStates.Completed,
          });

          return { success: true, passingData: { confirmTx } };
        } catch (error) {
          message = "Something went wrong while transfering SPL token.";
          updateNodeStateIfConnected({
            workflowId,
            node,
            nodeState: NodeStates.Failed,
            message,
          });

          return { success: false, passingData: {}, message };
        }
      }
    }
    default:
      console.log("Unable to find Node Type : ", nodeType);
      return { success: false, passingData: {} };
  }
}

// Funtion to replace {{text}} with value inside header
type Header = Record<string, string>;
function interpolate(template: string, header: Header): string {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    const trimmedKey = key.trim();
    return header[trimmedKey] ?? ""; // fallback if key not found
  });
}

export default webhookRoutes;
