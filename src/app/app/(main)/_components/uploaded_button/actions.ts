"use server"

import { prisma } from "@/app/api/database/prisma";

interface CreateFileInput {
  name: string;
  type: string;
  userId: string;
  data: string; 
}

export async function createFile({ name, type, userId, data }: CreateFileInput) {
  const binaryData = Buffer.from(data.split(",")[1], "base64"); 

  return await prisma.file.create({
    data: {
      name,
      type,
      userId,
      data: binaryData,
    },
  });
}
