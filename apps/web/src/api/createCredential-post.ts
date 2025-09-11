import axios from "axios";

export const createCredential = async ({
  title,
  platform,
  data,
}: {
  title: string;
  platform: string;
  data: string;
}) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/credential`,
      { title, platform, data },
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "An error occurred");
  }
};
