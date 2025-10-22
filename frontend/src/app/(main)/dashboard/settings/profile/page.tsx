"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div>
        <h3 className="text-lg font-medium">Профиль</h3>
        <p className="text-sm text-muted-foreground">
          Управляйте тем, как вас видят другие пользователи на сайте.
        </p>
      </div>

      <Separator />

      <section className="space-y-4">
        <div className="space-y-2 max-w-md">
          <Label htmlFor="name">Ваше имя</Label>
          <Input id="name" type="text" placeholder="Введите имя" />
        </div>

        <div>
          <Button size="sm">Сохранить</Button>
        </div>
      </section>

      <Separator />

      {/* Аватар */}
      <section className="space-y-4">
        <div>
          <h4 className="text-base font-semibold">Аватар</h4>
          <p className="text-sm text-muted-foreground">
            Загрузите фото профиля.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="/avatars/arhamkhnz.png" alt="@you" />
            <AvatarFallback>Вы</AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <Button size="sm" disabled>
              Изменить аватар
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
