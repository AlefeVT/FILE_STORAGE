"use client";

import { ReactNode, useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SlOptionsVertical } from "react-icons/sl";
import { BsTrash } from "react-icons/bs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { File } from "@/types/file-doc";
import { deleteFile, favoriteFile, fetchFileData } from "./actions";
import { IoImagesOutline } from "react-icons/io5";
import { GrDocumentTxt, GrDocumentPdf } from "react-icons/gr";
import { toast } from "@/components/ui/use-toast";
import { BsFiletypeDocx, BsFiletypeDoc, BsFiletypeSvg, BsFiletypeXlsx } from "react-icons/bs";
import Image from "next/image";
import { GrDocumentText } from "react-icons/gr";
import { IoMdStarOutline } from "react-icons/io";
import { useSession } from "next-auth/react";

interface FileCardProps {
    file: File;
    onDeleteFile: (fileId: string) => void;
}

export function FileCard({ file, onDeleteFile }: FileCardProps) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const session = useSession();

    useEffect(() => {
        prepareFileForDisplayAndDownload(file);
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
            if (downloadUrl) {
                URL.revokeObjectURL(downloadUrl);
            }
        };
    }, [file]);

    const deleteFileFromDb = async (fileId: string) => {
        try {
            await deleteFile(fileId);
            onDeleteFile(fileId);
            setIsConfirmOpen(false);
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    const favoriteFileInDb = async (fileId: string) => {
        try {
            const userId = session.data?.user.id;
            await favoriteFile(userId, fileId);
            toast({
                variant: "default",
                title: "Arquivo Favoritado",
                description: "O arquivo foi adicionado aos favoritos com sucesso!",
            });
        } catch (error) {
            console.error("Error favoriting file:", error);
        }
    };

    const prepareFileForDisplayAndDownload = async (file: File) => {
        try {
            const fileData = await fetchFileData(file.id);

            const isBase64 = (str: string) => {
                try {
                    return btoa(atob(str)) === str;
                } catch (err) {
                    return false;
                }
            };

            if (!isBase64(fileData.data)) {
                throw new Error("Invalid base64 string");
            }

            const binaryString = atob(fileData.data);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            const blob = new Blob([bytes], { type: file.type });
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);

            if (file.type.startsWith("image/")) {
                setImageUrl(url);
            }
        } catch (error) {
            console.error("Error preparing file:", error);
            toast({
                variant: "destructive",
                title: "Erro ao preparar arquivo",
                description: "Não foi possível preparar o arquivo, tente novamente mais tarde.",
            });
        }
    };

    const handleDownload = () => {
        if (downloadUrl) {
            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = file.name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleView = () => {
        if (downloadUrl && file.type === "application/pdf") {
            window.open(downloadUrl, "_blank");
        }
    };

    const typeIcons = {
        'application/pdf': <GrDocumentPdf className="w-5 h-5" />,
        'application/msword': <BsFiletypeDoc className="w-5 h-5" />,
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': <BsFiletypeDocx className="w-5 h-5" />,
        'text/plain': <GrDocumentTxt className="w-5 h-5" />,
        'image/svg+xml': <BsFiletypeSvg className="w-5 h-5" />,
        'image/png': <IoImagesOutline className="w-5 h-5" />,
        'image/jpeg': <IoImagesOutline className="w-5 h-5" />,
        'application/vnd.ms-excel': <BsFiletypeXlsx className="w-5 h-5" />,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': <BsFiletypeXlsx className="w-5 h-5" />,
    } as Record<string, ReactNode>;

    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2">
                    <div className="flex justify-center">{typeIcons[file.type]}</div>
                    {file.name}
                </CardTitle>
                <div className="absolute top-2 right-2">
                    <FileCardActions
                        file={file}
                        onDeleteFile={onDeleteFile}
                        onFavoriteFile={favoriteFileInDb} // Passe a função de favoritar
                        isConfirmOpen={isConfirmOpen}
                        setIsConfirmOpen={setIsConfirmOpen}
                    />
                </div>
            </CardHeader>
            <CardContent className="h-[200px] flex justify-center items-center">
                {imageUrl ? (
                    <Image
                        className="rounded-lg w-44 h-36 object-cover"
                        src={imageUrl}
                        alt={file.name}
                        layout="fixed"
                        width={100}
                        height={100}
                        onError={(e) => console.error("Image load error:", e)}
                    />
                ) : (
                    <GrDocumentText className="h-28 w-28"/>
                )}
            </CardContent>

            <CardFooter className="flex justify-center gap-2">
                <Button onClick={handleDownload}>Baixar</Button>
                {file.type === "application/pdf" && <Button onClick={handleView}>Visualizar</Button>}
            </CardFooter>
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
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

interface FileCardActionsProps extends FileCardProps {
    onFavoriteFile: (fileId: string) => void;
    isConfirmOpen: boolean;
    setIsConfirmOpen: (isOpen: boolean) => void;
}

function FileCardActions({ file, onDeleteFile, onFavoriteFile, setIsConfirmOpen }: FileCardActionsProps) {
    return (
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
                    Deletar
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={() => onFavoriteFile(file.id)} // Chama a função de favoritar diretamente
                    className="flex items-center gap-1 cursor-pointer"
                >
                    <IoMdStarOutline className="w-4 h-4" />
                    Favoritar
                </DropdownMenuItem>
                
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
