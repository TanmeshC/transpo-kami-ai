import Hero from "@/components/Hero";
import CrowdingDashboard from "@/components/CrowdingDashboard";
import RoutePlanner from "@/components/RoutePlanner";
import TransportMap from "@/components/TransportMap";
import MLPredictions from "@/components/MLPredictions";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <CrowdingDashboard />
      <RoutePlanner />
      <MLPredictions />
      <TransportMap />
    </div>
  );
};

export default Index;
