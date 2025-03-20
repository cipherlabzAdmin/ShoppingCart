import axios from "axios";

const sendToNextStatus = async ({ ids }) => {
  const baseUrl = process?.env?.API_BASE_URL;
  const responses = [];

  for (const checkoutId of ids) {
    try {
      const data = {
        checkoutId,
        comment: "string",
      };

      const response = await axios({
        method: "POST",
        url: `${baseUrl}services/ecommerce/checkout/SendCheckoutStatusToNextStage`,
        headers: {
          "Content-Type": "application/json",
        },
        data, 
      });
      responses.push(response.data);
    } catch (error) {
      console.error(`Failed to process checkoutId ${checkoutId}:`, error);
    }
  }

  return responses;
};

export default sendToNextStatus;
