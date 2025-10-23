import { motion } from "motion/react";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const priceData = [
  { month: "Jan", wheat: 245, rice: 320, corn: 180 },
  { month: "Feb", wheat: 255, rice: 330, corn: 185 },
  { month: "Mar", wheat: 268, rice: 345, corn: 190 },
  { month: "Apr", wheat: 272, rice: 350, corn: 195 },
  { month: "May", wheat: 280, rice: 365, corn: 205 },
  { month: "Jun", wheat: 295, rice: 375, corn: 210 },
];

const demandData = [
  { week: "Week 1", demand: 1200 },
  { week: "Week 2", demand: 1450 },
  { week: "Week 3", demand: 1350 },
  { week: "Week 4", demand: 1600 },
  { week: "Week 5", demand: 1800 },
  { week: "Week 6", demand: 1750 },
];

const commodities = [
  { name: "Wheat", price: 295, change: "+8.5%", trend: "up", volume: "12,500 tons" },
  { name: "Rice", price: 375, change: "+6.2%", trend: "up", volume: "8,200 tons" },
  { name: "Corn", price: 210, change: "+5.1%", trend: "up", volume: "15,800 tons" },
  { name: "Soybeans", price: 420, change: "-2.3%", trend: "down", volume: "6,400 tons" },
];

export function MarketTrendsPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 max-w-[1600px] mx-auto">
        <div className="mb-8">
          <h1 className="mb-2">Market Trends</h1>
          <p className="text-muted-foreground">
            Real-time commodity prices and market analysis
          </p>
        </div>

        {/* Commodity Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {commodities.map((commodity, index) => (
            <motion.div
              key={commodity.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{commodity.name}</p>
                      <div className="flex items-baseline gap-1">
                        <DollarSign className="h-4 w-4" />
                        <h3>{commodity.price}</h3>
                        <span className="text-sm text-muted-foreground">/ton</span>
                      </div>
                    </div>
                    {commodity.trend === "up" ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      commodity.trend === "up"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }
                  >
                    {commodity.change}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    Volume: {commodity.volume}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Price Trends */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>6-Month Price Trends</CardTitle>
                <CardDescription>Commodity price movements ($/ton)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="month" stroke="#717182" />
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
                      dataKey="wheat"
                      stroke="#2E7D32"
                      strokeWidth={3}
                      name="Wheat"
                      dot={{ fill: "#2E7D32", r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="rice"
                      stroke="#0288D1"
                      strokeWidth={3}
                      name="Rice"
                      dot={{ fill: "#0288D1", r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="corn"
                      stroke="#FDD835"
                      strokeWidth={3}
                      name="Corn"
                      dot={{ fill: "#FDD835", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Market Demand */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Market Demand</CardTitle>
                <CardDescription>Weekly demand volume (tons)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={demandData}>
                    <defs>
                      <linearGradient id="demandGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0288D1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0288D1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="week" stroke="#717182" />
                    <YAxis stroke="#717182" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="demand"
                      stroke="#0288D1"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#demandGradient)"
                      name="Demand"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Market Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Market Insights & Recommendations</CardTitle>
              <CardDescription>AI-powered trading suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="text-green-900 mb-1">Wheat - Strong Buy</h4>
                      <p className="text-sm text-green-700">
                        Price projected to increase 12-15% in next quarter due to high demand and low inventory.
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    Confidence: 87%
                  </Badge>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3 mb-2">
                    <ShoppingCart className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-blue-900 mb-1">Rice - Hold Position</h4>
                      <p className="text-sm text-blue-700">
                        Stable growth expected. Current prices favorable for gradual selling over next 2 months.
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                    Confidence: 92%
                  </Badge>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-3 mb-2">
                    <TrendingUp className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="text-amber-900 mb-1">Corn - Moderate Buy</h4>
                      <p className="text-sm text-amber-700">
                        Seasonal increase anticipated. Consider accumulating before peak season in 3 weeks.
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                    Confidence: 78%
                  </Badge>
                </div>

                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start gap-3 mb-2">
                    <TrendingDown className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="text-red-900 mb-1">Soybeans - Monitor</h4>
                      <p className="text-sm text-red-700">
                        Price volatility detected. Oversupply concerns. Wait for market stabilization.
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-red-100 text-red-800 border-red-300">
                    Confidence: 81%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
