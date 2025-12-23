// ============================================
// IMPORTS
// ============================================

// React hooks for managing component lifecycle and state
import { useEffect, useRef, useState } from "react";

// MapTiler SDK - the library that creates and manages the map
import * as maptilersdk from "@maptiler/sdk";

// MapTiler's default CSS styles for the map (required!)
import "@maptiler/sdk/dist/maptiler-sdk.css";

// Your custom CSS for the map container
import "./Map.css";

// ============================================
// COMPONENT DEFINITION
// ============================================

export default function Map() {
  
  // ============================================
  // REFS - Values that persist but don't trigger re-renders
  // ============================================
  
  // Ref to the HTML div element that will contain the map
  // Used to tell MapTiler SDK where to render the map
  const mapContainer = useRef(null);
  
  // Ref to store the map instance itself
  // Using useRef instead of useState because:
  // 1. We don't want to trigger re-renders when map changes
  // 2. We need the map object to persist across renders
  // 3. We need to prevent creating multiple map instances
  const map = useRef(null);

  // ============================================
  // STATE - Values that can trigger re-renders
  // ============================================
  
  // Map center longitude (Hanoi, Vietnam)
  // Using array destructuring without setter because we don't change it
  const [lng] = useState(105.8342);
  
  // Map center latitude (Hanoi, Vietnam)
  const [lat] = useState(21.0278);
  
  // Initial zoom level (12 = city level view)
  const [zoom] = useState(12);
  
  // Track if there's an error loading the map
  const [hasError, setHasError] = useState(false);
  
  // Track if the map is still loading
  const [isLoading, setIsLoading] = useState(true);

  // ============================================
  // EFFECT - Runs after component mounts and when dependencies change
  // ============================================
  
  useEffect(() => {
    // GUARD CLAUSE: If map already exists, don't create another one
    // This prevents duplicate maps when React re-renders
    if (map.current) return;
    
    // Get API key from environment variables
    // VITE_ prefix required for Vite to include it in browser bundle
    const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;

    // TRY-CATCH: Wrap map initialization to handle any errors gracefully
    try {
      // Step 1: Configure MapTiler SDK with your API key
      // This must happen before creating the map
      maptilersdk.config.apiKey = apiKey;

      // Step 2: Create the map instance
      map.current = new maptilersdk.Map({
        // Tell MapTiler which HTML element to render the map into
        container: mapContainer.current,
        
        // Set the map style (BRIGHT is a light, clean style)
        // Other options: STREETS, SATELLITE, OUTDOOR, etc.
        style: maptilersdk.MapStyle.BRIGHT,
        
        // Set initial map center [longitude, latitude]
        center: [lng, lat],
        
        // Set initial zoom level
        zoom: zoom,
      });

      // Step 3: Add EVENT LISTENER for map errors
      // If map fails to load tiles or encounters problems
      map.current.on('error', (error) => {
        console.error('Map error:', error);
        setHasError(true);      // Show error state to user
        setIsLoading(false);    // Stop showing loading indicator
      });

      // Step 4: Add EVENT LISTENER for when map finishes loading
      // 'load' event fires when map is fully initialized and ready
      map.current.on('load', () => {
        setIsLoading(false);    // Hide loading indicator
      });

      // Step 5: Add navigation controls (zoom buttons + compass)
      // 'top-right' positions the controls in the top-right corner
      map.current.addControl(
        new maptilersdk.NavigationControl(), 
        'top-right'
      );

      // CLEANUP FUNCTION: Runs when component unmounts
      // This prevents memory leaks by properly destroying the map
      return () => {
        if (map.current) {
          map.current.remove();    // Destroy the map instance
          map.current = null;      // Clear the reference
        }
      };
      
    } catch (error) {
      // CATCH: Handle any errors during map initialization
      console.error('Failed to initialize map:', error);
      setHasError(true);     // Show error state
      setIsLoading(false);   // Stop loading indicator
    }
    
  }, [lng, lat, zoom]); 
  // DEPENDENCIES: Effect re-runs if lng, lat, or zoom change
  // Note: We don't include 'map' because it's a ref, not state

  // ============================================
  // RENDER - What gets displayed on screen
  // ============================================
  
  return (
    // Outer wrapper div (styled in Map.css)
    <div className="map-wrap">
      {/* 
        Inner div that will contain the actual map
        - ref={mapContainer} attaches this div to our ref
        - MapTiler SDK will inject the map canvas into this div
      */}
      <div ref={mapContainer} className="map" />
    </div>
  );
}

// ============================================
// HOW IT ALL WORKS TOGETHER:
// ============================================
// 1. Component mounts → useEffect runs
// 2. Check if map already exists (guard clause)
// 3. Get API key from environment
// 4. Create map instance and attach to mapContainer div
// 5. Set up event listeners (error, load)
// 6. Add navigation controls
// 7. Map renders inside the div
// 8. When component unmounts → cleanup runs → map destroyed
// ============================================