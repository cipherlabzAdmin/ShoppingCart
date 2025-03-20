import React, { useEffect, useState } from "react";
import { FiTrash } from "react-icons/fi";
import { dateTimeDifference } from "../../Utils/CustomFunctions/DateTimeDifference";

const TableComponent = ({
  headers,
  orderDetails,
  handleDelete,
  start,
  computeDistanceInKilometers,
  showMainHeader = false,
  headerTitle = "",
  widthPre = "100%",
  completeDelevery,
  matchingItem,
  setTotalDistance,
}) => {
  const [orderData, setOrderData] = useState([]);
  const [selectedPackingNo, setSelectedPackingNo] = useState([]);
  const [totalDistance, setLocalTotalDistance] = useState(0);

  useEffect(() => {
    if (orderDetails) {
      setOrderData(orderDetails);
    }
    if (matchingItem) {
      setSelectedPackingNo((prev) =>
        prev.includes(matchingItem.packingNo)
          ? prev
          : [...prev, matchingItem.packingNo]
      );
    }
  }, [orderDetails, matchingItem]);

  const getRowClass = (index) => {
    const classes = [
      "row-1",
      "row-2",
      "row-3",
      "row-4",
      "row-5",
      "row-6",
      "row-7",
    ];
    return classes[index % classes.length];
  };

  const renderCellContent = (item, header, index) => {
    if (header.key === "distance") {
      const distance = computeDistanceInKilometers(
        start.lat,
        start.lng,
        item.latitude,
        item.longitude
      );
      return distance + " km";
    }
    if (header.key === "status" && item.status) {
      return (
        <button className="status-btn" onClick={() => completeDelevery(index)}>
          Done
        </button>
      );
    }
    if (header.key === "customerName" && item.customerFirstName) {
      return item.customerFirstName + "" + item.customerLastName;
    }
    if (header.key === "timeCountAll") {
      return dateTimeDifference(item.creationTime);
    }
    if (header.key === "timeCountDelivery") {
      return dateTimeDifference(item.preparedDateTime);
    }
    if (header.key === "action") {
      return (
        <span
          onClick={() => handleDelete(item.checkoutNo)}
          style={{ cursor: "pointer" }}
        >
          <FiTrash />
        </span>
      );
    }
    if (header.key === "check") {
      return (
        <input
          type="checkbox"
          checked={selectedPackingNo.includes(item.packingNo)}
          readOnly
        />
      );
    }
    return item[header.key];
  };

  useEffect(() => {
    if (computeDistanceInKilometers) {
      const sumDistance = orderData.reduce((sum, item) => {
        const distance = parseFloat(
          computeDistanceInKilometers(
            start.lat,
            start.lng,
            item.latitude,
            item.longitude
          )
        );
        return sum + (isNaN(distance) ? 0 : distance);
      }, 0);

      setLocalTotalDistance(sumDistance.toFixed(2));
      if (setTotalDistance) setTotalDistance(sumDistance.toFixed(2));
    }
  }, [orderData, start, computeDistanceInKilometers, setTotalDistance]);

  return (
    <div className="mt-4" style={{ width: `${widthPre}` }}>
      <table className="table custom-table">
        <thead>
          {showMainHeader && (
            <tr>
              <th scope="col" colSpan={headers.length} className="main-header">
                {headerTitle}
              </th>
            </tr>
          )}
          <tr>
            {headers.map((header) => (
              <th key={header.key} scope="col">
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orderData.map((item, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td
                  key={header.key}
                  className={
                    header.key === "checkoutNo"
                      ? `row-no ${getRowClass(index)}`
                      : ""
                  }
                >
                  {renderCellContent(item, header, index)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
