import express from 'express';
import cors from 'cors';
import { authenticate } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';
import taskListsRouter from './modules/taskLists/taskLists.router';
import taskItemsRouter from './modules/taskItems/taskItems.router';

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/task-lists', authenticate, taskListsRouter);
app.use('/api/task-lists/:listId/items', authenticate, taskItemsRouter);

app.use(errorHandler);

export default app;
