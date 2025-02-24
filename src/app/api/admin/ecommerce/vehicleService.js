import { axiosInstance } from "@/app/api/admin/axiosInstance";

const getVehicleDetails = async (userData) => {
  try {
    const response = await axiosInstance(
      userData,
      "POST",
      `services/ecommerce/vehicle/GetAll`
    );
    return response.data;
  } catch (error) {
    console.error("Error retreival vehicles:", error);
    throw error;
  }
};

export default getVehicleDetails;
