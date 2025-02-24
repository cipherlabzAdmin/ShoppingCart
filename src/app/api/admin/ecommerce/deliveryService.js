import { axiosInstance } from "@/app/api/admin/axiosInstance";

const getDeliveryDetails = async (userData) => {
  //console.log(userData);
  try {
    const response = await axiosInstance(
      userData,
      "POST",
      `services/ecommerce/deliveryRoute/GetAll`
    );
    return response.data;
  } catch (error) {
    console.error("Error retreival vehicles:", error);
    throw error;
  }
};

export default getDeliveryDetails;
