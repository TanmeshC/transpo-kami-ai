// Real PMPML bus route data processor
export interface PMPMLRoute {
  routeId: string;
  description: string;
  descriptionMarathi: string;
  distance: number;
  direction: 'D' | 'U' | 'R'; // Down, Up, Round
}

// Common Pune locations with their approximate coordinates
export const PUNE_LOCATIONS = {
  "Pune Station": { lat: 18.5204, lng: 73.8567, aliases: ["Pune Railway Station", "Railway Station"] },
  "Swargate": { lat: 18.5018, lng: 73.8553, aliases: ["Swargate Bus Stand"] },
  "Deccan Gymkhana": { lat: 18.5019, lng: 73.8312, aliases: ["Deccan"] },
  "FC Road": { lat: 18.5126, lng: 73.8358, aliases: ["Ferguson College Road"] },
  "Kothrud Depot": { lat: 18.5074, lng: 73.8077, aliases: ["Kothrud"] },
  "Hinjawadi": { lat: 18.5912, lng: 73.7278, aliases: ["Hinjawadi Phase 3", "Hinjawadi Maan Phase 3"] },
  "Katraj": { lat: 18.4484, lng: 73.8612, aliases: [] },
  "Kondhwa": { lat: 18.4633, lng: 73.9436, aliases: ["Kondhwa Bk"] },
  "Lohgaon": { lat: 18.5952, lng: 73.9285, aliases: [] },
  "Pimple Gurav": { lat: 18.5946, lng: 73.7696, aliases: ["Pimplegurav"] },
  "Balewadi": { lat: 18.5642, lng: 73.7769, aliases: ["Balewadi Depot"] },
  "Keshavnagar": { lat: 18.5614, lng: 73.9057, aliases: [] },
  "Akurdi": { lat: 18.6494, lng: 73.7758, aliases: ["Akurdi Railway Station"] },
  "Nigdi": { lat: 18.6544, lng: 73.7537, aliases: ["Nigdi Bus Station"] },
  "Chinchwad": { lat: 18.6279, lng: 73.8019, aliases: [] },
  "Bhosari": { lat: 18.6298, lng: 73.8430, aliases: ["Bhosari MIDC"] },
  "Pimpri": { lat: 18.6298, lng: 73.8067, aliases: ["Pimpri Market"] },
  "Dapodi": { lat: 18.6017, lng: 73.8430, aliases: [] },
  "Ravet": { lat: 18.6477, lng: 73.7391, aliases: ["Ravet IT Hub"] }
};

// Load and parse PMPML routes
export const loadPMPMLRoutes = async (): Promise<PMPMLRoute[]> => {
  try {
    const response = await fetch('/data/pmpml-bus-routes.json');
    const data = await response.json();
    
    return data.records.map((record: any[]) => {
      const [id, routeId, description, descriptionMarathi, distance] = record;
      const direction = routeId.includes('-D') ? 'D' : routeId.includes('-U') ? 'U' : 'R';
      
      return {
        routeId,
        description: description.trim(),
        descriptionMarathi: descriptionMarathi.trim(),
        distance: parseFloat(distance) || 0,
        direction
      };
    });
  } catch (error) {
    console.error('Failed to load PMPML routes:', error);
    return [];
  }
};

// Find location matches in route descriptions
export const findLocationInDescription = (description: string, location: string): boolean => {
  const normalizedDesc = description.toLowerCase();
  const normalizedLoc = location.toLowerCase();
  
  // Check direct match
  if (normalizedDesc.includes(normalizedLoc)) return true;
  
  // Check aliases
  const locationData = Object.entries(PUNE_LOCATIONS).find(([key, data]) => 
    key.toLowerCase() === normalizedLoc || 
    data.aliases.some(alias => alias.toLowerCase() === normalizedLoc)
  );
  
  if (locationData) {
    const [mainName, data] = locationData;
    if (normalizedDesc.includes(mainName.toLowerCase())) return true;
    return data.aliases.some(alias => normalizedDesc.includes(alias.toLowerCase()));
  }
  
  return false;
};

// Find routes between two locations
export const findRoutesBetweenLocations = async (from: string, to: string): Promise<any[]> => {
  const routes = await loadPMPMLRoutes();
  
  const relevantRoutes = routes.filter(route => {
    const fromMatch = findLocationInDescription(route.description, from);
    const toMatch = findLocationInDescription(route.description, to);
    return fromMatch && toMatch;
  });

  // Convert to our route format
  return relevantRoutes.slice(0, 3).map((route, index) => {
    const estimatedTime = Math.round(route.distance * 2.5); // Rough estimate: 2.5 min per km
    const estimatedCost = Math.round(route.distance * 2); // Rough estimate: ₹2 per km
    
    return {
      id: index + 1,
      duration: `${estimatedTime} min`,
      cost: `₹${Math.max(10, estimatedCost)}`, // Minimum fare ₹10
      crowding: Math.floor(Math.random() * 60) + 30, // 30-90%
      efficiency: Math.floor(85 + Math.random() * 15), // 85-100%
      modes: ["bus"],
      emissions: "Medium",
      realRoute: true,
      pmpmlData: {
        routeId: route.routeId,
        description: route.description,
        descriptionMarathi: route.descriptionMarathi,
        distance: route.distance
      },
      steps: [{
        mode: "bus",
        duration: `${estimatedTime} min`,
        line: `PMPML ${route.routeId} - ${route.description}`,
        crowding: Math.floor(Math.random() * 60) + 30
      }],
      recommended: index === 0
    };
  });
};

// Get coordinates for a location
export const getLocationCoordinates = (locationName: string) => {
  const location = Object.entries(PUNE_LOCATIONS).find(([key, data]) => 
    key.toLowerCase().includes(locationName.toLowerCase()) ||
    data.aliases.some(alias => alias.toLowerCase().includes(locationName.toLowerCase()))
  );
  
  return location ? location[1] : null;
};