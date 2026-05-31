import { Router } from 'express';
import {
  getTaskLists,
  getTaskListById,
  createTaskList,
  updateTaskList,
  deleteTaskList,
} from './taskLists.controller';

const router = Router();

router.get('/', getTaskLists);
router.get('/:id', getTaskListById);
router.post('/', createTaskList);
router.put('/:id', updateTaskList);
router.delete('/:id', deleteTaskList);

export default router;
