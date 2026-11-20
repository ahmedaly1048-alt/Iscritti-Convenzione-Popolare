"use client";
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

export default function AdminMap({ places, onPick }) {
  const box = useRef(null);
  const st = useRef({ map: null, L: null, group: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !box.current) return;
      const map = L.map(box.current, { scrollWheelZoom: false }).setView([42.5, 12.5], 5);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: "© OpenStreetMap",
      }).addTo(map);
      st.current = { map, L, group: L.layerGroup().addTo(map) };
      setVersion((v) => v + 1);
    })();
    return () => {
      cancelled = true;
      if (st.current.map) st.current.map.remove();
      st.current = { map: null, L: null, group: null };
    };
  }, []);

  useEffect(() => {
    const { map, L, group } = st.current;
    if (!map) return;
    group.clearLayers();
    const pts = [];
    places.forEach((p) => {
      const radius = Math.min(9 + Math.sqrt(p.count) * 5, 36);
      const m = L.circleMarker([p.lat, p.lng], {
        radius, color: "#0b2545", weight: 2, fillColor: "#ffb703", fillOpacity: 0.75,
      }).addTo(group);
      m.bindTooltip(`${p.city}: ${p.count}`);
      m.on("click", () => onPick(p.city));
      pts.push([p.lat, p.lng]);
    });
    if (pts.length) map.fitBounds(pts, { padding: [40, 40], maxZoom: 9 });
  }, [version, places, onPick]);

  return <div ref={box} className="ad-map" />;
}