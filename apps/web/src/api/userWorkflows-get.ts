import axios from "axios";

export const userWorkflows = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/workflow`,
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "An error occurred");
  }
};
