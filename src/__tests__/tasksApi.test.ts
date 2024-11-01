import { createMocks, MockRequest, MockResponse } from "node-mocks-http";
import { GET, POST } from "@/app/api/tasks/route";
import dbConnect from "@/lib/db";
import Task from "@/models/Task";
import User, { IUser } from "@/models/User";
import jwt from "jsonwebtoken";

jest.mock("@/lib/db");
jest.mock("next-auth/next");

describe("Tasks API", () => {
  let user: IUser;
  let token: string;

  beforeAll(async () => {
    await dbConnect();
    user = await User.create({
      email: "test@example.com",
      password: "password",
    });
    token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
  });

  it("should create a new task", async () => {
    const { req, res }: { req: MockRequest<any>; res: MockResponse<any> } = createMocks({
      method: "POST",
      body: {
        title: "Test Task",
        description: "This is a test task",
        dueDate: new Date().toISOString(),
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await POST(req);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toHaveProperty("_id");
  });

  it("should get tasks for a user", async () => {
    await Task.create({
      title: "Test Task",
      description: "This is a test task",
      dueDate: new Date(),
      user: user._id,
    });

    const { req, res }: { req: MockRequest<any>; res: MockResponse<any> } = createMocks({
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await GET(req);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toHaveProperty("tasks");
    expect(JSON.parse(res._getData()).tasks.length).toBeGreaterThan(0);
  });
});
