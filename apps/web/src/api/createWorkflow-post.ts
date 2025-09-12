import axios from "axios";

export const createWorkflow = async (workflowTitle : string) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/workflow`, {workflowTitle}
    );
    return response.data;
  } catch (error : any) {
    throw new Error(error?.response?.data?.message || "An error occurred");
  }
};  