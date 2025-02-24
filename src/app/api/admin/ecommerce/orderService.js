// api/userService.js
import { axiosInstance } from "@/app/api/admin/axiosInstance";

const getOrderDetails = async (userData) => {
  try {
    const response = await axiosInstance(
      userData,
      "POST",
      //"services/ecommerce/checkout/GetAllDetails"
      "services/ecommerce/checkout/GetAll"
    );
    return response.data;
  } catch (error) {
    console.error("Error retriving Order details:", error);
    throw error;
  }
};

export default getOrderDetails;
