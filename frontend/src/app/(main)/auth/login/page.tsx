import Image from "next/image";
import Link from "next/link";

import { LoginForm } from "../_components/login-form";
import { GoogleButton } from "../_components/social-auth/google-button";

export default function LoginV1() {
  return (
    <div className="flex h-dvh">
      {/* Левая часть */}
      <div className="bg-primary hidden lg:block lg:w-1/3">
        <div className="flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="space-y-6">
            <Image
              src="/logo.svg"
              alt="CrocodilePay Logo"
              width={200}
              height={200}
              className="mx-auto rounded-full bg-white p-4 shadow-lg"
            />
            <div className="space-y-2">
              <h1 className="text-primary-foreground text-4xl font-light">С возвращением</h1>
              <p className="text-primary-foreground/80 text-xl">Войдите, чтобы продолжить</p>
            </div>
          </div>
        </div>
      </div>

      {/* Правая часть */}
      <div className="bg-background flex w-full items-center justify-center p-8 lg:w-2/3">
        <div className="w-full max-w-md space-y-10 py-24 lg:py-32">
          <div className="space-y-4 text-center">
            <div className="text-2xl font-medium tracking-tight">Вход</div>
            <div className="text-muted-foreground mx-auto max-w-xl">Добро пожаловать! Введите ваш email и пароль.</div>
          </div>

          <div className="space-y-4">
            <LoginForm />
            <GoogleButton className="w-full" variant="outline" />
            <p className="text-muted-foreground text-center text-xs">
              Нет аккаунта?{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
