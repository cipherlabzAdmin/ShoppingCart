import { axiosInstance } from "@/app/api/admin/axiosInstance";

const getProducts = async (postData) => {
  try {
    const response = await axiosInstance(
      postData,
      "POST",
      `services/app/product/GetAll`
    );
    
    return response.data;
  } catch (error) {
    console.error("Error retreival products:", error);
    throw error;
  }
};

export default getProducts;
