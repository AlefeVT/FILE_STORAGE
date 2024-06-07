"use client"

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SlOptionsVertical } from "react-icons/sl";
import { BsTrash } from "react-icons/bs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { File } from "@/types/file-doc";
import { deleteFile } from "./actions";
import { toast } from "@/components/ui/use-toast";

interface FileCardProps {
    file: File;
    onDeleteFile: (fileId: string) => void;
}

export function FileCard({ file, onDeleteFile }: FileCardProps) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const deleteFileFromDb = async (fileId: string) => {
        try {
            await deleteFile(fileId);
            onDeleteFile(fileId);
            setIsConfirmOpen(false); 
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle>{file.name}</CardTitle>
                <div className="absolute top-2 right-2">
                    <FileCardActions
                        file={file}
                        onDeleteFile={onDeleteFile}
                        isConfirmOpen={isConfirmOpen}
                        setIsConfirmOpen={setIsConfirmOpen}
                    />
                </div>
            </CardHeader>
            <CardContent>
                <p>Card Content</p>
            </CardContent>
            <CardFooter>
                <Button>Baixar</Button>
            </CardFooter>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={async () => {
                                await deleteFileFromDb(file.id);
                                toast({
                                    variant: "default",
                                    title: "Arquivo Deletado",
                                    description: "O arquivo foi deletado com sucesso!",
                                });
                            }}
                        >
                            Continue
                        </AlertDialogAction>

                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}

function FileCardActions({ setIsConfirmOpen }: FileCardProps & { isConfirmOpen: boolean; setIsConfirmOpen: (isOpen: boolean) => void }) {
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <SlOptionsVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        onClick={() => setIsConfirmOpen(true)}
                        className="flex items-center gap-1 text-red-600 cursor-pointer"
                    >
                        <BsTrash className="w-4 h-4" />
                        Delete
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}
