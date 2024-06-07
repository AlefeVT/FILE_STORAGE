"use server"
import { prisma } from "@/app/api/database/prisma";

export async function createFile(fileData: { name: string; userId: string }) {
  return prisma.file.create({
    data: {
      name: fileData.name,
      userId: fileData.userId,
    },
  });
}
