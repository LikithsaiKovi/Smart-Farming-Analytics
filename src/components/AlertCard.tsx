import { motion } from "motion/react";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface AlertCardProps {
  type: "warning" | "success" | "info";
  title: string;
  message: string;
  time?: string;
}

export function AlertCard({ type, title, message, time }: AlertCardProps) {
  const config = {
    warning: {
      icon: AlertTriangle,
      color: "bg-amber-50 border-amber-200",
      iconColor: "text-amber-600",
      badge: "bg-amber-100 text-amber-700",
    },
    success: {
      icon: CheckCircle,
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
      badge: "bg-green-100 text-green-700",
    },
    info: {
      icon: Info,
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      badge: "bg-blue-100 text-blue-700",
    },
  };

  const { icon: Icon, color, iconColor, badge } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`${color} border shadow-sm hover:shadow-md transition-shadow cursor-pointer`}>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Icon className={`h-5 w-5 ${iconColor} flex-shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="text-sm">{title}</h4>
                {time && (
                  <Badge variant="outline" className={`${badge} text-xs`}>
                    {time}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{message}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
