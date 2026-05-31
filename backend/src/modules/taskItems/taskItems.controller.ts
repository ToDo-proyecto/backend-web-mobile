import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';

async function assertListOwner(listId: string, userId: string) {
  const list = await prisma.taskList.findFirst({ where: { id: listId, userId } });
  if (!list) throw new AppError(404, 'List not found');
  return list;
}

export async function getTaskItems(req: Request, res: Response, next: NextFunction) {
  try {
    const listId = req.params.listId as string;
    await assertListOwner(listId, req.userId);

    const items = await prisma.taskItem.findMany({
      where: { listId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(items);
  } catch (err) {
    next(err);
  }
}

export async function createTaskItem(req: Request, res: Response, next: NextFunction) {
  try {
    const listId = req.params.listId as string;
    await assertListOwner(listId, req.userId);

    const { title, description, priority = 'medium', dueDate } = req.body;
    if (!title?.trim()) throw new AppError(400, 'Title is required');

    const item = await prisma.taskItem.create({
      data: {
        listId,
        title: (title as string).trim(),
        description: description ?? null,
        priority,
        dueDate: dueDate ? new Date(dueDate as string) : null,
      },
    });

    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

export async function updateTaskItem(req: Request, res: Response, next: NextFunction) {
  try {
    const listId = req.params.listId as string;
    const itemId = req.params.itemId as string;
    await assertListOwner(listId, req.userId);

    const existing = await prisma.taskItem.findFirst({ where: { id: itemId, listId } });
    if (!existing) throw new AppError(404, 'Task not found');

    const { title, description, completed, priority, dueDate } = req.body;
    const item = await prisma.taskItem.update({
      where: { id: itemId },
      data: {
        ...(title !== undefined && { title: (title as string).trim() }),
        ...(description !== undefined && { description }),
        ...(completed !== undefined && { completed }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate as string) : null }),
      },
    });

    res.json(item);
  } catch (err) {
    next(err);
  }
}

export async function deleteTaskItem(req: Request, res: Response, next: NextFunction) {
  try {
    const listId = req.params.listId as string;
    const itemId = req.params.itemId as string;
    await assertListOwner(listId, req.userId);

    const existing = await prisma.taskItem.findFirst({ where: { id: itemId, listId } });
    if (!existing) throw new AppError(404, 'Task not found');

    await prisma.taskItem.delete({ where: { id: itemId } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
