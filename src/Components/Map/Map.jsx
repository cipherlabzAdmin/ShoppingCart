import { useTranslation } from "@/app/i18n/client";
import Btn from "@/Elements/Buttons/Btn";
import { ToastNotification } from "../../Utils/CustomFunctions/ToastNotification";

const baseUrl = process?.env?.API_BASE_URL;

import { useState, useMemo, useContext, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { RiMapPinLine, RiFormatClear } from "react-icons/ri";
import Cookies from 'js-cookie';

import I18NextContext from "@/Helper/I18NextContext";
import CustomerContext from "@/Helper/CustomerContext";

const MapComponent = ({ handleGetLocationClick, setModal ,type}) => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [searchLngLat, setSearchLngLat] = useState(null);
  const [locatedAddress, setLocatedAddress] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const { setFetchAddress } = useContext(CustomerContext);

  const [address, setAddress] = useState(null);
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  const YOUR_GOOGLE_MAPS_API_KEY = "AIzaSyAfKfHsz_gGYIaPGE1ITkYGILNDvvHCqYY";
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: YOUR_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [customer, setCustomer] = useState();

  const isAuthString = Cookies.get("uat");
  const isAuth = isAuthString ? JSON.parse(isAuthString) : null;
  useEffect(() => {
    if(isAuth !== "ManagerLogin" && isAuth){
      setCustomer(isAuth);
    } 
  }, [isAuth])

  if (!isLoaded) return <div>Loading....</div>;

  // static lat and lng
  const center = { lat: 6.932453, lng: 79.863463 };

  handleGetLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
  
          setSelectedPlace(null);
          setSearchLngLat(null);
          setCurrentLocation({ lat: latitude, lng: longitude });
          const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${YOUR_GOOGLE_MAPS_API_KEY}`;
  
          try {
            const response = await fetch(geocodeUrl);
            const data = await response.json();
  
            if (data.status === "OK" && data.results.length > 0) {
              setAddress(data.results[0].formatted_address);
              setLocatedAddress(data.results[0].formatted_address);
            } else {
              setAddress(`${latitude}, ${longitude}`);
            }
          } catch (error) {
            console.error("Geocode API error:", error);
            setAddress(`${latitude}, ${longitude}`); 
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };
  

  async function AddAddress() {
    const addressParts = address.split(", ");

    const addressLine1 = addressParts[0]; 
    const addressLine2 = addressParts.slice(1).join(", ");

    try {
      const response = await fetch(`${baseUrl}services/ecommerce/checkoutAddress/Create?checkoutId=1233`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any additional headers if needed
        },
        body: JSON.stringify([
          {
            "address1": addressLine1,
            "address2": addressLine2,
            "cityId": "00000000-0000-0000-0000-000000000000",
            "postalCode": "",
            "addressType": type === 'billing' ? 1 : 2,
            "locationLink": "string",
            "latitude": currentLocation.lat,
            "longitude": currentLocation.lng,
            "eCommerceCustomerId": customer.id
          }]),
      });
  
      const result = await response.json();
      if (result.success) {
        setFetchAddress(true);
        setModal(false);
        ToastNotification("success", "Added Address Successfully");
      }
    } catch (error) {
      console.log(error);
      // return NextResponse.json({
      //   message: "Something went wrong with the POST request",
      // });
    }
  }

  return (
    <>
      <div className="right-sidebar-box">
        <h4 className="text-center mb-4">
          <b>{t("Locate You -OR - Enter Your Location")}</b>{" "}
        </h4>

        <div className="flex row">
          <div class="">
            <PlacesAutocomplete
              setSelected={setCurrentLocation}
              setAddress={setAddress}
              showAddress={locatedAddress}
            />
          </div>
        </div>
        <div className="row p-2">
          <div className="col">
            <Btn
              className="btn-md w-100 fw-bold text-light theme-border-color"
              type="button"
              title="Locate Me"
              onClick={handleGetLocationClick}
            />
          </div>

          <div className="col">
            <Btn
              className="btn-md w-100 fw-bold text-light theme-bg-color"
              type="button"
              title="Confirm"
              onClick={AddAddress}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <GoogleMap
          zoom={currentLocation || selectedPlace ? 18 : 12}
          center={currentLocation || searchLngLat || center}
          mapContainerClassName="map"
          options={{ mapId: "b80feb2184f1411f" }}
          mapContainerStyle={{
            width: "100%",
            height: "600px",
            margin: "auto",
          }}
          // onLoad={onMapLoad}
        >
          {selectedPlace && <Marker position={searchLngLat} />}
          {currentLocation && <Marker position={currentLocation} />}
        </GoogleMap>
      </div>
    </>
  );
};

const PlacesAutocomplete = ({ setSelected, setAddress,showAddress }) => {
    const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setAddress(address);
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setSelected({ lat, lng });
  };

  return (
    <Combobox onSelect={handleSelect} style={{ zIndex: 10 }}>
      <div class="row">
        <div class="input-group">
          <ComboboxInput
            value={value || showAddress}
            onChange={(e) => setValue(e.target.value)}
            disabled={!ready}
            className="form-control"
            placeholder="Search an address"
            style={{ width: "100%" }}
          />
        </div>
      </div>
      <ComboboxPopover style={{ zIndex: 100000 }}>
        <ComboboxList className="flex">
          {status === "OK" &&
            data.map(({ place_id, description }, index) => (
              <div class="container" key={index}>
                <div class="d-flex justify-content-center">
                  <div class="p-2 flex-shrink-1">
                    <RiMapPinLine className="text-danger" />
                  </div>
                  <div class="w-100 mt-1">
                    <ComboboxOption
                      key={place_id}
                      value={description}
                      className="w-100"
                    ></ComboboxOption>
                  </div>
                </div>
              </div>
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};

export default MapComponent;
