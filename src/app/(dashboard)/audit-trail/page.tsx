import { Blocks, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getBlockchainTransactions } from '@/data/mockData';

export default function AuditTrailPage() {
  const blockchainTransactions = getBlockchainTransactions();

  return (
    <div>
      <h2 className="mb-4 flex items-center gap-2 font-bold text-2xl">
        <Blocks className="h-8 w-8 text-primary" />
        Blockchain Audit Trail
      </h2>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Immutable Transaction Records</CardTitle>
              <CardDescription>
                All sensor data and compliance events recorded on blockchain for
                transparency and tamper-proof audit trails
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
                    <span className="max-w-75 truncate font-mono">
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
              <li>✓ Regulatory confidence - Cryptographic proof for audits</li>
              <li>
                ✓ Automated traceability - Every action timestamped and
                traceable
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
