import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Search, Layers, MapPin, Cloud, CloudRain, Wind, Thermometer } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { apiService } from "../services/api";
import { toast } from "sonner";

export function WeatherMapPage() {
  const [layers, setLayers] = useState({
    clouds: true,
    rain: false,
    temperature: false,
    wind: false,
  });
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{name:string;country:string;state:string;lat:number;lon:number}>>([]);
  const [lat, setLat] = useState(40.7128);
  const [lon, setLon] = useState(-74.0060);

  const getLayerImage = () => {
    // Route through backend proxy to avoid blocked hosts
    const proxy = (u: string) => `http://localhost:5000/api/proxy-image?url=${encodeURIComponent(u)}`;
    if (layers.temperature) {
      return proxy("https://images.unsplash.com/photo-1581091226825-c6a89eab6015?auto=format&fit=crop&w=1600&q=80");
    }
    if (layers.rain) {
      return proxy("https://images.unsplash.com/photo-1503431128871-cd250803fa41?auto=format&fit=crop&w=1600&q=80");
    }
    if (layers.wind) {
      return proxy("https://images.unsplash.com/photo-1527489377706-5bf97e608852?auto=format&fit=crop&w=1600&q=80");
    }
    return proxy("https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?auto=format&fit=crop&w=1600&q=80");
  };

  useEffect(() => {
    const id = setTimeout(async () => {
      if (!query.trim()) { setSuggestions([]); return; }
      const res = await apiService.geocode(query.trim());
      if (res.success && res.data) setSuggestions(res.data);
    }, 250);
    return () => clearTimeout(id);
  }, [query]);

  const useMyLocation = () => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLon(pos.coords.longitude);
        toast.success("Location set");
      },
      () => toast.error("Unable to get location")
    );
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 max-w-[1600px] mx-auto">
        <div className="mb-6">
          <h1 className="mb-2">Weather Map Analytics</h1>
          <p className="text-muted-foreground">
            Live weather tracking and forecasting
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Search */}
            <Card>
              <CardContent className="p-4">
                <Label className="mb-2 block">Search Location</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search cities or farms..." className="pl-10" value={query} onChange={(e)=>setQuery(e.target.value)} />
                  {suggestions.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-card border rounded-md max-h-60 overflow-auto">
                      {suggestions.map((s, idx) => (
                        <button key={idx} className="w-full text-left px-3 py-2 hover:bg-muted" onClick={()=>{setLat(s.lat);setLon(s.lon);setQuery(`${s.name}, ${s.state? s.state+", ":""}${s.country}`);setSuggestions([]);}}>
                          {s.name}{s.state?`, ${s.state}`:''}, {s.country}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Layer Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="h-4 w-4 text-primary" />
                  <Label>Weather Layers</Label>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cloud className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Clouds</span>
                    </div>
                    <Switch
                      checked={layers.clouds}
                      onCheckedChange={(checked) =>
                        setLayers({ ...layers, clouds: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CloudRain className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Precipitation</span>
                    </div>
                    <Switch
                      checked={layers.rain}
                      onCheckedChange={(checked) =>
                        setLayers({ ...layers, rain: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Temperature</span>
                    </div>
                    <Switch
                      checked={layers.temperature}
                      onCheckedChange={(checked) =>
                        setLayers({ ...layers, temperature: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Wind</span>
                    </div>
                    <Switch
                      checked={layers.wind}
                      onCheckedChange={(checked) =>
                        setLayers({ ...layers, wind: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Locations */}
            <Card>
              <CardContent className="p-4">
                <Label className="mb-3 block">Quick Access</Label>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm" onClick={useMyLocation}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Use My Location
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm" onClick={()=>{setLat(17.3850);setLon(78.4867);}}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Hyderabad
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm" onClick={()=>{setLat(28.6139);setLon(77.2090);}}>
                    <MapPin className="h-4 w-4 mr-2" />
                    New Delhi
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Map Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <Card className="overflow-hidden">
              <div className="relative h-[700px] bg-gradient-to-br from-blue-50 to-green-50">
                {/* Map placeholder with weather imagery */}
                <div className="absolute inset-0">
                  <ImageWithFallback
                    src={getLayerImage()}
                    alt="Weather map"
                    className="w-full h-full object-cover opacity-30"
                  />
                </div>

                {/* Map overlay UI */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Cloud className="h-16 w-16 text-secondary mx-auto mb-4 opacity-50" />
                    <p className="text-lg text-muted-foreground">
                      Interactive weather map with live data
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      OpenWeather API integration placeholder
                    </p>
                  </div>
                </div>

                {/* Floating Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="absolute top-4 right-4"
                >
                  <Card className="w-80 shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3>Current Location</h3>
                          <p className="text-sm text-muted-foreground">{lat.toFixed(3)}, {lon.toFixed(3)}</p>
                        </div>
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Thermometer className="h-4 w-4 text-amber-500" />
                            <span className="text-sm text-muted-foreground">Temperature</span>
                          </div>
                          <p>{layers.temperature ? '28°C' : '—'}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CloudRain className="h-4 w-4 text-blue-500" />
                            <span className="text-sm text-muted-foreground">Humidity</span>
                          </div>
                          <p>{layers.rain ? '65%' : '—'}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Wind className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-muted-foreground">Wind</span>
                          </div>
                          <p>{layers.wind ? '12 km/h' : '—'}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Cloud className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-muted-foreground">Clouds</span>
                          </div>
                          <p>{layers.clouds ? '45%' : '—'}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-2">Forecast</p>
                        <p className="text-sm">Light rain expected in 48 hours</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Map markers */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="absolute top-1/3 left-1/3"
                >
                  <div className="relative">
                    <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg" />
                    <div className="absolute -top-1 -left-1 w-6 h-6 bg-primary/30 rounded-full animate-ping" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="absolute top-1/2 right-1/3"
                >
                  <div className="relative">
                    <div className="w-4 h-4 bg-accent rounded-full border-2 border-white shadow-lg" />
                    <div className="absolute -top-1 -left-1 w-6 h-6 bg-accent/30 rounded-full animate-ping" />
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
