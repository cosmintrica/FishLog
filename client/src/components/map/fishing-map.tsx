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

    // Initialize Leaflet map
    const initMap = async () => {
      const L = (window as any).L;
      if (!L) {
        // Load Leaflet dynamically
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
      const map = L.map(mapRef.current).setView([45.9432, 24.9668], 6);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
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

    const L = (window as any).L;
    if (!L) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Define icons for different water types
    const getIcon = (type: string) => {
      const iconMap = {
        river: '🏞️',
        lake: '🏔️',
        pond: '🟡',
        private_pond: '🟠',
        coastal: '🌊'
      };
      
      return L.divIcon({
        html: `<div style="background: white; border: 2px solid #2E8B57; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 16px;">${iconMap[type as keyof typeof iconMap] || '📍'}</div>`,
        iconSize: [30, 30],
        className: 'custom-div-icon'
      });
    };

    // Add markers
    (locations || []).forEach((location: any) => {
      // Filter based on selected type
      if (selectedFilter !== "all" && location.type !== selectedFilter) {
        return;
      }

      const marker = L.marker([parseFloat(location.latitude), parseFloat(location.longitude)], {
        icon: getIcon(location.type)
      }).addTo(mapInstanceRef.current);

      const typeLabel = location.type === 'river' ? 'Râu' : 
                       location.type === 'lake' ? 'Lac' : 
                       location.type === 'pond' ? 'Baltă' :
                       location.type === 'private_pond' ? 'Baltă Privată' :
                       location.type === 'coastal' ? 'Litoral' : 'Altă Zonă';
      
      const popupContent = `
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="font-weight: bold; margin: 0 0 8px 0; color: #1f2937;">${location.name}</h3>
          <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">Tip: ${typeLabel}</p>
          <p style="margin: 4px 0; color: #6b7280; font-size: 14px;">Pești: ${location.fishSpecies?.join(', ') || 'Nu sunt date'}</p>
          ${location.description ? `<p style="margin: 4px 0; color: #6b7280; font-size: 12px;">${location.description}</p>` : ''}
          <button 
            onclick="window.selectLocation('${location.id}')" 
            style="background: #F59E0B; color: white; padding: 6px 12px; border: none; border-radius: 6px; font-size: 12px; margin-top: 8px; cursor: pointer;"
          >
            📝 Înregistrează Record Aici
          </button>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      markersRef.current.push(marker);
    });

    // Add global function for location selection
    (window as any).selectLocation = (locationId: string) => {
      const location = (locations || []).find((loc: any) => loc.id === locationId);
      if (location) {
        onLocationSelect({
          name: location.name,
          county: location.county,
          type: location.type,
          latitude: location.latitude,
          longitude: location.longitude
        });
      }
    };

  }, [locations, selectedFilter, onLocationSelect]);

  const filterOptions = [
    { value: "all", label: "Toate", icon: "🗺️" },
    { value: "river", label: "Râuri", icon: "🏞️" },
    { value: "lake", label: "Lacuri", icon: "🏔️" },
    { value: "pond", label: "Bălți", icon: "🟡" },
    { value: "private_pond", label: "Bălți Private", icon: "🟠" },
    { value: "coastal", label: "Litoral", icon: "🌊" }
  ];

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Harta Locurilor de Pescuit</h3>
        </div>
        <div className="h-96 w-full flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">Se încarcă harta...</p>
        </div>
      </div>
    );
  }

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
              className={`${
                selectedFilter === option.value 
                  ? "bg-primary text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              data-testid={`filter-${option.value}`}
            >
              <span className="mr-1">{option.icon}</span>
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
