import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';

interface SensorGaugeProps {
  value: number;
  min: number;
  max: number;
  thresholdMin?: number;
  thresholdMax?: number;
  unit: string;
  name: string;
}

export default function SensorGauge({
  value,
  min,
  max,
  thresholdMin,
  thresholdMax,
  unit,
  name,
}: SensorGaugeProps) {
  // Calculate percentage for the gauge (0-100)
  const percentage = ((value - min) / (max - min)) * 100;

  // Determine compliance status
  const isCompliant =
    (thresholdMin === undefined || value >= thresholdMin) &&
    (thresholdMax === undefined || value <= thresholdMax);

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
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <div className="font-bold text-3xl">{value.toFixed(1)}</div>
          <div className="text-muted-foreground text-sm">{unit}</div>
        </div>
      </div>

      {/* Threshold labels */}
      <div className="mt-2 flex w-full justify-between px-2 text-muted-foreground text-xs">
        <span>{min.toFixed(0)}</span>
        {thresholdMin && thresholdMax && (
          <span className="font-medium text-primary">
            {thresholdMin.toFixed(1)}-{thresholdMax.toFixed(1)}
          </span>
        )}
        {thresholdMin && !thresholdMax && (
          <span className="font-medium text-primary">
            ≥{thresholdMin.toFixed(1)}
          </span>
        )}
        {!thresholdMin && thresholdMax && (
          <span className="font-medium text-primary">
            ≤{thresholdMax.toFixed(1)}
          </span>
        )}
        <span>{max.toFixed(0)}</span>
      </div>

      {/* Sensor name */}
      <div className="mt-2 text-center">
        <div className="font-medium text-sm">{name}</div>
      </div>
    </div>
  );
}
