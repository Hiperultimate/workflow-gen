import type { NodeType } from "@/types";
import { TextField, Flex, Text, Dialog } from "@radix-ui/themes";
import { useState } from "react";

interface AddNodeProps {
  onSelect: (value: { type: NodeType }) => void;
}

function AddNode({ onSelect }: AddNodeProps) {
  const [filter, setFilter] = useState("");

  const nodeOptions: { value: NodeType; label: string }[] = [
    { value: "telegramNode", label: "Telegram Node" },
    { value: "emailNode", label: "Email Node" },
    { value: "webhookNode", label: "Webhook Node" },
  ];

  // Filter nodes based on input
  const filteredNodes = nodeOptions.filter((node) =>
    node.label.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Flex direction="column" gap="3">
      <label>
        <div className="mb-1 font-bold">Filter Nodes</div>
        <TextField.Root
          placeholder="Search node types..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <TextField.Slot />
        </TextField.Root>
      </label>
      <div className="flex flex-col gap-2">
        {filteredNodes.length > 0 ? (
          filteredNodes.map((node) => (
            <Dialog.Close>
              <div
                key={node.value}
                className="bg-highlighted w-full border-1 border-lightborder rounded-sm p-4 text-center text-sm font-medium transition-colors hover:bg-white/30 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-pop"
                onClick={() => onSelect({ type: node.value })}
              >
                {node.label}
              </div>
            </Dialog.Close>
          ))
        ) : (
          <Text className="text-gray-500 p-2">No nodes match your search</Text>
        )}
      </div>
    </Flex>
  );
}

export default AddNode;