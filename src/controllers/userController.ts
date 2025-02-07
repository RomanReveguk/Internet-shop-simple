import { Request, Response } from 'express';
import { UserModel } from '../models/userModel';

// Вспомогательная функция для обработки ошибок
const handleError = (res: Response, error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message: errorMessage });
};

// Создание пользователя
export const createUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    try {
        const user = await UserModel.query().insert({ name, email, password });
        res.status(201).json(user);
    } catch (error: unknown) {
        handleError(res, error);
    }
};

// Получение пользователя по ID
export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await UserModel.query().findById(id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error: unknown) {
        handleError(res, error);
    }
};