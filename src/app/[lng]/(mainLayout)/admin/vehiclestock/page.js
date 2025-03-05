"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthProvider } from "@/Helper/AuthContext/AuthContext";
import withAuth from "@/Components/AuthHOC/withAuth";
import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import I18NextContext from "@/Helper/I18NextContext";
import getExtraItemsService from "@/app/api/admin/ecommerce/getExtraItemsService";
import axios from "axios";
import { toast } from "react-toastify";

const VehicleStockPage = () => {
  const storedWarehouse = JSON.parse(localStorage.getItem("selectedWarehouse"));
  const { i18Lang } = useContext(I18NextContext);
  const searchParams = useSearchParams();
  const router = useRouter();
  const route = searchParams.get("route");
  const [items, setItems] = useState([]);
  const baseUrl = process?.env?.API_BASE_URL;

  const fetchExtraItems = async (route) => {
    try {
      const response = await getExtraItemsService(route);
      const updatedItems = response.result.map((item) => ({
        ...item,
        handoverQty: 0, 
        gap: item.quantity - item.salesQuantity, 
        handoverDate: new Date().toISOString().split("T")[0], 
      }));
      setItems(updatedItems);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    }
  };

  useEffect(() => {
    fetchExtraItems(route);
  }, []);

  const handleQuantityChange = (index, value) => {
    const updatedItems = [...items];
    const handoverQty = Number(value);
    updatedItems[index].handoverQty = handoverQty;
    updatedItems[index].gap = updatedItems[index].quantity - (updatedItems[index].salesQuantity + handoverQty);
    setItems(updatedItems);
  };

  const handleDateChange = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].handoverDate = value;
    setItems(updatedItems);
  };

  const handleBack = () => {
    router.push(`/${i18Lang}/admin/tobesettle`);
  }

  const isSubmitDisabled = items.some((item) => item.gap > 0 || item.gap < 0);

  const handleSubmit = async () => {
    const data = items.map((item) => ({
        deliveryRouteId: parseInt(route),
        productId: item.productId,
        productCode: item.productCode,
        productName: item.productName,
        warehouseId: item.warehouseId,
        warehouseCode: item.warehouseCode,
        warehouseName: item.warehouseName,
        sellingPrice: item.sellingPrice,
        returnQuantity: item.handoverQty,
        handOverDate: item.handoverDate,
      }));

    try {
      const response = await axios({
        method: "POST",
        url: `${baseUrl}services/ecommerce/checkout/RestoreVehicleStockToStockBalance?deliveryRouteId=${route}&warehouseId=${storedWarehouse.id}`,
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
          <div className="header text-sm mb-2" style={{ fontSize: "x-large", fontWeight: "600" }}>
            Vehicle Stock Handover
          </div>
          <a href={`/${i18Lang}/admin/tobesettle`} type="button"> Back </a>
        </div>
      </div>
      <div className="row d-flex justify-content-center">
        <div className="mt-2 mb-3 col-lg-8 col-12 table-responsive">
          <Formik initialValues={{}} onSubmit={handleSubmit}>
            {() => (
              <Form>
                <div className="row mt-2">
                  <div className="col-12 table-responsive">
                    <table className="table custom-table">
                      <thead>
                        <tr>
                          <th className="p-1">#</th>
                          <th className="p-1">Item&nbsp;Name</th>
                          <th className="p-1">Barcode</th>
                          <th className="p-1">Add Qty</th>
                          <th className="p-1">Sale Qty</th>
                          <th className="p-1">Handover Qty</th>
                          <th className="p-1">Gap</th>
                          <th className="p-1">Handover Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.length === 0 ? (
                          <tr>
                            <td className="p-2" colSpan={8}>No Items Available</td>
                          </tr>
                        ) : (
                          items.map((item, index) => (
                            <tr key={index}>
                              <td className="p-1">{index + 1}</td>
                              <td className="p-1">{item.productName}</td>
                              <td className="p-1">{item.productCode}</td>
                              <td className="p-1">
                                <input type="number" disabled value={item.quantity} className="form-control form-control-sm" />
                              </td>
                              <td className="p-1">
                                <input type="number" disabled value={item.salesQuantity} className="form-control form-control-sm" />
                              </td>
                              <td className="p-1">
                                <input type="number" className="form-control form-control-sm" value={item.handoverQty} onChange={(e) => handleQuantityChange(index, e.target.value)} />
                              </td>
                              <td className="p-1">
                                <input type="number" disabled className="form-control form-control-sm" value={item.gap} />
                              </td>
                              <td className="p-1">
                                <input type="date" className="form-control form-control-sm" value={item.handoverDate} onChange={(e) => handleDateChange(index, e.target.value)} />
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
                    <button onClick={handleBack} className="btn btn-sm bg-secondary text-white d-inline">Cancel</button>
                    <button type="submit" className="btn btn-sm btn-secondary theme-bg-color text-white d-inline" disabled={isSubmitDisabled}>Submit</button>
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

const ProtectedVehicleStockPage = withAuth(VehicleStockPage);

const VehicleStock = () => {
  return (
    <AuthProvider>
      <ProtectedVehicleStockPage />
    </AuthProvider>
  );
};

export default VehicleStock;
