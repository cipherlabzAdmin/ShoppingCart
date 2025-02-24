"use client";
import React, { useContext, useEffect, useState } from "react";
import Items from "../handover/Items";
import ReturnItems from "./Items";
import ExtraItems from "./ExtraItems";
import { useSearchParams } from "next/navigation";
import getOrderDetails from "@/app/api/admin/ecommerce/orderService";
import getItems from "./getItems";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import I18NextContext from "@/Helper/I18NextContext";
import { useRouter } from "next/router";

const baseUrl = process?.env?.API_BASE_URL;

const handoverItems = () => {
  const searchParams = useSearchParams();
  const [selectedPackage, setSelectedPackage] = useState({});
  const route = localStorage.getItem("route");
  const storedWarehouse = JSON.parse(localStorage.getItem("selectedWarehouse"));
  const checkoutId = searchParams.get("id");
  //const router = useRouter();

  const [generalItems, setGeneralItems] = useState([]);
  const [coolBoxItems, setCoolBoxItems] = useState([]);
  const [chemicalItems, setChemicalItems] = useState([]);
  const [ricePacks, setRicePacks] = useState([]);
  const [outsideItems, setOutsideItems] = useState([]);
  const [removedOrders, setRemovedOrders] = useState([]);
  const [allItems, setAllItems] = useState([]);

  const { i18Lang } = useContext(I18NextContext);

  useEffect(() => {
    const interval = setInterval(() => {
      const removed = localStorage.getItem("RemovedItems");
      const checked = localStorage.getItem("checkedItems");

      if (removed) {
        setRemovedOrders(JSON.parse(removed));
      }
      if (checked) {
        setAllItems(JSON.parse(checked));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const postData = {
        warehouseId: storedWarehouse.id,
        status: 8,
        sortType: 1,
        skipCount: 0,
        maxResultCount: 100,
      };
      const response = await getOrderDetails(postData);

      if (response) {
        const filteredItems = response.result.items.filter(
          (item) => parseInt(item.id) === parseInt(checkoutId)
        );

        setSelectedPackage(filteredItems[0]);
      }
    } catch (error) {
      console.error("Failed to fetch OrderDetails:", error);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const handleChangeCheckoutStatus = async () => {
    if (allItems.length === 0) {
      toast.error("No Items Available");
      return;
    }
    const postData = {
      checkoutId: checkoutId,
      productIds: allItems.map((product) => product.productId),
    };

    try {
      const response = await axios.post(
        `${baseUrl}services/ecommerce/checkout/UpdateCheckoutHandOverStatus`,
        postData,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.success) {
        toast.success("Checkout Items Updated Successfully");
        localStorage.removeItem("RemovedItems");
        localStorage.removeItem("checkedItems");
        window.location.href =`/${i18Lang}/admin/handover`;
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [items1, items2, items3, items4, items5] = await Promise.all([
          getItems({
            controller: "GetGeneralItems",
            id: checkoutId,
            route: route,
          }),
          getItems({
            controller: "GetCoolboxItems",
            id: checkoutId,
            route: checkoutId,
          }),
          getItems({
            controller: "GetChemicalboxItems",
            id: checkoutId,
            route: checkoutId,
          }),
          getItems({
            controller: "GetRicePacks",
            id: checkoutId,
            route: checkoutId,
          }),
          getItems({
            controller: "GetOutsideItems",
            id: checkoutId,
            route: checkoutId,
          }),
        ]);

        setGeneralItems(items1 || []);
        setCoolBoxItems(items2 || []);
        setChemicalItems(items3 || []);
        setRicePacks(items4 || []);
        setOutsideItems(items5 || []);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="row m-0 d-flex justify-content-center">
        <div className="col-lg-8 col-12">
          <h3 className="fw-bold my-3">
            Pack No : {selectedPackage.packingNo}
          </h3>
        </div>
      </div>
      <div className="row m-0 d-flex justify-content-center">
        <div className="col-lg-8 col-12">
          <h6 className="bg-light p-2">General Items</h6>
        </div>
        <Items items={generalItems} />
      </div>
      <div className="row m-0 d-flex justify-content-center">
        <div className="col-lg-8 col-12">
          <h6 className="bg-light p-2">Cool Box Items</h6>
        </div>
        <Items items={coolBoxItems} />
      </div>
      <div className="row m-0 d-flex justify-content-center">
        <div className="col-lg-8 col-12">
          <h6 className="bg-light p-2">Chemical Items</h6>
        </div>
        <Items items={chemicalItems} />
      </div>
      <div className="row m-0 d-flex justify-content-center">
        <div className="col-lg-8 col-12">
          <h6 className="bg-light p-2">Rice Packet Items</h6>
        </div>
        <Items items={ricePacks} />
      </div>
      <div className="row m-0 d-flex justify-content-center">
        <div className="col-lg-8 col-12">
          <h6 className="bg-light p-2">Outside Items</h6>
        </div>
        <Items items={outsideItems} />
      </div>
      <div className="row m-0 d-flex justify-content-center">
        <div className="col-lg-8 col-12">
          <h6 className="bg-light p-2">Return Items</h6>
        </div>
        <ReturnItems items={removedOrders} />
      </div>
      <div className="row m-0 d-flex justify-content-center">
        <div className="col-lg-8 col-12">
          <h4 className="my-2 fw-bold">Extra Items</h4>
        </div>
        <div className="col-lg-8 col-12">
          
          <ExtraItems />
        </div>
        
      </div>
      <div className="row m-0 d-flex justify-content-center">
        <div className="col-lg-8 col-12 table-responsive">
          <table className="table table-borderless">
            <tbody>
              <tr>
                <td className="p-1" style={{ width: "30%" }}>
                  Bill Value
                </td>
                <td className="p-1">{selectedPackage.subTotal}</td>
              </tr>
              <tr>
                <td className="p-1">Discounted Amount</td>
                <td className="p-1">{selectedPackage.discount}</td>
              </tr>
              {/* <tr>
                <td className="p-1">To Be Paid</td>
                <td className="p-1">{selectedPackage.totalAmount}</td>
              </tr> */}
              <tr>
                <td className="p-1">Delivery Charge</td>
                <td className="p-1">{selectedPackage.deliverychargeAmount}</td>
              </tr>
              <tr>
                <td className="p-1">Total Amount</td>
                <td className="p-1">{selectedPackage.totalAmount}</td>
              </tr>
              <tr>
                <td className="p-1">Down Payment</td>
                <td className="p-1">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="row m-0 mb-2 d-flex justify-content-center">
        <div className="col-lg-8 col-12 d-flex justify-content-end gap-2">
          <button className="btn bg-warning btn-sm" disabled>
            Bill Print
          </button>
          <button
            onClick={handleChangeCheckoutStatus}
            className="btn btn-sm btn-secondary theme-bg-color text-white d-inline"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default handoverItems;
