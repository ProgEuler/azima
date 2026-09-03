import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type KpiTrend = "up" | "down";

export type KpiCardProps = {
  label: string;
  value: string;
  delta: string;
  trend: KpiTrend;
  icon?: ReactNode;
};

export function KpiCard({ label, value, delta, trend, icon }: KpiCardProps) {
  const positive = trend === "up";
  return (
    <Card size="sm">
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="text-muted-foreground">{label}</CardTitle>
        {icon ? <div className="text-muted-foreground">{icon}</div> : null}
      </CardHeader>
      <CardContent>
        <div className="font-heading text-2xl font-semibold tracking-tight">{value}</div>
        <div
          className={cn(
            "mt-1 inline-flex items-center gap-1 font-medium text-xs",
            positive ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
          )}
        >
          {positive ? <ArrowUpIcon className="size-3" /> : <ArrowDownIcon className="size-3" />}
          {delta}
        </div>
      </CardContent>
    </Card>
  );
}
