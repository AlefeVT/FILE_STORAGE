"use client"

import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function Page() {
  const createFile = useMutation(api.files.createFile);
  const files = useQuery(api.files.getFiles)

  const handleCreateFile = () => {
    createFile({
      name: "teste2",
    });
  };

  return (
    <div className="flex flex-col">
      <div>
        FILE STORAGE
      </div>

      <div className="w-3/4">
        <Button onClick={handleCreateFile}>Click</Button>
      </div>

      <div>
        {files?.map(file => {
          return <div key={file._id}>
            {file.name}
          </div>
        })}
      </div>


    </div>
  );
}
