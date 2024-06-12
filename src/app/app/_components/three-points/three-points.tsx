import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BsTrash } from "react-icons/bs";
import { IoMdStar, IoMdStarOutline } from "react-icons/io";
import { MdOutlineFileDownload, MdOutlineRemoveRedEye } from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";
import { FileCardProps } from "../file-card/file-card";

interface ThreePointsProps extends FileCardProps {
    onFavoriteFile: (fileId: string) => void;
    onUnfavoriteFile: (fileId: string) => void;
    onRestoreFile: (fileId: string) => void;
    isFavorited: boolean;
    isConfirmOpen: boolean;
    setIsConfirmOpen: (isOpen: boolean) => void;
    onDownload: () => void;
    onView: () => void;
}

export function ThreePoints({ file, onDeleteFile, onFavoriteFile, onUnfavoriteFile, onRestoreFile, onFavoriteToggle, isFavorited, setIsConfirmOpen, onDownload, onView }: ThreePointsProps) {
    if (file.status === "DELETED") {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <SlOptionsVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        onClick={() => onRestoreFile(file.id)}
                        className="flex items-center gap-1 cursor-pointer"
                    >
                        <BsTrash className="w-4 h-4" />
                        Restaurar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }

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

                {isFavorited ? (
                    <DropdownMenuItem
                        onClick={() => onUnfavoriteFile(file.id)}
                        className="flex items-center gap-1 cursor-pointer"
                    >
                        <IoMdStar className="w-4 h-4 text-yellow-500" />
                        Retirar dos Favoritos
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem
                        onClick={() => onFavoriteFile(file.id)}
                        className="flex items-center gap-1 cursor-pointer"
                    >
                        <IoMdStarOutline className="w-4 h-4" />
                        Favoritar
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={onDownload}
                    className="flex items-center gap-1 cursor-pointer"
                >
                    <MdOutlineFileDownload className="w-4 h-4" />
                    Baixar
                </DropdownMenuItem>

                {file.type === "application/pdf" && (
                    <DropdownMenuItem
                        onClick={onView}
                        className="flex items-center gap-1 cursor-pointer"
                    >
                        <MdOutlineRemoveRedEye className="w-4 h-4" />
                        Visualizar
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}