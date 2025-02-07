import { Model } from "objection";

export class UserModel extends Model {
    // Указываем имя таблицы в базе данных
    static get tableName() {
        return "users";
    }

    // Указываем имя столбца для первичного ключа
    static get idColumn() {
        return "id";
    }
}