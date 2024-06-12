"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  CellContext,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onDeleteFile: (fileId: string) => void
  onFavoriteToggle: (fileId: string) => void
  onRestoreFile: (fileId: string) => void
}

type ExtendedCellContext<TData, TValue> = CellContext<TData, TValue> & {
  onDeleteFile: (fileId: string) => void;
  onFavoriteToggle: (fileId: string) => void;
  onRestoreFile: (fileId: string) => void;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  onDeleteFile,
  onFavoriteToggle,
  onRestoreFile,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns: columns.map(column => ({
      ...column,
      cell: column.id === "actions"
        ? (context: CellContext<TData, TValue>) => typeof column.cell === "function"
          ? column.cell({ ...context, onDeleteFile, onFavoriteToggle, onRestoreFile } as ExtendedCellContext<TData, TValue>)
          : null
        : column.cell,
    })),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}