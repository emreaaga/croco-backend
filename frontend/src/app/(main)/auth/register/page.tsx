import Link from "next/link";
import { RegisterForm } from "../_components/register-form";
import { GoogleButton } from "../_components/social-auth/google-button";

export default function RegisterV1() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 px-4">
      <div className="w-full max-w-md rounded-xl border bg-white/80 backdrop-blur-md p-6 shadow-lg hover:shadow-xl transition">
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-2xl font-bold text-emerald-800">Регистрация</h1>
          <p className="text-gray-600 text-sm">
            Заполните данные ниже, чтобы создать аккаунт.
          </p>
        </div>

        <div className="space-y-4">
          <RegisterForm />
          <GoogleButton className="w-full" variant="outline" />
          <p className="text-muted-foreground text-center text-xs">
            Уже есть аккаунт?{" "}
            <Link href="/auth/login" className="text-emerald-600 hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
