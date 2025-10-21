"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, flexRender, SortingState } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { createColumns, User } from "./columns";

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

        if (res.data.success) setUsers(res.data.data);
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

  const table = useReactTable({
    data: users,
    columns: createColumns(handleStatusChange),
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
                <TableCell colSpan={5} className="text-muted-foreground h-24 text-center">
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
