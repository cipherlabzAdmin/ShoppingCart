"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthProvider } from "@/Helper/AuthContext/AuthContext";
import withAuth from "@/Components/AuthHOC/withAuth";
import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import I18NextContext from "@/Helper/I18NextContext";
import axios from "axios";
import readBarcodeService from "@/app/api/admin/ecommerce/readBarcodeService";
import { toast } from "react-toastify";

const ReturnStockPage = () => {
  const storedWarehouse = JSON.parse(localStorage.getItem("selectedWarehouse"));
  const searchParams = useSearchParams();
  const router = useRouter();
  const route = searchParams.get("route");
  const [items, setItems] = useState([]);
  const [reasons, setReasons] = useState([]);
  const { i18Lang } = useContext(I18NextContext);
  const baseUrl = process?.env?.API_BASE_URL;

  const handleBack = () => {
    router.push(`/${i18Lang}/admin/tobesettle`);
  }

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

  const handleReadBarcode = async (event) => {
    var code = event.target.value;
    try {
      const response = await readBarcodeService(route, code);

      if (
        response.result?.productId !== "00000000-0000-0000-0000-000000000000"
      ) {
        const currentDate = new Date().toISOString().split("T")[0];
        setItems((prevItems) => [
          ...prevItems,
          { ...response.result, returnReason: "", handOverDate: currentDate },
        ]);
      }

      event.target.value = "";
    } catch (error) {
      console.error("Failed to fetch barcode data:", error);
    }
  };

  useEffect(() => {
    fetchReasons();
  }, []);

  const handleInputChange = (index, field, value) => {
    setItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[index] = { ...updatedItems[index], [field]: value };
      return updatedItems;
    });
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast.info("No Items Available to return");
      return;
    }
    const data = items.map((item) => ({
      deliveryRouteId: parseInt(route),
      productId: item.productId,
      productCode: item.productCode,
      productName: item.productName,
      warehouseId: item.warehouseId,
      warehouseCode: item.warehouseCode,
      warehouseName: item.warehouseName,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      discountRate: item.discountRate,
      discountAmount: item.discountAmount,
      totalPrice: item.totalPrice,
      eCommerceCustomerId: item.eCommerceCustomerId,
      checkoutId: item.checkoutId,
      returnReason: item.returnReason,
      handOverDate: item.handOverDate,
      id: item.id,
    }));

    try {
      const response = await axios({
        method: "POST",
        url: `${baseUrl}services/ecommerce/checkout/RestoreReturnItemStockToStockBalance?deliveryRouteId=${route}&warehouseId=${storedWarehouse.id}`,
        headers: {
          "Content-Type": "application/json",
        },
        data,
      });
      if(response.data.success){
        toast.success("Updated Successfully!");
        router.push(`/${i18Lang}/admin/tobesettle`);
      }
    } catch (error) {
      console.error("Failed to fetch deliveryRoute endpoint:", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row d-flex justify-content-center">
        <div className="col-lg-8 col-12 d-flex justify-content-between align-items-center">
          <div
            className="header text-sm mb-2"
            style={{ fontSize: "x-large", fontWeight: "600" }}
          >
            Return Stock Handover
          </div>
          <a href={`/${i18Lang}/admin/tobesettle`} type="button">
            {" "}
            Back
          </a>
        </div>
      </div>
      <div className="row d-flex justify-content-center">
        <div className="mt-2 mb-3 col-lg-8 col-12 table-responsive">
          <Formik initialValues={{ id: "" }} onSubmit={handleSubmit}>
            {() => (
              <Form>
                <div className="row mt-2">
                  <div className="col-3 d-flex align-items-center">
                    <label>Barcode</label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      style={{color: 'transparent'}}
                      className="form-control border-secondary form-control-sm"
                      onChange={handleReadBarcode}
                    />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-12 table-responsive">
                    <table className="table custom-table">
                      <thead>
                        <tr>
                          <th className="p-1">#</th>
                          <th className="p-1">Item Name</th>
                          <th className="p-1">Return Reason</th>
                          <th className="p-1">Handover Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.length === 0 ? (
                          <tr>
                            <td className="p-2" colSpan={5}>
                              No Items Available
                            </td>
                          </tr>
                        ) : (
                          items.map((item, index) => (
                            <tr key={index}>
                              <td className="p-1">{index + 1}</td>
                              <td className="p-1">{item.productName}</td>
                              <td className="p-1">
                                <select
                                  className="form-control form-control-sm"
                                  value={item.returnReason}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "returnReason",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option disabled value="">
                                    Please Select
                                  </option>
                                  {reasons.map((reason, idx) => (
                                    <option key={idx} value={reason.item1}>
                                      {reason.item2}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="p-1">
                                <input
                                  type="date"
                                  className="form-control form-control-sm"
                                  value={item.handOverDate}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "handOverDate",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-12 d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="btn btn-sm bg-secondary text-white d-inline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-sm btn-secondary theme-bg-color text-white d-inline"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

const ProtectedReturnStockPage = withAuth(ReturnStockPage);

const ReturnStock = () => {
  return (
    <AuthProvider>
      <ProtectedReturnStockPage />
    </AuthProvider>
  );
};

export default ReturnStock;
