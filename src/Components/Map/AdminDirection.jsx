import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useLoadScript,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const createNumberIcon = (number, color = "#007cbf") => {
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40">
      <circle cx="20" cy="20" r="18" fill="${color}" />
      <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="14px" font-family="Arial" dy=".3em">${number}</text>
    </svg>`
  );

  return {
    url: `data:image/svg+xml;utf8,${svg}`,
    // eslint-disable-next-line no-undef
    scaledSize: new google.maps.Size(40, 40),
    // eslint-disable-next-line no-undef
    anchor: new google.maps.Point(20, 20),
  };
};

const AdminMapDirectionComponent = ({ start, endpoints }) => {
  const [directions, setDirections] = useState(null);
  const [officeIcon, setOfficeIcon] = useState(null);

  // Use an environment variable for your Google Maps API key
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAfKfHsz_gGYIaPGE1ITkYGILNDvvHCqYY",
    libraries: ["places"],
  });

  useEffect(() => {
    if (isLoaded) {
      // eslint-disable-next-line no-undef
      const scaledSize = new google.maps.Size(40, 40);

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
    <GoogleMap mapContainerStyle={mapContainerStyle} center={start} zoom={10}>
      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{ suppressMarkers: true }}
        />
      )}
      {officeIcon && <Marker position={start} icon={officeIcon} />}
      {officeIcon &&
        endpoints.map((endpoint, index) => (
          <Marker
            key={index}
            position={endpoint}
            icon={createNumberIcon(index + 1, "#A233FF")}
          />
        ))}
    </GoogleMap>
  );
};

export default AdminMapDirectionComponent;
