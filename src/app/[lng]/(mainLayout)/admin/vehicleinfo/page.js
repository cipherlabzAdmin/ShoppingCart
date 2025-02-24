"use client";
import React, { useState, useEffect, useContext } from "react";
import RunningConditionCheck from "@/Components/Packloading/RunningConditionCheck";
import axios from "axios";
import Textbox from "@/Components/Map/Textbox";
import Dropdown from "@/Components/Map/Dropdown";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import getOrderDetails from "@/app/api/admin/ecommerce/orderService";
import ecomService from "@/app/api/admin/ecommerce/defaultService";
import I18NextContext from "@/Helper/I18NextContext";
import getDeliveryDetails from "@/app/api/admin/ecommerce/deliveryService";

const baseUrl = process?.env?.API_BASE_URL;

const PackLoading = () => {
  const storedWarehouse = JSON.parse(localStorage.getItem("selectedWarehouse"));
  const [warehouseId, setWarehouseId] = useState("");
  const [deleveryId, setdeleveryId] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [ricePacks, setRicePacks] = useState([]);
  const [extraItems, setExtraItems] = useState([]);
  const [outsideItems, setOutsideItems] = useState([]);
  const router = useRouter();

  const { i18Lang } = useContext(I18NextContext);

  const validationSchema = Yup.object({
    id: Yup.string().required("Vehicle Number is required"),
    distanceToFinalEndpoint: Yup.string().required(
      "Route Distance is required"
    ),
    openingMeterReading: Yup.string().required(
      "opening Meter Reading is required"
    ),
  });

  const extraItemsvalidationSchema = Yup.object({
    productName: Yup.string().required("Item Name is required"),
    quantity: Yup.string().required(),
  });

  useEffect(() => {
    if (storedWarehouse) {
      setWarehouseId(storedWarehouse.id);
    }    
  }, [storedWarehouse]);

  useEffect(() => {
    if (storedWarehouse) {
      const wId = storedWarehouse.id;
      const fetchVehicles = async () => {
        try {
          const response = await getDeliveryDetails({
            warehouseId: wId,
            skipCount: 0,
            maxResultCount: 100,
          });
          if (response) {
            const results = response.result.items.flatMap((element) => ({
              id: element.type,
              label: element.vehicleNumber,
              value: element.id,
            }));
            setVehicles(results);
            //console.log("vehicles: ", results);
          }
        } catch (error) {
          console.error("Failed to fetch vehicles:", error);
        }
      };

      if (wId) {
        fetchVehicles();
        setWarehouseId(wId);
      }
    }
  }, [warehouseId]);

  const fetchExtraItems = async (deliveryRouteId) => {
    if (deliveryRouteId == "") {
      setExtraItems([]);
      return;
    }
    try {
      const response = await ecomService(
        {
          deliveryRouteId: parseInt(deliveryRouteId),
          skipCount: 0,
          maxResultCount: 100,
        },
        "extraItem/GetAll"
      );
      if (response) {
        setExtraItems(response.result.items);
        console.log("extraItem/GetAll response: ", response.result);
      }
    } catch (error) {
      console.error("Failed to fetch extraItem/GetAll:", error);
    }
  };
  const fetchRicePacks = async (deliveryRouteId) => {
    if (deliveryRouteId == "") {
      setRicePacks([]);
      return;
    }
    try {
      const response = await ecomService(
        {
          deliveryRouteId: parseInt(deliveryRouteId),
          skipCount: 0,
          maxResultCount: 100,
        },
        "checkout/GetRicePacks"
      );
      if (response) {
        setRicePacks(response.result);
        console.log("checkout/GetRicePacks response: ", response.result);
      }
    } catch (error) {
      console.error("Failed to fetch checkout/GetRicePacks:", error);
    }
  };

  const fetchOutsidedItems = async (deliveryRouteId) => {
    if (deliveryRouteId == "") {
      setOutsideItems([]);
      return;
    }
    try {
      const response = await ecomService(
        {
          deliveryRouteId: parseInt(deliveryRouteId),
          skipCount: 0,
          maxResultCount: 100,
        },
        "outsideItem/GetAll"
      );
      if (response) {
        setOutsideItems(response.result.items);
        console.log("extraItem/GetAll response: ", response.result);
      }
    } catch (error) {
      console.error("Failed to fetch extraItem/GetAll:", error);
    }
  };

  useEffect(() => {
    if (storedWarehouse) {
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
            //console.log("getOrderDetails response: ", response.result);
            setOrderDetails(response.result.items);
          }
        } catch (error) {
          console.error("Failed to fetch OrderDetails:", error);
        }
      };
      fetchOrderDetails();

      const wId = storedWarehouse.id;

      if (wId) {
        setWarehouseId(wId);
      }
    }
  }, []);

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
              isEngineOil: false,
              isAir: false,
              isWater: false,
              isBrake: false,
              isCondition: false,
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              const formData = {
                ...values,
                warehouseId,
              };
              setSubmitting(false);

              try {
                const response = await axios({
                  method: "POST",
                  url: `${baseUrl}services/ecommerce/deliveryRoute/Update`,
                  headers: {
                    "Content-Type": "application/json",
                  },
                  data: formData,
                });
                if (response.data.success) {   
                  router.push(`/${i18Lang}/admin/packloading`);               
                  // console.log("delivery Route Response: ", response);
                }
              } catch (error) {
                console.error("Failed to fetch endpoints:", error);
              }
            }}
          >
            {({ isSubmitting, handleChange }) => (
              <Form>
                <div className="text-end mb-3">
                  <button
                    type="button"
                    className="btn btn-sm btn-primary d-inline me-3"
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-sm btn-secondary theme-bg-color text-white d-inline"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Submit
                  </button>
                </div>
                <div className={"vehicleForm"}>
                  <div className="row">
                    <div className={"section col-6"}>
                      <div className="header">Vehicle Information</div>

                      <div className="row">
                        <div className={"inputGroup col-6"}>
                          <Field
                            type="text"
                            name="id"
                            label="Vehicle No"
                            options={vehicles}
                            component={Dropdown}
                            onChange={(e) => {
                              setdeleveryId(e.target.value);
                              fetchExtraItems(e.target.value);
                              fetchRicePacks(e.target.value);
                              fetchOutsidedItems(e.target.value);
                            }}
                          />
                        </div>
                        <div className={"inputGroup col-6"}>
                          <Field
                            type="text"
                            name="distanceToFinalEndpoint"
                            label="Route Distance"
                            component={Textbox}
                          />
                        </div>

                        <div className={"inputGroup col-6"}>
                          <Field
                            type="text"
                            name="openingMeterReading"
                            label="Opening Meter Reading"
                            component={Textbox}
                          />
                        </div>

                        <div className={"inputGroup col-6"}>
                          <Field
                            type="text"
                            name="expectedEndMeterReading"
                            label="Expected End Meter Reading"
                            component={Textbox}
                          />
                        </div>
                      </div>
                    </div>
                    <div className={"section col-6"}>
                      <div className="header">IOU Information</div>
                      <div className="row">
                        <div className={`inputGroup col-6`}>
                          <Field
                            type="text"
                            label="Cash in Hand Balance"
                            name="cashInHand"
                            component={Textbox}
                          />
                        </div>
                        <div className={`inputGroup col-6`}>
                          <Field
                            type="text"
                            label="Previous IOU Balance"
                            name="previousIOUBalance"
                            component={Textbox}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className={"inputGroup col-6"}>
                          <Field
                            type="text"
                            label="Allocated IOU Amount"
                            name="allocatedIOUAmount"
                            component={Textbox}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={"section"}>
                    {/* <RunningConditionCheck /> */}
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

export default PackLoading;
