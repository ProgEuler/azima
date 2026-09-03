import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type ChartPlaceholderProps = {
  title: string;
  data: number[];
  caption?: string;
};

// Tiny sparkline-style chart placeholder rendered with inline SVG.
// No external chart lib — keeps the bundle small.
export function ChartPlaceholder({ title, data, caption }: ChartPlaceholderProps) {
  const w = 320;
  const h = 96;
  const pad = 6;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const step = (w - pad * 2) / Math.max(data.length - 1, 1);

  const points = data.map((v, i) => {
    const x = pad + i * step;
    const y = pad + (1 - (v - min) / range) * (h - pad * 2);
    return [x, y] as const;
  });

  const path = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  const areaPath = `${path} L${points.at(-1)![0].toFixed(1)},${(h - pad).toFixed(1)} L${points[0]![0].toFixed(1)},${(h - pad).toFixed(1)} Z`;

  return (
    <Card size="sm">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>{title}</CardTitle>
        {caption ? <span className="text-[10px] text-muted-foreground">{caption}</span> : null}
      </CardHeader>
      <CardContent>
        <svg viewBox={`0 0 ${w} ${h}`} className="h-24 w-full" aria-hidden>
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#chartFill)" />
          <path d={path} fill="none" stroke="var(--chart-1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          {points.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={2} fill="var(--chart-1)" />
          ))}
        </svg>
      </CardContent>
    </Card>
  );
}
