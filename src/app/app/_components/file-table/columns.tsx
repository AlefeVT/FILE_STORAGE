"use client"

import { useEffect, useState } from "react";
import {
    ColumnDef
} from "@tanstack/react-table";
import { ThreePoints } from "../three-points/three-points";
import { File } from "@/types/file-doc";
import { useFileActions } from "../file-card/actions";

export const columns: ColumnDef<File>[] = [
    {
        header: "Nome",
        cell: ({ row }) => {

            return (
                <div>{(row.original.name)}</div>
            );
        },
    },
    {
        header: "Tipo de Arquivo",
        cell: ({ row }) => {

            return (
                <div>{(row.original.type)}</div>
            );
        },
    },
    {
        header: "Status",
        cell: ({ row }) => {
            const formatStatus = (status: string) => {
                switch (status) {
                    case "FAVORITE":
                        return "favoritado";
                    case "DELETED":
                        return "Na Lixeira";
                    case "ACTIVE":
                        return "ativo";
                    default:
                        return status;
                }
            };

            return (
                <div>{formatStatus(row.original.status)}</div>
            );
        },
    },
    {
        header: "Carregado em",
        cell: ({ row }) => {
            return (
                <div>{new Date(row.original.createdAt).toLocaleDateString()}</div>
            );
        },
    },
    {
        header: "Ações",
        cell: ({ row, onDeleteFile, onFavoriteToggle, onRestoreFile }: any) => {
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
            } = useFileActions(row.original, setIsFavorited, onDeleteFile, onFavoriteToggle, onRestoreFile);

            useEffect(() => {
                prepareFileForDisplayAndDownload(row.original, setImageUrl, setDownloadUrl);
                checkIfFavorited();
                return () => {
                    if (imageUrl) {
                        URL.revokeObjectURL(imageUrl);
                    }
                    if (downloadUrl) {
                        URL.revokeObjectURL(downloadUrl);
                    }
                };
            }, [row.original]);
        
            const handleDownload = () => {
                if (downloadUrl) {
                    const link = document.createElement("a");
                    link.href = downloadUrl;
                    link.download = row.original.name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            };
        
            const handleView = () => {
                if (downloadUrl && row.original.type === "application/pdf") {
                    window.open(downloadUrl, "_blank");
                }
            };

            return (
                <ThreePoints
                    file={row.original}
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
            );
        },
        id: "actions",
    },
];
