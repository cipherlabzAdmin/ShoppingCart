import axios from "axios";

const readBarcodeService = async (route, code) => {
  const baseUrl = process?.env?.API_BASE_URL;
  try {
    const response = await axios({
      method: "POST",
      url: `${baseUrl}services/ecommerce/checkout/GetReturnItemByProductBarCode?deliveryRouteId=${route}&productBarCode=${code}`,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch deliveryRoute endpoint:", error);
  }
};
export default readBarcodeService;
