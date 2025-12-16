import { motion } from "motion/react";
import { Sprout, Droplets, Thermometer, Activity } from "lucide-react";
import { DataCard } from "./DataCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Progress } from "./ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";

const soilComposition = [
  { component: "Clay", percentage: 35 },
  { component: "Sand", percentage: 45 },
  { component: "Silt", percentage: 20 },
];

const nutrientProfile = [
  { nutrient: "Nitrogen", current: 82, optimal: 85 },
  { nutrient: "Phosphorus", current: 76, optimal: 80 },
  { nutrient: "Potassium", current: 88, optimal: 85 },
  { nutrient: "pH Level", current: 68, optimal: 70 },
  { nutrient: "Organic Matter", current: 72, optimal: 75 },
];

export function SoilHealthPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 max-w-[1600px] mx-auto">
        <div className="mb-8">
          <h1 className="mb-2">Soil Health Monitoring</h1>
          <p className="text-muted-foreground">
            Real-time soil analysis and nutrient tracking
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DataCard
            title="Soil Moisture"
            value="68"
            unit="%"
            icon={Droplets}
            trend="Optimal range"
            color="secondary"
          />
          <DataCard
            title="Soil Temperature"
            value="24"
            unit="°C"
            icon={Thermometer}
            trend="+1°C from yesterday"
            color="warning"
          />
          <DataCard
            title="pH Level"
            value="6.8"
            unit=""
            icon={Activity}
            trend="Slightly acidic"
            color="primary"
          />
          <DataCard
            title="Organic Matter"
            value="3.2"
            unit="%"
            icon={Sprout}
            trend="Good level"
            color="success"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Nutrient Profile Radar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Nutrient Profile Analysis</CardTitle>
                <CardDescription>Current vs. optimal levels</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={nutrientProfile}>
                    <PolarGrid stroke="#e0e0e0" />
                    <PolarAngleAxis dataKey="nutrient" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Current Level"
                      dataKey="current"
                      stroke="#2E7D32"
                      fill="#2E7D32"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Optimal Level"
                      dataKey="optimal"
                      stroke="#0288D1"
                      fill="#0288D1"
                      fillOpacity={0.1}
                    />
                    <Legend />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Soil Composition */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Soil Composition</CardTitle>
                <CardDescription>Texture analysis breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={soilComposition} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="component" type="category" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="percentage" fill="#2E7D32" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Detailed Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Detailed Soil Metrics</CardTitle>
              <CardDescription>Field-by-field analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="mb-4">Field A - North Zone</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Nitrogen</span>
                        <span>82%</span>
                      </div>
                      <Progress value={82} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Phosphorus</span>
                        <span>76%</span>
                      </div>
                      <Progress value={76} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Potassium</span>
                        <span>88%</span>
                      </div>
                      <Progress value={88} className="h-2" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-4">Field B - South Zone</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Nitrogen</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Phosphorus</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Potassium</span>
                        <span>72%</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-4">Field C - East Zone</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Nitrogen</span>
                        <span>90%</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Phosphorus</span>
                        <span>82%</span>
                      </div>
                      <Progress value={82} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Potassium</span>
                        <span>79%</span>
                      </div>
                      <Progress value={79} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
