'use client';

import {
  Blocks,
  CheckCircle,
  Clock,
  Download,
  History as HistoryIcon,
  Minus,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useMemo, useState } from 'react';
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
import { getBlockchainTransactions, getHistoricalData } from '@/data/mockData';

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

  const historicalData = useMemo(
    () => getHistoricalData(selectedPeriod),
    [selectedPeriod]
  );
  const blockchainTransactions = getBlockchainTransactions();

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
    const values = historicalData.map(
      (d) => d[sensorId as keyof typeof d] as number
    );
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;

    // Calculate trend (last 20% vs first 20%)
    const recentAvg =
      values
        .slice(-Math.floor(values.length * 0.2))
        .reduce((a, b) => a + b, 0) / Math.floor(values.length * 0.2);
    const oldAvg =
      values
        .slice(0, Math.floor(values.length * 0.2))
        .reduce((a, b) => a + b, 0) / Math.floor(values.length * 0.2);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 font-bold text-3xl">
          <HistoryIcon className="h-8 w-8 text-primary" />
          Historical Data & Blockchain Audit Trail
        </h1>
        <p className="text-muted-foreground">
          Trend analysis, historical performance tracking, and immutable
          blockchain records
        </p>
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

      {/* Statistical Summary */}
      <div>
        <h2 className="mb-4 font-semibold text-xl">Statistical Summary</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sensors
            .filter((s) => selectedSensors.includes(s.id))
            .map((sensor) => {
              const stats = calculateStats(sensor.id);
              return (
                <Card key={sensor.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {sensor.label}
                      </CardTitle>
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

      {/* Blockchain Audit Trail Section */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 font-bold text-2xl">
          <Blocks className="h-8 w-8 text-primary" />
          ⛓️ Blockchain Audit Trail
        </h2>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Immutable Transaction Records</CardTitle>
                <CardDescription>
                  All sensor data and compliance events recorded on blockchain
                  for transparency and tamper-proof audit trails
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-primary/10">
                <Blocks className="mr-1 h-3 w-3" />
                Blockchain Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {blockchainTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-accent/50"
                >
                  <div className="shrink-0">
                    {tx.status === 'confirmed' ? (
                      <div className="rounded-full bg-green-500/20 p-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                    ) : (
                      <div className="rounded-full bg-yellow-500/20 p-2">
                        <Clock className="h-5 w-5 text-yellow-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        {tx.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-muted-foreground text-xs">
                        {tx.timestamp.toLocaleString()}
                      </span>
                    </div>
                    <div className="font-medium text-sm">{tx.description}</div>
                    <div className="flex items-center gap-4 text-muted-foreground text-xs">
                      <span>Block #{tx.blockNumber}</span>
                      <span className="max-w-[300px] truncate font-mono">
                        {tx.dataHash}
                      </span>
                      <Badge
                        variant={
                          tx.status === 'confirmed' ? 'default' : 'secondary'
                        }
                        className="text-xs"
                      >
                        {tx.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg bg-muted/50 p-4">
              <h4 className="mb-2 font-semibold">Why Blockchain?</h4>
              <ul className="space-y-1 text-muted-foreground text-sm">
                <li>
                  ✓ Immutable records - Data cannot be altered retroactively
                </li>
                <li>
                  ✓ Full transparency - All stakeholders can verify compliance
                  history
                </li>
                <li>
                  ✓ Regulatory confidence - Cryptographic proof for audits
                </li>
                <li>
                  ✓ Automated traceability - Every action timestamped and
                  traceable
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
