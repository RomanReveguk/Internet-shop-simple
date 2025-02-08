import express from 'express';
import {createOrder, deleteOrder, getOrderById, getOrdersByUserId, updateOrder, getOrdersList} from '../controllers/orderController';

const router = express.Router();

// Роуты для работы с заказами
router.post('/', createOrder);

// Получение заказов пользователя по ID (userId передается в params)
router.get('/user/:userId', getOrdersByUserId);

// Получение заказа по ID
router.get('/:id', getOrderById);

// Обновление заказа по ID
router.put('/:id', updateOrder);

// Удаление заказа по ID
router.delete('/:id', deleteOrder);

// Получение списка заказов с пагинацией
router.post('/_list', getOrdersList);


export { router as orderRoutes };