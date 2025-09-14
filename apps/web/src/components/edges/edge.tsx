import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type Edge,
  type EdgeProps,
} from "@xyflow/react";
import { Trash2 } from "lucide-react";

type ICustomEdge = Edge<{ value: number }, "custom">;

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}: EdgeProps<ICustomEdge>) {
  const { deleteElements } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <button
          onClick={() => deleteElements({ edges: [{ id }] })}
          className="bg-highlighted px-2 py-1 border-1 border-pop transition-all rounded-md hover:cursor-pointer opacity-0 hover:opacity-100"
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
