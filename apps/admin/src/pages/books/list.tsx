import { useList } from "@refinedev/core";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Book, Shelf } from "@/lib/types";

export function BookList() {
  const books = useList<Book>({ resource: "books" });
  const shelves = useList<Shelf>({ resource: "shelves" });

  const shelfMap = useMemo(() => {
    const map = new Map<string, string>();
    shelves.data?.data.forEach((s) => map.set(s.id, s.name));
    return map;
  }, [shelves.data]);

  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Book>[]>(
    () => [
      {
        accessorKey: "title",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 size-3" />
          </Button>
        ),
      },
      { accessorKey: "author", header: "Author" },
      {
        accessorKey: "shelfId",
        header: "Shelf",
        cell: ({ row }) => shelfMap.get(row.original.shelfId) ?? row.original.shelfId,
      },
      {
        accessorKey: "borrowedBy",
        header: "Status",
        cell: ({ row }) =>
          row.original.borrowedBy ? (
            <Badge variant="secondary">Borrowed by {row.original.borrowedBy}</Badge>
          ) : (
            <Badge variant="outline">Available</Badge>
          ),
      },
    ],
    [shelfMap],
  );

  const table = useReactTable({
    data: books.data?.data ?? [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (books.isLoading || shelves.isLoading) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Books</h1>
        <p className="text-sm text-muted-foreground">Full catalog, sortable.</p>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
