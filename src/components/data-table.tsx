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
import { IconArrowsUpDown, IconArrowUp, IconArrowDown } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    align?: "left" | "center" | "right" | "justify";
    headerAlign?: "left" | "center" | "right" | "justify";
    /** If true, the column header renders a clickable sort icon */
    sortable?: boolean;
    /**
     * The URL query key used for sortBy. Defaults to the column's accessorKey
     * when not provided.
     */
    sortKey?: string;
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

  const updateSearchParams = (updates: Record<string, string>, deletions?: string[]) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, value);
    });

    deletions?.forEach((key) => params.delete(key));

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  const currentSortBy = searchParams.get("sortBy") ?? "";
  const currentSortOrder = searchParams.get("sortOrder") ?? "";

  /** Cycle: none → asc → desc → none. Always resets page to 1. */
  const handleSort = (sortKey: string) => {
    if (currentSortBy !== sortKey) {
      // Different column — start with asc
      updateSearchParams({ sortBy: sortKey, sortOrder: "asc", page: "1" });
    } else if (currentSortOrder === "asc") {
      updateSearchParams({ sortBy: sortKey, sortOrder: "desc", page: "1" });
    } else {
      // Was desc — clear sort, reset page
      updateSearchParams({ page: "1" }, ["sortBy", "sortOrder"]);
    }
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
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta;
                  const isSortable = meta?.sortable === true;
                  const sortKey =
                    meta?.sortKey ??
                    (typeof (header.column.columnDef as { accessorKey?: string }).accessorKey === "string"
                      ? (header.column.columnDef as { accessorKey?: string }).accessorKey!
                      : undefined);
                  const isActiveSort = isSortable && !!sortKey && currentSortBy === sortKey;

                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.getSize(),
                        minWidth: header.getSize(),
                        textAlign: meta?.headerAlign || "left",
                      }}
                      className="last:text-right!"
                    >
                      {header.isPlaceholder ? null : (
                        <span
                          className={cn(
                            "inline-flex items-center gap-1",
                            isSortable && "cursor-pointer select-none group",
                          )}
                          onClick={() => isSortable && sortKey && handleSort(sortKey)}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {isSortable && (
                            <span
                              className={cn(
                                "transition-colors",
                                isActiveSort ? "text-foreground" : "text-muted-foreground/40 group-hover:text-muted-foreground",
                              )}
                            >
                              {isActiveSort && currentSortOrder === "asc" ? (
                                <IconArrowUp size={14} />
                              ) : isActiveSort && currentSortOrder === "desc" ? (
                                <IconArrowDown size={14} />
                              ) : (
                                <IconArrowsUpDown size={14} />
                              )}
                            </span>
                          )}
                        </span>
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
