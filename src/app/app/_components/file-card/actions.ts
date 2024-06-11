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

export async function favoriteFile(userId: string, fileId: string) {
    if (!userId || !fileId) {
      throw new Error('Invalid or missing userId or fileId');
    }
  
    try {
      await prisma.favoriteFile.create({
        data: {
          userId,
          fileId,
        },
      });
    } catch (error) {
      console.error('Error favoriting file:', error);
      throw new Error('Error favoriting file');
    }
  }

  export async function getFavoriteFiles(userId: string) {
    if (!userId) {
        throw new Error('Invalid or missing userId');
    }

    try {
        const favoriteFiles = await prisma.favoriteFile.findMany({
            where: { userId },
            include: {
                file: true,
            },
        });
        return favoriteFiles.map(favorite => favorite.file);
    } catch (error) {
        console.error('Error retrieving favorite files:', error);
        throw new Error('Error retrieving favorite files');
    }
}
