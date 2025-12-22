import { useEffect, useRef, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./map.css";

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null); // Changed from useState to useRef

  const [lng] = useState(105.8342);
  const [lat] = useState(21.0278);
  const [zoom] = useState(12);

  useEffect(() => {
    if (map.current) return; // Prevents re-initialization

    // Set API key inside useEffect or before component
    maptilersdk.config.apiKey = process.env.REACT_APP_MAPTILER_API_KEY;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.BRIGHT,
      center: [lng, lat],
      zoom: zoom,
    });

    // Optional: Add navigation controls
    map.current.addControl(new maptilersdk.NavigationControl(), 'top-right');

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [lng, lat, zoom]); // Removed 'map' from dependencies

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}