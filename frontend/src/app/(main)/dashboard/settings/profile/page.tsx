"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/context/user-context";
import { Pencil, Save, X, MailCheck, MailWarning } from "lucide-react";

export default function ProfilePage() {
  const user = useUser();
  const [editMode, setEditMode] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(user?.is_email_verifed ?? false);

  const toggleEdit = () => setEditMode((prev) => !prev);

  const handleVerify = async () => {
    setVerifying(true);
    // имитация API-запроса
    await new Promise((r) => setTimeout(r, 2000));
    setVerifying(false);
    // показываем, будто письмо отправлено
    alert("Письмо для подтверждения отправлено!");
  };

  return (
    <div className="w-full space-y-6">
      <div className="border-border/40 bg-card/50 w-full space-y-6 rounded-lg border p-6 shadow-sm transition-all">
        {/* Верх: аватар + кнопки */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <Avatar className="ring-border h-20 w-20 ring-2">
              <AvatarImage src="/avatars/arhamkhnz.png" alt={user?.name ?? "avatar"} />
              <AvatarFallback>{user?.name?.[0] ?? "?"}</AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <Button size="sm" variant="outline" disabled>
                Изменить аватар
              </Button>
              <p className="text-muted-foreground text-xs">Поддерживаются JPG, PNG (до 5MB)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {editMode ? (
              <>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => {
                    // TODO: handle save logic
                    setEditMode(false);
                  }}
                >
                  <Save className="mr-1 h-4 w-4" /> Сохранить
                </Button>
                <Button size="sm" variant="ghost" onClick={toggleEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button size="sm" variant="outline" onClick={toggleEdit}>
                <Pencil className="mr-1 h-4 w-4" /> Редактировать
              </Button>
            )}
          </div>
        </div>

        <Separator />

        {/* Поля */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Имя */}
          <div className="space-y-2">
            <Label htmlFor="name">Имя</Label>
            <Input
              id="name"
              type="text"
              defaultValue={user?.name}
              placeholder="Введите имя"
              readOnly={!editMode}
              className={!editMode ? "cursor-not-allowed opacity-70" : ""}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="email">Email</Label>
              {verified ? (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 border-green-500 bg-green-50 text-green-600"
                >
                  <MailCheck className="h-3.5 w-3.5" /> Подтверждена
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 border-amber-500 bg-amber-50 text-amber-600"
                >
                  <MailWarning className="h-3.5 w-3.5" /> Не подтверждена
                </Badge>
              )}
            </div>

            <Input
              id="email"
              type="email"
              defaultValue={user?.email}
              placeholder="user@example.com"
              readOnly={!editMode}
              className={!editMode ? "cursor-not-allowed opacity-70" : ""}
            />

            {!verified && (
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs">Подтвердите почту.</p>
                <Button size="sm" variant="secondary" onClick={handleVerify} disabled={verifying} className="text-xs">
                  {verifying ? "Отправка..." : "Отправить письмо"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
