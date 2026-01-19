import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';
import type { SensorReading } from '@/types';

interface SensorGaugeProps {
  sensor: SensorReading;
}

export default function SensorGauge({ sensor }: SensorGaugeProps) {
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
    <div className="flex flex-col items-center">
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
    </div>
  );
}
