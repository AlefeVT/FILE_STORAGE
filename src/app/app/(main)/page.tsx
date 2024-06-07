"use client";

import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { LuLoader2 } from "react-icons/lu";

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z.instanceof(File).nullable().refine((file) => file !== null, "Required"),
});

export default function Page() {
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const createFile = useMutation(api.files.createFile);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const files = useQuery(
    api.files.getFiles,
    status === "authenticated" ? { userId } : "skip"
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.file) return;

    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: {
        "Content-Type": values.file.type,
      },
      body: values.file,
    });

    const { storageId } = await result.json();

    try {
      await createFile({
        name: values.title,
        fileId: storageId,
        userId: userId,
      });

      form.reset();
      setIsFileDialogOpen(false);

      toast({
        variant: "success",
        title: "Arquivo enviado",
        description: "Seu arquivo foi enviado com sucesso!",
      })

    } catch (err) {
      toast({
        variant: "destructive",
        title: "Algo deu errado",
        description: "Seu arquivo não foi enviado, tente novamente mais tarde",
      })
    }

  }

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <main className="container mx-auto pt-24">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">FILE STORAGE</h1>

        <Dialog open={isFileDialogOpen} onOpenChange={(isOpen) => {
          setIsFileDialogOpen(isOpen);
          form.reset();
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsFileDialogOpen(true)}>Carregar arquivo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-8">Carregue seu arquivo aqui</DialogTitle>
              <DialogDescription>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Titulo</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="file"
                      render={({ field: { onChange }, ...field }) => (
                        <FormItem>
                          <FormLabel>Arquivo</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              {...field}
                              onChange={(event) => {
                                if (!event.target.files) return;
                                onChange(event.target.files[0]);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit"
                      disabled={form.formState.isSubmitting}
                      className="flex gap-1"
                    >
                      {form.formState.isSubmitting && <LuLoader2 className="h-4 animate-spin" />}
                      Enviar</Button>
                  </form>
                </Form>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div>
        {files?.map((file) => (
          <div key={file._id}>
            {file.name}
          </div>
        ))}
      </div>
    </main>
  );
}
