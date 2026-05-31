import { Router } from 'express';
import { getTaskItems, createTaskItem, updateTaskItem, deleteTaskItem } from './taskItems.controller';

const router = Router({ mergeParams: true });

router.get('/', getTaskItems);
router.post('/', createTaskItem);
router.patch('/:itemId', updateTaskItem);
router.delete('/:itemId', deleteTaskItem);

export default router;
