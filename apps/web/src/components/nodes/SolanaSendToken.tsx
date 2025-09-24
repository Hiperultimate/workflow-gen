import { SquarePen, Strikethrough, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import NodeWrapper from "./NodeWrapper";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Dialog, Flex, TextField } from "@radix-ui/themes";
import type { NodeWithOptionalFieldData } from "@/types";
import useConnectedNodesData from "@/hooks/useConnectedNodesData";

function SolanaSendTokenNode({
  id,
  data,
}: {
  id: string;
  data: {
    id: string;
    fieldData: any;
    onDataUpdate: (id: string, data: any) => void;
  };
}) {
  const { deleteElements } = useReactFlow();
  const { fieldData } = data;

  const { getSourceNodesData, getPreviousNodesData } = useConnectedNodesData();
  const { nodeData: previousNodesData, nodeDataKeys } =
    getPreviousNodesData(id);

  const parentNodeData = getSourceNodesData(id) as NodeWithOptionalFieldData[];

  const senderPrivateKey = useRef(fieldData?.senderPrivateKey || "");
  const receiversPublicKey = useRef(fieldData?.receiversPublicKey || "");
  const tokenMintAddress = useRef(fieldData?.tokenMintAddress || "");
  const sendTokenAmount = useRef(fieldData?.sendTokenAmount || "");

  const [senderPrivateKeyInput, setSenderPrivateKeyInput] = useState(
    senderPrivateKey.current
  );
  const [receiversPublicKeyInput, setReceiversPublicKeyInput] = useState(
    receiversPublicKey.current
  );
  const [tokenMintAddressInput, setTokenMintAddressInput] = useState(
    tokenMintAddress.current
  );
  const [sendTokenAmountInput, setSendTokenAmountInput] = useState(
    sendTokenAmount.current
  );

  const editSolanaSendTokenNodeHandler = useCallback(() => {
    senderPrivateKey.current = senderPrivateKeyInput;
    receiversPublicKey.current = receiversPublicKeyInput;
    tokenMintAddress.current = tokenMintAddressInput;
    sendTokenAmount.current = sendTokenAmountInput;

    const currentNodeData = {
      senderPrivateKey: senderPrivateKey.current,
      receiversPublicKey: receiversPublicKey.current,
      tokenMintAddress: tokenMintAddress.current,
      sendTokenAmount: sendTokenAmount.current,
    };

    const { previousNodesData: _omit, ...cleanPreviousNodesData } =
      previousNodesData || {};
    data.onDataUpdate(id, {
      ...currentNodeData,
      previousNodesData: { ...cleanPreviousNodesData, ...currentNodeData },
    });
  }, [
    senderPrivateKeyInput,
    receiversPublicKeyInput,
    tokenMintAddressInput,
    sendTokenAmountInput,
    data.onDataUpdate,
  ]);

  const deleteSolanaSendTokenNodeHandler = useCallback(
    (nodeId: string) => {
      deleteElements({ nodes: [{ id: nodeId }] });
    },
    [deleteElements]
  );

  // Populate reactflow node object containing data with empty fields
  useEffect(() => {
    editSolanaSendTokenNodeHandler();
  }, []);

  return (
    <NodeWrapper>
      <Dialog.Root>
        <Dialog.Trigger>
          <div className="absolute top-1/2 -left-7 -translate-y-1/2 hover:cursor-pointer bg-highlighted p-1 rounded-md hover:bg-white/30">
            <SquarePen size={15} />
          </div>
        </Dialog.Trigger>

        <Dialog.Content className="flex flex-col gap-2">
          <Dialog.Title>Solana Send Token Node</Dialog.Title>
          <Dialog.Description mb="4">Enter form details</Dialog.Description>

          <div className="bg-gray-800 border border-gray-300 rounded-md px-4 py-2 text-gray-300 font-mono">
            <div className="mb-1 font-bold">Input Data Preview</div>
            {parentNodeData && (
              <div>
                {nodeDataKeys.map((key, idx) => {
                  return <span key={idx}>{`{{${key}}} `}</span>;
                })}
                {parentNodeData
                  .map((node) => node.fieldData?.header ?? []) // safe: if fieldData or header missing, use empty array
                  .flat()
                  .map((headerValue, idx) => (
                    <span key={idx}>{`{{${headerValue}}} `}</span>
                  ))}
              </div>
            )}
          </div>

          <label>
            <div className="mb-1 font-bold">Users Private Key</div>
            <TextField.Root
              placeholder="7MNj7pL1y7XpPnN7ZeuaE4ctwg3WeufbX5o85sA91J1"
              value={senderPrivateKeyInput}
              onChange={(e) => {
                setSenderPrivateKeyInput(e.target.value);
              }}
            >
              <TextField.Slot />
            </TextField.Root>
          </label>

          <label>
            <div className="mb-1 font-bold">Receivers Public Key</div>
            <TextField.Root
              placeholder="7MNj7pL1y7XpPnN7ZeuaE4ctwg3WeufbX5o85sA91J1"
              value={receiversPublicKeyInput}
              onChange={(e) => {
                setReceiversPublicKeyInput(e.target.value);
              }}
            >
              <TextField.Slot />
            </TextField.Root>
          </label>

          <label>
            <div className="mb-1 font-bold">Token Mint Address</div>
            <TextField.Root
              placeholder="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
              value={tokenMintAddressInput}
              onChange={(e) => {
                setTokenMintAddressInput(e.target.value);
              }}
            >
              <TextField.Slot />
            </TextField.Root>
          </label>

          <label>
            <div className="mb-1 font-bold">Send Amount</div>
            <TextField.Root
              placeholder="0.265"
              value={sendTokenAmountInput}
              onChange={(e) => {
                setSendTokenAmountInput(e.target.value);
              }}
            >
              <TextField.Slot />
            </TextField.Root>
          </label>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <button className="bg-gray-400 px-4 py-2 rounded-md hover:bg-gray-500 hover:cursor-pointer">
                Cancel
              </button>
            </Dialog.Close>
            <Dialog.Close>
              <button
                className="bg-pop px-4 py-2 rounded-md hover:bg-pophover hover:cursor-pointer"
                onClick={() => editSolanaSendTokenNodeHandler()}
              >
                Save
              </button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <div className="flex flex-col justify-center items-center">
        <Strikethrough size={28} />
        <div className="font-bold text-md">Send Solana Token</div>
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </div>

      <div className="absolute top-1/2 -right-7 -translate-y-1/2 hover:cursor-pointer bg-highlighted p-1 rounded-md hover:bg-white/30">
        <Trash2
          size={15}
          color="#f96d5c"
          onClick={() => deleteSolanaSendTokenNodeHandler(id)}
        />
      </div>
    </NodeWrapper>
  );
}

export default SolanaSendTokenNode;
