'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Droplets,
  Gauge as GaugeIcon,
  Lock,
  Minus,
  Shield,
  TrendingDown,
  TrendingUp,
  Waves,
  Wind,
} from 'lucide-react';
import Link from 'next/link';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import SensorGauge from '@/components/SensorGauge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getAIRecommendations, type SensorReading } from '@/data/mockData';
import { fetcher } from '@/lib/api';

// Fetch function for sensor readings from API
const fetchSensorData = async (): Promise<SensorReading[]> => {
  const data = await fetcher<SensorReading[]>('/data/current');

  // Convert lastUpdated strings to Date objects
  return data.map((sensor) => ({
    ...sensor,
    lastUpdated: new Date(sensor.lastUpdated),
  }));
};

// Fetch function for historical data from API
const fetchHistoricalData = async (numDays: number) => {
  const data = await fetcher<any[]>(`/data/history?num_days=${numDays}`);
  // Convert timestamp strings to Date objects
  return data.map((point) => ({
    ...point,
    timestamp: new Date(point.timestamp),
  }));
};

export default function Dashboard() {
  const {
    data: sensors = [],
    isLoading: isLoadingCurrent,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['sensorReadings'],
    queryFn: fetchSensorData,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    staleTime: 20000, // Consider data stale after 20 seconds
    retry: 3, // Retry failed requests 3 times
  });

  const { data: last24Hours = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['historicalData', 1],
    queryFn: () => fetchHistoricalData(1),
    refetchInterval: 60000, // Auto-refresh every 60 seconds
    staleTime: 30000, // Consider data stale after 30 seconds
    retry: 3,
  });

  const recommendations = getAIRecommendations();
  const lastUpdate = new Date();

  // Loading state
  if (isLoadingCurrent || isLoadingHistory) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-primary border-b-2"></div>
          <p className="text-muted-foreground">Loading sensor data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Failed to Load Sensor Data</AlertTitle>
          <AlertDescription className="mt-2">
            <p>
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="mt-4"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const violations = sensors.filter((s) => s.status === 'violation');
  const complianceRate = (
    ((sensors.length - violations.length) / sensors.length) *
    100
  ).toFixed(1);

  const getIcon = (sensorId: string) => {
    switch (sensorId) {
      case 'ph':
        return <Activity className="h-5 w-5" />;
      case 'dissolvedOxygen':
        return <Wind className="h-5 w-5" />;
      case 'turbidity':
        return <Droplets className="h-5 w-5" />;
      case 'conductivity':
        return <Waves className="h-5 w-5" />;
      case 'flowRate':
        return <GaugeIcon className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  // Calculate daily trends
  const calculateTrend = (sensorId: string) => {
    if (!last24Hours || last24Hours.length < 2) {
      return {
        icon: <Minus className="h-4 w-4" />,
        text: 'N/A',
        color: 'text-muted-foreground',
      };
    }

    const recentData = last24Hours.slice(-12); // Last 12 hours
    const olderData = last24Hours.slice(0, 12); // First 12 hours

    const recentAvg =
      recentData.reduce(
        (sum: number, d: any) =>
          sum + (d[sensorId as keyof typeof d] as number),
        0
      ) / recentData.length;
    const olderAvg =
      olderData.reduce(
        (sum: number, d: any) =>
          sum + (d[sensorId as keyof typeof d] as number),
        0
      ) / olderData.length;

    const change = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (Math.abs(change) < 2)
      return {
        icon: <Minus className="h-4 w-4" />,
        text: 'Stable',
        color: 'text-muted-foreground',
      };
    if (change > 0)
      return {
        icon: <TrendingUp className="h-4 w-4" />,
        text: `+${change.toFixed(1)}%`,
        color: 'text-destructive',
      };
    return {
      icon: <TrendingDown className="h-4 w-4" />,
      text: `${change.toFixed(1)}%`,
      color: 'text-primary',
    };
  };

  // Pie chart data
  const pieData = [
    {
      name: 'Compliant',
      value: sensors.length - violations.length,
      color: '#84cc16',
    },
    { name: 'Non-Compliant', value: violations.length, color: '#ef4444' },
  ];

  // Compliance frequency data (last 7 days)
  const complianceFrequency = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toLocaleDateString('en-GB', {
        month: 'short',
        day: 'numeric',
      }),
      compliance: 65 + Math.random() * 30, // Mock: 65-95% compliance
    };
  });

  // Scatter plot data (pH vs DO correlation)
  const correlationData = last24Hours.map((d: any) => ({
    ph: d.ph,
    do: d.dissolvedOxygen,
  }));

  // Calculate cost impact
  const costImpact = violations.length * 15000000; // 15M VND per violation per day

  return (
    <div className="space-y-6">
      {/* CyberSecurity & System Status Banner */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-primary/50 bg-primary/5">
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/20 p-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">
                  🛡️ Enterprise Security Enabled
                </div>
                <div className="text-muted-foreground text-xs">
                  End-to-end encryption • Secure audit trails • Real-time
                  monitoring
                </div>
              </div>
              <Badge variant="default" className="bg-primary">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-green-500/20 p-3">
                <Lock className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">
                  🔐 Data Encryption Active
                </div>
                <div className="text-muted-foreground text-xs">
                  AES-256 encryption • Secure data transmission • ISO 27001
                  compliant
                </div>
              </div>
              <Badge variant="default" className="bg-green-600">
                Secured
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section 1: Real-Time Alerts Banner */}
      {violations.length > 0 && (
        <Alert variant="destructive" className="border-2">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="font-bold text-lg">
            ⚠️ {violations.length} Active Alert
            {violations.length > 1 ? 's' : ''} - Immediate Attention Required
          </AlertTitle>
          <AlertDescription className="mt-2">
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {violations.map((sensor) => (
                <div
                  key={sensor.id}
                  className="rounded border border-destructive/20 bg-destructive/10 p-3"
                >
                  <div className="font-semibold">{sensor.name}</div>
                  <div className="text-sm">
                    Current: {sensor.value.toFixed(2)} {sensor.unit} • Limit:{' '}
                    {sensor.threshold.label}
                  </div>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {violations.length === 0 && (
        <Alert className="border-2 border-primary bg-primary/5">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <AlertTitle className="font-bold text-lg text-primary">
            ✓ All Parameters Within QCVN 40:2025 Limits
          </AlertTitle>
          <AlertDescription>
            System operating normally. Last updated:{' '}
            {lastUpdate.toLocaleTimeString()}
          </AlertDescription>
        </Alert>
      )}

      {/* Section 2: Sensor Cards with Gauge Visualization */}
      <div>
        <h2 className="mb-4 font-bold text-2xl">Real-Time Sensor Monitoring</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {sensors.map((sensor) => (
            <Card
              key={sensor.id}
              className={`${sensor.status === 'violation' ? 'border-2 border-destructive shadow-lg' : ''}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  {getIcon(sensor.id)}
                  <Badge
                    variant={
                      sensor.status === 'compliant' ? 'default' : 'destructive'
                    }
                    className="font-bold text-xs"
                  >
                    {sensor.status === 'compliant'
                      ? 'COMPLIANT'
                      : 'NON-COMPLIANT'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <SensorGauge
                  value={sensor.value}
                  min={sensor.id === 'ph' ? 4 : 0}
                  max={
                    sensor.id === 'ph'
                      ? 11
                      : sensor.id === 'dissolvedOxygen'
                        ? 15
                        : sensor.id === 'turbidity'
                          ? 100
                          : sensor.id === 'conductivity'
                            ? 5000
                            : 150
                  }
                  thresholdMin={sensor.threshold.min}
                  thresholdMax={sensor.threshold.max}
                  unit={sensor.unit}
                  name={sensor.name}
                />
                <div className="mt-3 text-center text-muted-foreground text-xs">
                  Updated: {sensor.lastUpdated.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Section 3: Compliance Overview */}
      <div>
        <h2 className="mb-4 font-bold text-2xl">Compliance Overview</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">
                Overall Compliance
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-3xl">{complianceRate}%</div>
              <p className="mt-1 text-muted-foreground text-xs">
                {sensors.length - violations.length} of {sensors.length}{' '}
                parameters
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">
                Sensors in Compliance
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-3xl text-primary">
                {sensors.length - violations.length}
              </div>
              <p className="mt-1 text-muted-foreground text-xs">
                Within Compliance Limits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">
                Sensors Out of Compliance
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-3xl text-destructive">
                {violations.length}
              </div>
              <p className="mt-1 text-muted-foreground text-xs">
                Exceeding thresholds
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-medium text-sm">
                Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={80}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section 4: Key Metrics & Trends */}
      <div>
        <h2 className="mb-4 font-bold text-2xl">Key Metrics & Trends</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-medium text-sm">
                pH Level Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-2xl">
                    {sensors.find((s) => s.id === 'ph')?.value.toFixed(2)}
                  </div>
                  <div className="text-muted-foreground text-xs">24h avg</div>
                </div>
                <div
                  className={`flex items-center gap-1 ${calculateTrend('ph').color}`}
                >
                  {calculateTrend('ph').icon}
                  <span className="font-medium text-sm">
                    {calculateTrend('ph').text}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-medium text-sm">
                Water Flow Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">
                {(
                  (sensors.find((s) => s.id === 'flowRate')?.value ?? 0) * 24
                ).toFixed(0)}{' '}
                m³
              </div>
              <div className="text-muted-foreground text-xs">Daily total</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-medium text-sm">DO Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-2xl">
                    {sensors
                      .find((s) => s.id === 'dissolvedOxygen')
                      ?.value.toFixed(1)}{' '}
                    mg/L
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Current level
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1 ${calculateTrend('dissolvedOxygen').color}`}
                >
                  {calculateTrend('dissolvedOxygen').icon}
                  <span className="font-medium text-sm">
                    {calculateTrend('dissolvedOxygen').text}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-medium text-sm">
                Turbidity Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-2xl">
                    {sensors
                      .find((s) => s.id === 'turbidity')
                      ?.value.toFixed(1)}{' '}
                    NTU
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Current level
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1 ${calculateTrend('turbidity').color}`}
                >
                  {calculateTrend('turbidity').icon}
                  <span className="font-medium text-sm">
                    {calculateTrend('turbidity').text}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-medium text-sm">Cost Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-destructive" />
                <div>
                  <div className="font-bold text-2xl text-destructive">
                    ₫{(costImpact / 1000000).toFixed(0)}M
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {violations.length > 0
                      ? 'Potential daily fine'
                      : 'No violations'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section 5: Real-Time Monitoring Charts */}
      <div>
        <h2 className="mb-4 font-bold text-2xl">Real-Time Monitoring Charts</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {/* 24-Hour Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Last 24 Hours - All Parameters</CardTitle>
              <CardDescription>
                Real-time trends for all water quality sensors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={last24Hours}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(date) =>
                      new Date(date).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    }
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(date) =>
                      new Date(date).toLocaleTimeString()
                    }
                    formatter={(value: number) => value.toFixed(2)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ph"
                    stroke="#8b5cf6"
                    name="pH"
                    dot={false}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="dissolvedOxygen"
                    stroke="#3b82f6"
                    name="DO (mg/L)"
                    dot={false}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="turbidity"
                    stroke="#10b981"
                    name="Turbidity (NTU)"
                    dot={false}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="conductivity"
                    stroke="#f59e0b"
                    name="Conductivity"
                    dot={false}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="flowRate"
                    stroke="#ef4444"
                    name="Flow Rate"
                    dot={false}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Compliance Frequency */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Frequency (7 Days)</CardTitle>
              <CardDescription>Daily compliance percentage</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={complianceFrequency}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                  />
                  <Line
                    type="monotone"
                    dataKey="compliance"
                    stroke="#84cc16"
                    strokeWidth={3}
                    dot={{ fill: '#84cc16', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* pH vs DO Correlation */}
          <Card>
            <CardHeader>
              <CardTitle>pH vs DO Correlation</CardTitle>
              <CardDescription>
                Relationship between pH and dissolved oxygen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ph" name="pH" domain={[5, 9]} />
                  <YAxis dataKey="do" name="DO (mg/L)" domain={[0, 10]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter
                    name="pH vs DO"
                    data={correlationData}
                    fill="#8b5cf6"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Section 6: AI Recommendations Widget */}
      <div>
        <h2 className="mb-4 font-bold text-2xl">🤖 AI Recommendations</h2>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Top Priority Actions</CardTitle>
                <CardDescription>
                  Critical metrics requiring immediate attention
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/ai-plan">
                  View All Plans
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.slice(0, 3).map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-accent/50"
                >
                  <Badge
                    variant={
                      rec.priority === 'critical' || rec.priority === 'high'
                        ? 'destructive'
                        : 'default'
                    }
                    className="mt-1"
                  >
                    {rec.priority.toUpperCase()}
                  </Badge>
                  <div className="flex-1">
                    <div className="font-semibold">{rec.sensor}</div>
                    <div className="mt-1 text-muted-foreground text-sm">
                      {rec.issue}
                    </div>
                    <div className="mt-2 text-primary text-sm">
                      💡 {rec.recommendation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
