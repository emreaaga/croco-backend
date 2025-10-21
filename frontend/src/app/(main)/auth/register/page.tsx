import Image from "next/image";
import Link from "next/link";

import { RegisterForm } from "../_components/register-form";
import { GoogleButton } from "../_components/social-auth/google-button";

export default function RegisterV1() {
  return (
    <div className="flex h-dvh">
      <div className="bg-background flex w-full items-center justify-center p-8 lg:w-2/3">
        <div className="w-full max-w-md space-y-10 py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <div className="text-2xl font-medium tracking-tight">Регистрация</div>
            <div className="text-muted-foreground mx-auto max-w-xl">
              Заполните данные ниже, чтобы создать аккаунт. Это займёт всего пару минут.
            </div>
          </div>

          <div className="space-y-4">
            <RegisterForm />
            <GoogleButton className="w-full" variant="outline" />
            <p className="text-muted-foreground text-center text-xs">
              Уже есть аккаунт?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-primary hidden lg:block lg:w-1/3">
        <div className="flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="space-y-6">
            <Image
              src="/logo.svg"
              alt="CrocodilePay Logo"
              width={180}
              height={180}
              className="mx-auto rounded-full bg-white p-4 shadow-lg"
            />
            <div className="space-y-2">
              <h1 className="text-primary-foreground text-4xl font-light">Добро пожаловать!</h1>
              <p className="text-primary-foreground/80 text-lg">Регистрируйтесь и начните пользоваться платформой.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
