"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthProvider } from "@/Helper/AuthContext/AuthContext";
import withAuth from "@/Components/AuthHOC/withAuth";
import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import I18NextContext from "@/Helper/I18NextContext";
import getDriverDetails from "@/app/api/admin/ecommerce/driverService";
import getVehiclesByIdService from "@/app/api/admin/ecommerce/getVehiclesByIdService";
import getDeliveryRouteService from "@/app/api/admin/ecommerce/getDeliveryRouteService";
import { toast } from "react-toastify";
import getVehicleDetails from "@/app/api/admin/ecommerce/getVehicleDetails";
import axios from "axios";

const ToBeSettlePage = () => {
  const router = useRouter();
  const storedWarehouse = JSON.parse(localStorage.getItem("selectedWarehouse"));
  const { i18Lang } = useContext(I18NextContext);
  const [officers, setOfficers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState({});
  const baseUrl = process?.env?.API_BASE_URL;
  const [selectedOfficers, setSelectedOfficers] = useState(
    localStorage.getItem("selectedOfficer") || null
  );
  const [selectedVehicle, setSelectedVehicle] = useState(
    localStorage.getItem("selectedVehicle") || null
  );
  const [deliveryRoute, setDeliveryRoute] = useState(null);

  const returnstock = localStorage.getItem("return-stock");
  const vehiclestock = localStorage.getItem("vehicle-stock");
  const downpaymentcheck = localStorage.getItem("downpayment");

  const handleSubmit = async () => {
    
    if (!returnstock) {
      toast.info("Please Enter Return stock");
      return;
    }
    if (!vehiclestock) {
      toast.info("Please Enter Vehicle stock");
      return;
    }
    if (!downpaymentcheck) {
      toast.info("Please Enter Downpayment Details");
      return;
    }
    const data = {
      warehouseId: storedWarehouse.id,
      vehicleId: selectedVehicle,
      vehicleNumber: vehicle.vehicleNumber,
      driverId: vehicle.driverId,
      deliveryOfficerId: selectedOfficers,
      openingMeterReading: vehicle.openingMeterReading || 0,
      openingMeterReadingImageUrl: vehicle.openingMeterReadingImageUrl,
      expectedEndMeterReading: vehicle.expectedEndMeterReading,
      distanceToFinalEndpoint: vehicle.distanceToFinalEndpoint,
      totalDistance: vehicle.totalDistance || 0,
      isEngineOil: vehicle.isEngineOil,
      isAir: vehicle.isAir,
      isWater: vehicle.isWater,
      isBrake: vehicle.isBrake,
      isCondition: vehicle.isCondition,
      isCompleted: true,
      isReturnStockReturned: true,
      isVehicleStockReturned: true,
      isDownPaymentsSettled: true,
      allocatedIOUAmount: 0,
      routeDistanceInKM: 0,
      id: vehicle.id,
    };
    try {
      const response = await axios.post(
        `${baseUrl}services/ecommerce/deliveryRoute/Update`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        toast.success("Updated Successfully");
        localStorage.removeItem("selectedOfficer");
        localStorage.removeItem("selectedVehicle");
        localStorage.removeItem("return-stock");
        localStorage.removeItem("vehicle-stock");
        localStorage.removeItem("downpayment");
        window.location.href = `/${i18Lang}/admin/driver`;
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
    }
  };
  const handleReturnStock = () => {
    localStorage.setItem("return-stock", 1);
    if (deliveryRoute) {
      router.push(`/${i18Lang}/admin/returnstock?route=${deliveryRoute}`);
    } else {
      toast.info("Please Select Delivery Officer and Vehicle Number");
    }
  };
  const handleVehicleStock = () => {
    localStorage.setItem("vehicle-stock", 1);
    if (deliveryRoute) {
      router.push(`/${i18Lang}/admin/vehiclestock?route=${deliveryRoute}`);
    } else {
      toast.info("Please Select Delivery Officer and Vehicle Number");
    }
  };
  const handleDownPayment = () => {
    localStorage.setItem("downpayment", 1);
    router.push(`/${i18Lang}/admin/downpayment?route=${deliveryRoute}`);
  };

  const handleSetOfficer = async (event) => {
    const selectedValue = event.target.value;
    setSelectedOfficers(selectedValue);
    await fetchVehicles(selectedValue);
    localStorage.setItem("selectedOfficer", selectedValue);
  };

  const handleSetDeliveryRoute = async (event) => {
    const selectedValue = event.target.value;
    await fetchDeliveryRoute(selectedOfficers, selectedValue);
    setSelectedVehicle(selectedValue);
    localStorage.setItem("selectedVehicle", selectedValue);
    fetchVehicleDetails(selectedOfficers,selectedValue);
  };

  const fetchVehicleDetails = async (deliveryOfficerId,vehicleId) => {
    try {
      const response = await getVehicleDetails(deliveryOfficerId,vehicleId);
      setVehicle(response.result);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    }
  };

  const fetchVehicles = async (driverId) => {
    try {
      const responseVehicles = await getVehiclesByIdService(driverId);
      setVehicles(responseVehicles.result);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    }
  };
  const fetchDeliveryRoute = async (driverId, vehicleId) => {
    try {
      const response = await getDeliveryRouteService(driverId, vehicleId);
      setDeliveryRoute(response.result.id);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    }
  };

  useEffect(() => {
    if (storedWarehouse) {
      const wId = storedWarehouse.id;
      const fetchDrivers = async () => {
        try {
          const responseOfficers = await getDriverDetails({
            warehouseId: wId,
            userType: 5,
            skipCount: 0,
            maxResultCount: 100,
          });
          if (responseOfficers) {
            const resultsOfficers = responseOfficers.result.items.flatMap(
              (element) => ({
                label: element.fullName,
                value: element.id,
              })
            );
            setOfficers(resultsOfficers);
          }
        } catch (error) {
          console.error("Failed to fetch vehicles:", error);
        }
      };
      if (wId) {
        fetchDrivers();
      }
    }
    if (selectedOfficers) {
      fetchVehicles(selectedOfficers);
    }

    if (selectedVehicle && selectedOfficers) {
      fetchDeliveryRoute(selectedOfficers, selectedVehicle);
      fetchVehicleDetails(selectedOfficers,selectedVehicle);
    }
  }, []);

  return (
    <div className="container-fluid">
      <div className="row d-flex justify-content-center">
        <div className="col-lg-6 col-12">
          <div
            className="header text-sm mb-2"
            style={{ fontSize: "x-large", fontWeight: "600" }}
          >
            To Be Settle
          </div>
        </div>
      </div>
      <div className="row d-flex justify-content-center">
        <div className="mt-2 mb-3 col-lg-6 col-12 table-responsive">
          <Formik
            initialValues={{
              id: "",
            }}
            onSubmit={handleSubmit}
          >
            {({}) => (
              <Form>
                <div className="row mt-2">
                  <div className="col-6 d-flex align-items-center">
                    <label>Delivery Officer Name</label>
                  </div>
                  <div className="col-6">
                    <select
                      className="form-control border-secondary form-control-sm"
                      onChange={handleSetOfficer}
                      value={selectedOfficers}
                    >
                      <option disabled selected>
                        Please Select
                      </option>
                      {officers.map((officer, index) => (
                        <option key={index} value={officer.value}>
                          {officer.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-6 d-flex align-items-center">
                    <label>Vehicle Number</label>
                  </div>
                  <div className="col-6">
                    <select
                      className="form-control border-secondary form-control-sm"
                      onChange={handleSetDeliveryRoute}
                      value={selectedVehicle}
                    >
                      <option disabled selected>
                        Please Select
                      </option>
                      {vehicles.map((vehicle, index) => (
                        <option key={index} value={vehicle.id}>
                          {vehicle.vehicleNumber}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row mt-2">
                  <div className="col-6 d-flex align-items-center">
                    <label>Return Stock Handover</label>
                  </div>
                  <div className="col-6">
                    <button
                      onClick={handleReturnStock}
                      type="button"
                      className="btn btn-sm bg-success text-white d-inline"
                    >
                      Click here
                    </button>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-6 d-flex align-items-center">
                    <label>Vehicle Stock Handover</label>
                  </div>
                  <div className="col-6">
                    <button
                      onClick={handleVehicleStock}
                      type="button"
                      className="btn btn-sm bg-success text-white d-inline"
                    >
                      Click here
                    </button>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-6 d-flex align-items-center">
                    <label>Down Payment Handover</label>
                  </div>
                  <div className="col-6">
                    <button
                      onClick={handleDownPayment}
                      type="button"
                      className="btn btn-sm bg-success text-white d-inline"
                    >
                      Click here
                    </button>
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-12 d-flex justify-content-end gap-2">
                    <button className="btn btn-sm bg-secondary text-white d-inline">
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

const ProtectedToBeSettlePage = withAuth(ToBeSettlePage);

const ToBeSettle = () => {
  return (
    <AuthProvider>
      <ProtectedToBeSettlePage />
    </AuthProvider>
  );
};

export default ToBeSettle;
