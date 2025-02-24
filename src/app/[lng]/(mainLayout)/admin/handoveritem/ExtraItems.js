import ecomService from "@/app/api/admin/ecommerce/defaultService";
import React, { useEffect, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

const ExtraItems = () => {
  const [extraItems, setExtraItems] = useState([]);
  const route = localStorage.getItem("route");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [tableItems, setTableItems] = useState([]);

  const fetchExtraItems = async (route) => {
    if (route === "") {
      setExtraItems([]);
      return;
    }
    try {
      const response = await ecomService(
        {
          deliveryRouteId: parseInt(route),
          skipCount: 0,
          maxResultCount: 100,
        },
        "extraItem/GetAll"
      );
      if (response) {
        setExtraItems(response.result.items);
      }
    } catch (error) {
      console.error("Failed:", error);
    }
  };

  useEffect(() => {
    fetchExtraItems(route);
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      setFilteredProducts(
        extraItems.filter((product) =>
          product.productName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, extraItems]);

  console.log(filteredProducts);
  const handleDropdownItemClick = (product) => {
    setTableItems([
      ...tableItems,
      {
        id: product.id,
        productName: product.productName,
        quantity: product.quantity,
      },
    ]);
    setSearchTerm("");
  };

  const handleRemoveRow = (id) => {
    setTableItems(tableItems.filter((item) => item.id !== id));
  };

  return (
    <div className="row">
      <div className="col-12 table-responsive">
        <table className="table custom-table table-bordered">
          <thead>
            <tr>
              <td className="p-0" colSpan={7} style={{ position: "relative" }}>
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
                        {product.productName}
                      </li>
                    ))}
                  </ul>
                )}
              </td>
            </tr>
            <tr>
              <th className="p-1">#</th>
              <th className="p-1">Item Name</th>
              <th className="p-1">Quantity</th>
              <th className="p-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableItems.map((item, index) => (
              <tr key={item.id}>
                <td className="p-1">{index + 1}</td>
                <td className="p-1">{item.productName}</td>
                <td className="p-1">
                  <input
                    type="number"
                    className="p-1"
                    value={item.quantity}
                    onChange={(e) => {
                      const updatedItems = tableItems.map((tableItem) =>
                        tableItem.id === item.id
                          ? {
                              ...tableItem,
                              quantity: e.target.value,
                              total: e.target.value * item.offerPrice,
                            }
                          : tableItem
                      );
                      setTableItems(updatedItems);
                    }}
                  />
                </td>
                <td className="p-1">
                  <button
                    className="btn btn-sm text-danger"
                    onClick={() => handleRemoveRow(item.id)}
                  >
                    <FaRegTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="row">
          <div className="col-12 d-flex justify-content-end my-2">
            <button className="btn bg-warning btn-sm p-1">Save</button>
          </div>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default ExtraItems;
