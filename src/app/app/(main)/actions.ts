"use server"

import { prisma } from '@/app/api/database/prisma';

export default async function getFiles(userId: string) {
  if (!userId) {
    throw new Error('Invalid or missing userId');
  }

  try {
    const files = await prisma.file.findMany({
      where: { userId },
    });
    return files;
  } catch (error) {
    console.error('Error retrieving files:', error);
    throw new Error('Error retrieving files');
  }
}
