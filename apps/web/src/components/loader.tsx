import { Loader2 } from "lucide-react";

export default function Loader({ size }: { size?: number }) {
  return (
    <div className="flex h-full items-center justify-center pt-8">
      <Loader2 className="animate-spin" size={size || 22} />
    </div>
  );
}
