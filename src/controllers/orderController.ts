import { Request, Response } from 'express';
import { OrderModel } from '../models/orderModel'; // Импортируем модель заказа

// Вспомогательная функция для обработки ошибок
const handleError = (res: Response, error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message: errorMessage });
};

// Создание заказа
export const createOrder = async (req: Request, res: Response) => {
    const { user_id, total_amount, status } = req.body;
    try {
        const order = await OrderModel.query().insert({ user_id, total_amount, status });
        res.status(201).json(order);
    } catch (error: unknown) {
        handleError(res, error);
    }
};

// Получение всех заказов для конкретного пользователя
export const getOrdersByUserId = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const orders = await OrderModel.query().where('user_id', userId);
        if (orders.length === 0) {
            res.status(404).json({ message: 'No orders found for this user' });
        }
        res.json(orders);
    } catch (error: unknown) {
        handleError(res, error);
    }
};

// Получение заказа по ID
export const getOrderById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const order = await OrderModel.query().findById(id);
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
        }
        res.json(order); // Возвращаем заказ по ID
    } catch (error: unknown) {
        handleError(res, error);
    }
};

// Обновление заказа
export const updateOrder = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { total_amount, status } = req.body;
    try {
        const updatedOrder = await OrderModel.query().patchAndFetchById(id, { total_amount, status });
        if (!updatedOrder) {
            res.status(404).json({ message: 'Order not found' });
        }
        res.json(updatedOrder);
    } catch (error: unknown) {
        handleError(res, error);
    }
};

// Удаление заказа
export const deleteOrder = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedOrder = await OrderModel.query().deleteById(id);
        if (!deletedOrder) {
            res.status(404).json({ message: 'Order not found' });
        }
        res.status(204).send();
    } catch (error: unknown) {
        handleError(res, error);
    }
};