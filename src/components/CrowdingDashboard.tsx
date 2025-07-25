import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
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
  Zap,
  Eye
} from "lucide-react";

const CrowdingDashboard = () => {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const { toast } = useToast();
  const crowdingData = [
    {
      id: 1,
      location: "पुणे रेल्वे स्टेशन | Pune Railway Station",
      type: "metro",
      crowding: 89,
      status: "high",
      nextArrival: "2 min",
      trend: "up",
      prediction: "Peak until 10:00 AM"
    },
    {
      id: 2,
      location: "FC Road - फर्ग्युसन कॉलेज रोड",
      type: "bus",
      crowding: 34,
      status: "low",
      nextArrival: "5 min",
      trend: "down",
      prediction: "Light throughout morning"
    },
    {
      id: 3,
      location: "Hinjewadi IT Park - हिंजेवाडी",
      type: "metro",
      crowding: 82,
      status: "high",
      nextArrival: "1 min",
      trend: "up",
      prediction: "Tech crowd peak time"
    },
    {
      id: 4,
      location: "University of Pune - पुणे विद्यापीठ",
      type: "bus",
      crowding: 67,
      status: "medium",
      nextArrival: "7 min",
      trend: "down",
      prediction: "Student rush ending"
    },
    {
      id: 5,
      location: "Deccan Gymkhana - डेक्कन जिमखाना",
      type: "bus",
      crowding: 45,
      status: "medium",
      nextArrival: "3 min",
      trend: "up",
      prediction: "Evening crowd building"
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
    <div id="crowding-dashboard" className="py-16 px-6 bg-gradient-data min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Live Pune Transport | लाइव्ह पुणे वाहतूक</h2>
          <p className="text-muted-foreground text-lg">
            Real-time PMPML buses, Metro, and auto-rickshaw capacity
          </p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 shadow-card hover:shadow-transport transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">PMPML Routes</p>
                <p className="text-2xl font-bold">320</p>
              </div>
              <Bus className="w-8 h-8 text-primary" />
            </div>
          </Card>
          
          <Card className="p-6 shadow-card hover:shadow-transport transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Crowding</p>
                <p className="text-2xl font-bold">68%</p>
              </div>
              <Users className="w-8 h-8 text-secondary" />
            </div>
          </Card>
          
          <Card className="p-6 shadow-card hover:shadow-transport transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Predictions</p>
                <p className="text-2xl font-bold">96.8%</p>
              </div>
              <Zap className="w-8 h-8 text-accent" />
            </div>
          </Card>
          
          <Card className="p-6 shadow-card hover:shadow-transport transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Traffic Alerts</p>
                <p className="text-2xl font-bold">5</p>
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

                  <Button 
                    variant="data" 
                    size="sm"
                    onClick={() => {
                      setSelectedNode(selectedNode === item.id ? null : item.id);
                      toast({
                        title: "Station Details",
                        description: `${selectedNode === item.id ? 'Hiding' : 'Viewing'} details for ${item.location.split(' | ')[1] || item.location}`
                      });
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {selectedNode === item.id ? "Hide Details" : "View Details | विवरण देखें"}
                  </Button>
                </div>
              </div>
              
              {/* Detailed Information Panel */}
              {selectedNode === item.id && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Operating Hours:</span>
                      <p className="text-muted-foreground">5:30 AM - 11:30 PM</p>
                    </div>
                    <div>
                      <span className="font-medium">Next Arrival:</span>
                      <p className="text-muted-foreground">{item.nextArrival}</p>
                    </div>
                    <div>
                      <span className="font-medium">Platform/Stop:</span>
                      <p className="text-muted-foreground">Platform {Math.floor(Math.random() * 4) + 1}</p>
                    </div>
                    <div>
                      <span className="font-medium">Accessibility:</span>
                      <p className="text-muted-foreground">Wheelchair accessible</p>
                    </div>
                    <div>
                      <span className="font-medium">Current Status:</span>
                      <p className="text-muted-foreground">On time</p>
                    </div>
                    <div>
                      <span className="font-medium">Peak Hours:</span>
                      <p className="text-muted-foreground">8-10 AM, 6-8 PM</p>
                    </div>
                    <div>
                      <span className="font-medium">Fare from here:</span>
                      <p className="text-muted-foreground">₹10 - ₹35</p>
                    </div>
                    <div>
                      <span className="font-medium">Trend Prediction:</span>
                      <p className="text-muted-foreground">{item.prediction}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="hero" 
            size="lg"
            onClick={() => {
              document.getElementById('transport-map')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }}
            >
              <MapPin className="w-5 h-5 mr-2" />
              View Pune Map | पुणे नकाशा पहा
            </Button>
        </div>
      </div>
    </div>
  );
};

export default CrowdingDashboard;