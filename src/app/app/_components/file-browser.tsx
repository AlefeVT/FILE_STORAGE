"use client";

import { useSession } from "next-auth/react";
import { LuLoader2 } from "react-icons/lu";
import { useEffect, useState } from "react";
import { File } from "@/types/file-doc";
import { FileCard } from "./file-card/file-card";
import { UploadedButton } from "./uploaded_button/uploaded_button";
import Image from "next/image";
import { SearchBar } from "./search-bar.tsx/search-bar";
import { getDeletedFiles, getFavoriteFiles, getFiles } from "./actions";
import { DataTable } from "./file-table/file-table";
import { columns } from "./file-table/columns";

interface FileBrowserProps {
  title: string;
  favorites?: boolean;
  deleted?: boolean;
}

export default function FileBrowser({ title, favorites, deleted }: FileBrowserProps) {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchFiles() {
      if (userId) {
        try {
          let data;
          if (deleted) {
            data = await getDeletedFiles(userId);
          } else if (favorites) {
            data = await getFavoriteFiles(userId);
          } else {
            data = await getFiles(userId);
          }
          const convertedData = data.map((file: any) => ({
            ...file,
            data: file.data.toString('utf-8'),
          }));
          setFiles(convertedData);
        } catch (error) {
          console.error('Error fetching files:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchFiles();
  }, [userId, favorites, deleted]);

  const handleNewFile = (newFile: File) => {
    setFiles((prevFiles) => [...prevFiles, newFile]);
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
  };

  const handleFavoriteToggle = (fileId: string) => {
    setFiles((prevFiles) => {
      if (favorites) {
        return prevFiles.filter((file) => file.id !== fileId);
      } else {
        return prevFiles.map((file) =>
          file.id === fileId ? { ...file, favorite: false } : file
        );
      }
    });
  };

  const handleRestoreFile = (fileId: string) => {
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
          <div>
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
                <h2 className="text-2xl text-center">
                  {deleted ? "Você não tem arquivo na lixeira." : (favorites ? "Você não tem arquivos favoritados no momento." : "Você não tem arquivos, carregue um agora.")}
                </h2>
              </div>

              {!favorites && !deleted && (
                <div className="flex justify-center">
                  <UploadedButton onNewFile={handleNewFile} />
                </div>
              )}
            </div>
          </div>
        </>
      )}

{
  !isLoading && files && files.length > 0 && (
    <>
      <Placeholder />
      <DataTable
        columns={columns}
        data={filteredFiles}
        onDeleteFile={handleDeleteFile}
        onFavoriteToggle={handleFavoriteToggle}
        onRestoreFile={handleRestoreFile}
      />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-20 mt-10">
            {filteredFiles.map((file: File) => (
              <FileCard
                key={file.id}
                file={file}
                onDeleteFile={handleDeleteFile}
                onFavoriteToggle={handleFavoriteToggle}
                onRestoreFile={handleRestoreFile}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
