import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <Card size="sm">
      <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-center">
        {icon ? <div className="text-muted-foreground">{icon}</div> : null}
        <div className="font-medium">{title}</div>
        {description ? (
          <p className="max-w-sm text-muted-foreground text-xs">{description}</p>
        ) : null}
        {action ? <div className="mt-2">{action}</div> : null}
      </CardContent>
    </Card>
  );
}
