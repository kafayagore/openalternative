"use client"

import { formatDate } from "@curiousleaf/utils"
import type { Alternative } from "@openalternative/db"
import type { ColumnDef } from "@tanstack/react-table"
import { AlternativeActions } from "~/app/(dashboard)/alternatives/_components/alternative-actions"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { DataTableLink } from "~/components/data-table/data-table-link"
import { DataTableThumbnail } from "~/components/data-table/data-table-thumbnail"
import { Checkbox } from "~/components/ui/checkbox"

export function getColumns(): ColumnDef<Alternative>[] {
  return [
    {
      accessorKey: "name",
      header: ({ table, column }) => (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            className="block my-auto mx-1.5"
          />

          <DataTableColumnHeader column={column} title="Name" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={value => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="block my-auto mx-1.5"
          />

          <DataTableLink href={`/alternatives/${row.original.id}`}>
            {row.original.faviconUrl && <DataTableThumbnail src={row.original.faviconUrl} />}
            {row.getValue("name")}
          </DataTableLink>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
      cell: ({ row }) => (
        <div className="max-w-96 truncate text-muted-foreground">{row.getValue("description")}</div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{formatDate(row.getValue<Date>("createdAt"))}</span>
      ),
      size: 0,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <AlternativeActions alternative={row.original} row={row} className="float-right -my-0.5" />
      ),
      size: 0,
    },
  ]
}
