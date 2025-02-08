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

    // Указываем связи с другими моделями. Каждый заказ в таблице orders связан с одним пользователем в таблице users.
    static relationMappings = {
        user: {
            relation: Model.BelongsToOneRelation,
            modelClass: UserModel,
            join: {
                from: "orders.user_id",
                to: "users.id",
            },
        },
    };
}