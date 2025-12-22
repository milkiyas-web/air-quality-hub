import { Thermometer, Wind, Sparkles } from "lucide-react";
import { Header } from "@/components/Header";
import { SensorCard } from "@/components/SensorCard";
import { AirQualityIndex } from "@/components/AirQualityIndex";
import { FanControl } from "@/components/FanControl";
import { StatusBar } from "@/components/StatusBar";
import { useSensorData } from "@/hooks/useSensorData";

function getTemperatureStatus(temp: number) {
  if (temp >= 20 && temp <= 24) return { status: "good" as const, text: "Optimal" };
  if (temp >= 18 && temp <= 26) return { status: "moderate" as const, text: "Acceptable" };
  return { status: "poor" as const, text: "Out of range" };
}

function getGasStatus(gas: number) {
  if (gas < 500) return { status: "good" as const, text: "Clean air" };
  if (gas < 800) return { status: "moderate" as const, text: "Fair" };
  return { status: "poor" as const, text: "Ventilate" };
}

function getDustStatus(dust: number) {
  if (dust < 50) return { status: "good" as const, text: "Excellent" };
  if (dust < 100) return { status: "moderate" as const, text: "Moderate" };
  return { status: "poor" as const, text: "High PM" };
}

export default function Index() {
  const { data, isConnected, lastUpdated, toggleFan } = useSensorData();
  
  const tempStatus = getTemperatureStatus(data.temperature);
  const gasStatus = getGasStatus(data.gas);
  const dustStatus = getDustStatus(data.dust);

  return (
    <div className="min-h-screen bg-background">
      <Header isConnected={isConnected} lastUpdated={lastUpdated} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Status Bar */}
        <div className="mb-8 animate-fade-in">
          <StatusBar 
            roomName="Conference Room A - Main Building" 
            uptime="4h 23m" 
          />
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Air Quality Index - Featured */}
          <div className="lg:row-span-2 animate-fade-in-delay-1">
            <AirQualityIndex 
              score={data.airQualityIndex} 
              className="h-full"
            />
          </div>

          {/* Sensor Cards */}
          <div className="animate-fade-in-delay-2">
            <SensorCard
              title="Temperature"
              value={data.temperature}
              unit="°C"
              icon={Thermometer}
              status={tempStatus.status}
              statusText={tempStatus.text}
            />
          </div>

          <div className="animate-fade-in-delay-3">
            <SensorCard
              title="Gas Level"
              value={data.gas}
              unit="ppm"
              icon={Wind}
              status={gasStatus.status}
              statusText={gasStatus.text}
            />
          </div>

          <div className="animate-fade-in-delay-4">
            <SensorCard
              title="Dust Particles"
              value={data.dust}
              unit="µg/m³"
              icon={Sparkles}
              status={dustStatus.status}
              statusText={dustStatus.text}
            />
          </div>

          {/* Fan Control */}
          <div className="md:col-span-2 lg:col-span-1 animate-fade-in-delay-4">
            <FanControl
              isOn={data.fanStatus}
              onToggle={toggleFan}
              className="h-full"
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>IoT Air Quality Monitoring System • Real-time Environmental Data</p>
        </footer>
      </main>
    </div>
  );
}
