// FileCard.tsx
"use client";

import { ReactNode, useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { IoImagesOutline } from "react-icons/io5";
import { GrDocumentTxt, GrDocumentPdf } from "react-icons/gr";
import { BsFiletypeDocx, BsFiletypeDoc, BsFiletypeSvg, BsFiletypeXlsx } from "react-icons/bs";
import Image from "next/image";
import { GrDocumentText } from "react-icons/gr";
import { IoMdStar } from "react-icons/io";
import { File } from "@/types/file-doc";
import { ThreePoints } from "../three-points/three-points";
import { toast } from "@/components/ui/use-toast";
import { useFileActions } from "./actions";

export interface FileCardProps {
    file: File;
    onDeleteFile: (fileId: string) => void;
    onFavoriteToggle: (fileId: string) => void;
    onRestoreFile: (fileId: string) => void;
}

export function FileCard({ file, onDeleteFile, onFavoriteToggle, onRestoreFile }: FileCardProps) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [isFavorited, setIsFavorited] = useState(false);

    const {
        checkIfFavorited,
        deleteFileFromDb,
        favoriteFileInDb,
        unfavoriteFileInDb,
        restoreFileInDb,
        prepareFileForDisplayAndDownload,
    } = useFileActions(file, setIsFavorited, onDeleteFile, onFavoriteToggle, onRestoreFile);

    useEffect(() => {
        prepareFileForDisplayAndDownload(file, setImageUrl, setDownloadUrl);
        checkIfFavorited();
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
            if (downloadUrl) {
                URL.revokeObjectURL(downloadUrl);
            }
        };
    }, [file]);

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
                <CardTitle className="flex gap-2 items-center">
                    {isFavorited && <IoMdStar className="text-yellow-500 w-5 h-5" />}
                    <div className="flex justify-center">{typeIcons[file.type]}</div>
                    {file.name}
                </CardTitle>
                <div className="absolute top-2 right-2">
                    <ThreePoints
                        file={file}
                        onDeleteFile={onDeleteFile}
                        onFavoriteFile={favoriteFileInDb}
                        onUnfavoriteFile={unfavoriteFileInDb}
                        onRestoreFile={restoreFileInDb}
                        onFavoriteToggle={onFavoriteToggle}
                        isFavorited={isFavorited}
                        isConfirmOpen={isConfirmOpen}
                        setIsConfirmOpen={setIsConfirmOpen}
                        onDownload={handleDownload}
                        onView={handleView}
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
                    <GrDocumentText className="h-28 w-28" />
                )}
            </CardContent>

            <CardFooter>
                <div className="text-sm text-gray-500">Documento carregado em: {new Date(file.createdAt).toLocaleDateString()}</div>
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
