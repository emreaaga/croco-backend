"use client";

import { useRouter } from "next/navigation";
import { BadgeCheck, Bell, Settings, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/axios";
import { getInitials } from "@/lib/utils";

export function AccountSwitcher({
  user,
}: {
  readonly user: {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly avatar?: string | null;
    readonly role?: string;
  } | null;
}) {
  const router = useRouter();

  const handleLogOut = async () => {
    try {
      await api.post("/auth/logout");
      router.replace("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) {
    return (
      <Avatar className="size-9 rounded-lg">
        <AvatarFallback className="rounded-lg">?</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-9 rounded-lg cursor-pointer">
          <AvatarImage
            src={user.avatar || "/avatars/arhamkhnz.png"}
            alt={user.name}
          />
          <AvatarFallback className="rounded-lg">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="min-w-56 space-y-1 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <div className="flex w-full items-center gap-2 px-2 py-1.5">
          <Avatar className="size-9 rounded-lg">
            <AvatarImage
              src={user.avatar || "/avatars/arhamkhnz.png"}
              alt={user.name}
            />
            <AvatarFallback className="rounded-lg">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
            <span className="truncate text-xs capitalize text-muted-foreground">
              {user.role || "administrator"}
            </span>
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            Профиль
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            Настройки
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Уведомления
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogOut}>
          <LogOut />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
