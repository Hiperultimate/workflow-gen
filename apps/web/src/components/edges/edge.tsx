import { cn } from "@/lib/utils";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  useReactFlow,
  type Edge,
  type EdgeProps,
} from "@xyflow/react";
import { Trash2 } from "lucide-react";
import { useState } from "react";

type ICustomEdge = Edge<{ value: number }, "custom">;

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: EdgeProps<ICustomEdge>) {
    const [displayDelete, setDisplayDelete] = useState(false);
  const { deleteElements } = useReactFlow();
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

return (
  <>
    <BaseEdge id={id} path={edgePath} style={{ stroke: "white" }} />
    <path
      id={`${id}-overlay`}
      d={edgePath}
      fill="none"
      stroke="transparent"
      strokeWidth={50} // Increase hit area
      onMouseEnter={() => setDisplayDelete(true)}
      onMouseLeave={() => setDisplayDelete(false)}
    />
    <EdgeLabelRenderer>
      <button
        onClick={() => deleteElements({ edges: [{ id }] })}
        className={cn(
          "bg-highlighted px-2 py-1 border-1 border-pop transition-all rounded-md hover:cursor-pointer opacity-0 hover:opacity-100",
          {
            "opacity-100": displayDelete === true,
            "opacity-0": displayDelete === false,
          }
        )}
        style={{
          position: "absolute",
          transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          pointerEvents: "all",
        }}
      >
        <Trash2 size={12} color="#f96d5c" />
      </button>
    </EdgeLabelRenderer>
  </>
);
}

export default CustomEdge;
