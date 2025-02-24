import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  MarkerF,
  DirectionsRenderer,
  useLoadScript,
} from "@react-google-maps/api";
import { getDeliveryType } from "@/Helper/Order/OrderHelper";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
  // position: "relative", // Ensuring the map container is relative
};

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const createNumberIcon = (number) => {
  let svg = null;
  switch (number) {
    case "S":
      svg = encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
        <circle cx="12" cy="12" r="5" fill="blue" stroke="blue" stroke-width="2"/>
      </svg>`
      );
      break;
    case "1":
      svg = encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
        <circle cx="12" cy="12" r="5" fill="none" stroke="${getDeliveryType(
          1
        )}" stroke-width="2"/>
      </svg>`
      );
      break;
    case "2":
      svg = encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
        <circle cx="12" cy="12" r="5" fill="none" stroke="${getDeliveryType(
          2
        )}" stroke-width="2"/>
      </svg>`
      );
      break;
    case "3":
      svg = encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
        <circle cx="12" cy="12" r="5" fill="none" stroke="${getDeliveryType(
          3
        )}" stroke-width="2"/>
      </svg>`
      );
      break;
    case "4":
      svg = encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
        <circle cx="12" cy="12" r="5" fill="none" stroke="${getDeliveryType(
          4
        )}" stroke-width="2"/>
      </svg>`
      );
      break;

    default:
      break;
  }

  return {
    url: `data:image/svg+xml;utf8,${svg}`,
    // eslint-disable-next-line no-undef
    scaledSize: new google.maps.Size(40, 40),
    // eslint-disable-next-line no-undef
    anchor: new google.maps.Point(20, 20),
  };
};

const MapDirectionComponent = ({ start, endpoints, setOrder }) => {

  const [directions, setDirections] = useState(null);
  const [officeIcon, setOfficeIcon] = useState(null);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const mapRef = useRef();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAfKfHsz_gGYIaPGE1ITkYGILNDvvHCqYY",
    libraries: ["geometry"],
    mapIds: ["b80feb2184f1411f"],
  });

  const onLoad = (map) => {
    mapRef.current = map;
  };

  const getMarkerPosition = (markerLatLng) => {
    /*return new Promise((resolve) => {
      if (!mapRef.current) return { x: 0, y: 0 };

      const overlay = new google.maps.OverlayView();
      overlay.onAdd = function () {
        const projection = overlay.getProjection();
        const point = projection?.fromLatLngToContainerPixel(markerLatLng);
        overlay.setMap(null);
        if (!point) {
          resolve({ x: 0, y: 0 });
        } else {
          resolve({ x: point.x, y: point.y });
        }
      };
      overlay.draw = function () {};
      overlay.setMap(mapRef.current);
    });*/

    if (!mapRef.current) return { x: 0, y: 0 };

    // eslint-disable-next-line no-undef
    const overlay = new google.maps.OverlayView();
    overlay.draw = function () { }; // empty function required
    overlay.setMap(mapRef.current);
    const point = overlay
      ?.getProjection()
      ?.fromLatLngToContainerPixel(markerLatLng);

    // Remove overlay once used to avoid memory leaks
    overlay.setMap(null);

    return point ? { x: point.x, y: point.y } : { x: 0, y: 0 };
  };

  useEffect(() => {
    if (isLoaded) {
      // eslint-disable-next-line no-undef
      const point1 = new google.maps.LatLng(34.0522, -118.2437); // Los Angeles
      // eslint-disable-next-line no-undef
      const point2 = new google.maps.LatLng(36.1699, -115.1398); // Las Vegas
      // Compute the distance between the two points
      // eslint-disable-next-line no-undef
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        point1,
        point2
      );
      //console.log(distance / 1000);
    }
  }, [isLoaded]);
  useEffect(() => {
    if (isLoaded && endpoints.length > 0) {
      setOfficeIcon(createNumberIcon("S"));
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: start,
          destination: endpoints[endpoints.length - 1],
          waypoints: endpoints
            .slice(0, -1)
            .map((location) => ({ location, stopover: true })),
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          // eslint-disable-next-line no-undef
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Error fetching directions ${status}`);
          }
        }
      );
    }
  }, [isLoaded, start, endpoints]);

  if (!isLoaded) return <div>Loading...</div>;

  
  return (
    <div style={{ position: "relative" }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={start}
        zoom={10}
        onLoad={onLoad}
      >
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{ suppressMarkers: true }}
          />
        )}
        {officeIcon && (
          <MarkerF
            position={start}
            icon={officeIcon}
            // onMouseOver={() => setHoveredMarker("start")}
            // onMouseOut={() => setHoveredMarker(null)}
            onClick={() => console.log("Clicked start")}
          />
        )}
        {endpoints.map((endpoint, index) => (
          <MarkerF
            key={index}
            position={endpoint}
            icon={createNumberIcon(endpoint?.status?.toString())}
            onMouseOver={() =>
              setHoveredMarker({
                index: index + 1,
                no: endpoint.checkoutNo,
                isDisabled: endpoint.isDisabled,
              })
            }
            onMouseOut={() =>
              setTimeout(() => {
                setHoveredMarker(null);
              }, 5000)
            }
          //onClick={() => console.log(`Clicked marker ${index + 1}`)}
          // style={{ position: "relative" }}
          />
        ))}
      </GoogleMap>
      {hoveredMarker !== null && (
        <button
          onClick={() => setOrder(hoveredMarker.no)}
          style={{
            position: "absolute",
            top: `${getMarkerPosition(endpoints[hoveredMarker.index - 1]).y}px`,
            left: `${getMarkerPosition(endpoints[hoveredMarker.index - 1]).x}px`,
            // transform: "translate(-50%, -50%)",
            zIndex: 1000, // Ensure the button is above all map overlays
            backgroundColor: hoveredMarker.isDisabled ? "#808080" : "#e0c261", // Dark yellow color
            color: "black",
            padding: "4px 8px",
            border: "none",
            borderRadius: "10px", // Rounded borders
            cursor: "pointer",
            fontSize: "14px",
            outline: "none",
          }}
        >
          Order No: {hoveredMarker.no}
        </button>
      )}
    </div>
  );
};

export default MapDirectionComponent;
