import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const baseUrl = process?.env?.API_BASE_URL;

const Items = ({ items }) => {
  const [currentItems, setCurrentItems] = useState([]);
  const [removedItems, setRemovedItems] = useState([]);
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get("id");
   

  useEffect(() => {
    const storedRemovedItems = JSON.parse(localStorage.getItem("RemovedItems")) || [];
    setRemovedItems(storedRemovedItems);
    setCurrentItems(
      items.filter(item => !storedRemovedItems.some(removed => removed.productId === item.productId))
      .map(item => ({
        ...item,
        totalPrice: item.quantity * item.maximumRetailPrice,
        isChecked: false
      }))
    );
  }, [items]);

  const handleQuantityChange = (index, value) => {
    const updatedItems = [...currentItems];
    updatedItems[index].quantity = value;
    updatedItems[index].totalPrice = value * updatedItems[index].maximumRetailPrice;
    setCurrentItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    const itemToRemove = currentItems[index];
    const updatedItems = currentItems.filter((_, i) => i !== index);
    setCurrentItems(updatedItems);
    setRemovedItems(prevRemoved => {
      const updatedRemoved = [...prevRemoved, itemToRemove];
      localStorage.setItem("RemovedItems", JSON.stringify(updatedRemoved));
      return updatedRemoved;
    });
  };

  const handleCheckboxChange = (index) => {
    const updatedItems = [...currentItems];
    updatedItems[index].isChecked = !updatedItems[index].isChecked;
    setCurrentItems(updatedItems);
  };

  const handleHandover = async () => {
    const checkedItems = currentItems.filter(item => item.isChecked);
    localStorage.setItem("checkedItems", JSON.stringify(checkedItems));
    if (checkedItems.length === 0) {
      toast.error("No Items Available");
      return;
    }
    const postData = {
      checkoutId: checkoutId,
      productIds: checkedItems.map(product => product.productId),
    };

    try {
      const response = await axios.post(
        `${baseUrl}services/ecommerce/checkout/UpdateCartItemsHandOverStatus`,
        postData,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.success) {
        toast.success("Cart Items Updated Successfully");
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
  };

  return (
    <div className="col-lg-8 col-12 table-responsive">
      <table className="table custom-table table-bordered">
        <thead>
          <tr>
            <th className="p-1">#</th>
            <th className="p-1">Item Name</th>
            <th className="p-1">MRP</th>
            <th className="p-1">Quantity</th>
            <th className="p-1">Offer Price</th>
            <th className="p-1">Total</th>
            <th className="p-1 text-end">Check</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length < 1 ? (
            <tr>
              <td colSpan="7" className="text-danger text-center">
                No Items Available
              </td>
            </tr>
          ) : (
            currentItems.map((item, index) => (
              <tr key={index}>
                <td className="p-1">{index + 1}</td>
                <td className="p-1">{item.productName}</td>
                <td className="p-1">{item.maximumRetailPrice}</td>
                <td className="p-1">
                  <input
                    type="number"
                    value={item.quantity}
                    className="p-1"
                    onChange={(e) =>
                      handleQuantityChange(index, parseInt(e.target.value))
                    }
                  />
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
          <button
            className="btn bg-warning btn-sm p-1"
            onClick={handleHandover}
          >
            Handover
          </button>
        </div>
        <hr />
      </div>
    </div>
  );
};

export default Items;
