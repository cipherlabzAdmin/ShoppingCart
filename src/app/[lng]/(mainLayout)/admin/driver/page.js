"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import MapDirection from "@/Components/Map/MapDirection";
import Chart from "@/Components/Map/Chart";
import InfoBar from "@/Components/Map/InfoBar";
import TableComponent from "@/Components/Map/tableMap";
import Dropdown from "@/Components/Map/Dropdown";
import { useLoadScript } from "@react-google-maps/api";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import getVehicleDetails from "@/app/api/admin/ecommerce/vehicleService";
import getDriverDetails from "@/app/api/admin/ecommerce/driverService";
import getOrderDetails from "@/app/api/admin/ecommerce/orderService";
import { useRouter } from "next/navigation";
import I18NextContext from "@/Helper/I18NextContext";
import { AuthProvider } from "@/Helper/AuthContext/AuthContext";
import withAuth from "@/Components/AuthHOC/withAuth";
import { Toast } from "reactstrap";
import { toast } from "react-toastify";
import sendToNextStatus from "@/app/api/admin/ecommerce/sendToNext";

const baseUrl = process?.env?.API_BASE_URL;

const SetDriverOrderPage = () => {
  const validationSchema = Yup.object({
    vehicleId: Yup.string().required("Vehicle is required"),
    driverId: Yup.string().required("Driver is required"),
    deliveryOfficerId: Yup.string()
      .when("vehicleId", {
        is: (vehicleId) => {
          const selectedVehicle = vehicles.find((vehicle) => {
            return vehicle.id === parseInt(vehicleId);
          });
          return selectedVehicle ? selectedVehicle.isDeliveryOfficer : false;
        },
        then: Yup.string().required("Delivery Officer is required"),
        otherwise: Yup.string(),
      })
      .notOneOf(
        [Yup.ref("driverId")],
        "Driver and Delivery Officer cannot be the same"
      ),
  });
  const [endpoints, setEndpoints] = useState([]);
  const [response, setResponse] = useState([]);
  const [warehouseId, setWarehouseId] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [isSubmitting, setSubmitting] = useState();
  const [label, setLabel] = useState("");
  const [totalDistance, setTotalDistance] = useState(0);
  const router = useRouter();
  const storedWarehouse = JSON.parse(localStorage.getItem("selectedWarehouse"));
  const startLat = storedWarehouse ? storedWarehouse.latitude : "7.084";
  const startLng = storedWarehouse ? storedWarehouse.longitude : "80.0098";
  const start = { lat: parseFloat(startLat), lng: parseFloat(startLng) };
  const mapRef = useRef();

  const { i18Lang } = useContext(I18NextContext);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAfKfHsz_gGYIaPGE1ITkYGILNDvvHCqYY",
    libraries: ["geometry"],
    mapIds: ["b80feb2184f1411f"],
  });

  const handleSetSelectedVehicleName = (event) => {
    const val = event.target.value;
    const filteredItem = vehicleOptions.filter((item) => parseInt(item.value) === parseInt(val));
    
    setLabel(filteredItem[0].label);
  };

  useEffect(() => {
    if (storedWarehouse) {
      const wId = storedWarehouse.id;
      const fetchVehicles = async () => {
        try {
          const response = await getVehicleDetails({
            warehouseId: wId,
            // isAvailable: true,
            skipCount: 0,
            maxResultCount: 100,
          });
          if (response) {
            setVehicles(response.result.items);
            const results = response.result.items.flatMap((element) => ({
              label: element.vehicleNumber,
              value: element.id,
            }));
            setVehicleOptions(results);
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
  }, []);

  useEffect(() => {
    if (storedWarehouse) {
      const wId = storedWarehouse.id;
      const fetchDrivers = async () => {
        try {
          const responseDriver = await getDriverDetails({
            warehouseId: wId,
            userType: 4,
            skipCount: 0,
            maxResultCount: 100,
          });
          if (responseDriver) {
            //console.log("response fetchDrivers", responseDriver);
            const resultsDriver = responseDriver.result.items.flatMap(
              (element) => ({
                label: element.fullName,
                value: element.id,
              })
            );
            setDrivers(resultsDriver);
          }
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

  const computeDistanceInKilometers = (lat1, long1, lat2, long2) => {
    // eslint-disable-next-line no-undef
    const point1 = new google.maps.LatLng(lat1, long1);
    // eslint-disable-next-line no-undef
    const point2 = new google.maps.LatLng(lat2, long2);
    const distanceInMeters =
      // eslint-disable-next-line no-undef
      google.maps.geometry.spherical.computeDistanceBetween(point1, point2);
    const distanceInKilometers = distanceInMeters / 1000;

    return distanceInKilometers.toFixed(2);
  };

  useEffect(() => {
    if (isLoaded && mapRef.current) {
      const distance = computeDistanceInKilometers(
        34.0522,
        -118.2437,
        36.1699,
        -115.1398
      ); // Coordinates for Los Angeles and Las Vegas
      // setDistanceKm(distance);
      //console.log(`Distance in kilometers: ${distance}`);
    }
  }, [isLoaded]); // Depend on isLoaded to recompute if it changes

  useEffect(() => {
    const fetchEndpoints = async () => {
      const postData = {
        warehouseId: storedWarehouse.id,
        // status: 6,
        sortType: 1,
        skipCount: 0,
        maxResultCount: 1000,
        isHandover: false,
      };
      try {
        const response = await getOrderDetails(postData);
        if (response) {
          const filteredItems = response.result.items.filter(
            (item) => item.isHandover !== true && item.packingNo !== null
          );

          const itemsWithLatLong = filteredItems.map((item) => ({
            lat: parseFloat(item.latitude),
            lng: parseFloat(item.longitude),
            status: item.deliveryMethodId,
            checkoutId: item.checkoutId,
            checkoutNo: item.checkoutNo,
            isDisabled: false,
          }));

          setResponse(filteredItems);
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

  //console.log(22, endpoints);
  const headers = [
    { key: "checkoutNo", label: "ITEM CODE" },
    { key: "packingNo", label: "PACK NO" },
    { key: "customerName", label: "CUSTOMER" },
    { key: "timeCountAll", label: "TIME COUNT" },
    { key: "distance", label: "DISTANCE" },
    { key: "action", label: "Actions" },
  ];

  //console.log("response", endpoints);
  const [meterReading, setMeterReading] = useState("");

  const handleSelect = (event) => {
    setMeterReading(event.target.value);
  };
  const [selectedOdr, setSelectedOdr] = useState([]);

  const setSelectedOrder = (orderNo) => {
    //console.log("Order number to add:", orderNo);
    // Find the item in the response array
    const rep = response.find((item) => item.checkoutNo === orderNo);

    if (rep) {
      // Check if the item is already in the selectedOdr array
      const exists = selectedOdr.some((item) => item.checkoutNo === orderNo);

      if (!exists) {
        // Item does not exist, so add it
        const updatedData = [...selectedOdr, rep];
        //console.log("Adding new item, updated data:", updatedData);
        setSelectedOdr(updatedData);
        const newMapObj = endpoints.map((endpoint) => {
          return endpoint.checkoutNo === orderNo
            ? { ...endpoint, isDisabled: !endpoint.isDisabled }
            : endpoint;
        });
        setEndpoints(newMapObj);
      } else {
        // Item already exists, log or handle accordingly
        console.log("Item already exists, no update made.");
      }
    } else {
      // No item found with the given order number
      console.log("No item found with orderNo:", orderNo);
    }
  };

  // Function to handle the deletion of a row
  const handleDelete = (orderNo) => {
    const updatedOrderData = selectedOdr.filter(
      (item) => item.checkoutNo !== orderNo
    );
    setSelectedOdr(updatedOrderData);
    const newMapObj = endpoints.map((endpoint) => {
      return endpoint.checkoutNo === orderNo
        ? { ...endpoint, isDisabled: !endpoint.isDisabled }
        : endpoint;
    });
    setEndpoints(newMapObj);
  };

  const handleSubmit = async (values) => {
    if (selectedOdr.length === 0) {
      toast.error("Please select the Orders!");
      return false;
    }

    const checkoutIds = selectedOdr.map((item) => item.id);

    const data = {
      warehouseId: storedWarehouse.id,
      vehicleId: parseInt(values.vehicleId),
      vehicleNumber: label,
      driverId: parseInt(values.driverId),
      deliveryOfficerId: parseInt(values.deliveryOfficerId),
      openingMeterReading: "",
      openingMeterReadingImageUrl: "",
      expectedEndMeterReading: "",
      distanceToFinalEndpoint: "",
      totalDistance: "",
      isEngineOil: false,
      isAir: false,
      isWater: false,
      isBrake: false,
      isCondition: false,
      routeDistanceInKM: totalDistance,
      checkoutIds,
    };

    // const formData = {
    //   ...values,
    //   warehouseId,
    //   routeDistanceInKM: totalDistance,
    //   checkoutIds,
    // };
    try {
      const response = await axios({
        method: "POST",
        url: `${baseUrl}services/ecommerce/deliveryRoute/Create`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      });

      if (response) {
        const selectedIds = selectedOdr.map((item) => item.id);
        try {
          const response = await sendToNextStatus({ ids: selectedIds });
        } catch (error) {
          console.error("Failed to fetch IOU balance:", error);
        }
        router.push(`/${i18Lang}/admin/vehicleinfo`);
      }
    } catch (error) {
      console.error("Failed to fetch deliveryRoute endpoint:", error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="clo-6" style={{ width: "50%" }}>
          <div
            className="header text-end text-sm mb-2"
            style={{ fontSize: "x-large", fontWeight: "600" }}
          >
            Create Driver route
          </div>
          <MapDirection
            start={start}
            endpoints={endpoints}
            setOrder={setSelectedOrder}
          />
        </div>

        <div className="col-6" style={{ width: "50%" }}>
          <Formik
            initialValues={{
              vehicleId: "",
              driverId: "",
              deliveryOfficerId: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              handleSubmit(values, warehouseId);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="text-end mb-3 mt-3">
                  <button className="btn btn-sm btn-primary d-inline me-3">
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
                <div>
                  <Chart items={endpoints} />
                </div>
                <div className="pb-2">
                  <InfoBar isMain={false} />
                </div>
                <div>
                  <InfoBar isMain={true} />
                </div>
                <div className="row pt-2">
                  <div className="col-12">
                    <div className="row">
                      <div className="col-lg-4 col-12">
                        <Field
                          name="vehicleId"
                          label="Vehicle"
                          options={vehicleOptions}
                          component={Dropdown}
                          onChange={handleSetSelectedVehicleName}
                        />
                      </div>
                      <div className="col-lg-4 col-12">
                        <Field
                          name="driverId"
                          label="Driver"
                          options={drivers}
                          component={Dropdown}
                        />
                      </div>
                      <div className="col-lg-4 col-12">
                        <Field
                          name="deliveryOfficerId"
                          label="Delivery Officer"
                          options={officers}
                          component={Dropdown}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <div className="row">
        <TableComponent
          orderDetails={selectedOdr}
          handleDelete={handleDelete}
          headers={headers}
          start={start}
          computeDistanceInKilometers={computeDistanceInKilometers}
          setTotalDistance={setTotalDistance}
          widthPre="100%"
        />
      </div>
    </div>
  );
};

const ProtectedSetDriverOrderPage = withAuth(SetDriverOrderPage);

const DriverPage = () => {
  return (
    <AuthProvider>
      <ProtectedSetDriverOrderPage />
    </AuthProvider>
  );
};

export default DriverPage;
