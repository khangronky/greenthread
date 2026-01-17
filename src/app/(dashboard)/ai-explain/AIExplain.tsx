'use client';

import { Brain, Clock, Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { type AIExplanation, getAIExplanations } from '@/data/mockData';

export default function AIExplain() {
  const [explanations] = useState<AIExplanation[]>(getAIExplanations());
  const [selectedPeriod, setSelectedPeriod] = useState('24h');
  const [selectedSensor, setSelectedSensor] = useState('all');

  const periods = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
  ];

  const sensors = [
    'all',
    'pH Level',
    'Dissolved Oxygen',
    'Turbidity',
    'Conductivity',
    'Flow Rate',
  ];

  const filteredExplanations = explanations.filter(
    (exp) => selectedSensor === 'all' || exp.sensor === selectedSensor
  );

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'anomaly' ? (
      <TrendingDown className="h-4 w-4 text-destructive" />
    ) : (
      <TrendingUp className="h-4 w-4 text-primary" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 font-bold text-3xl">
          <Brain className="h-8 w-8 text-primary" /> AI Explain
        </h1>
        <p className="text-muted-foreground">
          AI-powered causal factor analysis for sensor parameter changes
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <label className="font-medium text-sm">Time Period</label>
            <div className="flex gap-2">
              {periods.map((period) => (
                <Button
                  key={period.value}
                  variant={
                    selectedPeriod === period.value ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => setSelectedPeriod(period.value)}
                >
                  {period.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-medium text-sm">Sensor</label>
            <div className="flex flex-wrap gap-2">
              {sensors.map((sensor) => (
                <Button
                  key={sensor}
                  variant={selectedSensor === sensor ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSensor(sensor)}
                >
                  {sensor === 'all' ? 'All Sensors' : sensor}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Explanations List */}
      <div className="space-y-4">
        <h2 className="font-semibold text-xl">
          Analysis Results ({filteredExplanations.length})
        </h2>

        {filteredExplanations.map((explanation) => (
          <Card key={explanation.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {getStatusIcon(explanation.status)}
                    {explanation.sensor}
                  </CardTitle>
                  <CardDescription className="mt-1 flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {explanation.timestamp.toLocaleString()}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="font-bold text-2xl">
                    {explanation.value.toFixed(2)}
                  </div>
                  <Badge
                    variant={
                      explanation.status === 'anomaly'
                        ? 'destructive'
                        : 'default'
                    }
                  >
                    {explanation.status === 'anomaly'
                      ? 'Anomaly Detected'
                      : 'Normal'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-3 flex items-center gap-2 font-semibold">
                  <Brain className="h-4 w-4 text-primary" />
                  Causal Factors (Ranked by Impact)
                </h3>
                <div className="space-y-3">
                  {explanation.factors.map((factor, idx) => (
                    <div
                      key={idx}
                      className="space-y-2 rounded-lg border p-4 transition-colors hover:bg-accent/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {factor.impact === 'high' && (
                              <TrendingUp className="h-4 w-4 text-destructive" />
                            )}
                            {factor.impact === 'medium' && (
                              <Minus className="h-4 w-4 text-yellow-500" />
                            )}
                            {factor.impact === 'low' && (
                              <TrendingDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <span className="font-medium">{factor.factor}</span>
                        </div>
                        <Badge variant={getImpactColor(factor.impact)}>
                          {factor.impact.toUpperCase()} Impact
                        </Badge>
                      </div>
                      <p className="pl-6 text-muted-foreground text-sm">
                        {factor.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-primary/20 bg-primary/10 p-4">
                <p className="text-sm">
                  <span className="font-semibold text-primary">
                    💡 AI Insight:
                  </span>{' '}
                  Based on the analysis, {explanation.factors[0]?.factor} is the
                  primary driver of the observed {explanation.sensor} changes.
                  Addressing this factor is expected to have the most
                  significant impact on stabilizing the parameter.
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
