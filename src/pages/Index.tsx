import Hero from "@/components/Hero";
import CrowdingDashboard from "@/components/CrowdingDashboard";
import RoutePlanner from "@/components/RoutePlanner";
import TransportMap from "@/components/TransportMap";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <CrowdingDashboard />
      <RoutePlanner />
      <TransportMap />
    </div>
  );
};

export default Index;
