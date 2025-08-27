import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { MapPin, Filter } from "lucide-react";

interface FishingMapProps {
  onLocationSelect: (location: any) => void;
}

export function FishingMap({ onLocationSelect }: FishingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const { data: locations, isLoading } = useQuery({
    queryKey: ["/api/fishing-locations"],
  });

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize Leaflet map dynamically (if not already loaded)
    const initMap = async () => {
      const L = (window as any).L;
      if (!L) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => initMapInstance();
        document.body.appendChild(script);
      } else {
        initMapInstance();
      }
    };

    const initMapInstance = () => {
      const L = (window as any).L;
      const map = L.map(mapRef.current).setView([45.9432, 24.9668], 7);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap | PescArt România',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!locations || !mapInstanceRef.current) return;

    // remove existing markers
    markersRef.current.forEach(m => {
      try { mapInstanceRef.current.removeLayer(m); } catch(e) {}
    });
    markersRef.current = [];

    const L = (window as any).L;
    if (!L) return;

    const getMarkerOptions = (type: string) => {
      const colors: Record<string,string> = {
        river: '#3B82F6',
        lake: '#60A5FA',
        pond: '#0EA5A9',
        private_pond: '#8B5CF6',
        coastal: '#06B6D4'
      };
      const color = colors[type] || '#6B7280';
      return {
        radius: 6,
        weight: 1,
        color: '#ffffff',
        fillColor: color,
        fillOpacity: 0.9
      };
    };

    (locations || []).forEach((location: any) => {
      if (selectedFilter !== "all" && location.type !== selectedFilter) return;

      const lat = parseFloat(location.latitude as any);
      const lng = parseFloat(location.longitude as any);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      const marker = L.circleMarker([lat, lng], getMarkerOptions(location.type));

      const typeLabel = location.type === 'river' ? 'Râu' :
                        location.type === 'lake' ? 'Lac' :
                        location.type === 'pond' ? 'Baltă' :
                        location.type === 'private_pond' ? 'Baltă Privată' :
                        location.type === 'coastal' ? 'Litoral' : 'Altă Zonă';

      const popupContent = `
        <div style="padding: 12px; min-width: 260px;">
          <h3 style="font-weight: bold; margin: 0 0 8px 0; font-size: 16px;">${location.name}</h3>
          <p style="margin: 4px 0; color: #6b7280;"><strong>Tip:</strong> ${typeLabel}</p>
          <p style="margin: 4px 0; color: #6b7280;"><strong>Județ:</strong> ${location.county}</p>
          ${location.fishSpecies ? `<p style="margin: 4px 0; color: #6b7280;"><strong>Specii:</strong> ${location.fishSpecies.join(', ')}</p>` : ''}
          ${location.description ? `<p style="margin: 8px 0 0 0; font-size: 12px; color: #9ca3af;">${location.description}</p>` : ''}
          <button id="open-submit-${location.id}" style="background: #F59E0B; color: white; padding: 8px 12px; border: none; border-radius: 6px; font-size: 14px; margin-top: 12px; cursor: pointer; width: 100%; font-weight: 500;">
            📝 Înregistrează Record Aici
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 320, className: 'custom-popup' });

      marker.on('popupopen', function() {
        setTimeout(() => { // wait for DOM
          const btn = document.getElementById(`open-submit-${location.id}`);
          if (btn) {
            btn.addEventListener('click', () => {
              if (typeof (window as any).openSubmitModal === 'function') {
                (window as any).openSubmitModal({
                  id: location.id,
                  name: location.name,
                  county: location.county,
                  type: location.type,
                  latitude: location.latitude,
                  longitude: location.longitude
                });
              } else {
                onLocationSelect({
                  id: location.id,
                  name: location.name,
                  county: location.county,
                  type: location.type,
                  latitude: location.latitude,
                  longitude: location.longitude
                });
              }
            }, { once: true });
          }
        }, 50);
      });

      marker.addTo(mapInstanceRef.current);
      markersRef.current.push(marker);
    });

    // global fallback function
    (window as any).selectFishingLocation = (locationId: string) => {
      const location = (locations || []).find((loc: any) => loc.id === locationId);
      if (location) {
        if (typeof (window as any).openSubmitModal === 'function') {
          (window as any).openSubmitModal(location);
        } else {
          onLocationSelect({
            id: location.id,
            name: location.name,
            county: location.county,
            type: location.type,
            latitude: location.latitude,
            longitude: location.longitude
          });
        }
      }
    };

  }, [locations, selectedFilter, onLocationSelect]);

  const filterOptions = [
    { value: "all", label: "Toate", icon: "All" },
    { value: "river", label: "Râuri", icon: "R" },
    { value: "lake", label: "Lacuri", icon: "L" },
    { value: "pond", label: "Bălți", icon: "B" },
    { value: "private_pond", label: "Private", icon: "P" },
    { value: "coastal", label: "Litoral", icon: "C" }
  ];

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            Harta Locurilor de Pescuit din România
          </h3>
        </div>
        <div className="h-[500px] w-full flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-3 animate-pulse" />
            <p className="text-gray-500">Se încarcă locațiile de pescuit...</p>
          </div>
        </div>
      </div>
    );
  }

  const locationCount = locations?.length || 0;
  const filteredCount = selectedFilter === "all" 
    ? locationCount 
    : locations?.filter((l: any) => l.type === selectedFilter).length || 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden" id="map">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4" data-testid="map-title">Harta Locurilor de Pescuit</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {filterOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedFilter === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(option.value)}
              className={`${selectedFilter === option.value ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              data-testid={`filter-${option.value}`}
            >
              {option.label}
            </Button>
          ))}
        </div>
        <div className="text-sm text-gray-600 mb-2">
          <MapPin className="inline h-4 w-4 mr-1" />
          Faceți click pe orice marker pentru a înregistra un record la acea locație
        </div>
      </div>
      <div ref={mapRef} className="h-96 w-full" data-testid="map-container" />
    </div>
  );
}
