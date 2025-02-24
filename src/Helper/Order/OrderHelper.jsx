export const DeliveryColor = {
  FLASH: "#e60000",
  BULLET: "#f0ad4e",
  EXPRESS: "#5cb85c",
  STANDARD: "#5bc0de",
};

export const getDeliveryType = (num) => {
  let odType = null;
  switch (num) {
    case 1:
      odType = DeliveryColor.STANDARD;
      break;
    case 2:
      odType = DeliveryColor.EXPRESS;
      break;
    case 3:
      odType = DeliveryColor.FLASH;
      break;
    case 4:
      odType = DeliveryColor.BULLET;
  }
  return odType;
};
