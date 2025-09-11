import axios from "axios";

export const getUserCredentials = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_SERVER_URL}/credential`,
    );
    return response.data;
  } catch (error : any) {
    throw new Error(error?.response?.data?.message || "An error occurred");
  }
};  