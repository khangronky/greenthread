// Helper function to calculate compliance status
export function calculateStatus(
  value: number,
  threshold: { min?: number; max?: number }
): 'compliant' | 'violation' {
  if (threshold.min !== undefined && value < threshold.min) {
    return 'violation';
  }
  if (threshold.max !== undefined && value > threshold.max) {
    return 'violation';
  }
  return 'compliant';
}

// Helper function to format threshold label
export function formatThresholdLabel(threshold: {
  min?: number;
  max?: number;
}): string {
  if (threshold.min !== undefined && threshold.max !== undefined) {
    return `${threshold.min.toFixed(1)} - ${threshold.max.toFixed(1)}`;
  }
  if (threshold.min !== undefined) {
    return `≥ ${threshold.min.toFixed(1)}`;
  }
  if (threshold.max !== undefined) {
    return `≤ ${threshold.max.toFixed(1)}`;
  }
  return 'N/A';
}
