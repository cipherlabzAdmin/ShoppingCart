import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const baseUrl = process?.env?.API_BASE_URL;

const ReturnItems = ({ items,checkoutId ,customerId}) => {
  const [reasons, setReasons] = useState([]);
  const admin = localStorage.getItem("AdminId");
  const [checkedItems, setCheckedItems] = useState(items.map(() => false));
  const [selectedReasons, setSelectedReasons] = useState(
    items.map(() => "")
  );
  const storedWarehouse = JSON.parse(localStorage.getItem("selectedWarehouse"));

  const fetchReasons = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}services/ecommerce/checkout/GetReturnReasonTypesValues`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data) {
        setReasons(response.data.result);
      } else {
        console.warn("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Failed to fetch return reasons:", error);
    }
  };

  const handleSubmit = async () => {
    const data = items.map((item, index) => ({
      productId: item.productId,
      productCode: item.productCode || "",
      productName: item.productName || "",
      warehouseId: storedWarehouse.id || "",
      warehouseCode: storedWarehouse.code || "",
      warehouseName: storedWarehouse.name || "",
      unitPrice: item.offerPrice || 0,
      quantity: item.quantity || 0,
      discountRate: item.discountRate || 0,
      discountAmount: item.discountAmount || 0,
      totalPrice: item.totalPrice || 0,
      eCommerceCustomerId:customerId, 
      checkoutId: parseInt(checkoutId),
      returnReason: parseInt(selectedReasons[index]) || null, 
      returnUserId: parseInt(admin),
    }));

    try {
      const response = await axios.post(
        `${baseUrl}services/ecommerce/checkout/createCartReturn`,
        data,  
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200 && response.data) {
        toast.success("Return items updated successfully");
      } else {
        console.warn("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Failed to submit return items:", error);
    }
  };

  useEffect(() => {
    fetchReasons();
  }, []);

  const handleCheckboxChange = (index) => {
    setCheckedItems((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const handleReasonChange = (index, value) => {
    setSelectedReasons((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  return (
    <div className="col-lg-8 col-12 table-responsive">
      <table className="table table-bordered">
        <thead className="table-danger">
          <tr>
            <th className="p-1">#</th>
            <th className="p-1">Item Name</th>
            <th className="p-1">MRP</th>
            <th className="p-1">Quantity</th>
            <th className="p-1">Return Reason</th>
            <th className="p-1">Offer Price</th>
            <th className="p-1">Total</th>
            <th className="p-1 text-end">Check</th>
          </tr>
        </thead>
        <tbody>
          {items.length < 1 ? (
            <tr>
              <td colSpan="8" className="text-danger text-center">
                No Items Available
              </td>
            </tr>
          ) : (
            items.map((item, index) => (
              <tr key={index}>
                <td className="p-1">{index + 1}</td>
                <td className="p-1">{item.productName}</td>
                <td className="p-1">{item.maximumRetailPrice}</td>
                <td className="p-1">{item.quantity}</td>
                <td className="p-1">
                  <select
                    className="p-1 w-100"
                    value={selectedReasons[index]}
                    onChange={(e) => handleReasonChange(index, e.target.value)}
                  >
                    <option value="">Please Select Reason</option>
                    {reasons.map((reason, idx) => (
                      <option key={idx} value={reason.item1}>
                        {reason.item2}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-1">{item.offerPrice}</td>
                <td className="p-1">{item.totalPrice}</td>
                <td className="p-1 d-flex justify-content-end gap-3">
                  <input
                    type="checkbox"
                    className="form-check"
                    checked={checkedItems[index]}
                    onChange={() => handleCheckboxChange(index)}
                  />
                  {/* <a href="#" style={{ fontWeight: "bold", color: "red" }}>
                    <FaRegTrashAlt />
                  </a> */}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="row">
        <div className="col-12 d-flex justify-content-end my-2">
          <button onClick={handleSubmit} className="btn bg-warning btn-sm p-1">
            Update
          </button>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default ReturnItems;
