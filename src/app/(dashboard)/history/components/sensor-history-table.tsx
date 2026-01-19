'use client';

import { useQuery } from '@tanstack/react-query';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Filter,
  X,
} from 'lucide-react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { fetcher } from '@/lib/api';
import { cn } from '@/lib/utils';
import {
  type SensorDataRow,
  tableColumns,
} from './sensor-history-table-columns';

// API Response type
type SensorHistoryResponse = {
  data: SensorDataRow[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

// Fetch sensor history data from API
const fetchSensorHistory = async (
  page: number,
  pageSize: number,
  sortBy: string,
  sortOrder: 'asc' | 'desc',
  sensorType: string,
  startDate: Date | null,
  endDate: Date | null
): Promise<SensorHistoryResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('pageSize', pageSize.toString());
  params.append('sortBy', sortBy);
  params.append('sortOrder', sortOrder);

  if (sensorType && sensorType !== 'all') {
    params.append('sensorType', sensorType);
  }

  if (startDate) {
    params.append('startDate', startDate.toISOString());
  }

  if (endDate) {
    params.append('endDate', endDate.toISOString());
  }

  const data = await fetcher<SensorHistoryResponse>(
    `/data/sensor-history?${params.toString()}`
  );
  return data;
};

// Export data to CSV
const exportToCSV = (data: SensorDataRow[], filename: string) => {
  // Define CSV headers
  const headers = ['Timestamp', 'Sensor Type', 'Value', 'Unit', 'Status'];

  // Map sensor type to readable labels
  const sensorTypeLabels: Record<SensorDataRow['type'], string> = {
    ph: 'pH Level',
    dissolvedOxygen: 'Dissolved Oxygen',
    turbidity: 'Turbidity',
    conductivity: 'Conductivity',
    flowRate: 'Flow Rate',
    tds: 'Total Dissolved Solids',
  };

  // Convert data to CSV rows
  const csvRows = data.map((row) => [
    new Date(row.recorded_at).toLocaleString('en-GB'),
    sensorTypeLabels[row.type],
    row.value.toString(),
    row.unit || '—',
    row.status === 'compliant' ? 'Compliant' : 'Violation',
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...csvRows.map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Sort icon component
const SortIcon = ({
  isSorted,
  direction,
}: {
  isSorted: boolean;
  direction: 'asc' | 'desc';
}) => {
  if (!isSorted) {
    return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
  }

  return direction === 'asc' ? (
    <ArrowUp className="ml-2 h-4 w-4" />
  ) : (
    <ArrowDown className="ml-2 h-4 w-4" />
  );
};

export function SensorHistoryTable() {
  // Controlled state - each change triggers API refetch
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState<string>('recorded_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sensorTypeFilter, setSensorTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Fetch data with React Query - refetches on ANY state change
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery<SensorHistoryResponse>({
    queryKey: [
      'sensorHistory',
      page,
      pageSize,
      sortColumn,
      sortDirection,
      sensorTypeFilter,
      dateRange?.from,
      dateRange?.to,
    ],
    queryFn: () =>
      fetchSensorHistory(
        page,
        pageSize,
        sortColumn,
        sortDirection,
        sensorTypeFilter,
        dateRange?.from || null,
        dateRange?.to || null
      ),
    staleTime: 30000,
    retry: 2,
  });

  // Sort handler
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      // Toggle direction if same column
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      // New column - default to descending
      setSortColumn(columnKey);
      setSortDirection('desc');
    }
    // Reset to page 1 when sorting changes
    setPage(1);
  };

  // Pagination handlers
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: string) => {
    setPageSize(Number(newSize));
    setPage(1); // Reset to first page
  };

  // Filter handlers
  const handleSensorTypeChange = (type: string) => {
    setSensorTypeFilter(type);
    setPage(1); // Reset to first page
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setPage(1); // Reset to first page
  };

  const handleClearDateRange = () => {
    setDateRange(undefined);
    setPage(1);
  };

  // Export handler
  const handleExport = () => {
    if (!response?.data) return;

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `sensor-history-${timestamp}.csv`;
    exportToCSV(response.data, filename);
  };

  // Error state
  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sensor Data History</CardTitle>
          <CardDescription>
            Detailed sensor readings with filtering and export capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <p className="font-semibold text-destructive">
                Failed to load sensor data
              </p>
              <p className="text-muted-foreground text-sm">
                {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalPages = response?.pagination.totalPages || 1;
  const currentPage = response?.pagination.page || page;
  const total = response?.pagination.total || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>Sensor Data History</CardTitle>
            <CardDescription>
              Detailed sensor readings with filtering and export capabilities
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={!response?.data || response.data.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sensor Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select
              value={sensorTypeFilter}
              onValueChange={handleSensorTypeChange}
            >
              <SelectTrigger className="w-50">
                <SelectValue placeholder="Filter by sensor type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sensors</SelectItem>
                <SelectItem value="ph">pH Level</SelectItem>
                <SelectItem value="dissolvedOxygen">
                  Dissolved Oxygen
                </SelectItem>
                <SelectItem value="turbidity">Turbidity</SelectItem>
                <SelectItem value="conductivity">Conductivity</SelectItem>
                <SelectItem value="flowRate">Flow Rate</SelectItem>
                <SelectItem value="tds">Total Dissolved Solids</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-65 justify-start text-left font-normal',
                  !dateRange && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {dateRange.from.toLocaleDateString('en-GB')} -{' '}
                      {dateRange.to.toLocaleDateString('en-GB')}
                    </>
                  ) : (
                    dateRange.from.toLocaleDateString('en-GB')
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* Clear Date Range */}
          {dateRange && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearDateRange}
              className="h-9"
            >
              <X className="mr-1 h-4 w-4" />
              Clear
            </Button>
          )}

          {/* Active Filters Display */}
          {(sensorTypeFilter !== 'all' || dateRange) && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Filters:</span>
              {sensorTypeFilter !== 'all' && (
                <Badge variant="secondary">
                  {sensorTypeFilter.replace(/_/g, ' ')}
                </Badge>
              )}
              {dateRange && <Badge variant="secondary">Date Range</Badge>}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {tableColumns.map((column) => (
                  <TableHead key={column.key}>
                    {column.sortable ? (
                      <Button
                        variant="ghost"
                        onClick={() => handleSort(column.key)}
                        className="-ml-4 h-8"
                      >
                        {column.label}
                        <SortIcon
                          isSorted={sortColumn === column.key}
                          direction={sortDirection}
                        />
                      </Button>
                    ) : (
                      column.label
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={tableColumns.length}
                    className="h-64 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <p className="text-muted-foreground text-sm">
                        Loading data...
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : !response?.data || response.data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={tableColumns.length}
                    className="h-64 text-center"
                  >
                    <p className="text-muted-foreground">
                      No sensor data found
                    </p>
                    {(sensorTypeFilter !== 'all' || dateRange) && (
                      <p className="text-muted-foreground text-sm">
                        Try adjusting your filters
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                response.data.map((row) => (
                  <TableRow key={row.id}>
                    {tableColumns.map((column) => (
                      <TableCell key={column.key}>
                        {column.render
                          ? column.render(row)
                          : column.key !== 'actions'
                            ? String(
                                row[column.key as keyof SensorDataRow] ?? ''
                              )
                            : ''}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {response && response.data.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            {/* Page size selector */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Rows per page:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="h-8 w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 25, 50, 100].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Page info and navigation */}
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                Page {currentPage} of {totalPages} ({total} total)
              </span>

              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1 || isLoading}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages || isLoading}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
