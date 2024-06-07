"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuLoader2 } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { File as AppFile } from "@/types/file-doc";
import { createFile } from "./actions";

const formSchema = z.object({
  title: z.string().min(1).max(200),
  file: z.instanceof(File).nullable().refine((file) => file !== null, "Required"),
});

interface UploadedButtonProps {
  onNewFile: (file: AppFile) => void;
}

export function UploadedButton({ onNewFile }: UploadedButtonProps) {
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.file) return;

    try {
      const newFile = await createFile({
        name: values.title,
        userId: userId!,
      });

      form.reset();
      setIsFileDialogOpen(false);

      toast({
        variant: "success",
        title: "Arquivo enviado",
        description: "Seu arquivo foi enviado com sucesso!",
      });

      onNewFile(newFile);
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Algo deu errado",
        description: "Seu arquivo não foi enviado, tente novamente mais tarde",
      });
    }
  }

  return (
    <Dialog
      open={isFileDialogOpen}
      onOpenChange={(isOpen) => {
        setIsFileDialogOpen(isOpen);
        form.reset();
      }}
    >
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
                      <FormLabel>Título</FormLabel>
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
                <Button type="submit" disabled={form.formState.isSubmitting} className="flex gap-1">
                  {form.formState.isSubmitting && <LuLoader2 className="h-4 animate-spin" />}
                  Enviar
                </Button>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
