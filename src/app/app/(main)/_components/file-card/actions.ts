"use server"
import { prisma } from "@/app/api/database/prisma";

export async function deleteFile(id: string) {
    try {
        const deletedFile = await prisma.file.delete({
            where: {
                id: id,
            },
        });
        return deletedFile;
    } catch (error) {
        throw new Error(`Failed to delete file: ${error}`);
    }
}
