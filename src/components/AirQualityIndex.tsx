import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Wind } from "lucide-react";

interface AirQualityIndexProps {
  score: number; // 0-100
  className?: string;
}

function getAQIStatus(score: number) {
  if (score >= 80) return { label: "Excellent", color: "text-success", bgColor: "bg-success" };
  if (score >= 60) return { label: "Good", color: "text-primary", bgColor: "bg-primary" };
  if (score >= 40) return { label: "Moderate", color: "text-warning", bgColor: "bg-warning" };
  if (score >= 20) return { label: "Poor", color: "text-destructive", bgColor: "bg-destructive" };
  return { label: "Hazardous", color: "text-destructive", bgColor: "bg-destructive" };
}

export function AirQualityIndex({ score, className }: AirQualityIndexProps) {
  const status = getAQIStatus(score);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card variant="control" className={cn("overflow-hidden", className)}>
      <CardContent className="p-8">
        <div className="flex flex-col items-center">
          <div className="relative">
            {/* Background glow */}
            <div 
              className={cn(
                "absolute inset-0 rounded-full blur-2xl opacity-20",
                status.bgColor
              )} 
            />
            
            {/* SVG Circle */}
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-secondary"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                className={cn("transition-all duration-1000 ease-out", status.color)}
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                }}
              />
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Wind className={cn("h-6 w-6 mb-1", status.color)} />
              <span className="text-4xl font-bold font-mono">{score}</span>
              <span className="text-xs text-muted-foreground">AQI</span>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <h3 className={cn("text-2xl font-semibold", status.color)}>
              {status.label}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Air Quality Index
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
