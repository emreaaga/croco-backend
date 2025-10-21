"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, EllipsisVertical } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/axios";

export type User = {
  id: number;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const router = useRouter();

  const handleStatusChange = async (id: number, status: "approved" | "rejected") => {
    try {
      const res = await api.patch(`/users/${id}`, { status });

      if (res.data.success) {
        toast.success(`Статус обновлён: ${status}`);
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
      } else {
        toast.error("Не удалось обновить статус.");
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.info("Сессия истекла. Войдите снова.");
        router.replace("/auth/login");
      } else {
        console.error(err);
        toast.error("Ошибка при изменении статуса");
      }
    }
  };

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get("/users");

        if (res.data.success) {
          setUsers(res.data.data);
        } else {
          console.error("Ошибка при получении данных:", res.data);
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          toast.info("Сессия истекла. Войдите снова.");
          router.replace("/auth/login");
        } else {
          console.error("Ошибка запроса:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  // 🧱 Конфиг таблицы
  const columns: ColumnDef<User>[] = [
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

  const table = useReactTable({
    data: users,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) return <div className="text-muted-foreground p-6 text-center">Загрузка...</div>;

  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-muted-foreground h-24 text-center">
                  Нет данных.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
