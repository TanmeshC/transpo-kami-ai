import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Clock, Users, TrendingUp } from "lucide-react";
import heroImage from "@/assets/pune-transport-hero.jpg";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Pune Smart Transport Network"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-indian opacity-90" />
      </div>

      {/* Floating Data Cards */}
      <div className="absolute top-20 left-10 animate-slide-up">
        <div className="bg-background/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <Users className="w-5 h-5" />
            <span className="text-sm font-medium">Live Crowding</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">72%</div>
          <div className="text-xs text-white/80">Pune Metro - Vanaz</div>
        </div>
      </div>

      <div className="absolute top-32 right-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="bg-background/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">Next Arrival</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">4 min</div>
          <div className="text-xs text-white/80">PMPML Bus - Route 4</div>
        </div>
      </div>

      <div className="absolute bottom-32 left-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="bg-background/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
          <div className="flex items-center gap-2 text-white">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Route Efficiency</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">96%</div>
          <div className="text-xs text-white/80">FC Road to Deccan</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
          <MapPin className="w-4 h-4 mr-2" />
          पुणे स्मार्ट मोबिलिटी | Pune Smart Mobility
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
          <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            TranspoKami
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Smart crowding prediction for PMPML buses, Pune Metro, and auto-rickshaws
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Button 
            variant="hero" 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => {
              document.getElementById('route-planner')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }}
          >
            Plan Pune Route | रूट प्लान करा
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => {
              document.getElementById('crowding-dashboard')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }}
          >
            Live Data | लाइव्ह डेटा
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">8L+</div>
            <div className="text-white/80">Daily Pune Commuters</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">97%</div>
            <div className="text-white/80">PMPML Route Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">20min</div>
            <div className="text-white/80">Avg Time Saved Daily</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;