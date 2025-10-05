const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class TaskController {
  // Retrieve all tasks ordered by creation date
  async getAllTasks(req, res) {
    try {
      const tasks = await prisma.task.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  }

  // Retrieve a specific task by ID
  async getTaskById(req, res) {
    try {
      const { id } = req.params;
      const task = await prisma.task.findUnique({
        where: { id: parseInt(id) }
      });
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch task' });
    }
  }

  // Create a new task
  async createTask(req, res) {
    try {
      const { title, description } = req.body;
      
      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }
      
      const task = await prisma.task.create({
        data: {
          title,
          description: description || null
        }
      });
      
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create task' });
    }
  }

  // Update an existing task
  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const { title, description, completed } = req.body;
      
      const task = await prisma.task.update({
        where: { id: parseInt(id) },
        data: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(completed !== undefined && { completed })
        }
      });
      
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task' });
    }
  }

  // Delete a task by ID
  async deleteTask(req, res) {
    try {
      const { id } = req.params;
      
      await prisma.task.delete({
        where: { id: parseInt(id) }
      });
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  }

  // Get task completion statistics
  async getTaskStats(req, res) {
    try {
      const total = await prisma.task.count();
      const completed = await prisma.task.count({
        where: { completed: true }
      });
      const pending = total - completed;

      res.json({
        total,
        completed,
        pending
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch task statistics' });
    }
  }
}

module.exports = new TaskController();