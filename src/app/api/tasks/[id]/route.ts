import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Task from "@/models/Task";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  const token = cookies().get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);

    const { title, description, dueDate, completed } = await req.json();
    const task = await Task.findOneAndUpdate(
      { _id: params.id, user: decoded.userId },
      { title, description, dueDate, completed },
      { new: true }
    );

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  const token = cookies().get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);

    const task = await Task.findOneAndDelete({
      _id: params.id,
      user: decoded.userId,
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  const token = cookies().get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);
    const { completed } = await req.json();

    const task = await Task.findOneAndUpdate(
      { _id: params.id, user: decoded.userId },
      { completed },
      { new: true }
    );

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error updating task status:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
