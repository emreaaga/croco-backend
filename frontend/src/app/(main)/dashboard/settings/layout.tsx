"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, Settings, Sun, Bell, Monitor } from "lucide-react";

const sidebarNavItems = [
  { title: "Профиль", href: "/dashboard/settings/profile", icon: User },
  { title: "Аккаунт", href: "/dashboard/settings/account", icon: Settings },
  { title: "Внешний вид", href: "/dashboard/settings/appearance", icon: Sun },
  { title: "Уведомления", href: "/dashboard/settings/notifications", icon: Bell },
  { title: "Отображение", href: "/dashboard/settings/display", icon: Monitor },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-2 p-2 pb-8 md:p-3">
      <div className="space-y-0.5">
        <h2 className="text-lg font-semibold tracking-tight md:text-xl">Настройки</h2>
        <p className="text-muted-foreground text-xs md:text-sm">
          Управляйте настройками аккаунта и параметрами уведомлений.
        </p>
      </div>

      <Separator className="my-3" />

      <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-6">
        <div className="w-full overflow-x-auto md:w-1/5 md:overflow-visible">
          <nav className="flex gap-1 overflow-x-auto pb-2 md:flex-col md:gap-1 md:pb-0">
            {sidebarNavItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Button
                  key={item.title}
                  asChild
                  variant="ghost"
                  className={cn(
                    "flex-shrink-0 justify-start px-2 py-1 text-xs whitespace-nowrap md:w-full md:text-sm",
                    active && "bg-muted hover:bg-muted"
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>

        <div className="w-full flex-1 md:max-w-3xl">
          <Card className="rounded-lg p-3 shadow-sm md:p-4 space-y-3">{children}</Card>
        </div>
      </div>
    </div>
  );
}
