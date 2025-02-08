import { Model } from "objection";
import {OrderModel} from "./orderModel";

export class UserModel extends Model {
    // Указываем имя таблицы в базе данных
    static get tableName() {
        return "users";
    }

    // Указываем имя столбца для первичного ключа
    static get idColumn() {
        return "id";
    }

    // Устанавливаем связь с заказами
    static relationMappings = {
        orders: {
            relation: Model.HasManyRelation,  // Связь "один ко многим"
            modelClass: OrderModel,
            join: {
                from: 'users.id',
                to: 'orders.user_id'
            }
        }
    };

}