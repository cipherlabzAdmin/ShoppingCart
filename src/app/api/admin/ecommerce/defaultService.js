import { axiosInstance } from "@/app/api/admin/axiosInstance";

const ecomService = async (postData, endpoint) => {
  
  endpoint = endpoint || 'deliveryRoute/GetAll';
  try {
    const response = await axiosInstance(
      postData,
      "POST",
      `services/ecommerce/` + endpoint
    );
    return !response.data ? response : response.data;
  } catch (error) {
    console.error(`Error retreival - ${endpoint} : ` , error);
    throw error;
  }
};

export default ecomService;
