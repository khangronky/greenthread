'use client';

import { Bot } from 'lucide-react';
import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { useAIExplainStore, type Severity } from '@/stores/ai-explain.store';
import type { SensorReading, SensorType } from '@/types';
import { cn } from '@/lib/utils';

interface SensorGaugeProps {
  sensor: SensorReading;
}

function getSeverityStyles(severity: Severity) {
  switch (severity) {
    case 'critical':
      return {
        border: 'border-red-500',
        glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]',
        badge: 'bg-red-500 text-white',
        animation: 'animate-pulse',
      };
    case 'warning':
      return {
        border: 'border-yellow-500',
        glow: 'shadow-[0_0_20px_rgba(234,179,8,0.5)]',
        badge: 'bg-yellow-500 text-black',
        animation: 'animate-pulse',
      };
    default:
      return {
        border: 'border-green-500',
        glow: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]',
        badge: 'bg-green-500 text-white',
        animation: 'animate-pulse',
      };
  }
}

export default function SensorGauge({ sensor }: SensorGaugeProps) {
  const { highlight, isStreaming } = useAIExplainStore();

  // Check if this sensor is currently being analyzed
  const isHighlighted =
    isStreaming && highlight.sensorId === (sensor.id as SensorType);
  const styles = isHighlighted ? getSeverityStyles(highlight.severity) : null;

  // Calculate percentage for the gauge (0-100)
  const percentage = sensor.value
    ? ((sensor.value - sensor.ranges.min) /
        (sensor.ranges.max - sensor.ranges.min)) *
      100
    : 0;

  // Determine compliance status
  const isCompliant = sensor.status === 'compliant';

  const data = [
    {
      name: 'value',
      value: percentage,
      fill: isCompliant ? '#84cc16' : '#ef4444', // lime-500 or red-500
    },
  ];

  return (
    <div
      className={cn(
        'relative flex flex-col items-center rounded-lg p-2 transition-all duration-300',
        isHighlighted && [
          'border-2',
          styles?.border,
          styles?.glow,
          styles?.animation,
        ]
      )}
    >
      {/* AI Analyzing Badge */}
      {isHighlighted && (
        <div className="absolute -top-2 left-1/2 z-10 -translate-x-1/2">
          <Badge
            className={cn(
              'flex items-center gap-1 text-xs whitespace-nowrap',
              styles?.badge
            )}
          >
            <Bot className="h-3 w-3" />
            AI Analyzing
          </Badge>
        </div>
      )}

      {/* Gauge Chart */}
      <div className="relative">
        <RadialBarChart
          width={200}
          height={140}
          cx={100}
          cy={110}
          innerRadius={60}
          outerRadius={90}
          barSize={20}
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background={{ fill: '#e5e7eb' }}
            dataKey="value"
            cornerRadius={10}
          />
        </RadialBarChart>

        {/* Center value display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
          <div className="font-bold text-2xl">
            {sensor.value?.toFixed(1) ?? 'N/A'}
          </div>
          {sensor.value !== null && (
            <div className="text-muted-foreground text-sm">{sensor.unit}</div>
          )}
        </div>
      </div>

      {/* Threshold labels */}
      <div className="mt-2 flex w-full justify-between px-2 text-muted-foreground text-xs">
        <span>{sensor.ranges.min.toFixed(0)}</span>
        <span className="font-medium text-primary">
          {sensor.threshold.label}
        </span>
        <span>{sensor.ranges.max.toFixed(0)}</span>
      </div>

      {/* Sensor name */}
      <div className="mt-2 text-center">
        <div className="font-medium text-sm">{sensor.name}</div>
      </div>

      {/* Action Required indicator */}
      {isHighlighted && highlight.actionRequired && (
        <div className="mt-2">
          <Badge variant="destructive" className="text-xs">
            Action Required
          </Badge>
        </div>
      )}
    </div>
  );
}
