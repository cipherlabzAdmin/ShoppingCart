import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

const baseUrl = process?.env?.API_BASE_URL;

const ReturnItems = ({ items }) => {
  const [reasons, setReasons] = useState([]);
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

  useEffect(() => {
    fetchReasons();
  }, []);

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
              <td colSpan="7" className="text-danger text-center">
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
                  <select className="p-1 w-100">
                    <option>Please Select Reason</option>
                    {reasons.map((reason, index) => (
                      <option key={index} value={reason.item1}>{reason.item2}</option>
                    ))}
                  </select>
                </td>
                <td className="p-1">{item.offerPrice}</td>
                <td className="p-1">{item.totalPrice}</td>
                <td className="p-1 d-flex justify-content-end gap-3">
                  <input
                    type="checkbox"
                    className="form-check"
                    checked={item.isChecked}
                    onChange={() => handleCheckboxChange(index)}
                  />
                  <a
                    href="#"
                    style={{ fontWeight: "bold", color: "red" }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveItem(index);
                    }}
                  >
                    <FaRegTrashAlt />
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="row">
        <div className="col-12 d-flex justify-content-end my-2">
          <button className="btn bg-warning btn-sm p-1">Update</button>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default ReturnItems;
