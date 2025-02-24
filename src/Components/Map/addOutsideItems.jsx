import getProducts from "@/app/api/admin/ecommerce/productService";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { toast } from "react-toastify";

const OutsideItemTableComponent = ({ warehouseId, deleveryId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [quantity, setQuantity] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState("");
  const [addedItems, setAddedItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const baseUrl = process?.env?.API_BASE_URL;

  const fetchProducts = useCallback(async (keyword) => {
    setLoading(true);
    try {
      const response = await getProducts(
        {
          keyword: keyword || "",
          isQuantityRequired: true,
          isActive: true,
          warehouseId: warehouseId,
          sortType: 1,
          skipCount: 0,
          maxResultCount: 200,
        },
        "product/GetAll"
      );
      if (response) {
        setProducts(response.result.items);
      }
    } catch (error) {
      console.error("Failed to fetch product/GetAll:", error);
    } finally {
      setLoading(false);
    }
  }, [warehouseId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleRemoveItem = (itemId) => {
    setAddedItems(addedItems.filter((item) => item.id !== itemId));
  };

  const handleCreateOutsideItems = async () => {
    if (!deleveryId) {
      toast.error("Please select a vehicle number");
      return;
    }

    const products = addedItems.map((item) => ({
      productId: item.id,
      productCode: item.code,
      quantity: item.quantity,
      productName: item.name,
      availableQuantity: item.availableQuantity,
    }));

    const formData = {
      deliveryRouteId: deleveryId,
      warehouseId,
      products,
    };

    try {
      const response = await axios.post(
        `${baseUrl}services/ecommerce/outsideItem/CreateOutsideItems?deliveryRouteId=${deleveryId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          data: formData,
        }
      );
      if (response) {
        console.log(response);
      }
    } catch (error) {
     // console.error("Failed to fetch ", error);
    }
  };

  useEffect(() => {
    if (searchTerm.trim()) {
      setFilteredProducts(
        products.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, products]);

  const handleAddItem = (selectedProduct) => {
    if (!quantity || !availableQuantity) {
      alert("Please fill out both Quantity and Available Quantity fields.");
      return;
    }
    if (addedItems.some((item) => item.id === selectedProduct.id)) {
      alert("Item already added.");
      return;
    }

    const newItem = {
      id: selectedProduct.id,
      code: selectedProduct.code,
      name: selectedProduct.name,
      quantity,
      availableQuantity,
    };

    setAddedItems([...addedItems, newItem]);
    setSearchTerm("");
    setQuantity("");
    setAvailableQuantity("");
    setFilteredProducts([]);
  };

  const handleDropdownItemClick = async (product) => {
    setSearchTerm(product.name);
    await setFilteredProducts([]);
  };

  return (
    <div>
      <table className="table table-bordered custom-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Item Code</th>
            <th>Item Name</th>
            <th style={{ width: "20%" }}>Quantity</th>
            <th style={{ width: "20%" }}>Available Quantity</th>
            <th style={{ width: "5%" }} className="text-end"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-1" colSpan={3} style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="Search Items..."
                className="p-1 w-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {filteredProducts.length > 0 && (
                <ul
                  className="dropdown-list"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    maxHeight: "200px",
                    overflowY: "auto",
                    background: "#fff",
                    border: "1px solid #ccc",
                    zIndex: 10,
                    listStyleType: "none",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  {filteredProducts.map((product) => (
                    <li
                      key={product.id}
                      style={{
                        padding: "8px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f0f0f0",
                      }}
                      onClick={() => handleDropdownItemClick(product)}
                    >
                      {product.name}
                    </li>
                  ))}
                </ul>
              )}
            </td>
            <td className="p-1">
              <input
                type="number"
                placeholder="Quantity"
                className="p-1 w-100"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </td>
            <td className="p-1">
              <input
                type="number"
                placeholder="Available Quantity"
                className="p-1 w-100"
                value={availableQuantity}
                onChange={(e) => setAvailableQuantity(e.target.value)}
              />
            </td>
            <td className="p-1">
              <button
                className="btn btn-sm bg-warning"
                onClick={() => {
                  const selectedProduct = products.find((product) =>
                    product.name
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  );
                  if (selectedProduct) handleAddItem(selectedProduct);
                }}
              >
                {loading ? "Loading..." : "Add"}
              </button>
            </td>
          </tr>
          {addedItems.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.code}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.availableQuantity}</td>
              <td>
                <a
                  onClick={() => handleRemoveItem(item.id)}
                  style={{ cursor: "pointer" }}
                >
                  <IoTrashOutline style={{ color: "red" }} />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleCreateOutsideItems} className="btn btn-sm text-white bg-success">
        Save Outside Items
      </button>
    </div>
  );
};

export default OutsideItemTableComponent;
