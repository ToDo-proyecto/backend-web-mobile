import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';

function parseTags(raw: string): string[] {
  try { return JSON.parse(raw); } catch { return []; }
}

function toClientShape(list: any, itemsOverride?: { completed: boolean }[]) {
  const items = itemsOverride ?? list.items ?? [];
  const total = items.length;
  const done = items.filter((i: { completed: boolean }) => i.completed).length;
  const percentage = total === 0 ? 0 : Math.round((done / total) * 100);
  return {
    id: list.id,
    title: list.title,
    subtitle: list.subtitle,
    tags: parseTags(list.tags),
    createdAt: list.createdAt,
    updatedAt: list.updatedAt,
    percentage,
    idColor: list.color,
    idIcon: list.icon,
  };
}

export async function getTaskLists(req: Request, res: Response, next: NextFunction) {
  try {
    const lists = await prisma.taskList.findMany({
      where: { userId: req.userId },
      include: { items: { select: { completed: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(lists.map((l: any) => toClientShape(l, l.items)));
  } catch (err) {
    next(err);
  }
}

export async function getTaskListById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const list = await prisma.taskList.findFirst({
      where: { id, userId: req.userId },
      include: { items: { select: { completed: true } } },
    });
    if (!list) throw new AppError(404, 'List not found');
    res.json(toClientShape(list, list.items));
  } catch (err) {
    next(err);
  }
}

export async function createTaskList(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, subtitle = '', tags = [], color = '#3B82F6', icon = 'list' } = req.body;
    if (!title?.trim()) throw new AppError(400, 'Title is required');

    const list = await prisma.taskList.create({
      data: {
        userId: req.userId,
        title: (title as string).trim(),
        subtitle,
        tags: JSON.stringify(tags),
        color,
        icon,
      },
    });
    res.status(201).json(toClientShape(list));
  } catch (err) {
    next(err);
  }
}

export async function updateTaskList(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const existing = await prisma.taskList.findFirst({ where: { id, userId: req.userId } });
    if (!existing) throw new AppError(404, 'List not found');

    const { title, subtitle, tags, color, icon } = req.body;
    const list = await prisma.taskList.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: (title as string).trim() }),
        ...(subtitle !== undefined && { subtitle }),
        ...(tags !== undefined && { tags: JSON.stringify(tags) }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon }),
      },
      include: { items: { select: { completed: true } } },
    });
    res.json(toClientShape(list, list.items));
  } catch (err) {
    next(err);
  }
}

export async function deleteTaskList(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const existing = await prisma.taskList.findFirst({ where: { id, userId: req.userId } });
    if (!existing) throw new AppError(404, 'List not found');

    await prisma.taskList.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
