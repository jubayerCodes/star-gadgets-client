"use client";

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { Meta } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseSearchQuery } from "@/lib/parseSearchQuery";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    align?: "left" | "center" | "right" | "justify";
    headerAlign?: "left" | "center" | "right" | "justify";
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  meta: Meta;
}

export function DataTable<TData, TValue>({ columns, data, meta }: DataTableProps<TData, TValue>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { page, limit } = parseSearchQuery(searchParams);

  const pageIndex = page - 1;

  const updateSearchParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, value);
    });

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  const totalPages = Math.ceil(meta.total / meta.limit);

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: page,
    paginationItemsToDisplay: 5,
    totalPages,
  });

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.getSize(),
                        minWidth: header.getSize(),
                        textAlign: header.column.columnDef.meta?.headerAlign || "left",
                      }}
                      className="last:text-right!"
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      align={cell.column.columnDef?.meta?.align || "left"}
                      className="last:text-right!"
                    >
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
      <div className="flex items-center justify-between gap-8 w-full">
        {/* Results per page */}
        <div className="flex items-center gap-3">
          <Label htmlFor={"rowsPerPage"}>Rows per page</Label>
          <Select
            value={limit.toString()}
            onValueChange={(value) => {
              updateSearchParams({ limit: value, page: page.toString() });
            }}
          >
            <SelectTrigger className="w-fit whitespace-nowrap" id={"rowsPerPage"}>
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8">
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Page number information */}
        {/* <div className="flex grow justify-end whitespace-nowrap text-muted-foreground text-sm">
          <p aria-live="polite" className="whitespace-nowrap text-muted-foreground text-sm">
            <span className="text-foreground">
              {meta?.from} - {meta?.to}
            </span>{" "}
            of <span className="text-foreground">{meta?.total}</span>
          </p>
        </div> */}

        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            {/* Previous page button */}
            <PaginationItem>
              <PaginationPrevious
                aria-disabled={pageIndex === 0 ? true : undefined}
                className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                onClick={() => {
                  if (pageIndex === 0) return;

                  updateSearchParams({ page: (page - 1).toString() });
                }}
                role={pageIndex === 0 ? "link" : undefined}
              />
            </PaginationItem>

            {/* Left ellipsis (...) */}
            {showLeftEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Page number links */}
            {pages.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  aria-disabled={pageIndex === 0}
                  onClick={() => {
                    updateSearchParams({ page: page.toString() });
                  }}
                  isActive={page === pageIndex + 1}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Right ellipsis (...) */}
            {showRightEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Next page button */}
            <PaginationItem>
              <PaginationNext
                aria-disabled={pageIndex === totalPages - 1 ? true : undefined}
                className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                onClick={() => {
                  if (pageIndex === totalPages - 1) return;
                  updateSearchParams({ page: (page + 1).toString() });
                }}
                role={pageIndex === totalPages - 1 ? "link" : undefined}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
