'use client';

import { Badge } from '@/components/ui/badge';
import type { SensorType } from '@/types';

// Define the sensor data type matching the database schema
export type SensorDataRow = {
  id: string;
  type: SensorType;
  value: number;
  unit: string;
  recorded_at: string;
  status: 'compliant' | 'violation';
};

// Simple column configuration without TanStack Table
export type TableColumn = {
  key: keyof SensorDataRow | 'actions';
  label: string;
  sortable: boolean;
  render?: (row: SensorDataRow) => React.ReactNode;
};

// Sensor type display mappings
const sensorTypeLabels: Record<SensorDataRow['type'], string> = {
  temperature: 'Temperature',
  ph: 'pH Level',
  dissolvedOxygen: 'Dissolved Oxygen',
  turbidity: 'Turbidity',
  conductivity: 'Conductivity',
  flowRate: 'Flow Rate',
  tds: 'Total Dissolved Solids',
};

// Sensor type badge colors
const sensorTypeBadgeVariants: Record<
  SensorDataRow['type'],
  'default' | 'secondary' | 'outline'
> = {
  temperature: 'default',
  ph: 'default',
  dissolvedOxygen: 'default',
  turbidity: 'secondary',
  conductivity: 'secondary',
  flowRate: 'outline',
  tds: 'outline',
};

// Simple column definitions
export const tableColumns: TableColumn[] = [
  {
    key: 'recorded_at',
    label: 'Timestamp',
    sortable: true,
    render: (row) => {
      const date = new Date(row.recorded_at);
      return (
        <div className="font-medium">
          <div>{date.toLocaleDateString('en-GB')}</div>
          <div className="text-muted-foreground text-xs">
            {date.toLocaleTimeString('en-GB')}
          </div>
        </div>
      );
    },
  },
  {
    key: 'type',
    label: 'Sensor Type',
    sortable: true,
    render: (row) => {
      return (
        <Badge variant={sensorTypeBadgeVariants[row.type]}>
          {sensorTypeLabels[row.type]}
        </Badge>
      );
    },
  },
  {
    key: 'value',
    label: 'Value',
    sortable: true,
    render: (row) => {
      return <div className="font-semibold">{row.value.toFixed(2)}</div>;
    },
  },
  {
    key: 'unit',
    label: 'Unit',
    sortable: false,
    render: (row) => {
      return <div className="text-muted-foreground">{row.unit || '—'}</div>;
    },
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (row) => {
      return (
        <Badge
          variant={row.status === 'compliant' ? 'default' : 'destructive'}
          className="font-medium"
        >
          {row.status === 'compliant' ? 'Compliant' : 'Violation'}
        </Badge>
      );
    },
  },
];
