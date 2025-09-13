import axios from "axios";

export const getWorkflowById = async (id : string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/workflow/${id}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "An error occurred");
  }
};
