import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type DataTableColumn<T> = {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  width?: string; // e.g. "w-32"
  align?: "left" | "right" | "center";
};

export function DataTable<T>({
  columns,
  data,
  empty,
}: {
  columns: DataTableColumn<T>[];
  data: T[];
  empty?: ReactNode;
}) {
  if (data.length === 0 && empty) {
    return <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">{empty}</div>;
  }
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={c.key} className={c.width} style={c.align === "right" ? { textAlign: "right" } : c.align === "center" ? { textAlign: "center" } : undefined}>
                {c.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow key={idx}>
              {columns.map((c) => (
                <TableCell key={c.key} className={c.width} style={c.align === "right" ? { textAlign: "right" } : c.align === "center" ? { textAlign: "center" } : undefined}>
                  {c.render(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
