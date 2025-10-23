import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface DataCardProps {
  title: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  trend?: string;
  color?: string;
}

export function DataCard({ title, value, unit, icon: Icon, trend, color = "primary" }: DataCardProps) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent-foreground",
    success: "bg-green-100 text-green-600",
    warning: "bg-amber-100 text-amber-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-muted-foreground text-sm mb-2">{title}</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-3xl">{value}</h3>
                {unit && <span className="text-muted-foreground">{unit}</span>}
              </div>
              {trend && (
                <p className="text-sm text-muted-foreground mt-2">{trend}</p>
              )}
            </div>
            <div className={`p-3 rounded-xl ${colorClasses[color as keyof typeof colorClasses] || colorClasses.primary}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
