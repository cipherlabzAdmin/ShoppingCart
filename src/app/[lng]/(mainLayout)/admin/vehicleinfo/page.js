"use client";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Textbox from "@/Components/Map/Textbox";
import Dropdown from "@/Components/Map/Dropdown";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import I18NextContext from "@/Helper/I18NextContext";
import getDeliveryDetails from "@/app/api/admin/ecommerce/deliveryService";
import getIOUByUserId from "@/app/api/admin/ecommerce/getIOUbyUser";
import getVehicleDetails from "@/app/api/admin/ecommerce/getVehicleDetails";
import { AuthProvider } from "@/Helper/AuthContext/AuthContext";
import withAuth from "@/Components/AuthHOC/withAuth";

const baseUrl = process?.env?.API_BASE_URL;

const SetVehicleConfirmationPage = () => {
  const storedWarehouse = JSON.parse(localStorage.getItem("selectedWarehouse"));
  const [warehouseId, setWarehouseId] = useState(storedWarehouse?.id || "");
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState({});
  const [iouBalance, setIOUBalance] = useState(null);
  const [officer, setOfficer] = useState(null);
  const router = useRouter();
  const { i18Lang } = useContext(I18NextContext);
  const admin = localStorage.getItem("AdminId");


  const validationSchema = Yup.object({
    id: Yup.string().required("Vehicle Number is required"),
    distanceToFinalEndpoint: Yup.string().required(
      "Route Distance is required"
    ),
    openingMeterReading: Yup.string().required(
      "Opening Meter Reading is required"
    ),
    allocatedIOUAmount: Yup.string().required(
      "Allocated IOU Amount is required"
    ),
  });

  useEffect(() => {
    const fetchIOU = async () => {
      try {
        const response = await getIOUByUserId(admin);
        setIOUBalance(response.result.iouBalance);
      } catch (error) {
        console.error("Failed to fetch IOU balance:", error);
      }
    };
    fetchIOU();
  }, [admin]);

  useEffect(() => {
    if (warehouseId) {
      const fetchVehicles = async () => {
        try {
          const response = await getDeliveryDetails({
            warehouseId,
            skipCount: 0,
            isAvailable: true,
            maxResultCount: 100,
            isCompleted: false,
          });
          if (response?.result?.items) {
            setVehicles(
              response.result.items.map((element) => ({
                id: element.id,
                label: element.vehicleNumber || "Unknown",
                value: element.id,
                distance: element.routeDistanceInKM || "0",
                isAir: element.isAir,
                isWater: element.isWater,
                isCondition: element.isCondition,
                isBrake: element.isBrake,
                isEngineOil: element.isEngineOil,
                deliveryOfficerId: element.deliveryOfficerId,
                vehicleId: element.vehicleId,
              }))
            );
          }
        } catch (error) {
          console.error("Failed to fetch vehicles:", error);
        }
      };
      fetchVehicles();
    }
  }, [warehouseId]);

  const fetchVehicleDetails = async (deliveryOfficerId, vehicleId) => {
    try {
      const response = await getVehicleDetails(parseInt(deliveryOfficerId), parseInt(vehicleId));

      if (response.result) {
        setVehicle(response.result);
      }
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    }
  };

  const handleSubmit = async (values) => {
    const data = {
      warehouseId: storedWarehouse.id,
      vehicleId: vehicle.vehicleId,
      vehicleNumber: vehicle.vehicleNumber,
      driverId: vehicle.driverId,
      deliveryOfficerId: vehicle.deliveryOfficerId,
      openingMeterReading: parseFloat(values.openingMeterReading) || 0,
      openingMeterReadingImageUrl: vehicle.openingMeterReadingImageUrl,
      expectedEndMeterReading: parseFloat(values.expectedEndMeterReading),
      distanceToFinalEndpoint: parseFloat(values.distanceToFinalEndpoint),
      totalDistance: parseFloat(values.distanceToFinalEndpoint)|| 0,
      isEngineOil: values.isEngineOil,
      isAir: values.isAir,
      isWater: values.isWater,
      isBrake: values.isBrake,
      isCondition: values.isCondition,
      isCompleted: false,
      isReturnStockReturned: false,
      isVehicleStockReturned: false,
      isDownPaymentsSettled: false,
      allocatedIOUAmount: parseFloat(values.allocatedIOUAmount),
      routeDistanceInKM: parseFloat(values.distanceToFinalEndpoint),
      id: parseInt(values.id),
    };

    const ioudata = {
      userId: admin,
      iouBalance: values.allocatedIOUAmount,
      id: parseInt(values.id),
    };

    try {
      const response = await axios.post(
        `${baseUrl}services/ecommerce/deliveryRoute/Update`,
        JSON.stringify(data),
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.data.success) {
        router.push(`/${i18Lang}/admin/packloading`);
      }
    } catch (error) {
      console.error("Failed to submit data:", error);
    }
    try {
      const response = await axios.post(
        `${baseUrl}services/ecommerce/deliveryRoute/UpdateIOUBalanceByUserId`,
        JSON.stringify(ioudata),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Failed to submit data:", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row d-flex justify-content-center">
        <div className="col-12">
          <h2 className="mb-4 text-center">Vehicle Confirmation</h2>
        </div>
        <div className="col-12 col-md-6">
          <Formik
            initialValues={{
              id: "",
              distanceToFinalEndpoint: "",
              openingMeterReading: "",
              expectedEndMeterReading: "",
              cashInHand: "",
              previousIOUBalance: "",
              allocatedIOUAmount: "",
              isEngineOil: true,
              isAir: true,
              isWater: true,
              isBrake: true,
              isCondition: true,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue, values }) => {
              useEffect(() => {
                if (iouBalance !== null) {
                  setFieldValue("previousIOUBalance", iouBalance);
                }
              }, [iouBalance]);

              return (
                <Form>
                  <div className="d-flex justify-content-end mb-3">
                    <a
                      href={`/${i18Lang}/admin/driver`}
                      className="btn btn-sm btn-primary me-3"
                    >
                      Back
                    </a>
                    <button
                      className="btn btn-sm btn-secondary theme-bg-color text-white"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      Submit
                    </button>
                  </div>
                  <div className="vehicleForm row">
                    <div className="section col-12 col-lg-6 mb-3">
                      <div className="header">Vehicle Information</div>
                      <Field
                        type="text"
                        name="id"
                        label="Vehicle No"
                        options={vehicles}
                        component={Dropdown}
                        onChange={async (e) => {
                          const selectedVehicle = vehicles.find(
                            (v) => String(v.value) === String(e.target.value)
                          );
                          await fetchVehicleDetails(selectedVehicle.deliveryOfficerId, selectedVehicle.vehicleId);
                          const distance = selectedVehicle?.distance || "0";
                          setFieldValue("id", e.target.value);
                          setFieldValue("distanceToFinalEndpoint", distance);
                          setFieldValue("isAir", selectedVehicle.isAir);
                          setFieldValue(
                            "isEngineOil",
                            selectedVehicle.isEngineOil
                          );
                          setFieldValue("isWater", selectedVehicle.isWater);
                          setFieldValue("isBrake", selectedVehicle.isBrake);
                          setOfficer(selectedVehicle.deliveryOfficerId);
                          setFieldValue(
                            "isCondition",
                            selectedVehicle.isCondition
                          );
                          setFieldValue(
                            "expectedEndMeterReading",
                            (parseFloat(values.openingMeterReading) || 0) +
                              parseFloat(distance)
                          );
                        }}
                      />
                      <Field
                        type="text"
                        name="distanceToFinalEndpoint"
                        label="Route Distance"
                        component={Textbox}
                        disabled
                      />
                      <Field
                        type="text"
                        name="openingMeterReading"
                        label="Opening Meter Reading"
                        component={Textbox}
                        onChange={(e) => {
                          setFieldValue("openingMeterReading", e.target.value);
                          setFieldValue(
                            "expectedEndMeterReading",
                            (
                              parseFloat(e.target.value) +
                              (parseFloat(values.distanceToFinalEndpoint) || 0)
                            ).toFixed(2)
                          );
                        }}
                      />
                      <Field
                        type="text"
                        name="expectedEndMeterReading"
                        label="Expected End Meter Reading"
                        component={Textbox}
                        disabled
                      />
                    </div>
                    <div className="section col-12 mb-3 col-lg-6">
                      <div className="header">IOU Information</div>
                      <Field
                        type="text"
                        label="Cash in Hand Balance"
                        name="cashInHand"
                        component={Textbox}
                      />
                      <Field
                        type="text"
                        label="Previous IOU Balance"
                        name="previousIOUBalance"
                        component={Textbox}
                      />
                      <Field
                        type="text"
                        label="Allocated IOU Amount"
                        name="allocatedIOUAmount"
                        component={Textbox}
                      />
                    </div>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};

const ProtectedSetVehicleConfirmationPage = withAuth(SetVehicleConfirmationPage);

const VehicleConfirmationPage = () => {
  return (
    <AuthProvider>
      <ProtectedSetVehicleConfirmationPage />
    </AuthProvider>
  );
};

export default VehicleConfirmationPage;
