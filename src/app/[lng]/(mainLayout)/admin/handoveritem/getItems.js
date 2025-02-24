import axios from "axios";
const baseUrl = process?.env?.API_BASE_URL;

const getItems = async ({ controller, id, route }) => {
  const formData = {
    checkoutId: id,
    deliveryRouteId: route,
  };

  try {
    const response = await axios({
      method: "POST",
      url: `${baseUrl}services/ecommerce/checkout/${controller}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: formData,
    });
    const list = response.data.result;
    return list;
  } catch (error) {
    console.error("Failed to fetch items:", error);
    return null;
  }
};

export default getItems;
