import express, { Request, Response } from 'express';
import { createUser, getUserById } from '../controllers/userController';

const router = express.Router();

// POST /api/users
router.post('/', createUser);

// GET /api/users/:id
router.get('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
    await getUserById(req, res);  // Мы явно вызываем getUserById, передавая правильные параметры
});

//router.get('/:id', getUserById);

export { router as userRoutes };