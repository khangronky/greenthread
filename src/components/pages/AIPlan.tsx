'use client';

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';
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
import {
  type AIRecommendation,
  getAIRecommendations,
  getSensorReadings,
} from '@/utils/mockData';

export default function AIPlan() {
  const [recommendations] = useState<AIRecommendation[]>(
    getAIRecommendations()
  );
  const [sensors] = useState(getSensorReadings());
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedSensor, setSelectedSensor] = useState('all');

  const priorities = ['all', 'critical', 'high', 'medium', 'low'];
  const sensorNames = ['all', ...new Set(recommendations.map((r) => r.sensor))];

  const filteredRecommendations = recommendations.filter((rec) => {
    const priorityMatch =
      selectedPriority === 'all' || rec.priority === selectedPriority;
    const sensorMatch =
      selectedSensor === 'all' || rec.sensor === selectedSensor;
    return priorityMatch && sensorMatch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4" />;
      case 'high':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  const complianceRate = (
    (sensors.filter((s) => s.status === 'compliant').length / sensors.length) *
    100
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 font-bold text-3xl">
          <Lightbulb className="h-8 w-8 text-primary" />🤖 AI Plan
        </h1>
        <p className="text-muted-foreground">
          AI-generated corrective action recommendations for optimal compliance
        </p>
      </div>

      {/* Compliance Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Current Compliance
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{complianceRate}%</div>
            <p className="text-muted-foreground text-xs">
              {sensors.filter((s) => s.status === 'compliant').length} of{' '}
              {sensors.length} parameters
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Recommendations
            </CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{recommendations.length}</div>
            <p className="text-muted-foreground text-xs">
              {
                recommendations.filter(
                  (r) => r.priority === 'critical' || r.priority === 'high'
                ).length
              }{' '}
              high priority
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Target Compliance
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-primary">95%+</div>
            <p className="text-muted-foreground text-xs">
              Expected after implementation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <label className="font-medium text-sm">Priority Level</label>
            <div className="flex gap-2">
              {priorities.map((priority) => (
                <Button
                  key={priority}
                  variant={
                    selectedPriority === priority ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => setSelectedPriority(priority)}
                >
                  {priority === 'all'
                    ? 'All'
                    : priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="font-medium text-sm">Sensor</label>
            <div className="flex flex-wrap gap-2">
              {sensorNames.slice(0, 4).map((sensor) => (
                <Button
                  key={sensor}
                  variant={selectedSensor === sensor ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSensor(sensor)}
                >
                  {sensor === 'all' ? 'All' : sensor}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations List */}
      <div className="space-y-4">
        <h2 className="font-semibold text-xl">
          Action Plan ({filteredRecommendations.length})
        </h2>

        {filteredRecommendations.map((rec) => (
          <Card key={rec.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{rec.sensor}</CardTitle>
                    <Badge variant={getPriorityColor(rec.priority)}>
                      {getPriorityIcon(rec.priority)}
                      {rec.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    <AlertTriangle className="mr-1 inline h-3 w-3" />
                    {rec.issue}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Recommendation */}
              <div className="rounded-lg border border-primary/20 bg-primary/10 p-4">
                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  Recommendation
                </h3>
                <p className="text-sm">{rec.recommendation}</p>
              </div>

              {/* Action Steps */}
              <div>
                <h3 className="mb-3 font-semibold">Action Steps</h3>
                <div className="space-y-2">
                  {rec.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"
                    >
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground text-sm">
                        {idx + 1}
                      </div>
                      <p className="pt-0.5 text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected Impact */}
              <div className="rounded-lg border bg-accent/50 p-4">
                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Expected Impact
                </h3>
                <p className="text-muted-foreground text-sm">
                  {rec.estimatedImpact}
                </p>
              </div>

              {/* Action Button */}
              <div className="flex justify-end">
                <Button>
                  Implement Plan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
