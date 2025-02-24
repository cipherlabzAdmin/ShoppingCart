// api/axiosInstance.js
import axios from "axios";

const baseUrl = process?.env?.API_BASE_URL;

export const axiosInstance = async (postData, method, api) => {
  const response = await axios({
    method: method,
    url: `${baseUrl}${api}`,
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(postData),
  });

  return response;
};
