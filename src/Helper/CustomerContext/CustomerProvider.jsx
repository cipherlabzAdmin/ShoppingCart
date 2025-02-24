import React, { useEffect, useState } from "react";
import CustomerContext from ".";
import Cookies from "js-cookie";

const baseUrl = process?.env?.API_BASE_URL;

const CustomerProvider = (props) => {
  const [cities, setCities] = useState([]);
  const [fetchAddress, setFetchAddress] = useState(false);
  const [checkoutAddress, setCheckoutAddress] = useState([]);
  const [billingAddress, setBillingAddress] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [warehouseSelect, setWarehouseSelect] = useState();

  const isAuthString = Cookies.get("uatTemp");
  const isAuth = isAuthString ? JSON.parse(isAuthString) : null;

  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await fetch(
          `${baseUrl}services/app/common/GetAllCities`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Add any additional headers if needed
            },
          }
        ); // Replace with your API endpoint
        const citiesData = await response.json();
        setCities(citiesData.result);
        // setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        // setLoading(false);
      }
    }

    fetchCities();
  }, []);

  useEffect(() => {
    async function fetchCheckouAddress() {
      try {
        const response = await fetch(
          `${baseUrl}services/ecommerce/checkoutAddress/GetAll`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Add any additional headers if needed
            },
            body: JSON.stringify({
              checkoutId: null,
              eCommerceCustomerId: isAuth?.id,
            }),
          }
        ); // Replace with your API endpoint
        const address = await response.json();
        const filteredBillingAddresses = address.result.items
          .filter((item) => item.addressType === 1)
          .slice(-4);
        setBillingAddress(filteredBillingAddresses);

        const filteredCheckoutAddresses = address.result.items.filter(
          (item) => item.addressType === 2
        );
        setCheckoutAddress(filteredCheckoutAddresses);

        setFetchAddress(false);
        // setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        // setLoading(false);
      }
    }

    fetchCheckouAddress();
  }, [fetchAddress]);

  useEffect(() => {
    async function fetchWarehouses() {
      try {
        const response = await fetch(
          `${baseUrl}services/app/warehouse/GetAll`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Add any additional headers if needed
            },
            body: JSON.stringify({
              isActive: true,
              skipCount: 0,
              maxResultCount: 100,
            }),
          }
        ); // Replace with your API endpoint
        const result = await response.json();
        setWarehouses(result.result.items);
      } catch (error) {
        console.error("Error fetching products:", error);
        // setLoading(false);
      }
    }

    fetchWarehouses();
  }, []);

  return (
    <CustomerContext.Provider
      value={{
        ...props,
        cities,
        setCities,
        checkoutAddress,
        billingAddress,
        setFetchAddress,
        warehouses,
        warehouseSelect,
        setWarehouseSelect,
      }}
    >
      {props.children}
    </CustomerContext.Provider>
  );
};

export default CustomerProvider;
