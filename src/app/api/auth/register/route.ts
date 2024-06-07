import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { NextRequest } from "next/server";
import { prisma } from "../../database/prisma";
export async function POST(request: NextRequest) {
  try {
    const data: { 
      name: string; 
      email: string; 
      password: string; 
    } = await request.json();

    console.log(data);
    
    const userFound = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (userFound) {
      return NextResponse.json(
        {
          message: "Email já está em uso no sistema.",
        },
        {
          status: 400,
        }
      );
    }

    const usernameFound = await prisma.user.findFirst({
      where: {
        name: data.name,
      },
    });

    if (usernameFound) {
      return NextResponse.json(
        {
          message: "Nome já está em uso no sistema.",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    const { password: _, ...user } = newUser;

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: (error as Error).message,
      },
      {
        status: 500,
      }
    );
  }
}
