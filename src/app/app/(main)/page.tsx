"use client";
import { useSession } from "next-auth/react";
import { LuLoader2 } from "react-icons/lu";
import { useEffect, useState } from "react";
import { File } from "@/types/file-doc";
import getFiles from "./actions";
import { FileCard } from "./_components/file-card/file-card";
import { UploadedButton } from "./_components/uploaded_button/uploaded_button";

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

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LuLoader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <main className="container mx-auto pt-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">FILE STORAGE</h1>
        <UploadedButton onNewFile={handleNewFile} />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {files.map((file: File) => (
          <FileCard file={file}  onDeleteFile={handleDeleteFile} />
        ))}
      </div>
    </main>
  );
}
