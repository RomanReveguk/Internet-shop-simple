import express from 'express';
import {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    getUsersList,
    uploadUsers,
    getTopUsers,
    getUserByIdWithOrders,
    createUserWithPubSub
} from '../controllers/userController';
import multer from 'multer';

const router = express.Router();

// Настроим multer для обработки одного файла
const upload = multer({ dest: 'uploads/' });

// Создание пользователя POST /api/users
router.post('/', createUser);

// Создание пользователя через Google Pub/Sub POST /api/users/createUserWithPubSub
router.post('/createUserWithPubSub', createUserWithPubSub);

// Получение топ-N пользователей с наибольшим количеством заказов
router.get('/top', getTopUsers);

// Получение пользователя по ID GET /api/users/:id
router.get('/:id', getUserById);

// Обновление пользователя
router.put('/:id', updateUser);

// Удаление пользователя
router.delete('/:id', deleteUser);

// Получение списка пользователей с фильтрацией и пагинацией
router.post('/_list', getUsersList);

// Загрузка пользователей из JSON файла
router.post('/upload', upload.single('file'), uploadUsers);

// Получение пользователя по ID с заказами
router.get('/:id/with-orders', getUserByIdWithOrders);

export { router as userRoutes };