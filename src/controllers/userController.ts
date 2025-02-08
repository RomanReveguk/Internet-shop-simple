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
        } else {
            res.json(user);
        }
    } catch (error: unknown) {
        handleError(res, error);
    }
};

// Обновление пользователя
export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    try {
        const updatedUser = await UserModel.query().patchAndFetchById(id, { name, email, password });
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json(updatedUser);
        }
    } catch (error: unknown) {
        handleError(res, error);
    }
};

// Удаление пользователя
export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedUser = await UserModel.query().deleteById(id);
        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(204).send();
        }
    } catch (error: unknown) {
        handleError(res, error);
    }
};

// Получение пользователя по ID с заказами
export const getUserByIdWithOrders = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await UserModel.query()
            .findById(id)
            .withGraphFetched('orders'); // Получаем также связанные заказы

        if (!user) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.json(user);
        }
    } catch (error: unknown) {
        handleError(res, error);
    }
};

// Получение списка пользователей с фильтрацией и пагинацией
export const getUsersList = async (req: Request, res: Response) => {
    const { name, page = 1, size = 20 } = req.body;

    try {
        const query = UserModel.query()
            .select('id', 'name')  // Ограничиваем выборку только полями id и name
            .modify((builder) => {
                if (name) {
                    builder.where('name', 'like', `%${name}%`);  // Фильтрация по имени
                }
            })
            .page(page - 1, size);  // Пагинация: page начинается с 0

        // Получаем количество пользователей, соответствующих фильтрам (без пагинации)
        const totalCountQuery = UserModel.query()
            .modify((builder) => {
                if (name) {
                    builder.where('name', 'like', `%${name}%`);  // Применяем фильтрацию по имени
                }
            })
            .count('id as count');  // Получаем количество пользователей по id

        // Выполняем оба запроса параллельно
        const [users, totalUsers] = await Promise.all([query, totalCountQuery]);

        // @ts-ignore
        const totalCount = Number(totalUsers[0]?.count);  // Получаем значение count из результата
        const totalPages = Math.ceil(totalCount / size);  // Расчет количества страниц

        // Ответ с данными
        res.json({
            list: users,
            totalPages
        });
    } catch (error: unknown) {
        handleError(res, error);
    }
};

// Загрузка данных из JSON
export const uploadUsers = async (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
    }

    const trx = await UserModel.startTransaction(); // Начинаем транзакцию

    try {
        const fileContent = require('fs').readFileSync(req.file.path, 'utf8'); // Читаем содержимое файла
        const users = JSON.parse(fileContent); // Парсим содержимое JSON

        const successfulInserts = [];

        for (const userData of users) {
            try {
                const user = await UserModel.query(trx).insert(userData); // Вставляем пользователя в транзакции
                successfulInserts.push(user);
            } catch (error) {
                // В случае ошибки, откатываем транзакцию
                throw new Error('Error inserting user');
            }
        }

        await trx.commit(); // Если все прошло успешно, коммитим транзакцию
        res.json({ successCount: successfulInserts.length });
    } catch (error) {
        await trx.rollback(); // В случае ошибки, откатываем изменения
        res.status(400).json({ message: 'Error uploading users', error });
    } finally {
        // Удаляем временный файл
        require('fs').unlinkSync(req.file.path);
    }
};

// Получение топ-N сущностей (например, top-N пользователей с наибольшим количеством заказов)
export const getTopUsers = async (req: Request, res: Response) => {
    const { n } = req.query; // Получаем параметр n
    try {
        const topUsers = await UserModel.query()
            .select('users.id', 'users.name')
            .count('orders.id as orderCount')
            .join('orders', 'orders.user_id', 'users.id')
            .groupBy('users.id')
            .orderBy('orderCount', 'desc')
            .limit(Number(n));

        res.json(topUsers);
    } catch (error: unknown) {
        handleError(res, error);
    }
};