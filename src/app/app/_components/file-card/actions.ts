"use server";
import { prisma } from "@/app/api/database/prisma";

export async function deleteFile(id: string) {
    try {
        const updatedFile = await prisma.file.update({
            where: { id },
            data: { status: 'DELETED' },
        });
        return updatedFile;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to delete file: ${error.message}`);
        } else {
            throw new Error(`Failed to delete file: Unknown error occurred`);
        }
    }
}

export async function restoreFile(id: string) {
    try {
        const updatedFile = await prisma.file.update({
            where: { id },
            data: { status: 'ACTIVE' },
        });
        return updatedFile;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to restore file: ${error.message}`);
        } else {
            throw new Error(`Failed to restore file: Unknown error occurred`);
        }
    }
}

export async function favoriteFile(userId: string, fileId: string) {
    if (!userId || !fileId) {
        throw new Error('Invalid or missing userId or fileId');
    }

    try {
        const file = await prisma.file.updateMany({
            where: {
                id: fileId,
                userId: userId,
                status: { not: 'DELETED' },
            },
            data: {
                status: 'FAVORITE',
            },
        });

        if (file.count === 0) {
            throw new Error('File not found or already deleted');
        }

        return { message: 'File marked as favorite' };
    } catch (error: any) {
        console.error('Error favoriting file:', error);
        throw new Error(`Error favoriting file: ${error.message}`);
    }
}

export async function unfavoriteFile(userId: string, fileId: string) {
    if (!userId || !fileId) {
        throw new Error('Invalid or missing userId or fileId');
    }

    try {
        const file = await prisma.file.updateMany({
            where: {
                id: fileId,
                userId: userId,
                status: 'FAVORITE',
            },
            data: {
                status: 'ACTIVE',
            },
        });

        if (file.count === 0) {
            throw new Error('File not found or not favorited');
        }

        return { message: 'File unmarked as favorite' };
    } catch (error: any) {
        console.error('Error unfavoriting file:', error);
        throw new Error(`Error unfavoriting file: ${error.message}`);
    }
}

export async function isFileFavorited(userId: string, fileId: string) {
    try {
        const file = await prisma.file.findFirst({
            where: {
                id: fileId,
                userId: userId,
                status: 'FAVORITE',
            },
        });
        return file !== null;
    } catch (error) {
        console.error('Error checking if file is favorited:', error);
        throw new Error('Error checking if file is favorited');
    }
}

//GETs/////////////////////////////////////

export async function getFileData(id: string) {
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

export async function getFavoriteFiles(userId: string) {
    if (!userId) {
        throw new Error('Invalid or missing userId');
    }

    try {
        const favoriteFiles = await prisma.file.findMany({
            where: {
                userId,
                status: 'FAVORITE',
            },
        });
        return favoriteFiles;
    } catch (error) {
        console.error('Error retrieving favorite files:', error);
        throw new Error('Error retrieving favorite files');
    }
}

export async function getDeletedFiles(userId: string) {
    if (!userId) {
        throw new Error('Invalid or missing userId');
    }

    try {
        const deletedFiles = await prisma.file.findMany({
            where: {
                userId: userId,
                status: 'DELETED',
            },
        });
        return deletedFiles;
    } catch (error) {
        console.error('Error retrieving deleted files:', error);
        throw new Error('Error retrieving deleted files');
    }
}

export async function getFiles(userId: string) {
    if (!userId) {
        throw new Error('Invalid or missing userId');
    }

    try {
        const files = await prisma.file.findMany({
            where: {
                userId: userId,
                status: {
                    in: ['ACTIVE', 'FAVORITE'],
                },
            },
        });
        return files;
    } catch (error) {
        console.error('Error retrieving files:', error);
        throw new Error('Error retrieving files');
    }
}