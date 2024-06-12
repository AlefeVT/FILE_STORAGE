import { toast } from "@/components/ui/use-toast";
import { deleteFile, favoriteFile, unfavoriteFile, getFileData, isFileFavorited, restoreFile } from "../actions";
import { useSession } from "next-auth/react";

export const useFileActions = (
    file: any, 
    setIsFavorited: (isFavorited: boolean) => void, 
    onDeleteFile: (fileId: string) => void, 
    onFavoriteToggle: (fileId: string) => void, 
    onRestoreFile: (fileId: string) => void
) => {
    const session = useSession();

    const checkIfFavorited = async () => {
        if (session.data?.user.id) {
            const result = await isFileFavorited(session.data.user.id, file.id);
            setIsFavorited(result);
        }
    };

    const deleteFileFromDb = async (fileId: string) => {
        try {
            await deleteFile(fileId);
            onDeleteFile(fileId);
        } catch (error) {
            console.error("Error deleting file:", error);
        }
    };

    const favoriteFileInDb = async (fileId: string) => {
        try {
            const userId = session.data?.user.id;
            await favoriteFile(userId, fileId);
            setIsFavorited(true);
            toast({
                variant: "default",
                title: "Arquivo Favoritado",
                description: "O arquivo foi adicionado aos favoritos com sucesso!",
            });
            onFavoriteToggle(fileId);
        } catch (error: any) {
            if (error.message.includes("already favorited")) {
                toast({
                    variant: "default",
                    title: "Arquivo já favoritado",
                    description: "Este arquivo já está na sua lista de favoritos.",
                });
            } else {
                console.error("Error favoriting file:", error);
                toast({
                    variant: "destructive",
                    title: "Erro ao favoritar arquivo",
                    description: error.message,
                });
            }
        }
    };

    const unfavoriteFileInDb = async (fileId: string) => {
        try {
            const userId = session.data?.user.id;
            await unfavoriteFile(userId, fileId);
            setIsFavorited(false);
            toast({
                variant: "default",
                title: "Arquivo Desfavoritado",
                description: "O arquivo foi removido dos favoritos com sucesso!",
            });
            onFavoriteToggle(fileId);
        } catch (error: any) {
            console.error("Error unfavoriting file:", error);
            toast({
                variant: "destructive",
                title: "Erro ao desfavoritar arquivo",
                description: error.message,
            });
        }
    };

    const restoreFileInDb = async (fileId: string) => {
        try {
            await restoreFile(fileId);
            onRestoreFile(fileId);
            toast({
                variant: "default",
                title: "Arquivo Restaurado",
                description: "O arquivo foi restaurado com sucesso!",
            });
        } catch (error) {
            console.error("Error restoring file:", error);
            toast({
                variant: "destructive",
                title: "Erro ao restaurar arquivo",
                description: "Não foi possível restaurar o arquivo, tente novamente mais tarde.",
            });
        }
    };

    const prepareFileForDisplayAndDownload = async (
        file: any, 
        setImageUrl: (url: string) => void, 
        setDownloadUrl: (url: string) => void
    ) => {
        try {
            const fileData = await getFileData(file.id);

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

    return {
        checkIfFavorited,
        deleteFileFromDb,
        favoriteFileInDb,
        unfavoriteFileInDb,
        restoreFileInDb,
        prepareFileForDisplayAndDownload,
    };
};
