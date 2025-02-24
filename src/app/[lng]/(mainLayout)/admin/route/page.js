"use client";
import AdminMapDirectionComponent from "@/Components/Map/AdminDirection";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProgressTracker from "@/Components/Map/OrderBarChart";
import TableComponent from "@/Components/Map/tableMap";

const baseUrl = process?.env?.API_BASE_URL;

const Admin = () => {
  const [endpoints, setEndpoints] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [steps, setSteps] = useState([]);
  let [currentStep, setCurrentStep] = useState(0);
  useEffect(() => {
    const fetchEndpoints = async () => {
      const postData = {
        sortType: 1,
        skipCount: 0,
        maxResultCount: 10,
      };
      try {
        const response = await axios({
          method: "post",
          url: `${baseUrl}services/ecommerce/checkout/GetAllDetails`,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify(postData),
        });
        if (response) {
          const itemsWithLatLong = response.data.result.items.map((item) => ({
            lat: parseFloat(item.latitude),
            lng: parseFloat(item.longitude), // If the attribute is named 'long', use 'long', otherwise use 'lng' if that's the correct attribute name.
          }));
          generateSteps(itemsWithLatLong.length);
          setOrderDetails(response.data.result.items.map((item) => item));
          setEndpoints(itemsWithLatLong);
        }

        // setEndpoints(response.data); // Assuming the data is an array of endpoint objects
      } catch (error) {
        console.error("Failed to fetch endpoints:", error);
        // Fallback to temporary data if API call fails
      }
    };

    fetchEndpoints();
  }, []);

  const generateSteps = (maxCount) => {
    const steps = [];
    for (let i = 1; i <= maxCount; i++) {
      steps.push(`Step ${i}`);
    }
    setSteps(steps);
  };

  const completeDelevery = (index) => {
    currentStep = index + 1;
    setCurrentStep(currentStep);
  };

  // Start location in Colombo, Sri Lanka
  const start = { lat: 6.977079, lng: 80.861244 };
  const headers = [
    { key: "checkoutNo", label: "NO" },
    { key: "mobileNo", label: "DELIVERY NO" },
    { key: "customerName", label: "CUSTOMER NAME" },
    { key: "timeCountAll", label: "TIME COUNT ALL" },
    { key: "packingNo", label: "PACK NO" },
    { key: "status", label: "DELIVERY STATUS" },
  ];
  //console.log("orderDatils", orderDetails);
  return (
    <div
      className="flex flex-col p-10 justify-content-center align-items-center"
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: "200px",
        paddingRight: "200px",
      }}
    >
      <div
        className="m-10"
        style={{
          // width: "70%",
          marginBottom: "40px",
        }}
      >
        {endpoints?.length > 0 ? (
          <AdminMapDirectionComponent start={start} endpoints={endpoints} />
        ) : (
          <div>Loading...</div> // Provides feedback while loading
        )}
      </div>
      <div
        style={{
          marginBottom: "40px",
        }}
      >
        <ProgressTracker steps={steps} currentStep={currentStep} />
      </div>
      <div>
        {orderDetails && (
          <TableComponent orderDetails={orderDetails} headers={headers} completeDelevery={completeDelevery} />
        )}
      </div>
    </div>
  );
};

export default Admin;
