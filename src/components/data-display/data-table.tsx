"use client";

import * as React from "react";

import type {
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useConfirm from "@/hooks/use-confirm";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterKey?: string;
  onDelete?: (rows: Row<TData>[]) => void;
  disabled?: boolean;
  onSelectedRow?: (rows: Row<TData>[]) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterKey,
  onDelete,
  disabled,
  onSelectedRow,
}: DataTableProps<TData, TValue>) {
  const [ConfirmationDailog, confirm] = useConfirm(
    "本当に実行しますか?",
    "これは複数削除です",
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: (newRowSelection) => {
      setRowSelection(newRowSelection);
    },
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  React.useEffect(() => {
    rowSelection && onSelectedRow?.(table.getFilteredSelectedRowModel().rows);
  }, [onSelectedRow, table.getFilteredSelectedRowModel, rowSelection]);

  return (
    <div>
      <ConfirmationDailog />
      <div className="flex items-center py-4">
        {filterKey && (
          <Input
            placeholder={`検索 ${filterKey}...`}
            value={
              (table.getColumn(filterKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(filterKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
        {table.getFilteredSelectedRowModel().rows.length > 0 && onDelete && (
          <Button
            disabled={disabled}
            size="sm"
            variant="outline"
            className="ml-auto text-xs font-normal"
            onClick={async () => {
              const ok = await confirm();

              if (ok) {
                onDelete(table.getFilteredSelectedRowModel().rows);
                table.resetRowSelection();
              }
            }}
            type="button"
          >
            <Trash className="mr-2 size-4" />
            削除 ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        )}
      </div>
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
                            header.getContext(),
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
                  data-state={row.getIsSelected() && "選択中"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  ありません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} 個選択
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          type="button"
        >
          前へ
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          type="button"
        >
          次へ
        </Button>
      </div>
    </div>
  );
}
