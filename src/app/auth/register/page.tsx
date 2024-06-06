"use client"

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Page() {

  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        toast({
          title: 'Registro realizado com sucesso!',
          description: 'Faça o Login para acessar nossa plataforma!',
        });

        router.push('/auth/login');
      } else {
        const data = await res.json();
        toast({
          title: 'Erro de registro',
          description: data.message || 'Ocorreu um erro durante o registro.',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro de registro',
        description: 'Ocorreu um erro durante o registro.',
      });
    }
  };

  return (
    <div className="h-screen">
      <div className="m-4 mb-20">
        <Link href={'/'} className="bg-primary text-white px-6 py-2 rounded-md">Voltar</Link>
      </div>

      <div className="flex justify-center items-center ">

        <div className="mx-auto space-y-6 w-full lg:w-1/2 md:w-1/2 sm:w-full">

          <form onSubmit={handleSubmit}>
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Registrar</h1>
              <p className="text-gray-500 dark:text-gray-400">Crie sua conta para começar.</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
              </div>
              <Button type="submit" className="w-full">Registrar</Button>
              <div className="mt-4 text-center text-sm">
                Já possui uma conta? Faça{" "}
                <Link href="/auth/login" className="underline" prefetch={false}>
                  Login
                </Link>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>

  );
}
