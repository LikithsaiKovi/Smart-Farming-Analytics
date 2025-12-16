import { motion } from "motion/react";
import { Thermometer, Droplets, Wind, CloudRain, TrendingUp, AlertCircle } from "lucide-react";
import { DataCard } from "./DataCard";
import { AlertCard } from "./AlertCard";
import { RealTimeWeather } from "./RealTimeWeather";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useEffect, useState } from "react";
import { apiService } from "../services/api";
import { Button } from "./ui/button";

type WeatherTrendPoint = { time: string; temp: number; humidity: number };

const cropHealthData = [
  { date: "Jan", health: 78, yield: 65 },
  { date: "Feb", health: 82, yield: 70 },
  { date: "Mar", health: 85, yield: 75 },
  { date: "Apr", health: 88, yield: 82 },
  { date: "May", health: 90, yield: 88 },
  { date: "Jun", health: 92, yield: 90 },
];

export function Dashboard() {
  const [trendData, setTrendData] = useState<WeatherTrendPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const defaultLat = 40.7128;
  const defaultLon = -74.0060;

  const loadForecast = async () => {
    setIsLoading(true);
    try {
      const res = await apiService.getWeatherForecast(defaultLat, defaultLon);
      if (res.success && res.data) {
        const mapped: WeatherTrendPoint[] = res.data.map((p: any) => ({
          time: new Date(p.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          temp: Math.round(p.temperature),
          humidity: p.humidity,
        }));
        setTrendData(mapped);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadForecast();
  }, []);
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
        <div className="mb-8">
          <h1 className="mb-2">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Real-time insights for your agricultural operations
          </p>
        </div>

        {/* Weather Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <DataCard
            title="Temperature"
            value="28"
            unit="°C"
            icon={Thermometer}
            trend="+2°C from yesterday"
            color="warning"
          />
          <DataCard
            title="Humidity"
            value="65"
            unit="%"
            icon={Droplets}
            trend="Normal range"
            color="secondary"
          />
          <DataCard
            title="Wind Speed"
            value="12"
            unit="km/h"
            icon={Wind}
            trend="Light breeze"
            color="primary"
          />
          <DataCard
            title="Rainfall"
            value="5.2"
            unit="mm"
            icon={CloudRain}
            trend="Last 24 hours"
            color="success"
          />
        </div>

        {/* Real-Time Weather */}
        <div className="mb-6 sm:mb-8">
          <RealTimeWeather lat={defaultLat} lon={defaultLon} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Main Charts Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weather Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>24-Hour Weather Trend</CardTitle>
                      <CardDescription>Temperature and humidity monitoring</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={loadForecast} disabled={isLoading}>Refresh</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="time" stroke="#717182" />
                      <YAxis stroke="#717182" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="temp"
                        stroke="#FDD835"
                        strokeWidth={3}
                        name="Temperature (°C)"
                        dot={{ fill: "#FDD835", r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="humidity"
                        stroke="#0288D1"
                        strokeWidth={3}
                        name="Humidity (%)"
                        dot={{ fill: "#0288D1", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Crop Health Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Crop Health & Yield Index</CardTitle>
                  <CardDescription>6-month performance tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={cropHealthData}>
                      <defs>
                        <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#66BB6A" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#66BB6A" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis dataKey="date" stroke="#717182" />
                      <YAxis stroke="#717182" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="health"
                        stroke="#2E7D32"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorHealth)"
                        name="Health Score"
                      />
                      <Area
                        type="monotone"
                        dataKey="yield"
                        stroke="#66BB6A"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorYield)"
                        name="Yield Index"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* AI Prediction Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <CardTitle>AI Yield Prediction</CardTitle>
                  </div>
                  <CardDescription>Estimated harvest for current season</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-8">
                    <div>
                      <p className="text-muted-foreground mb-2">Predicted Yield</p>
                      <h2 className="text-primary">2,450 kg/acre</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        +15% compared to last season
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-2">Confidence</p>
                      <h3 className="text-primary">94%</h3>
                    </div>
                    <div className="flex-1">
                      <p className="text-muted-foreground mb-2">Key Factors</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          Optimal soil pH
                        </span>
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          Good rainfall
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Panel - Alerts */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-primary" />
                    <CardTitle>Alerts & Recommendations</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <AlertCard
                    type="warning"
                    title="Irrigation Required"
                    message="Field A shows low soil moisture. Consider irrigation within 24 hours."
                    time="2h ago"
                  />
                  <AlertCard
                    type="warning"
                    title="Fertilizer Alert"
                    message="Nitrogen levels predicted to drop below optimal in 3 days."
                    time="5h ago"
                  />
                  <AlertCard
                    type="success"
                    title="Optimal Conditions"
                    message="Field B has perfect moisture and nutrient balance."
                    time="1d ago"
                  />
                  <AlertCard
                    type="info"
                    title="Weather Update"
                    message="Moderate rainfall expected in 2 days. Plan harvesting accordingly."
                    time="1d ago"
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Soil Sensors */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Real-Time Soil Sensors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Moisture Level</span>
                      <span className="text-sm">68%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-secondary" style={{ width: "68%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">pH Level</span>
                      <span className="text-sm">6.8</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "85%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Nitrogen (N)</span>
                      <span className="text-sm">82%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: "82%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Phosphorus (P)</span>
                      <span className="text-sm">76%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "76%" }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
