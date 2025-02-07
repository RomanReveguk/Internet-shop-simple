import { Model } from "objection";
import { UserModel } from "./userModel"; // Импортируем модель пользователя

export class OrderModel extends Model {
    // Указываем имя таблицы для заказов
    static get tableName() {
        return "orders";
    }

    // Указываем имя столбца для первичного ключа
    static get idColumn() {
        return "id";
    }

    // Указываем связи с другими моделями
    static relationMappings = {
        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: UserModel,
            join: {
                from: "orders.user_id", // поле в таблице orders
                to: "users.id", // поле в таблице users
            },
        },
    };
}