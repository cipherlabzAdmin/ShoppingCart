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

const ToBeSettlePage = () => {
  const router = useRouter();
  const { i18Lang } = useContext(I18NextContext);
  const storedWarehouse = JSON.parse(localStorage.getItem("selectedWarehouse"));
  const [officers, setOfficers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [selectedOfficers, setSelectedOfficers] = useState(null);
    const [deliveryRoute, setDeliveryRoute] = useState(null);

    const fetchVehicles = async (driverId) => {
      try {
        const responseVehicles = await getVehiclesByIdService(driverId);
        setVehicles(responseVehicles.result);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      }
    };
    const fetchDeliveryRoute = async (driverId,vehicleId) => {
      try {
        const response = await getDeliveryRouteService(driverId,vehicleId);
        setDeliveryRoute(response.result.id);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      }
    };

    const handleSetOfficer = async (event) => {
      const selectedValue = event.target.value;
      setSelectedOfficers(selectedValue);
      await fetchVehicles(selectedValue);
    };
  
    const handleSetDeliveryRoute = async (event) => {
      const selectedValue = event.target.value;
      await fetchDeliveryRoute(selectedOfficers,selectedValue);
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
    }, []);
  const handleSubmit = () => {
    //alert();
  };
  return (
    <div className="container-fluid">
      <div className="row d-flex justify-content-center">
        <div className="col-lg-6 col-12 d-flex justify-content-between align-items-center">
          <div
            className="header text-sm mb-2"
            style={{ fontSize: "x-large", fontWeight: "600" }}
          >
            Down Payment Handover
          </div>
          <a href={`/${i18Lang}/admin/tobesettle`} type="button">
            {" "}
            Back
          </a>
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
                    <label>Cash in hand as at today</label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="form-control border-secondary form-control-sm"
                      placeholder="Please Enter"
                    />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-6 d-flex align-items-center">
                    <label>Physical handover amount</label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="form-control border-secondary form-control-sm"
                      placeholder="Please Enter"
                    />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-6 d-flex align-items-center">
                    <label>Payment done for allowed payment</label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="form-control border-secondary form-control-sm"
                      placeholder="Please Enter"
                    />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-6 d-flex align-items-center">
                    <label>System balance to be settle</label>
                  </div>
                  <div className="col-6">
                    <input
                      type="text"
                      className="form-control border-secondary form-control-sm"
                      placeholder="Please Enter"
                    />
                  </div>
                </div>
                <div className="row mt-2">
                  <div className="col-6 d-flex align-items-center">
                    <label>Physical handover date</label>
                  </div>
                  <div className="col-6">
                    <input
                      type="date"
                      className="form-control border-secondary form-control-sm"
                      placeholder="Please Enter"
                    />
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
