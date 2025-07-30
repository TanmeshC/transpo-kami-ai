import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const TransportMap = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const { toast } = useToast();

  const [transportNodes, setTransportNodes] = useState([
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
    },
    // PCMC Region locations
    {
      id: 7,
      name: "Akurdi Railway Station",
      type: "metro",
      coordinates: [73.7758, 18.6494] as [number, number],
      crowding: 65,
      status: "medium",
      alerts: 0
    },
    {
      id: 8,
      name: "Nigdi Bus Station",
      type: "bus",
      coordinates: [73.7537, 18.6544] as [number, number],
      crowding: 52,
      status: "medium",
      alerts: 1
    },
    {
      id: 9,
      name: "Chinchwad",
      type: "bus",
      coordinates: [73.8019, 18.6279] as [number, number],
      crowding: 48,
      status: "medium",
      alerts: 0
    },
    {
      id: 10,
      name: "Bhosari MIDC",
      type: "bus",
      coordinates: [73.8430, 18.6298] as [number, number],
      crowding: 71,
      status: "high",
      alerts: 1
    },
    {
      id: 11,
      name: "Pimpri Market",
      type: "bus",
      coordinates: [73.8067, 18.6298] as [number, number],
      crowding: 59,
      status: "medium",
      alerts: 0
    },
    {
      id: 12,
      name: "Dapodi",
      type: "bus",
      coordinates: [73.8430, 18.6017] as [number, number],
      crowding: 43,
      status: "medium",
      alerts: 0
    },
    {
      id: 13,
      name: "Ravet IT Hub",
      type: "metro",
      coordinates: [73.7391, 18.6477] as [number, number],
      crowding: 76,
      status: "high",
      alerts: 2
    }
  ]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTransportNodes(prevNodes => 
        prevNodes.map(node => {
          // Randomly fluctuate crowding by ±5%
          const crowdingChange = Math.floor(Math.random() * 11) - 5;
          const newCrowding = Math.max(0, Math.min(100, node.crowding + crowdingChange));
          
          // Update status based on new crowding
          let newStatus = "low";
          if (newCrowding > 75) newStatus = "high";
          else if (newCrowding > 50) newStatus = "medium";
          
          // Randomly add/remove alerts
          const newAlerts = Math.random() > 0.8 ? Math.floor(Math.random() * 3) : node.alerts;
          
          return {
            ...node,
            crowding: newCrowding,
            status: newStatus,
            alerts: newAlerts
          };
        })
      );
      setLastUpdated(new Date());
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const markersRef = useRef<L.Marker[]>([]);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current).setView([18.5204, 73.8567], 11);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update markers when transport nodes change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      map.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add updated markers
    transportNodes.forEach((node) => {
      if (!map.current) return;

      // Create custom icon based on node type and status
      const iconHtml = node.type === "metro" 
        ? '<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M7.2 12c0 2.5 2 4.5 4.5 4.5s4.5-2 4.5-4.5-2-4.5-4.5-4.5-4.5 2-4.5 4.5zm8.8 0c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4 4 1.8 4 4z"/></svg>'
        : '<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>';

      const statusColor = node.status === "high" ? "#dc2626" : node.status === "medium" ? "#ea580c" : "#16a34a";

      const customIcon = L.divIcon({
        html: `<div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer" style="background-color: ${statusColor};">${iconHtml}</div>`,
        className: 'custom-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      // Create popup content
      const popupContent = `
        <div class="font-medium">${node.name}</div>
        <div class="text-sm text-gray-600">
          Crowding: <span style="color: ${node.crowding > 75 ? '#dc2626' : node.crowding > 50 ? '#ea580c' : '#16a34a'}">${node.crowding}%</span>
        </div>
        ${node.alerts > 0 ? `<div class="text-xs text-red-600 flex items-center mt-1">⚠️ ${node.alerts} alert${node.alerts > 1 ? 's' : ''}</div>` : ''}
      `;

      // Add marker to map
      const marker = L.marker([node.coordinates[1], node.coordinates[0]], { icon: customIcon })
        .addTo(map.current!)
        .bindPopup(popupContent);
      
      markersRef.current.push(marker);
    });
  }, [transportNodes]);

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

        <div className="grid grid-cols-1 gap-6">
          {/* Interactive Map */}
          <div className="w-full">
            <Card className={`p-6 shadow-card ${isFullScreen ? 'fixed inset-4 z-50' : ''}`}>
              <div className={`relative rounded-lg overflow-hidden ${isFullScreen ? 'h-full' : 'h-96'}`}>
                <div ref={mapContainer} className="absolute inset-0" />
                
                {/* Real-time Data Overlay */}
                <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 z-10">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live Data Active</span>
                  </div>
                </div>
              </div>

              {/* Map Actions */}
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  Last updated: {new Date(lastUpdated).toLocaleTimeString()}
                </div>
                <Button 
                  variant="hero" 
                  size="sm"
                  onClick={() => {
                    setIsFullScreen(!isFullScreen);
                    setTimeout(() => {
                      map.current?.invalidateSize();
                    }, 100);
                    toast({
                      title: isFullScreen ? "Map Minimized" : "Map Expanded",
                      description: isFullScreen ? "Map view returned to normal" : "Map expanded for better view"
                    });
                  }}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isFullScreen ? "Exit Full Map" : "Full Map | संपूर्ण नकाशा"}
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