"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/context/user-context";
import { ShieldCheck, ShieldOff } from "lucide-react";

export default function AccountPage() {
  const user = useUser();

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
              <Input id="current-password" type="password" placeholder="••••••••" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="new-password">Новый пароль</Label>
              <Input id="new-password" type="password" placeholder="Введите новый пароль" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm-password">Подтвердите пароль</Label>
              <Input id="confirm-password" type="password" placeholder="Повторите новый пароль" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button size="sm" className="w-fit">
              Обновить пароль
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
