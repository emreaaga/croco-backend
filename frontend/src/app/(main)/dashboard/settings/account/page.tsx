"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Loader2, ShieldOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { apiServer } from "@/lib/api-server";

export default function AccountPage() {
  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.warning("Заполните все поля");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Пароли не совпадают");
    }

    try {
      setLoading(true);

      const res = await apiServer("/auth/change-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          old_password: oldPassword,
          password: newPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Ошибка при смене пароля");
      }

      toast.success("Пароль успешно изменён!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Не удалось изменить пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="border-border/40 bg-card/50 w-full space-y-6 rounded-lg border p-6 shadow-sm transition-all">
        <div className="space-y-1">
          <h4 className="text-base font-semibold">Изменить пароль</h4>
          <p className="text-muted-foreground text-sm">Для защиты вашего аккаунта регулярно обновляйте пароль.</p>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="max-w-md space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="current-password">Текущий пароль</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="new-password">Новый пароль</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Введите новый пароль"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Подтвердите пароль</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Повторите новый пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button size="sm" onClick={handleChangePassword} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Обновление..." : "Обновить пароль"}
            </Button>
          </div>
        </div>
      </div>

      <div className="border-border/40 bg-card/50 w-full space-y-6 rounded-lg border p-6 shadow-sm transition-all">
        <div className="space-y-1">
          <h4 className="flex items-center gap-2 text-base font-semibold">Двухфакторная аутентификация (2FA)</h4>
          <p className="text-muted-foreground text-sm">Дополнительная защита вашего аккаунта при входе.</p>
        </div>

        <Separator />

        <div className="flex max-w-md flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-muted rounded-md p-2">
              <ShieldOff className="text-muted-foreground h-5 w-5" />
            </div>
            <div>
              <Label className="text-sm font-medium">2FA неактивна</Label>
              <p className="text-muted-foreground text-sm">Скоро будет доступно</p>
            </div>
          </div>

          <Switch disabled />
        </div>
      </div>
    </div>
  );
}
