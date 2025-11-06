import { NodeStates, type INode } from "@/types/types";
import updateNodeStateIfConnected from "../updateNodeStateIfConnected";
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

async function executeSolana(
  { fieldData }: { fieldData: Record<string, any> },
  workflowId: string,
  node: INode
) {
  updateNodeStateIfConnected({
    workflowId,
    node,
    nodeState: NodeStates.Loading,
  });

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

export default executeSolana;