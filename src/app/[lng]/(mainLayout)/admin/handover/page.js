"use client";
import React, { useState, useContext, useEffect } from "react";
import MapDirection from "@/Components/Map/MapDirection";
import { useLoadScript } from "@react-google-maps/api";
import { AuthProvider } from "@/Helper/AuthContext/AuthContext";
import withAuth from "@/Components/AuthHOC/withAuth";
import DeliveryTable from "./delivery-tb";
import "./progress.css";
import getOrderDetails from "@/app/api/admin/ecommerce/orderService";

const SetHandoverPage = () => {
  const start = { lat: 7.006398, lng: 79.962609 };
  const [endpoints, setEndpoints] = useState([]);
  const [orders, setOrders] = useState([]);
  const [allPackages, setAllPackages] = useState([]);
  const route = localStorage.getItem("route");
  const storedWarehouse = JSON.parse(localStorage.getItem("selectedWarehouse"));

  const fetchOrderDetails = async (route) => {
    try {
      const postData = {
        warehouseId: storedWarehouse.id,
        status: 8,
        sortType: 1,
        skipCount: 0,
        maxResultCount: 100,
      };
      const response = await getOrderDetails(postData);

      setAllPackages(response.result.items);
    } catch (error) {
      console.error("Failed to fetch OrderDetails:", error);
    }
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAfKfHsz_gGYIaPGE1ITkYGILNDvvHCqYY",
    libraries: ["geometry"],
    mapIds: ["b80feb2184f1411f"],
  });


  useEffect(() => {
    const storedOrderDetails = localStorage.getItem("matchingOrders");
    fetchOrderDetails(route);
  
    if (storedOrderDetails) {
      const parsedOrders = JSON.parse(storedOrderDetails);  
      setTimeout(() => {
        const matchingPackages = allPackages.filter(pkg =>
          parsedOrders.some(order => order.packingNo === pkg.packingNo)
        );
  
        setOrders(matchingPackages);
      }, 500);
    }
  }, [allPackages]);
  
  return (
    <div className="container-fluid">
      <div className="row d-flex justify-content-center">
        <div className="col-lg-11 col-12">
          <div
            className="header text-center text-sm mb-2"
            style={{ fontSize: "x-large", fontWeight: "600" }}
          >
            Handover
          </div>
        </div>
        <div className="col-lg-11 col-12">
          <MapDirection start={start} endpoints={endpoints} />
        </div>
      </div>
      <div className="row d-flex justify-content-center">
        <div className="col-lg-10 my-3 col-12">
          <ul class="progressbar border-warning">
            {orders.map((item, index) => (
              <li className="border-success">{index+1}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="row d-flex justify-content-center">
        <DeliveryTable orders={orders} />
      </div>
    </div>
  );
};

const ProtectedSetHandoverPage = withAuth(SetHandoverPage);

const HandoverPage = () => {
  return (
    <AuthProvider>
      <ProtectedSetHandoverPage />
    </AuthProvider>
  );
};

export default HandoverPage;
