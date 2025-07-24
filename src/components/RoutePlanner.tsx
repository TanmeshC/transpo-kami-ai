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
  Star
} from "lucide-react";

const RoutePlanner = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleFindRoutes = () => {
    if (from.trim() && to.trim()) {
      setShowResults(true);
    } else {
      alert("Please enter both start and destination locations");
    }
  };

  const handleSelectRoute = (routeId: number) => {
    alert(`Route ${routeId} selected! Navigation would start in a real app.`);
  };

  const routeOptions = [
    {
      id: 1,
      duration: "23 min",
      cost: "$3.50",
      crowding: 42,
      efficiency: 94,
      modes: ["metro", "bus"],
      emissions: "Low",
      steps: [
        { mode: "metro", duration: "15 min", line: "Blue Line", crowding: 38 },
        { mode: "bus", duration: "8 min", line: "Route 42", crowding: 46 }
      ],
      recommended: true
    },
    {
      id: 2,
      duration: "31 min",
      cost: "$2.80",
      crowding: 67,
      efficiency: 78,
      modes: ["bus", "bus"],
      emissions: "Medium",
      steps: [
        { mode: "bus", duration: "18 min", line: "Route 15", crowding: 72 },
        { mode: "bus", duration: "13 min", line: "Route 8", crowding: 62 }
      ],
      recommended: false
    },
    {
      id: 3,
      duration: "19 min",
      cost: "$4.20",
      crowding: 28,
      efficiency: 87,
      modes: ["metro"],
      emissions: "Low",
      steps: [
        { mode: "metro", duration: "19 min", line: "Express Green", crowding: 28 }
      ],
      recommended: false
    }
  ];

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
          <h2 className="text-4xl font-bold mb-4">Smart Route Planner</h2>
          <p className="text-muted-foreground text-lg">
            AI-optimized routes with real-time crowding insights
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
                  placeholder="Enter start location"
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
                  placeholder="Enter destination"
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
              >
                <Zap className="w-4 h-4 mr-2" />
                Find Routes
              </Button>
            </div>
          </div>
        </Card>

        {/* Route Options */}
        {showResults && (
        <div className="space-y-4">
          {routeOptions.map((route) => (
            <Card key={route.id} className={`p-6 shadow-card hover:shadow-transport transition-all duration-300 ${route.recommended ? 'ring-2 ring-primary/20' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {route.recommended && (
                    <Badge className="bg-primary/10 text-primary border-primary/20">
                      <Star className="w-3 h-3 mr-1" />
                      Recommended
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