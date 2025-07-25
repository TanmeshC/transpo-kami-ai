import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Users, 
  Clock, 
  AlertTriangle,
  Layers,
  Zap,
  Filter,
  Train,
  Bus
} from "lucide-react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const TransportMap = () => {
  const [selectedLayer, setSelectedLayer] = useState("crowding");
  const [mapboxToken, setMapboxToken] = useState("");
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const mapLayers = [
    { id: "crowding", label: "Crowding", icon: Users },
    { id: "delays", label: "Delays", icon: Clock },
    { id: "routes", label: "Routes", icon: MapPin },
    { id: "alerts", label: "Alerts", icon: AlertTriangle }
  ];

  const transportNodes = [
    {
      id: 1,
      name: "Pune Railway Station",
      type: "metro",
      coordinates: [73.8567, 18.5204] as [number, number], // lng, lat
      crowding: 89,
      status: "high",
      alerts: 1
    },
    {
      id: 2,
      name: "Hinjewadi IT Park",
      type: "metro", 
      coordinates: [73.7278, 18.5912] as [number, number],
      crowding: 82,
      status: "high",
      alerts: 0
    },
    {
      id: 3,
      name: "FC Road",
      type: "bus",
      coordinates: [73.8358, 18.5126] as [number, number],
      crowding: 34,
      status: "low",
      alerts: 0
    },
    {
      id: 4,
      name: "Deccan Gymkhana",
      type: "bus",
      coordinates: [73.8312, 18.5019] as [number, number],
      crowding: 45,
      status: "medium",
      alerts: 0
    },
    {
      id: 5,
      name: "University of Pune",
      type: "bus",
      coordinates: [73.8567, 18.5438] as [number, number],
      crowding: 67,
      status: "medium",
      alerts: 0
    },
    {
      id: 6,
      name: "Swargate Bus Stand",
      type: "bus",
      coordinates: [73.8553, 18.5018] as [number, number],
      crowding: 78,
      status: "high",
      alerts: 2
    }
  ];

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [73.8567, 18.5204], // Pune center
      zoom: 11
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add transport nodes as markers
    transportNodes.forEach((node) => {
      if (!map.current) return;

      // Create marker element
      const markerElement = document.createElement('div');
      markerElement.className = `w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer ${getNodeColor(node.status)}`;
      markerElement.innerHTML = node.type === "metro" 
        ? '<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8 2 5 5 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-4-3-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>'
        : '<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/></svg>';

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="font-medium">${node.name}</div>
        <div class="text-sm text-gray-600">
          Crowding: <span class="${getCrowdingColor(node.crowding)}">${node.crowding}%</span>
        </div>
        ${node.alerts > 0 ? `<div class="text-xs text-red-600 flex items-center mt-1">⚠️ ${node.alerts} alert${node.alerts > 1 ? 's' : ''}</div>` : ''}
      `);

      // Add marker to map
      new mapboxgl.Marker(markerElement)
        .setLngLat(node.coordinates)
        .setPopup(popup)
        .addTo(map.current);
    });

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  const getNodeColor = (status: string) => {
    switch (status) {
      case "high": return "bg-destructive";
      case "medium": return "bg-accent";
      case "low": return "bg-secondary";
      default: return "bg-muted";
    }
  };

  return (
    <div id="transport-map" className="py-16 px-6 bg-gradient-data min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Pune Transport Map | पुणे वाहतूक नकाशा</h2>
          <p className="text-muted-foreground text-lg">
            Real-time visualization of Pune's mobility network
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Controls */}
          <Card className="p-6 shadow-card h-fit">
            <h3 className="font-semibold mb-4 flex items-center">
              <Layers className="w-5 h-5 mr-2" />
              Map Layers
            </h3>
            
            <div className="space-y-2 mb-6">
              {mapLayers.map((layer) => (
                <Button
                  key={layer.id}
                  variant={selectedLayer === layer.id ? "default" : "outline"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => setSelectedLayer(layer.id)}
                >
                  <layer.icon className="w-4 h-4 mr-2" />
                  {layer.label}
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Legend</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-destructive"></div>
                    <span>High Crowding (75%+)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-accent"></div>
                    <span>Medium Crowding (50-75%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    <span>Low Crowding (under 50%)</span>
                  </div>
                </div>
              </div>

              <Button variant="data" size="sm" className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                Filter Options
              </Button>
            </div>
          </Card>

          {/* Interactive Map */}
          <div className="lg:col-span-3">
            <Card className="p-6 shadow-card">
              {!mapboxToken ? (
                <div className="space-y-4">
                  <h3 className="font-semibold">Enter Mapbox Token</h3>
                  <p className="text-sm text-muted-foreground">
                    Get your free token from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
                  </p>
                  <Input
                    placeholder="Enter your Mapbox public token..."
                    value={mapboxToken}
                    onChange={(e) => setMapboxToken(e.target.value)}
                  />
                </div>
              ) : (
                <div className="relative rounded-lg h-96 overflow-hidden">
                  <div ref={mapContainer} className="absolute inset-0" />
                  
                  {/* Real-time Data Overlay */}
                  <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 z-10">
                    <div className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Live Data Active</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Map Actions */}
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  Last updated: 2 seconds ago
                </div>
                <Button 
                  variant="hero" 
                  size="sm"
                  onClick={() => alert("Full screen map would open in a real app")}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Full Map | संपूर्ण नकाशा
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  function getCrowdingColor(crowding: number) {
    if (crowding > 75) return "text-destructive";
    if (crowding > 50) return "text-accent";
    return "text-secondary";
  }
};

export default TransportMap;