"use client";

import { divIcon, icon } from "leaflet";
import { Polyline, Tooltip, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Map } from "leaflet";
import L from "leaflet";
import { MdLocationPin } from "react-icons/md";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const ClickableMap = ({ userPosition }: { userPosition: [number, number] }) => {
  const iconSizeOther: [number, number] = [60, 60];
  const ICON_OTHER = icon({
    iconUrl: "/location.png",
    iconSize: iconSizeOther,
  });
  const [marker, setMarker] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  useMapEvents({
    click: (e) => {
      setMarker([e.latlng.lat, e.latlng.lng]);
      //   const distanceInMeters = e.latlng.distanceTo(userPosition);
      //   setDistance(distanceInMeters);
    },
  });

  const map = useMap();
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (marker) {
      // Remove the old routing control if it exists
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }

      // Create a new routing control and add it to the map
      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(userPosition[0], userPosition[1]),
          L.latLng(marker[0], marker[1]),
        ],
        router: new (L.Routing.osrmv1 as any)({
          serviceUrl: "https://router.project-osrm.org/route/v1",
        }),
        lineOptions: {
          styles: [{ color: "blue", opacity: 1, weight: 5 }],
          extendToWaypoints: true,
          missingRouteTolerance: 0.02,
        },
        addWaypoints: false,
        fitSelectedRoutes: false,
        showAlternatives: false,
        routeWhileDragging: false,
        // here
      }).addTo(map);

      routingControlRef.current = routingControl;
    }
  }, [marker]);

  useEffect(() => {
    console.log("distance", distance);
  }, [distance]);

  return (
    <>
      {/* {marker ? <Marker position={marker} icon={ICON_OTHER} /> : null} */}
      {/* {marker ? (
        <Polyline positions={[userPosition, marker]} color="red" />
      ) : null} */}
      {/* {distance ? <p>Distance: {distance} meters</p> : null} */}
    </>
  );
};

const MapContainerComponent = () => {
  const iconSize: [number, number] = [100, 100];
  const iconSizeOther: [number, number] = [60, 60];
  const [position, setPosition] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  const ICON = divIcon({
    className: "custom-icon",
    html: `
        <div style='width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; position: relative;'>
          <div style='width: ${iconSize[0] / 2}px; height: ${
      iconSize[1] / 2
    }px; position: absolute; background-color: #1F619F; border-radius: 50%;'></div>
          <div class='pulseCircle2' style='width: ${iconSize[0]}px; height: ${
      iconSize[1]
    }px; position: absolute; background-color: #1F619F; border-radius: 50%;'></div>
        </div>
      `,
    iconSize: iconSize,
  });

  const ICON_OTHER = icon({
    iconUrl: "/location.png",
    iconSize: iconSizeOther,
  });

  return (
    <div className="z-0 w-screen h-[100svh] flex flex-col relative">
      <div className="w-full bg-white shadow-lg flex justify-between rounded-xl h-full">
        <MapContainer
          center={position}
          zoom={17}
          //   zoomControl={false}
          attributionControl={false}
          scrollWheelZoom={false}
          className="h-full"
          style={{ width: "100%", height: "100svh" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // OpenStreetMap tile layer URL
          />
          <Marker
            position={position}
            icon={ICON}
            // icon={ICON_OTHER}
          />
          <ClickableMap userPosition={position} />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapContainerComponent;

// const ClickableMap = () => {
//   const iconSizeOther: [number, number] = [60, 60];
//   const ICON_OTHER = icon({
//     iconUrl: "/location.png",
//     iconSize: iconSizeOther,
//   });
//   const [marker, setMarker] = useState<[number, number] | null>(null);

//   useMapEvents({
//     click: (e) => {
//       setMarker([e.latlng.lat, e.latlng.lng]);
//     },
//   });

//   return marker ? <Marker position={marker} icon={ICON_OTHER} /> : null;
// };
