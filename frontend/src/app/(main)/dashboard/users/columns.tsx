"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type User = {
  id: number;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export const createColumns = (handleStatusChange: (id: number, status: "approved" | "rejected") => void): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Имя
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "status",
    header: "Статус",
    cell: ({ row }) => {
      const status = row.getValue("status");
      const color =
        status === "approved"
          ? "text-emerald-600 bg-emerald-50 border border-emerald-200"
          : status === "pending"
            ? "text-yellow-600 bg-yellow-50 border border-yellow-200"
            : "text-red-600 bg-red-50 border border-red-200";

      return (
        <span className={`rounded-md px-2 py-1 text-xs font-medium capitalize ${color}`}>{status as string}</span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Дата регистрации
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div className="text-muted-foreground">{date.toLocaleDateString("ru-RU")}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground flex size-8">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
              Копировать email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {user.status === "pending" && (
              <DropdownMenuItem className="text-emerald-600" onClick={() => handleStatusChange(user.id, "approved")}>
                Одобрить
              </DropdownMenuItem>
            )}
            {user.status === "approved" && (
              <DropdownMenuItem className="text-red-600" onClick={() => handleStatusChange(user.id, "rejected")}>
                Отклонить
              </DropdownMenuItem>
            )}
            {user.status === "rejected" && (
              <DropdownMenuItem className="text-emerald-600" onClick={() => handleStatusChange(user.id, "approved")}>
                Одобрить
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
