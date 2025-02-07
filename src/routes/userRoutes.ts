import express from 'express';
import {createUser, getUserById} from '../controllers/userController';

const router = express.Router();

// POST /api/users
router.post('/', createUser);

// GET /api/users/:id
router.get('/:id', getUserById);

export { router as userRoutes };