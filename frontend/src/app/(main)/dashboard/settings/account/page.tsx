"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function AccountPage() {
  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div>
        <h3 className="text-lg font-medium">Аккаунт</h3>
        <p className="text-sm text-muted-foreground">
          Управляйте настройками безопасности и доступа к аккаунту.
        </p>
      </div>

      <Separator />

      {/* Email */}
      <section className="space-y-4">
        <div>
          <h4 className="text-base font-semibold">Электронная почта</h4>
          <p className="text-sm text-muted-foreground">
            Обновите адрес вашей почты, используемый для входа в систему.
          </p>
        </div>

        <div className="space-y-2 max-w-md">
          <Label htmlFor="email">Текущий Email</Label>
          <Input id="email" type="email" placeholder="user@example.com" />
        </div>

        <div>
          <Button size="sm">Сохранить</Button>
        </div>
      </section>

      <Separator />

      {/* Пароль */}
      <section className="space-y-4">
        <div>
          <h4 className="text-base font-semibold">Изменить пароль</h4>
          <p className="text-sm text-muted-foreground">
            Для защиты вашего аккаунта регулярно обновляйте пароль.
          </p>
        </div>

        <div className="space-y-3 max-w-md">
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

        <div>
          <Button size="sm">Обновить пароль</Button>
        </div>
      </section>

      <Separator />

      {/* 2FA */}
      <section className="space-y-4">
        <div>
          <h4 className="text-base font-semibold">Двухфакторная аутентификация (2FA)</h4>
          <p className="text-sm text-muted-foreground">
            Дополнительная защита вашего аккаунта при входе.
          </p>
        </div>

        <div className="flex items-center justify-between max-w-md border border-border rounded-md p-3">
          <div>
            <Label>2FA</Label>
            <p className="text-sm text-muted-foreground">Скоро...</p>
          </div>
          <Switch disabled />
        </div>
      </section>
    </div>
  );
}
