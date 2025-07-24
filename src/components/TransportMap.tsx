import { useState } from "react";
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

const TransportMap = () => {
  const [selectedLayer, setSelectedLayer] = useState("crowding");

  const mapLayers = [
    { id: "crowding", label: "Crowding", icon: Users },
    { id: "delays", label: "Delays", icon: Clock },
    { id: "routes", label: "Routes", icon: MapPin },
    { id: "alerts", label: "Alerts", icon: AlertTriangle }
  ];

  const transportNodes = [
    {
      id: 1,
      name: "Central Station",
      type: "metro",
      position: { x: 45, y: 30 },
      crowding: 89,
      status: "high",
      alerts: 1
    },
    {
      id: 2,
      name: "Tech District",
      type: "metro", 
      position: { x: 65, y: 45 },
      crowding: 67,
      status: "medium",
      alerts: 0
    },
    {
      id: 3,
      name: "University Hub",
      type: "bus",
      position: { x: 25, y: 60 },
      crowding: 78,
      status: "high",
      alerts: 0
    },
    {
      id: 4,
      name: "Downtown Plaza",
      type: "metro",
      position: { x: 55, y: 70 },
      crowding: 34,
      status: "low",
      alerts: 0
    },
    {
      id: 5,
      name: "Airport Express",
      type: "bus",
      position: { x: 80, y: 25 },
      crowding: 45,
      status: "medium",
      alerts: 2
    }
  ];

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
          <h2 className="text-4xl font-bold mb-4">Interactive Transport Map</h2>
          <p className="text-muted-foreground text-lg">
            Real-time visualization of urban mobility patterns
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
              <div className="relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg h-96 overflow-hidden">
                {/* Map Background Grid */}
                <div className="absolute inset-0">
                  <svg className="w-full h-full opacity-20">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Transport Routes (Lines) */}
                <svg className="absolute inset-0 w-full h-full">
                  {/* Metro Blue Line */}
                  <path
                    d="M 45% 30% Q 55% 40% 65% 45% Q 60% 55% 55% 70%"
                    stroke="hsl(var(--primary))"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                  {/* Bus Route */}
                  <path
                    d="M 25% 60% Q 40% 50% 80% 25%"
                    stroke="hsl(var(--secondary))"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                </svg>

                {/* Transport Nodes */}
                {transportNodes.map((node) => (
                  <div
                    key={node.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{ 
                      left: `${node.position.x}%`, 
                      top: `${node.position.y}%` 
                    }}
                  >
                    {/* Node Pulse Effect */}
                    <div className={`absolute inset-0 rounded-full ${getNodeColor(node.status)} opacity-30 animate-ping scale-150`}></div>
                    
                    {/* Main Node */}
                    <div className={`relative w-6 h-6 rounded-full ${getNodeColor(node.status)} border-2 border-white shadow-lg flex items-center justify-center`}>
                      {node.type === "metro" ? (
                        <Train className="w-3 h-3 text-white" />
                      ) : (
                        <Bus className="w-3 h-3 text-white" />
                      )}
                    </div>

                    {/* Alerts Badge */}
                    {node.alerts > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs px-1 min-w-[1rem] h-4 flex items-center justify-center">
                        {node.alerts}
                      </Badge>
                    )}

                    {/* Tooltip */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      <div className="font-medium">{node.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Crowding: <span className={getCrowdingColor(node.crowding)}>{node.crowding}%</span>
                      </div>
                      {node.alerts > 0 && (
                        <div className="text-xs text-destructive flex items-center mt-1">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {node.alerts} alert{node.alerts > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Real-time Data Overlay */}
                <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live Data Active</span>
                  </div>
                </div>
              </div>

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
                  Full Screen Map
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