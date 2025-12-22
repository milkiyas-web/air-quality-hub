import { useState, useEffect, useCallback } from "react";

export interface SensorData {
  temperature: number;
  gas: number;
  dust: number;
  fanStatus: boolean;
  airQualityIndex: number;
}

function calculateAQI(temp: number, gas: number, dust: number): number {
  // Simple AQI calculation based on sensor readings
  let score = 100;
  
  // Temperature penalty (ideal: 20-24°C)
  if (temp < 18 || temp > 26) score -= 15;
  else if (temp < 20 || temp > 24) score -= 5;
  
  // Gas penalty (lower is better, ppm)
  if (gas > 1000) score -= 40;
  else if (gas > 800) score -= 25;
  else if (gas > 500) score -= 10;
  
  // Dust penalty (lower is better, µg/m³)
  if (dust > 150) score -= 40;
  else if (dust > 100) score -= 25;
  else if (dust > 50) score -= 10;
  
  return Math.max(0, Math.min(100, score));
}

function getRandomVariation(base: number, range: number): number {
  return base + (Math.random() - 0.5) * range;
}

export function useSensorData() {
  const [data, setData] = useState<SensorData>({
    temperature: 22.5,
    gas: 420,
    dust: 35,
    fanStatus: false,
    airQualityIndex: 85,
  });
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(new Date());

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newTemp = getRandomVariation(prev.temperature, 0.5);
        const newGas = getRandomVariation(prev.gas, 30);
        const newDust = getRandomVariation(prev.dust, 5);
        
        // Fan affects air quality over time
        const fanEffect = prev.fanStatus ? -2 : 1;
        const adjustedGas = Math.max(200, Math.min(1200, newGas + fanEffect * 5));
        const adjustedDust = Math.max(10, Math.min(200, newDust + fanEffect * 2));
        
        const aqi = calculateAQI(newTemp, adjustedGas, adjustedDust);
        
        return {
          temperature: Math.round(newTemp * 10) / 10,
          gas: Math.round(adjustedGas),
          dust: Math.round(adjustedDust),
          fanStatus: prev.fanStatus,
          airQualityIndex: Math.round(aqi),
        };
      });
      setLastUpdated(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Simulate occasional disconnections
  useEffect(() => {
    const interval = setInterval(() => {
      // 5% chance of brief disconnection
      if (Math.random() < 0.05) {
        setIsConnected(false);
        setTimeout(() => setIsConnected(true), 3000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const toggleFan = useCallback((value: boolean) => {
    setData((prev) => ({ ...prev, fanStatus: value }));
  }, []);

  return {
    data,
    isConnected,
    lastUpdated,
    toggleFan,
  };
}
