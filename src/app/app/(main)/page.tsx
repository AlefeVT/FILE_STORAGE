"use client";
import { useSession } from "next-auth/react";
import { LuLoader2 } from "react-icons/lu";
import { useEffect, useState } from "react";
import { File } from "@/types/file-doc";
import getFiles from "./actions";
import { FileCard } from "./_components/file-card/file-card";
import { UploadedButton } from "./_components/uploaded_button/uploaded_button";
import Image from "next/image";

export default function Page() {
  const { data: session, status } = useSession();
  const userId: string | undefined = session?.user?.id;

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFiles() {
      if (userId) {
        try {
          const data = await getFiles(userId);
          setFiles(data);
        } catch (error) {
          console.error('Error fetching files:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchFiles();
  }, [userId]);

  const handleNewFile = (newFile: File) => {
    setFiles((prevFiles) => [...prevFiles, newFile]);
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
  };

  const isLoading = loading || status === "loading";

  return (
    <main className="container mx-auto pt-12">
      {isLoading && (
        <div className="flex flex-col gap-8 w-full items-center mt-32">
          <LuLoader2 className="h-20 w-20 animate-spin text-gray-500" />
          <div className="text-2xl">
            Carregando seus arquivos...
          </div>
        </div>
      )}

      {!isLoading && files && files.length === 0 && (
        <div className="flex flex-col gap-8 w-full items-center mt-32">
          <Image
            alt="imagem e ícone de diretório"
            width={300}
            height={300}
            src={"/empty.svg"}
          />
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl">Você não tem arquivos, carregue um agora.</h2>
            <UploadedButton onNewFile={handleNewFile} />
          </div>
        </div>
      )}

      {!isLoading && files && files.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl text-gray-600">Seus arquivos</h2>
            <UploadedButton onNewFile={handleNewFile} />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file: File) => (
              <FileCard key={file.id} file={file} onDeleteFile={handleDeleteFile} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
