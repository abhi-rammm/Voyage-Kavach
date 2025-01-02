import React, { useEffect, useRef } from "react";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 19.076,
  lng: 72.8777,
};

export default function Map({ source, destination, sourceAddress, destinationAddress }) {
  const mapRef = useRef(null);

  const onLoad = (map) => {
    mapRef.current = map;
  };

  useEffect(() => {
    if (source && destination && mapRef.current) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(source);
      bounds.extend(destination);
      mapRef.current.fitBounds(bounds);
    }
  }, [source, destination]);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={10}
      center={source || defaultCenter}
      onLoad={onLoad}
    >
      {source && (
        <Marker position={source} label={sourceAddress || "Source"} />
      )}

      {destination && (
        <Marker position={destination} label={destinationAddress || "Destination"} />
      )}

      {source && destination && (
        <Polyline
          path={[source, destination]}
          options={{ strokeColor: "#FF0000", strokeOpacity: 1, strokeWeight: 2 }}
        />
      )}
    </GoogleMap>
  );
}
