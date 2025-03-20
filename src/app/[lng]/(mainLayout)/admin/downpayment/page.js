"use client";
import React, { useContext, useEffect, useState } from "react";
import { AuthProvider } from "@/Helper/AuthContext/AuthContext";
import withAuth from "@/Components/AuthHOC/withAuth";
import { Form, Formik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import I18NextContext from "@/Helper/I18NextContext";
import getDriverDetails from "@/app/api/admin/ecommerce/driverService";
import getVehiclesByIdService from "@/app/api/admin/ecommerce/getVehiclesByIdService";
import getDeliveryRouteService from "@/app/api/admin/ecommerce/getDeliveryRouteService";
import getDeliveryRoutePaymentSummaryByUserId from "@/app/api/admin/ecommerce/getDeliveryRoutePaymentSummaryByUserId";
import axios from "axios";
import { toast } from "react-toastify";

const ToBeSettlePage = () => {
  const router = useRouter();
  const admin = localStorage.getItem("AdminId");
  const { i18Lang } = useContext(I18NextContext);
  const storedWarehouse = JSON.parse(localStorage.getItem("selectedWarehouse"));
  const [officers, setOfficers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedOfficers, setSelectedOfficers] = useState(
    localStorage.getItem("selectedOfficer") || null
  );
  const baseUrl = process?.env?.API_BASE_URL;
  const [selectedVehicle, setSelectedVehicle] = useState(
    localStorage.getItem("selectedVehicle") || null
  );
  const [deliveryRoute, setDeliveryRoute] = useState(null);
  const [cashinhand, setCashinhand] = useState(null);
  const [totaldeliveryroutepayment, setTotaldeliveryroutepayment] =
    useState(null);
  const searchParams = useSearchParams();
  const route = searchParams.get("route");

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
      console.error("Failed to fetch delivery route:", error);
    }
  };

  const handleSetOfficer = async (event) => {
    const selectedValue = event.target.value;
    setSelectedOfficers(selectedValue);
  };

  const handleSetDeliveryRoute = async (event) => {
    const selectedValue = event.target.value;
    setSelectedVehicle(selectedValue);
    await fetchDeliveryRoute(selectedOfficers, selectedValue);
  };

  useEffect(() => {
    fetchVehicles(selectedOfficers);
    const fetchIOU = async () => {
      try {
        const response = await getDeliveryRoutePaymentSummaryByUserId(
          selectedOfficers,
          route
        );

        setCashinhand(response.result.allocatedIOUAmount);
        setTotaldeliveryroutepayment(
          response.result.totalDeliveryRoutePayments
        );
      } catch (error) {
        console.error("Failed to fetch IOU balance:", error);
      }
    };
    fetchIOU();
  }, [selectedOfficers, route]);

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
            const resultsOfficers = responseOfficers.result.items.map(
              (element) => ({
                label: element.fullName,
                value: element.id,
              })
            );
            setOfficers(resultsOfficers);
          }
        } catch (error) {
          console.error("Failed to fetch officers:", error);
        }
      };
      if (wId) {
        fetchDrivers();
      }
    }
  }, []);

  const handleSubmit = async (values) => {
    if (values.handoverDate === "") {
      toast.info("Please Enter Handover Date");
      return;
    }
    const data = {
      deliveryRouteId: parseInt(route),
      deliveryOfficerId: parseInt(selectedOfficers),
      vehicleId: parseInt(selectedVehicle),
      warehouseId: storedWarehouse.id,
      warehouseCode: storedWarehouse.code,
      warehouseName: storedWarehouse.name,
      cashInHandAmount: parseFloat(values.cashInHand),
      totalPaymentAmount: parseFloat(values.allowedPaymentDone),
      physicalHandOverAmount: parseFloat(values.physicalHandoverAmount),
      balanceAmount: parseFloat(values.systemBalance),
      physicalHandOverDate: values.handoverDate,
    };
    try {
      const response = await axios.post(
        `${baseUrl}services/ecommerce/deliveryRoute/CreateDeliveryRouteCashHandOver`,
        JSON.stringify(data),
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.success) {
        router.push(`/${i18Lang}/admin/tobesettle`);
      }
    } catch (error) {
      console.error("Failed to submit data:", error);
    }
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
            Back{" "}
          </a>
        </div>
      </div>
      <div className="row d-flex justify-content-center">
        <div className="mt-2 mb-3 col-lg-6 col-12 table-responsive">
          <Formik
            enableReinitialize
            initialValues={{
              deliveryOfficer: selectedOfficers,
              vehicleNumber: selectedVehicle,
              cashInHand: cashinhand !== null ? parseFloat(cashinhand) : 0,
              physicalHandoverAmount: 0,
              allowedPaymentDone:
                totaldeliveryroutepayment !== null
                  ? parseFloat(totaldeliveryroutepayment)
                  : 0,
              systemBalance: 0,
              handoverDate: "",
            }}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange }) => (
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
                      name="deliveryOfficer"
                      disabled
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
                      name="vehicleNumber"
                      disabled
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

                {[
                  { name: "cashInHand", label: "Cash in hand as at today" },
                  {
                    name: "physicalHandoverAmount",
                    label: "Physical handover amount",
                  },
                  {
                    name: "allowedPaymentDone",
                    label: "Payment done for allowed payment",
                  },
                  {
                    name: "systemBalance",
                    label: "System balance to be settled",
                  },
                  {
                    name: "handoverDate",
                    label: "Physical handover date",
                    type: "date",
                  },
                ].map(({ name, label, type = "text" }) => (
                  <div className="row mt-2" key={name}>
                    <div className="col-6 d-flex align-items-center">
                      <label>{label}</label>
                    </div>
                    <div className="col-6">
                      <input
                        type={type}
                        className="form-control border-secondary form-control-sm"
                        placeholder="Please Enter"
                        name={name}
                        value={values[name]}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                ))}

                <div className="row mt-2">
                  <div className="col-12 d-flex justify-content-end gap-2">
                    <button
                      type="button"
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

const ProtectedToBeSettlePage = withAuth(ToBeSettlePage);

const ToBeSettle = () => {
  return (
    <AuthProvider>
      <ProtectedToBeSettlePage />
    </AuthProvider>
  );
};

export default ToBeSettle;
