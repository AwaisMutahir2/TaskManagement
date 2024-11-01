import mongoose from 'mongoose'
import Task from '@/models/Task'

describe('Task Model Test', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI!)
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  it('should create & save task successfully', async () => {
    const validTask = new Task({
      title: 'Test Task',
      description: 'This is a test task',
      dueDate: new Date(),
      user: new mongoose.Types.ObjectId(),
    })
    const savedTask = await validTask.save()
    
    expect(savedTask._id).toBeDefined()
    expect(savedTask.title).toBe(validTask.title)
    expect(savedTask.description).toBe(validTask.description)
    expect(savedTask.completed).toBe(false)
  })

  it('should fail to save task without required fields', async () => {
    const invalidTask = new Task({ description: 'Invalid task' })
    let err
    try {
      await invalidTask.save()
    } catch (error) {
      err = error
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError)
  })
})