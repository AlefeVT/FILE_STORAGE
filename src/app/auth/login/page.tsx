"use client"

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

export default function Page() {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
      });

      if (!res) {
        return null;
      }

      if (res.ok) {
        router.push('/app');

      } else {
        toast({
          title: 'Erro ao autenticar',
          description: 'Ocorreu um erro durante a autenticação.',
        });
      }
    } catch (err) {

    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="h-screen">
      <div className="m-4 mb-20">
        <Link href={'/'} className="bg-primary text-white px-6 py-2 rounded-md">Voltar</Link>
      </div>

      <div className="flex justify-center items-center ">

        <div className="mx-auto space-y-6 w-1/2 lg:w-1/3 md:w-1/2 sm:w-1/2">
          <form onSubmit={handleSubmit}>
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Faça login na sua conta</h1>
              <p className="text-gray-500 dark:text-gray-400">Digite suas credenciais abaixo.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="exemplo@email.com" required onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <Link href="#" className="ml-auto inline-block text-sm underline" prefetch={false}>
                    Esqueceu a senha?
                  </Link>
                </div>
                <Input id="password" name="password" type="password" required onChange={handleChange} />
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
              <Button variant="outline" className="w-full">
                Entrar com Google
              </Button>
              <div className="mt-4 text-center text-sm">
                Não tem uma conta?{" "}
                <Link href="/auth/register" className="underline" prefetch={false}>
                  Criar conta
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
