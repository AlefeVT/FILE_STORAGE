"use client";
import { useSession } from "next-auth/react";
import { LuLoader2 } from "react-icons/lu";
import { useEffect, useState } from "react";
import { File } from "@/types/file-doc";
import { FileCard } from "./file-card/file-card";
import { UploadedButton } from "./uploaded_button/uploaded_button";
import Image from "next/image";
import { SearchBar } from "./search-bar.tsx/search-bar";
import getFiles from "../actions";
import { getFavoriteFiles } from "./file-card/actions";

interface FileBrowserProps {
  title: string;
  favorites: boolean;
}

export default function FileBrowser({ title, favorites }: FileBrowserProps) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchFiles() {
      if (userId) {
        try {
          const data = favorites ? await getFavoriteFiles(userId) : await getFiles(userId);
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

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(query.toLowerCase())
  );

  function Placeholder() {
    return (
      <>
        <div className="items-center flex flex-col sm:flex-col lg:flex-row sm:space-y-10 lg:space-y-0 justify-between mb-8 space-y-4  ">
          <h2 className="text-lg text-center sm:text-xl text-gray-600">{title}</h2>
          <SearchBar onSearch={setQuery} />

          <div className="">
            <UploadedButton onNewFile={handleNewFile} />
          </div>
        </div>
      </>
    );

  }

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
        <>
          <Placeholder />
          <div className="flex flex-col gap-8 w-full items-center mt-32">
            <Image
              alt="imagem e ícone de diretório"
              width={300}
              height={300}
              src={"/empty.svg"}
            />
            <div className="flex flex-col gap-4">
              <div>
              <h2 className="text-2xl text-center">Você não tem arquivos, carregue um agora.</h2>
              </div>

              <div className="flex justify-center">
                <UploadedButton onNewFile={handleNewFile} />
              </div>
            </div>
          </div>
        </>
      )}

      {!isLoading && files && files.length > 0 && (
        <>
          <Placeholder />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file: File) => (
              <FileCard key={file.id} file={file} onDeleteFile={handleDeleteFile} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
