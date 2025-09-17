// import { Platform } from "prisma/generated/enums";
import { Platform } from "@workflow-gen/db";
import z from "zod";

export const crendentialCreateSchema = z.object({
  title: z.string().min(3),
  platform: z.enum(Platform),
  data: z.string().refine(
    (val) => {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    },
    {
      message: "Data must be a valid JSON string",
    }
  ),
});
