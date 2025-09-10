import axios from "axios";

export const createCredential = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/auth/signup`,
      { email, password }
    );
    return response.data;
  } catch (error : any) {
    throw new Error(error?.response?.data?.message || "An error occurred");
  }
}; 