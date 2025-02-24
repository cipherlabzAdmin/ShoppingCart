// api/userService.js
import { axiosInstance } from "@/app/api/admin/axiosInstance";

const getDriverDetails = async (userData) => {
  try {
    const response = await axiosInstance(
      userData,
      "POST",
      "services/app/user/GetAllUsers"
    );
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export default getDriverDetails;
