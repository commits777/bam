"use client";

import { useEffect, useRef } from "react";
import type { Venue } from "@/lib/types";

interface MapViewProps {
  venues: Venue[];
  selectedVenue: Venue | null;
  onVenueSelect: (venue: Venue) => void;
}

export default function MapView({ venues, selectedVenue, onVenueSelect }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const markersRef = useRef<unknown[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically import leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      if (!mapRef.current || mapInstanceRef.current) return;

      // Fix default icon path issue with webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [37.975, 23.726],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      // CartoDB Positron — clean, minimal basemap, free
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution: "© OpenStreetMap contributors © CARTO",
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);

      // Custom attribution (small)
      L.control.attribution({ position: "bottomright", prefix: false }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapInstanceRef.current = map;

      // Add markers
      addMarkers(L, map, venues, selectedVenue, onVenueSelect);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update markers when venues/selection changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current as ReturnType<typeof L.map>;

      // Remove old markers
      markersRef.current.forEach((m) => (m as ReturnType<typeof L.marker>).remove());
      markersRef.current = [];

      addMarkers(L, map, venues, selectedVenue, onVenueSelect, markersRef);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venues, selectedVenue]);

  return (
    <div className="relative w-full h-full">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}

function addMarkers(
  L: typeof import("leaflet"),
  map: ReturnType<typeof L.map>,
  venues: Venue[],
  selectedVenue: Venue | null,
  onVenueSelect: (venue: Venue) => void,
  markersRef?: React.MutableRefObject<unknown[]>
) {
  venues.forEach((venue) => {
    const isSelected = selectedVenue?.id === venue.id;
    const isSponsored = venue.sponsored;

    const iconHtml = `
      <div style="
        width: ${isSelected ? 44 : 36}px;
        height: ${isSelected ? 44 : 36}px;
        background: ${isSelected ? "#0A0A0A" : isSponsored ? "#FFD000" : "#FF2D2D"};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 ${isSelected ? 8 : 4}px ${isSelected ? 20 : 12}px rgba(${isSelected ? "0,0,0" : "255,45,45"},${isSelected ? 0.4 : 0.35});
        cursor: pointer;
        transition: all 0.15s ease;
        border: 2px solid ${isSelected ? "#FFD000" : "rgba(255,255,255,0.3)"};
      ">
        <span style="
          transform: rotate(45deg);
          font-family: 'Archivo Black', sans-serif;
          font-size: ${isSelected ? 14 : 11}px;
          color: ${isSelected ? "#FFD000" : isSponsored ? "#0A0A0A" : "#FFFCF2"};
          font-weight: 900;
          line-height: 1;
        ">!</span>
      </div>
    `;

    const icon = L.divIcon({
      html: iconHtml,
      className: "",
      iconSize: [isSelected ? 44 : 36, isSelected ? 44 : 36],
      iconAnchor: [isSelected ? 22 : 18, isSelected ? 44 : 36],
    });

    const marker = L.marker([venue.lat, venue.lng], { icon })
      .addTo(map)
      .on("click", () => onVenueSelect(venue));

    // Popup on hover (desktop)
    marker.bindPopup(
      `<div style="padding:10px 14px;min-width:160px;">
        <div style="font-family:'Archivo Black',sans-serif;font-size:15px;color:#0A0A0A;margin-bottom:2px">${venue.name}</div>
        <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#888;letter-spacing:1px;text-transform:uppercase">${venue.neighborhood} · ${venue.budget}</div>
      </div>`,
      { closeButton: false, offset: [0, -10] }
    );

    if (markersRef) {
      markersRef.current.push(marker);
    }
  });
}
