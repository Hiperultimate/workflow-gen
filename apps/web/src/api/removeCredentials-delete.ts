import axios from "axios";

export const removeCredentials = async (id : string) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_SERVER_URL}/credential/${id}`,
    );
    return response.data;
  } catch (error : any) {
    throw new Error(error?.response?.data?.message || "An error occurred");
  }
};  