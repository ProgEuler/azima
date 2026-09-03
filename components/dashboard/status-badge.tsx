import type { OrderStatus, UserStatus, ProviderStatus, NotificationStatus, RequestStatus, ServiceStatus, EarningStatus } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

type Status =
  | OrderStatus
  | UserStatus
  | ProviderStatus
  | NotificationStatus
  | RequestStatus
  | ServiceStatus
  | EarningStatus
  | string;

function variantFor(status: Status): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    // "good" states
    case "active":
    case "paid":
    case "delivered":
    case "completed":
    case "open":
      return "default";
    // "warn" / neutral states
    case "invited":
    case "pending":
    case "in_progress":
    case "queued":
    case "draft":
    case "paused":
      return "secondary";
    // "bad" states
    case "suspended":
    case "cancelled":
    case "failed":
    case "bounced":
    case "refunded":
      return "destructive";
    default:
      return "outline";
  }
}

function labelFor(status: Status): string {
  return status.replace(/_/g, " ");
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge variant={variantFor(status)} className="capitalize">
      {labelFor(status)}
    </Badge>
  );
}
