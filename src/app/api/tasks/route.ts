import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Task from "@/models/Task";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  await dbConnect();

  const token = cookies().get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 10; // Number of tasks per page
    const filter = searchParams.get("filter");
    const sort = searchParams.get("sort");
    const search = searchParams.get("search");

    let query: Record<string, any> = { user: decoded.userId };

    if (filter === "completed") query.completed = true;
    if (filter === "incomplete") query.completed = false;
    if (search) query.title = { $regex: search, $options: "i" };

    const sortOption: Record<string, any> = {};
    if (sort === "dueDate") sortOption.dueDate = 1;
    if (sort === "title") sortOption.title = 1;

    const tasks = await Task.find(query)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Task.countDocuments(query);

    return NextResponse.json({
      tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: Request) {
  await dbConnect();

  const token = cookies().get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = await verifyToken(token);

    const { title, description, dueDate } = await req.json();
    const task = await Task.create({
      title,
      description,
      dueDate,
      user: decoded.userId,
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 400 });
  }
}
