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
import { AuthProvider } from "@/Helper/AuthContext/AuthContext";
import withAuth from "@/Components/AuthHOC/withAuth";

const baseUrl = process?.env?.API_BASE_URL;

const SethandoverItems = () => {
  const searchParams = useSearchParams();
  const currentDate = new Date();
  const [selectedPackage, setSelectedPackage] = useState({});
  const [billValue, setBillValue] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
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
  const [downPayment, setDownPayment] = useState(null);

  const [removedItems, setRemovedItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);

  const handleRemovedItems = (items) => {
    setRemovedItems(items);
  };

  const handleCheckItems = (items) => {
    setCheckedItems(items);
  };

  const { i18Lang } = useContext(I18NextContext);

  useEffect(() => {
    const total = checkedItems.reduce(
      (sum, item) => sum + (item.totalPrice || 0),
      0
    );
    const delivery =
      parseFloat(total) + parseFloat(selectedPackage.deliverychargeAmount);
    setBillValue(total);
    setTotalValue(delivery);
    setRemovedOrders(removedItems);
    setAllItems(checkedItems);
  }, [checkedItems]);

  function formatCurrency(amount) {
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const fetchOrderDetails = async () => {
    try {
      const postData = {
        warehouseId: storedWarehouse.id,
        // status: 8,
        sortType: 1,
        skipCount: 0,
        maxResultCount: 100,
      };
      const response = await getOrderDetails(postData);

      if (response) {
        const filteredItems = response.result.items.filter(
          (item) => parseInt(item.id) === parseInt(checkoutId)
        );
        const tot = filteredItems[0].subTotal;
        const totalBal = filteredItems[0].totalAmount;
        setSelectedPackage(filteredItems[0]);
        setBillValue(tot);
        setTotalValue(totalBal);
      }
    } catch (error) {
      console.error("Failed to fetch OrderDetails:", error);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  const handleSetDownPayment = (event) => {
    setDownPayment(event.target.value);
  };
  const handleChangeCheckoutStatus = async () => {
    const admin = localStorage.getItem("AdminId");
    const data = {
      checkoutId: checkoutId,
      checkoutNo: selectedPackage.checkoutNo,
      eCommerceCustomerId: selectedPackage.eCommerceCustomerId,
      warehouseId: selectedPackage.warehouseId,
      warehouseCode: selectedPackage.warehouseCode,
      warehouseName: selectedPackage.warehouseName,
      paymentMethod: selectedPackage.paymentMethod,
      deliveryRouteId: selectedPackage.deliveryRouteId,
      deliveryRouteNo: selectedPackage.deliveryRouteNo,
      paymentDate: new Date(),
      paymentAmount: downPayment,
      isDownPayment: true,
      deliveryOfficerId: admin,
    };
    const updatecheckoutdata = {
      deliveryMethodId: selectedPackage.deliveryMethodId,
      discount: selectedPackage.discount,
      handOverUserId: parseInt(admin),
      isHandover: true,
      handOverTime: currentDate,
      uCartItems: allItems.map((item, index) => ({
        id: item.id,
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
        isNewEntry: false,
        isEdited: removedOrders.length > 0 ? true : false,
        handOverUserId: admin,
        isHandover: true,
        handOverTime: currentDate,
        isExtraItem: true,
      })),

      id: selectedPackage.id,
    };

    if (allItems.length === 0) {
      toast.error("No Items Available");
      return;
    }
    const postData = {
      checkoutId: checkoutId,
      productIds: allItems.map((product) => product.productId),
    };

    if(selectedPackage.paymentMethod === 3){
      if(downPayment === null || downPayment === 0){
        toast.info("Please Enter Downpayment");
        return;
      }
      try {
        const response = await axios.post(
          `${baseUrl}services/ecommerce/checkout/CreateCheckoutPayment`,
          data,
          { headers: { "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    }
    try {
      const response = await axios.post(
        `${baseUrl}services/ecommerce/checkout/UpdateCheckoutHandOverStatus`,
        postData,
        { headers: { "Content-Type": "application/json" } }
      );

      const updateresponse = await axios.post(
        `${baseUrl}services/ecommerce/checkout/Update`,
        updatecheckoutdata,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        toast.success("Checkout Items Updated Successfully");
        window.location.href = `/${i18Lang}/admin/handover`;
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [items1, items2, items3, items4, items5] = await Promise.all([
          getItems({ controller: "GetGeneralItems", id: checkoutId, route }),
          getItems({ controller: "GetCoolboxItems", id: checkoutId, route }),
          getItems({ controller: "GetChemicalboxItems", id: checkoutId, route }),
          getItems({ controller: "GetRicePacks", id: checkoutId, route }),
          getItems({ controller: "GetOutsideItems", id: checkoutId, route }),
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
}, [checkoutId, route]);



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
        <Items
          items={generalItems}
          onRemoveItems={handleRemovedItems}
          onCheckItems={handleCheckItems}
        />
      </div>
      <div className="row m-0 d-flex justify-content-center">
        <div className="col-lg-8 col-12">
          <h6 className="bg-light p-2">Cool Box Items</h6>
        </div>
        <Items
          items={coolBoxItems}
          onRemoveItems={handleRemovedItems}
          onCheckItems={handleCheckItems}
        />
      </div>
      <div className="row m-0 d-flex justify-content-center">
        <div className="col-lg-8 col-12">
          <h6 className="bg-light p-2">Chemical Items</h6>
        </div>
        <Items
          items={chemicalItems}
          onRemoveItems={handleRemovedItems}
          onCheckItems={handleCheckItems}
        />
      </div>
      <div className="row m-0 d-flex justify-content-center">
        <div className="col-lg-8 col-12">
          <h6 className="bg-light p-2">Rice Packet Items</h6>
        </div>
        <Items
          items={ricePacks}
          onRemoveItems={handleRemovedItems}
          onCheckItems={handleCheckItems}
        />
      </div>
      <div className="row m-0 d-flex justify-content-center">
        <div className="col-lg-8 col-12">
          <h6 className="bg-light p-2">Outside Items</h6>
        </div>
        <Items
          items={outsideItems}
          onRemoveItems={handleRemovedItems}
          onCheckItems={handleCheckItems}
        />
      </div>
      <div className="row m-0 d-flex justify-content-center">
        <div className="col-lg-8 col-12">
          <h6 className="bg-light p-2">Return Items</h6>
        </div>
        <ReturnItems
          items={removedItems}
          checkoutId={checkoutId}
          customerId={
            selectedPackage ? selectedPackage.eCommerceCustomerId : null
          }
        />
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
                <td className="p-1">{formatCurrency(billValue)}</td>
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
                <td className="p-1">{formatCurrency(totalValue)}</td>
              </tr>
              {selectedPackage.paymentMethod === 3 ? (
                <tr>
                  <td className="p-1">Down Payment</td>
                  <td className="p-1">
                    <input
                      onChange={handleSetDownPayment}
                      type="number"
                      value={downPayment}
                      placeholder="Enter Down Payment"
                      className="form-control w-50 form-control-sm"
                    />
                  </td>
                </tr>
              ) : (
                ""
              )}
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

const ProtectedSethandoverItemsPage = withAuth(SethandoverItems);

const handoverItemsPage = () => {
  return (
    <AuthProvider>
      <ProtectedSethandoverItemsPage />
    </AuthProvider>
  );
};

export default handoverItemsPage;