import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Train,
  Bus,
  Zap
} from "lucide-react";

const CrowdingDashboard = () => {
  const crowdingData = [
    {
      id: 1,
      location: "Central Station - Platform 2",
      type: "metro",
      crowding: 89,
      status: "high",
      nextArrival: "2 min",
      trend: "up",
      prediction: "Peak until 9:30 AM"
    },
    {
      id: 2,
      location: "Broadway Bus Stop",
      type: "bus",
      crowding: 34,
      status: "low",
      nextArrival: "5 min",
      trend: "down",
      prediction: "Light throughout morning"
    },
    {
      id: 3,
      location: "Tech District Hub",
      type: "metro",
      crowding: 67,
      status: "medium",
      nextArrival: "1 min",
      trend: "up",
      prediction: "Increasing rapidly"
    },
    {
      id: 4,
      location: "University Campus",
      type: "bus",
      crowding: 78,
      status: "high",
      nextArrival: "7 min",
      trend: "down",
      prediction: "Peak ending soon"
    }
  ];

  const getCrowdingColor = (level: number) => {
    if (level > 75) return "text-destructive";
    if (level > 50) return "text-accent";
    return "text-secondary";
  };

  const getCrowdingBadge = (status: string) => {
    const variants = {
      high: "bg-destructive/10 text-destructive border-destructive/20",
      medium: "bg-accent/10 text-accent border-accent/20",
      low: "bg-secondary/10 text-secondary border-secondary/20"
    };
    return variants[status as keyof typeof variants];
  };

  return (
    <div className="py-16 px-6 bg-gradient-data min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Live Crowding Dashboard</h2>
          <p className="text-muted-foreground text-lg">
            Real-time transport capacity and intelligent predictions
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 shadow-card hover:shadow-transport transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Routes</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <Bus className="w-8 h-8 text-primary" />
            </div>
          </Card>
          
          <Card className="p-6 shadow-card hover:shadow-transport transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Crowding</p>
                <p className="text-2xl font-bold">62%</p>
              </div>
              <Users className="w-8 h-8 text-secondary" />
            </div>
          </Card>
          
          <Card className="p-6 shadow-card hover:shadow-transport transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Predictions</p>
                <p className="text-2xl font-bold">98.7%</p>
              </div>
              <Zap className="w-8 h-8 text-accent" />
            </div>
          </Card>
          
          <Card className="p-6 shadow-card hover:shadow-transport transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alerts Active</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </Card>
        </div>

        {/* Real-time Crowding List */}
        <div className="space-y-4">
          {crowdingData.map((item) => (
            <Card key={item.id} className="p-6 shadow-card hover:shadow-transport transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    {item.type === "metro" ? (
                      <Train className="w-6 h-6 text-primary" />
                    ) : (
                      <Bus className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">{item.location}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Next: {item.nextArrival}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {item.prediction}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getCrowdingColor(item.crowding)}`}>
                      {item.crowding}%
                    </div>
                    <div className="flex items-center justify-center space-x-1">
                      {item.trend === "up" ? (
                        <TrendingUp className="w-4 h-4 text-destructive" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-secondary" />
                      )}
                      <Badge className={getCrowdingBadge(item.status)}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>

                  <Button variant="data" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Action Button */}
        <div className="text-center mt-12">
          <Button variant="hero" size="lg">
            <MapPin className="w-5 h-5 mr-2" />
            View Interactive Map
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CrowdingDashboard;