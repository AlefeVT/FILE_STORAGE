"use server";
import { prisma } from "@/app/api/database/prisma";

export async function fetchFileData(id: string) {
    try {
        const file = await prisma.file.findUnique({
            where: { id },
        });
        if (!file) {
            throw new Error(`File with id ${id} not found`);
        }

        const base64Data = Buffer.from(file.data).toString("base64");
        return { ...file, data: base64Data };
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch file data: ${error.message}`);
        } else {
            throw new Error(`Failed to fetch file data: Unknown error occurred`);
        }
    }
}

export async function deleteFile(id: string) {
    try {
        const deletedFile = await prisma.file.delete({
            where: {
                id: id,
            },
        });
        return deletedFile;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to delete file: ${error.message}`);
        } else {
            throw new Error(`Failed to delete file: Unknown error occurred`);
        }
    }
}
