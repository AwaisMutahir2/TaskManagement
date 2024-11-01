import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  await dbConnect();

  const { email, password } = await req.json();

  try {
    const user = await User.create({ email, password });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return NextResponse.json({ token }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "User registration failed" },
      { status: 400 }
    );
  }
}
