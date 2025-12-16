import { motion } from "motion/react";
import { FileText, Download, Calendar, TrendingUp, BarChart, PieChart, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

const reportsData = [
  {
    id: 1,
    title: "Monthly Yield Analysis",
    type: "Yield Report",
    date: "Oct 15, 2025",
    status: "Ready",
    size: "2.3 MB",
  },
  {
    id: 2,
    title: "Soil Health Assessment",
    type: "Soil Report",
    date: "Oct 10, 2025",
    status: "Ready",
    size: "1.8 MB",
  },
  {
    id: 3,
    title: "Weather Impact Study",
    type: "Weather Report",
    date: "Oct 5, 2025",
    status: "Ready",
    size: "3.1 MB",
  },
  {
    id: 4,
    title: "Quarterly Performance",
    type: "Summary",
    date: "Oct 1, 2025",
    status: "Ready",
    size: "4.5 MB",
  },
];

const regionalData = [
  { region: "North Zone", yield: 2850, growth: "+18%" },
  { region: "South Zone", yield: 2650, growth: "+12%" },
  { region: "East Zone", yield: 2400, growth: "+8%" },
  { region: "West Zone", yield: 2750, growth: "+15%" },
];

const trendData = [
  { metric: "Average Yield", current: "2,450 kg/acre", previous: "2,100 kg/acre", change: "+16.7%" },
  { metric: "Soil Health", current: "85%", previous: "78%", change: "+9.0%" },
  { metric: "Water Usage", current: "1,200 L/acre", previous: "1,450 L/acre", change: "-17.2%" },
  { metric: "Crop Disease", current: "25%", previous: "35%", change: "-28.6%" },
];

export function ReportsPage() {
  const [weeklySummary, setWeeklySummary] = useState<boolean>(() => localStorage.getItem('sched_weekly') !== 'false');
  const [monthlyAnalytics, setMonthlyAnalytics] = useState<boolean>(() => localStorage.getItem('sched_monthly') !== 'false');
  const [soilHealth, setSoilHealth] = useState<boolean>(() => localStorage.getItem('sched_soil') === 'true');
  const [yieldForecast, setYieldForecast] = useState<boolean>(() => localStorage.getItem('sched_yield') !== 'false');

  useEffect(() => {
    localStorage.setItem('sched_weekly', String(weeklySummary));
  }, [weeklySummary]);
  useEffect(() => {
    localStorage.setItem('sched_monthly', String(monthlyAnalytics));
  }, [monthlyAnalytics]);
  useEffect(() => {
    localStorage.setItem('sched_soil', String(soilHealth));
  }, [soilHealth]);
  useEffect(() => {
    localStorage.setItem('sched_yield', String(yieldForecast));
  }, [yieldForecast]);

  const downloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCSV = (report: typeof reportsData[number]) => {
    const csv = `Title,Type,Date,Size\n${report.title},${report.type},${report.date},${report.size}`;
    downloadFile(`${report.title.replace(/\s+/g,'_')}.csv`, csv, 'text/csv');
    toast.success('CSV downloaded');
  };

  const handleDownloadPDF = (report: typeof reportsData[number]) => {
    const text = `Report: ${report.title}\nType: ${report.type}\nDate: ${report.date}\nSize: ${report.size}\n\nThis is a placeholder PDF.`;
    downloadFile(`${report.title.replace(/\s+/g,'_')}.pdf`, text, 'application/pdf');
    toast.success('PDF generated');
  };

  const handleGenerateReport = () => {
    toast.message('Generating report...', { description: 'This may take a few seconds' });
    setTimeout(() => toast.success('Report ready. Download from the list above.'), 800);
  };
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="mb-2">Reports & Insights</h1>
            <p className="text-muted-foreground">
              Download comprehensive analytics and schedule automated reports
            </p>
          </div>
          <Button className="bg-primary text-primary-foreground" onClick={handleGenerateReport}>
            <FileText className="h-4 w-4 mr-2" />
            Generate New Report
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Downloadable Reports */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Available Reports</CardTitle>
                      <CardDescription>Download your analytics reports</CardDescription>
                    </div>
                    <Download className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportsData.map((report, index) => (
                      <motion.div
                        key={report.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="mb-1">{report.title}</h4>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span>{report.type}</span>
                              <span>•</span>
                              <span>{report.date}</span>
                              <span>•</span>
                              <span>{report.size}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {report.status}
                          </Badge>
                          <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(report)}>
                            <Download className="h-4 w-4 mr-1" />
                            PDF
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDownloadCSV(report)}>
                            CSV
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Key Trends Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <CardTitle>Key Trends Comparison</CardTitle>
                  </div>
                  <CardDescription>Current vs. previous period performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead>Current Period</TableHead>
                        <TableHead>Previous Period</TableHead>
                        <TableHead>Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trendData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.metric}</TableCell>
                          <TableCell>{row.current}</TableCell>
                          <TableCell>{row.previous}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                row.change.startsWith("+")
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              }
                            >
                              {row.change}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </motion.div>

            {/* Regional Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-secondary" />
                    <CardTitle>Regional Performance</CardTitle>
                  </div>
                  <CardDescription>Yield comparison across zones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {regionalData.map((region, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span>{region.region}</span>
                            <div className="flex items-center gap-3">
                              <span>{region.yield} kg/acre</span>
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                {region.growth}
                              </Badge>
                            </div>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(region.yield / 3000) * 100}%` }}
                              transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                              className="h-full bg-primary"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Scheduled Reports */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <CardTitle>Schedule Reports</CardTitle>
                  </div>
                  <CardDescription>Automated report delivery</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Summary</Label>
                      <p className="text-sm text-muted-foreground">Every Monday, 8:00 AM</p>
                    </div>
                    <Switch checked={weeklySummary} onCheckedChange={(v)=>{ setWeeklySummary(v); toast.success(`Weekly Summary ${v ? 'enabled' : 'disabled'}`); }} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Monthly Analytics</Label>
                      <p className="text-sm text-muted-foreground">1st of each month</p>
                    </div>
                    <Switch checked={monthlyAnalytics} onCheckedChange={(v)=>{ setMonthlyAnalytics(v); toast.success(`Monthly Analytics ${v ? 'enabled' : 'disabled'}`); }} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Soil Health Report</Label>
                      <p className="text-sm text-muted-foreground">Bi-weekly</p>
                    </div>
                    <Switch checked={soilHealth} onCheckedChange={(v)=>{ setSoilHealth(v); toast.success(`Soil Health Report ${v ? 'enabled' : 'disabled'}`); }} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Yield Forecast</Label>
                      <p className="text-sm text-muted-foreground">Quarterly</p>
                    </div>
                    <Switch checked={yieldForecast} onCheckedChange={(v)=>{ setYieldForecast(v); toast.success(`Yield Forecast ${v ? 'enabled' : 'disabled'}`); }} />
                  </div>

                  <Button variant="outline" className="w-full mt-4" onClick={()=> toast.message('Open email settings in backend .env (SMTP).', { description: 'Configured for Gmail App Passwords' })}>
                    <Mail className="h-4 w-4 mr-2" />
                    Configure Email
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Insights */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-secondary" />
                    <CardTitle>Quick Insights</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <h4 className="text-sm">Top Performer</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      North Zone showing highest yield growth at +18% this quarter
                    </p>
                  </div>

                  <div className="p-4 bg-secondary/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart className="h-4 w-4 text-secondary" />
                      <h4 className="text-sm">Water Efficiency</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      17% reduction in water usage while maintaining yield levels
                    </p>
                  </div>

                  <div className="p-4 bg-accent/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-accent-foreground" />
                      <h4 className="text-sm">Disease Control</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      28% decrease in crop disease compared to last season
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Export Options */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Export Options</CardTitle>
                  <CardDescription>Choose your preferred format</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Export as PDF
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Export as CSV
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    Export as Excel
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
