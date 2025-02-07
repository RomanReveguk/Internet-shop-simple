import { Request, Response } from 'express';

/** Мидлвар для обработки несуществующих маршрутов */
export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({ message: 'Route not found' });
};