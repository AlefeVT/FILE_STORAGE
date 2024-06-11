"use client"

import * as z from "zod";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
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
  file: z
    .instanceof(File)
    .nullable()
    .refine((file) => file !== null, { message: "Required" }),
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
      const fileType = values.file.type;
      if (!fileType) throw new Error("Não foi possível determinar o tipo do arquivo");

      const isSafeFileType = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/svg+xml', 'image/png', 'image/jpeg', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(fileType);
      if (!isSafeFileType) {
        throw new Error("Tipo de arquivo não seguro. Por favor, envie um PDF, DOC, DOCX ou TXT.");
      }

      const fileBase64 = await readFileAsBase64(values.file);

      const newFile = await createFile({
        name: values.title,
        type: fileType, 
        userId: userId!,
        data: fileBase64,
        status: "ACTIVE",
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

  function readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
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
                          const uploadedFile = event.target.files[0];
                          console.log("Tipo do arquivo:", uploadedFile.type);
                          onChange(uploadedFile);
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
