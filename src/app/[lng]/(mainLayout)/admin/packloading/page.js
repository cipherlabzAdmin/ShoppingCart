"use client";
import React, { useState, useEffect, useCallback } from "react";
//import Breadcrumb from "@/Components/Common/Breadcrumb";
import RunningConditionCheck from "@/Components/Packloading/RunningConditionCheck";
import AdminMapDirectionComponent from "@/Components/Map/AdminDirection";
import axios from "axios";
import TableComponent from "@/Components/Map/tableMap";
import Textbox from "@/Components/Map/Textbox";
import withAuth from "@/Components/AuthHOC/withAuth";
import Dropdown from "@/Components/Map/Dropdown";
import SearchBar from "@/Components/Map/SearchBar";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import getOrderDetails from "@/app/api/admin/ecommerce/orderService";
import ecomService from "@/app/api/admin/ecommerce/defaultService";
import getDeliveryDetails from "@/app/api/admin/ecommerce/deliveryService";
import getProducts from "@/app/api/admin/ecommerce/productService";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import ExtraItemTableComponent from "@/Components/Map/addExtraItems";
import OutsideItemTableComponent from "@/Components/Map/addOutsideItems";
import getVehicleDetails from "@/app/api/admin/ecommerce/getVehicleDetails";
import sendToNextStatus from "@/app/api/admin/ecommerce/sendToNext";
import { AuthProvider } from "@/Helper/AuthContext/AuthContext";

const baseUrl = process?.env?.API_BASE_URL;

const SetPackLoadingPage = () => {
  // Start location in Colombo, Sri Lanka
  let { Auth } = "";
  Auth = Cookies.get("uatTemp");
  const currentUser = JSON.parse(Auth);

  const [endpoints, setEndpoints] = useState([]);
  const storedWarehouse = JSON.parse(localStorage.getItem("selectedWarehouse"));
  const startLat =
    storedWarehouse && storedWarehouse.latitude
      ? storedWarehouse.latitude
      : "7.084";
  const startLng =
    storedWarehouse && storedWarehouse.longitude
      ? storedWarehouse.longitude
      : "80.0098";
  const start = { lat: parseFloat(startLat), lng: parseFloat(startLng) };
  const [warehouseId, setWarehouseId] = useState("");
  const [deliveryId, setdeliveryId] = useState("");
  const [routeId, setRouteId] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [vehicle, setVehicle] = useState({});
  const [ricePacks, setRicePacks] = useState([]);
  const [extraItems, setExtraItems] = useState([]);
  const [extraKeyword, setExtraKeyword] = useState("");
  const [outsideItems, setOutsideItems] = useState([]);
  const [outsideKeyword, setOutsideKeyword] = useState("");
  const [products, setProducts] = useState([]);
  const [officer, setOfficer] = useState([]);
  const [extraProducts, setExtraProducts] = useState([]);
  const [outsideProducts, setOutsideProducts] = useState([]);
  const [product, setProduct] = useState([]);
  const [outsideProduct, setoutsideProduct] = useState([]);
  const [matchingItem, setMatchingItem] = useState({});
  const [matchingItems, setMatchingItems] = useState([]);

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

  const fetchEndpoints = async (value) => {
    try {
      const response = await ecomService(
        {
          sortType: 1,
          deliveryRouteId: parseInt(value),
          // skipCount: 0,
          // maxResultCount: 100,
        },
        "checkout/GetAllDetails"
      );
      if (response) {
        const itemsWithLatLong = response.result.items.map((item) => ({
          lat: parseFloat(item.latitude),
          lng: parseFloat(item.longitude), // If the attribute is named 'long', use 'long', otherwise use 'lng' if that's the correct attribute name.
          status: item.status,
        }));
        setEndpoints(itemsWithLatLong);
      }
    } catch (error) {
      console.error("Failed to fetch endpoints:", error);
      // Fallback to temporary data if API call fails
    }
  };

  const fetchVehicleDetails = async (devOfficer, vehicleId) => {
    try {
      const response = await getVehicleDetails(devOfficer, vehicleId);
      if (response.result) {
        setVehicle(response.result);
      }
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    }
  };

  const handleSetVehicle = (value, vehicleId, devOfficer) => {
    fetchEndpoints(value);
    fetchVehicleDetails(devOfficer, vehicleId);
  };

  const handleMatch = (item) => {
    if (item) {
      setMatchingItem(item);
      setMatchingItems((prevItems) => [...prevItems, item]);
    }
  };

  const handleNextStatus = async () => {
    const selectedIds = matchingItems.map((item) => item.id);
    try {
      const response = await sendToNextStatus({ ids: selectedIds });
    } catch (error) {
      console.error("Failed to fetch IOU balance:", error);
    }
  };

  const handleNext = async (values) => {
    if (!deliveryId) {
      toast.info("Please Select Vehicle No");
      return;
    }
    if (matchingItems.length <= 0) {
      toast.info("Please Select Orders");
      return;
    }

    localStorage.setItem("route", deliveryId);
    localStorage.setItem("matchingOrders", JSON.stringify(matchingItems));
    await handleNextStatus();
    window.location.href = "./handover";
  };

  useEffect(() => {
    if (storedWarehouse) {
      const wId = storedWarehouse.id;
      const fetchVehicles = async () => {
        try {
          const response = await getDeliveryDetails({
            warehouseId: wId,
            skipCount: 0,
            maxResultCount: 100,
            isCompleted: false,
            sortType: 1,
          });
          if (response) {
            const results = response.result.items.flatMap((element) => ({
              id: element.type,
              label: element.vehicleNumber,
              value: element.id,
              vehicleId: element.vehicleId,
              deliveryOfficerId: element.deliveryOfficerId,
            }));
            setVehicles(results);
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

  const headers = [
    { key: "id", label: "No" },
    { key: "deliveryRouteId", label: "Delivery No" },
    { key: "timeCountDelivery", label: "Time Count Delivery" },
    { key: "timeCountAll", label: "Time Count All" },
    { key: "packingNo", label: "Pack No" },
    { key: "Plastic", label: "Plastic Box Count" },
    { key: "coolbox", label: "Coolbox No" },
    { key: "coolboxCheck", label: "Coolbox Check", checkbox: true },
    { key: "chemical", label: "Checmical Pack" },
    { key: "check", label: "Check", checkbox: true },
  ];

  const CleanKeyword = async () => {
    setExtraKeyword("");
    setOutsideKeyword("");
  };
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
      }
    } catch (error) {
      console.error("Failed to fetch extraItem/GetAll:", error);
    }
  };

  const fetchOrderDetails = async (route) => {
    try {
      const postData = {
        warehouseId: storedWarehouse.id,
        status: 9,
        sortType: 1,
        skipCount: 0,
        maxResultCount: 100,
      };
      const response = await getOrderDetails(postData);

      if (response) {
        const filteredItems = response.result.items.filter(
          (item) => parseInt(item.deliveryRouteId) === parseInt(route)
        );

        setOrderDetails(filteredItems);
      }
    } catch (error) {
      console.error("Failed to fetch OrderDetails:", error);
    }
  };
  useEffect(() => {
    if (storedWarehouse) {
      if (routeId) {
        fetchOrderDetails(routeId);
      }
      const wId = storedWarehouse.id;
      if (wId) {
        setWarehouseId(wId);
      }
    }
  }, []);

  const fetchProducts = useCallback(
    async (keyword) => {
      try {
        const response = await getProducts(
          {
            keyword: keyword,
            isQuantityRequired: true,
            isActive: true,
            warehouseId: warehouseId,
            sortType: 1,
            skipCount: 0,
            maxResultCount: 200,
          },
          "product/GetAll"
        );
        if (response) {
          if (outsideKeyword) {
            setOutsideProducts(response.result.items);
          }
          if (extraKeyword) {
            setProducts(response.result.items);
          }
          setExtraProducts(response.result.items);
        }
      } catch (error) {
        console.error("Failed to fetch product/GetAll:", error);
      }
    },
    [extraKeyword, outsideKeyword, warehouseId]
  );

  useEffect(() => {
    if (extraKeyword != "") {
      if (extraKeyword && extraKeyword !== "") {
        fetchProducts(extraKeyword);
      } else {
        setProducts([]);
      }
    } else {
      if (outsideKeyword && outsideKeyword !== "") {
        fetchProducts(outsideKeyword);
      } else {
        setOutsideProducts([]);
      }
    }
  }, [extraKeyword, outsideKeyword, fetchProducts, extraProducts]);

  const ricePackHeaders = [
    { key: "productCode", label: "ITEM CODE" },
    { key: "productName", label: "ITEM NAME" },
    //{ key: "size", label: "SIZE" },
    { key: "quantity", label: "QUANTITY" },
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-md-6">
          <h2 className="mb-4 text-center">Pack Loading</h2>
          <AdminMapDirectionComponent start={start} endpoints={endpoints} />
        </div>
        <div className="col-12 col-md-6">
          <Formik
            initialValues={{
              id: parseInt(vehicle.id),
              distanceToFinalEndpoint: parseFloat(
                vehicle.distanceToFinalEndpoint
              ),
              openingMeterReading: parseFloat(vehicle.openingMeterReading),
              expectedEndMeterReading: parseFloat(
                vehicle.expectedEndMeterReading
              ),
              openingMeterReadingImageUrl: "",
              totalDistance: parseFloat(vehicle.totalDistance),
              isEngineOil: vehicle.isEngineOil,
              isAir: vehicle.isAir,
              isWater: vehicle.isWater,
              isBrake: vehicle.isBrake,
              isCondition: vehicle.isCondition,
              isCompleted: vehicle.isCompleted,
              vehicleId: vehicle.vehicleId,
              vehicleNumber: vehicle.vehicleNumber,
              driverId: vehicle.driverId,
              deliveryOfficerId: vehicle.deliveryOfficerId,
              isReturnStockReturned: false,
              isVehicleStockReturned: false,
              isDownPaymentsSettled: false,
              routeDistanceInKM: parseFloat(vehicle.routeDistanceInKM),
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              const formData = {
                id: parseInt(vehicle.id),
                distanceToFinalEndpoint: parseFloat(
                  vehicle.distanceToFinalEndpoint
                ),
                openingMeterReading: parseFloat(vehicle.openingMeterReading),
                expectedEndMeterReading: parseFloat(
                  vehicle.expectedEndMeterReading
                ),
                openingMeterReadingImageUrl: "",
                totalDistance: parseFloat(vehicle.totalDistance),
                isEngineOil: vehicle.isEngineOil,
                isAir: vehicle.isAir,
                isWater: vehicle.isWater,
                isBrake: vehicle.isBrake,
                isCondition: vehicle.isCondition,
                isCompleted: vehicle.isCompleted,
                vehicleId: vehicle.vehicleId,
                vehicleNumber: vehicle.vehicleNumber,
                driverId: vehicle.driverId,
                deliveryOfficerId: vehicle.deliveryOfficerId,
                isReturnStockReturned: false,
                isVehicleStockReturned: false,
                isDownPaymentsSettled: false,
                routeDistanceInKM: parseFloat(vehicle.routeDistanceInKM),
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
                if (response) {
                  window.location.href = "./handover";
                }
              } catch (error) {
                console.error("Failed to fetch endpoints:", error);
              }
            }}
          >
            {({ isSubmitting, handleChange }) => (
              <Form>
                <div className="text-end my-3">
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
                    onClick={handleNext}
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
                              const selectedVehicle = vehicles.find(
                                (v) =>
                                  String(v.value) === String(e.target.value)
                              );
                              setOfficer(selectedVehicle.deliveryOfficerId);
                              handleSetVehicle(
                                e.target.value,
                                selectedVehicle.vehicleId,
                                selectedVehicle.deliveryOfficerId
                              );
                              setdeliveryId(e.target.value);
                              setRouteId(e.target.value);
                              fetchExtraItems(e.target.value);
                              fetchRicePacks(e.target.value);
                              fetchOutsidedItems(e.target.value);
                              fetchOrderDetails(e.target.value);
                            }}
                          />
                        </div>
                        {/* <div className={"inputGroup col-6"}>
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
                        </div> */}
                      </div>
                    </div>
                    {/* <div className={"section col-6"}>
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
                    </div> */}
                  </div>
                  <div className={"section"}>
                    <RunningConditionCheck
                      routeId={routeId}
                      vehicle={vehicle}
                    />
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <div className="row mt-3">
        <SearchBar orderList={orderDetails} onMatch={handleMatch} />
      </div>
      <div className="row d-flex justify-content-center">
        <div className="col-12 col-lg-9">
          <TableComponent
            orderDetails={orderDetails}
            headers={headers}
            matchingItem={matchingItem}
            start={start}
          />
        </div>
        <div className="col-12 col-lg-9">
          <TableComponent
            orderDetails={ricePacks}
            headers={ricePackHeaders}
            showMainHeader={true}
            headerTitle="Rice Packs"
            start={start}
          />
        </div>
      </div>
      <div className="row my-3 d-flex justify-content-center">
        <div className="col-lg-9 col-12">
          <h6 className="bg-light fw-bold p-2">Extra Items</h6>
        </div>
        <div className="col-12 col-lg-9">
          <ExtraItemTableComponent
            warehouseId={warehouseId}
            deliveryId={deliveryId}
          />
          {/* <TableComponent
            orderDetails={extraItems}
            headers={ricePackHeaders}
            showHeaderForm={true}
            showMainHeader={true}
            headerTitle="Extra Items"
          /> */}

          {/* <Formik
            initialValues={{
              productId: "",
              productName: "",
              quantity: "",
            }}
            validationSchema={extraItemsvalidationSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              if (!deliveryId) {
                toast.error("Please select a vehicle number");
                return false;
              }

              const products = [
                {
                  productId: product.id,
                  size: values.size,
                  quantity: values.quantity,
                },
              ];
              const formData = {
                deliveryRouteId: deliveryId,
                warehouseId,
                products,
              };
              // Handle form submission
              try {
                const response = await axios({
                  method: "POST",
                  url: `${baseUrl}services/ecommerce/extraItem/Create`,
                  headers: {
                    "Content-Type": "application/json",
                  },
                  data: formData,
                });
                if (response) {
                  await fetchExtraItems(deliveryId);
                  resetForm();
                }
              } catch (error) {
                console.error("Failed to fetch extraItem/Create:", error);
              }
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, handleChange, setFieldValue }) => (
              <Form>
                
                <div className="row">
                  <div className="col-6">
                    <Field
                      type="text"
                      name="productName"
                      placeholder="Item Name"
                      className="p-1"
                      onChange={(e) => {
                        handleChange(e);
                        setExtraKeyword(e.target.value);
                      }}
                      component={Textbox}
                    />
                    {extraKeyword && products.length > 0 && (
                      <div
                        className=""
                        style={{
                          position: "absolute",
                          marginTop: "-10px",
                          zIndex: 1,
                          background: "white",
                          height: "438px",
                          overflowY: "auto",
                        }}
                      >
                        {products.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => {
                              setFieldValue("productName", product.name);
                              setProduct(product);
                              setProducts([]);
                              CleanKeyword();
                            }}
                            style={{
                              cursor: "pointer",
                              padding: "2px",
                              borderBottom: "1px solid",
                            }}
                          >
                            {product.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="col-3">
                    <Field
                      type="text"
                      name="quantity"
                      placeholder="Quantity"
                      className="p-1"
                      component={Textbox}
                    />
                  </div>
                  <div className="col-3">
                    <Field
                      type="text"
                      name="availableQuantity"
                      placeholder="Available Quantity"
                      className="p-1"
                      component={Textbox}
                    />
                  </div>
                  <div className="col-3">
                    <button
                      className="btn btn-sm btn-secondary theme-bg-color text-white d-inline "
                      type="submit"
                      disabled={isSubmitting}
                    >
                      + Extra Item
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik> */}
        </div>

        <div className="col-lg-9 col-12 mt-2">
          <h6 className="bg-light fw-bold p-2">Outside Items</h6>
        </div>
        <div className="col-12 col-lg-9">
          <OutsideItemTableComponent
            warehouseId={warehouseId}
            deliveryId={deliveryId}
          />
        </div>
        {/* <div className="col-12 col-lg-9">
          <TableComponent
            orderDetails={outsideItems}
            headers={ricePackHeaders}
            showMainHeader={true}
            headerTitle="Outside Items"
          />

          <Formik
            initialValues={{
              productId: "",
              // productName: "",
              quantity: "",
            }}
            validationSchema={extraItemsvalidationSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              if (!deliveryId) {
                toast.error("Please select a vehicle number");
                return false;
              }
              const formData = [
                {
                  productId: outsideProduct.id,
                  productCode: outsideProduct.code,
                  productName: outsideProduct.name,
                  quantity: values.quantity,
                },
              ];
              // Handle form submission POST /api/services/ecommerce/outsideItem/CreateOutsideItems?deliveryRouteId=
              try {
                const response = await axios({
                  method: "POST",
                  url:
                    `${baseUrl}services/ecommerce/outsideItem/CreateOutsideItems?deliveryRouteId=` +
                    deliveryId,
                  headers: {
                    "Content-Type": "application/json",
                  },
                  data: formData,
                });
                if (response) {
                  await fetchOutsidedItems(deliveryId);
                  resetForm();
                }
              } catch (error) {
                console.error("Failed to fetch outsideItem/Create:", error);
              }
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, handleChange, setFieldValue }) => (
              <Form>
                <div className="row border-1">
                  <div className="col-6">
                    <Field
                      type="text"
                      name="productName"
                      placeholder="Item Name"
                      className="p-1"
                      onChange={(e) => {
                        handleChange(e);
                        setOutsideKeyword(e.target.value);
                      }}
                      component={Textbox}
                    />
                    {outsideKeyword && outsideProducts.length > 0 && (
                      <div
                        className=""
                        style={{
                          position: "absolute",
                          marginTop: "-10px",
                          zIndex: 1,
                          background: "white",
                          height: "438px",
                          overflowY: "auto",
                        }}
                      >
                        {outsideProducts.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => {
                              setFieldValue("productName", product.name);
                              setoutsideProduct(product);
                              setOutsideProducts([]);
                              CleanKeyword();
                            }}
                            style={{
                              cursor: "pointer",
                              padding: "2px",
                              borderBottom: "1px solid",
                            }}
                          >
                            {product.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="col-3">
                    <Field
                      type="text"
                      name="quantity"
                      placeholder="Quantity"
                      className="p-1"
                      component={Textbox}
                    />
                  </div>
                  <div className="col-3">
                    <button
                      className="btn btn-sm btn-secondary theme-bg-color text-white d-inline "
                      type="submit"
                      disabled={isSubmitting}
                    >
                      + Outside Item
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div> */}
      </div>
    </div>
  );
};

const ProtectedSetPackLoadingPage = withAuth(SetPackLoadingPage);

const PackLoadingPage = () => {
  return (
    <AuthProvider>
      <ProtectedSetPackLoadingPage />
    </AuthProvider>
  );
};

export default PackLoadingPage;
