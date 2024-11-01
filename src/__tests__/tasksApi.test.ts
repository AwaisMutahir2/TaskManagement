import { NextApiRequest, NextApiResponse } from 'next';
import { PUT, DELETE } from "@/app/api/tasks/[id]/route"; 
import dbConnect from '@/lib/db';
import Task from '@/models/Task';
import { verifyToken } from '@/lib/auth';

// Mock the necessary modules
jest.mock('@/lib/db');
jest.mock('@/models/Task');
jest.mock('@/lib/auth');

const mockCookies = jest.fn();
jest.mock('next/headers', () => ({
  cookies: () => ({
    get: (name: string) => {
      if (name === 'token') {
        return { value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzI0N2UyNmYxMTAxMGJlZGMyYWJlYjMiLCJpYXQiOjE3MzA0ODAyNTQsImV4cCI6MTczMDQ4Mzg1NH0.iGhtuSbDXrxmGFAKdkTepn5po6lDJ98imQNk7x9YXUM' }; // Simulate a valid token
      }
      return null;
    },
  }),
}));

describe('Task API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(() => {
    jest.clearAllMocks();
  });

  describe('PUT /api/task/[id]', () => {
    it('should update a task successfully', async () => {
      const req = new Request('http://localhost/api/tasks/123', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Updated Task',
          description: 'Updated Description',
          dueDate: new Date().toISOString(),
          completed: false,
        }),
      });

      (verifyToken as jest.Mock).mockResolvedValue({ userId: 'user123' });
      (Task.findOneAndUpdate as jest.Mock).mockResolvedValue({
        _id: '123',
        title: 'Updated Task',
        description: 'Updated Description',
        dueDate: new Date(),
        completed: false,
      });

      const response = await PUT(req, { params: { id: '123' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        _id: '123',
        title: 'Updated Task',
        description: 'Updated Description',
        dueDate: expect.any(String), // Ensure this matches your format
        completed: false,
      });
    });

    it('should return 404 if task is not found', async () => {
      const req = new Request('http://localhost/api/tasks/123', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Non-existent Task' }),
      });

      (verifyToken as jest.Mock).mockResolvedValue({ userId: 'user123' });
      (Task.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      const response = await PUT(req, { params: { id: '123' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'Task not found' });
    });
  });

  describe('DELETE /api/task/[id]', () => {
    it('should delete a task successfully', async () => {
      const req = new Request('http://localhost/api/tasks/123', {
        method: 'DELETE',
        headers: { 'Cookie': 'token=valid-token' },
      });

      (verifyToken as jest.Mock).mockResolvedValue({ userId: 'user123' });
      (Task.findOneAndDelete as jest.Mock).mockResolvedValue({
        _id: '123',
        title: 'Task to be deleted',
      });

      const response = await DELETE(req, { params: { id: '123' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({ message: 'Task deleted successfully' });
    });
  });
});
