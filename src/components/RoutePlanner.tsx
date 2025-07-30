import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Users, 
  Zap,
  Train,
  Bus,
  Car,
  Bike,
  ArrowRight,
  Star,
  Database
} from "lucide-react";
import { findRoutesBetweenLocations } from "@/utils/pmpmlRoutes";

const RoutePlanner = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [routeOptions, setRouteOptions] = useState([]);

  const generateRoutes = (from: string, to: string) => {
    // Simple route generation based on locations
    const routeVariations = [
      {
        baseTime: 20 + Math.floor(Math.random() * 15),
        baseCost: 25 + Math.floor(Math.random() * 20),
        modes: ["metro", "bus"],
        efficiency: 85 + Math.floor(Math.random() * 15)
      },
      {
        baseTime: 25 + Math.floor(Math.random() * 20),
        baseCost: 20 + Math.floor(Math.random() * 15),
        modes: ["bus", "bus"],
        efficiency: 70 + Math.floor(Math.random() * 20)
      },
      {
        baseTime: 15 + Math.floor(Math.random() * 10),
        baseCost: 35 + Math.floor(Math.random() * 25),
        modes: ["metro"],
        efficiency: 90 + Math.floor(Math.random() * 10)
      }
    ];

    return routeVariations.map((variant, index) => ({
      id: index + 1,
      duration: `${variant.baseTime} min`,
      cost: `₹${variant.baseCost}`,
      crowding: Math.floor(Math.random() * 80) + 20,
      efficiency: variant.efficiency,
      modes: variant.modes,
      emissions: variant.modes.includes("metro") ? "Low" : "Medium",
      steps: variant.modes.map((mode, stepIndex) => ({
        mode,
        duration: `${Math.floor(variant.baseTime / variant.modes.length)} min`,
        line: mode === "metro" 
          ? `${["Blue", "Purple", "Green"][stepIndex % 3]} Line (${from.split(" ")[0]}-${to.split(" ")[0]})`
          : `PMPML Route ${Math.floor(Math.random() * 50) + 1} (${from.split(" ")[0]}-${to.split(" ")[0]})`,
        crowding: Math.floor(Math.random() * 70) + 25
      })),
      recommended: index === 0
    }));
  };

  const handleFindRoutes = async () => {
    if (from.trim() && to.trim()) {
      setIsLoading(true);
      try {
        // First try to find real PMPML routes
        const realRoutes = await findRoutesBetweenLocations(from, to);
        
        if (realRoutes.length > 0) {
          setRouteOptions(realRoutes);
        } else {
          // Fallback to generated routes if no real routes found
          const generatedRoutes = generateRoutes(from, to);
          setRouteOptions(generatedRoutes);
        }
        
        setShowResults(true);
      } catch (error) {
        console.error('Error finding routes:', error);
        // Fallback to generated routes
        const generatedRoutes = generateRoutes(from, to);
        setRouteOptions(generatedRoutes);
        setShowResults(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please enter both start and destination locations");
    }
  };

  const handleSelectRoute = (routeId: number) => {
    alert(`Route ${routeId} selected! Navigation would start in a real app.`);
  };


  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "metro": return <Train className="w-4 h-4" />;
      case "bus": return <Bus className="w-4 h-4" />;
      case "car": return <Car className="w-4 h-4" />;
      case "bike": return <Bike className="w-4 h-4" />;
      default: return <Navigation className="w-4 h-4" />;
    }
  };

  const getCrowdingColor = (level: number) => {
    if (level > 60) return "text-destructive";
    if (level > 35) return "text-accent";
    return "text-secondary";
  };

  return (
    <div id="route-planner" className="py-16 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Pune Route Planner | पुणे रूट प्लॅनर</h2>
          <p className="text-muted-foreground text-lg">
            PMPML buses, Metro, and auto-rickshaw route optimization
          </p>
        </div>

        {/* Search Form */}
        <Card className="p-6 mb-8 shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="e.g., Pune Railway Station, FC Road"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <div className="relative">
                <Navigation className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="e.g., Hinjewadi, Deccan Gymkhana"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="hero" 
                className="w-full"
                onClick={handleFindRoutes}
                disabled={isLoading}
              >
                <Zap className="w-4 h-4 mr-2" />
                {isLoading ? "Finding Routes..." : "Find Routes | रूट शोधा"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Route Options */}
        {showResults && (
        <div className="space-y-4">
          {/* Real Data Indicator */}
          {routeOptions.length > 0 && routeOptions[0].realRoute && (
            <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <Database className="w-5 h-5" />
                <span className="font-medium">Real PMPML Routes Found!</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Official Data
                </Badge>
              </div>
              <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                These routes are from official PMPML bus route database (Pune Municipal Corporation)
              </p>
            </Card>
          )}
          
          {routeOptions.map((route) => (
            <Card key={route.id} className={`p-6 shadow-card hover:shadow-transport transition-all duration-300 ${route.recommended ? 'ring-2 ring-primary/20' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {route.recommended && (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      <Star className="w-3 h-3 mr-1" />
                      {route.realRoute ? "Official Route" : "Recommended"}
                    </Badge>
                  )}
                  {route.realRoute && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <Database className="w-3 h-3 mr-1" />
                      PMPML {route.pmpmlData?.routeId}
                    </Badge>
                  )}
                  <div className="flex items-center space-x-2">
                    {route.modes.map((mode, index) => (
                      <div key={index} className="flex items-center">
                        <div className="p-2 rounded-full bg-primary/10">
                          {getModeIcon(mode)}
                        </div>
                        {index < route.modes.length - 1 && (
                          <ArrowRight className="w-3 h-3 mx-1 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSelectRoute(route.id)}
                >
                  Select Route
                </Button>
              </div>

              {/* Route Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="font-semibold">{route.duration}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Duration</span>
                </div>
                
                <div className="text-center">
                  <div className="font-semibold text-secondary">{route.cost}</div>
                  <span className="text-xs text-muted-foreground">Cost</span>
                </div>
                
                <div className="text-center">
                  <div className={`font-semibold ${getCrowdingColor(route.crowding)}`}>
                    {route.crowding}%
                  </div>
                  <span className="text-xs text-muted-foreground">Avg Crowding</span>
                </div>
                
                <div className="text-center">
                  <div className="font-semibold text-accent">{route.efficiency}%</div>
                  <span className="text-xs text-muted-foreground">Efficiency</span>
                </div>
              </div>

              {/* Route Details for Real Routes */}
              {route.realRoute && route.pmpmlData && (
                <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                  <div className="text-sm">
                    <div className="font-medium text-primary mb-1">Official Route Details:</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div><strong>Route:</strong> {route.pmpmlData.description}</div>
                      <div><strong>Distance:</strong> {route.pmpmlData.distance} km</div>
                      <div className="md:col-span-2"><strong>मराठी:</strong> {route.pmpmlData.descriptionMarathi}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Route Steps */}
              <div className="space-y-2">
                {route.steps.map((step, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-1 rounded bg-primary/10">
                        {getModeIcon(step.mode)}
                      </div>
                      <div>
                        <span className="font-medium">{step.line}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          {step.duration}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className={`text-sm font-medium ${getCrowdingColor(step.crowding)}`}>
                        {step.crowding}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};

export default RoutePlanner;