import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";

const createNumberedIcon = (number) =>
  L.icon({
    iconUrl: "/image/marker-icon-blue.png",
    shadowUrl: "/image/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowSize: [41, 41],
  });

const FitBounds = ({ positions }) => {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [positions, map]);
  return null;
};

const CaptureMap = ({ plannedPlaceList, setMapInstance }) => {
  const mapRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      setMapInstance(map);
    }
  }, [mapRef.current]);

  if (!plannedPlaceList || plannedPlaceList.length === 0 || !ready) return null;

  const positions = plannedPlaceList.map((p) => [
    p.placeLatLng.lat,
    p.placeLatLng.lng,
  ]);

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 480,
        height: 480,
        visibility: "hidden", // display: none ❌
        zIndex: -1,
      }}
    >
      <MapContainer
        center={positions[0]}
        zoom={13}
        style={{ width: 480, height: 480 }}
        ref={mapRef}
        whenReady={(e) => {
          setMapInstance(e.target);
        }}
      >
        <TileLayer
          crossOrigin={true}
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds positions={positions} />
        {positions.map((pos, idx) => (
          <Marker key={idx} position={pos} icon={createNumberedIcon(idx + 1)} />
        ))}
      </MapContainer>
    </div>
  );
};

export default CaptureMap;
