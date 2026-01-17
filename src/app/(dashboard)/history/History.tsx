'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Download,
  History as HistoryIcon,
  Minus,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { fetcher } from '@/lib/api';

// Fetch function for historical data from API
const fetchHistoricalData = async (numDays: number) => {
  const data = await fetcher<any[]>(`/data/history?num_days=${numDays}`);
  // Convert timestamp strings to Date objects
  return data.map((point) => ({
    ...point,
    timestamp: new Date(point.timestamp),
  }));
};

export default function History() {
  const [selectedPeriod, setSelectedPeriod] = useState(7);
  const [selectedSensors, setSelectedSensors] = useState([
    'ph',
    'dissolvedOxygen',
  ]);

  const periods = [
    { value: 7, label: '7 Days' },
    { value: 30, label: '30 Days' },
    { value: 90, label: '90 Days' },
  ];

  const sensors = [
    { id: 'ph', label: 'pH Level', color: '#8b5cf6', unit: '' },
    {
      id: 'dissolvedOxygen',
      label: 'Dissolved Oxygen',
      color: '#3b82f6',
      unit: 'mg/L',
    },
    { id: 'turbidity', label: 'Turbidity', color: '#10b981', unit: 'NTU' },
    {
      id: 'conductivity',
      label: 'Conductivity',
      color: '#f59e0b',
      unit: 'µS/cm',
    },
    { id: 'flowRate', label: 'Flow Rate', color: '#ef4444', unit: 'm³/h' },
  ];

  const {
    data: historicalData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['historicalData', selectedPeriod],
    queryFn: () => fetchHistoricalData(selectedPeriod),
    refetchInterval: 60000, // Auto-refresh every 60 seconds
    staleTime: 30000, // Consider data stale after 30 seconds
    retry: 3,
  });

  const toggleSensor = (sensorId: string) => {
    setSelectedSensors((prev) =>
      prev.includes(sensorId)
        ? prev.filter((id) => id !== sensorId)
        : [...prev, sensorId]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
  };

  const calculateStats = (sensorId: string) => {
    if (!historicalData || historicalData.length === 0) {
      return {
        min: 0,
        max: 0,
        avg: 0,
        trend: 'stable' as const,
        trendPercent: 0,
      };
    }

    const values = historicalData.map(
      (d: any) => d[sensorId as keyof typeof d] as number
    );
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg =
      values.reduce((a: number, b: number) => a + b, 0) / values.length;

    // Calculate trend (last 20% vs first 20%)
    const recentAvg =
      values
        .slice(-Math.floor(values.length * 0.2))
        .reduce((a: number, b: number) => a + b, 0) /
      Math.floor(values.length * 0.2);
    const oldAvg =
      values
        .slice(0, Math.floor(values.length * 0.2))
        .reduce((a: number, b: number) => a + b, 0) /
      Math.floor(values.length * 0.2);
    const trendPercent = ((recentAvg - oldAvg) / oldAvg) * 100;

    let trend: 'improving' | 'stable' | 'degrading';
    if (Math.abs(trendPercent) < 5) trend = 'stable';
    else if (sensorId === 'ph') {
      // For pH, closer to 7 is better
      trend =
        Math.abs(recentAvg - 7) < Math.abs(oldAvg - 7)
          ? 'improving'
          : 'degrading';
    } else if (sensorId === 'dissolvedOxygen') {
      // For DO, higher is better
      trend = trendPercent > 0 ? 'improving' : 'degrading';
    } else {
      // For turbidity, conductivity, flow rate - lower is better
      trend = trendPercent < 0 ? 'improving' : 'degrading';
    }

    return { min, max, avg, trend, trendPercent };
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-primary" />;
      case 'degrading':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-primary border-b-2"></div>
          <p className="text-muted-foreground">Loading historical data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Failed to Load Historical Data</CardTitle>
            <CardDescription>
              Unable to fetch historical sensor data. Please try again later.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 font-bold text-3xl">
          <HistoryIcon className="h-8 w-8 text-primary" />
          Historical Data
        </h1>
        <p className="text-muted-foreground">
          Trend analysis and historical performance tracking
        </p>
      </div>

      {/* Statistical Summary */}
      <div>
        <h2 className="mb-4 font-semibold text-xl">Statistical Summary</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sensors.map((sensor) => {
            const stats = calculateStats(sensor.id);
            return (
              <Card key={sensor.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{sensor.label}</CardTitle>
                    <Badge
                      variant={
                        stats.trend === 'improving'
                          ? 'default'
                          : stats.trend === 'degrading'
                            ? 'destructive'
                            : 'secondary'
                      }
                    >
                      {getTrendIcon(stats.trend)}
                      {stats.trend}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <div className="text-muted-foreground">Min</div>
                      <div className="font-semibold">
                        {stats.min.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Avg</div>
                      <div className="font-semibold">
                        {stats.avg.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Max</div>
                      <div className="font-semibold">
                        {stats.max.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Trend: {stats.trendPercent > 0 ? '+' : ''}
                    {stats.trendPercent.toFixed(1)}% over period
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Period Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Time Period</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          {periods.map((period) => (
            <Button
              key={period.value}
              variant={selectedPeriod === period.value ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod(period.value)}
            >
              {period.label}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Sensor Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Select Sensors to Display
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {sensors.map((sensor) => (
            <Button
              key={sensor.id}
              variant={
                selectedSensors.includes(sensor.id) ? 'default' : 'outline'
              }
              size="sm"
              onClick={() => toggleSensor(sensor.id)}
            >
              <div
                className="mr-2 h-3 w-3 rounded-full"
                style={{ backgroundColor: sensor.color }}
              />
              {sensor.label}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Trend Analysis</CardTitle>
          <CardDescription>
            Historical data for the last {selectedPeriod} days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(date) => formatDate(new Date(date))}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(date) => new Date(date).toLocaleString()}
                formatter={(value: number) => value.toFixed(2)}
              />
              <Legend />
              {selectedSensors.map((sensorId) => {
                const sensor = sensors.find((s) => s.id === sensorId);
                return sensor ? (
                  <Line
                    key={sensorId}
                    type="monotone"
                    dataKey={sensorId}
                    stroke={sensor.color}
                    name={sensor.label}
                    dot={false}
                    strokeWidth={2}
                  />
                ) : null;
              })}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
