# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json в контейнер
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы в контейнер
COPY . .

# Устанавливаем переменные окружения
ENV NODE_ENV=development

# Открываем порт, на котором будет работать сервер
EXPOSE 3000

# Выполняем сборку проекта
RUN npm run build

# Запускаем приложение
CMD ["npm", "start"]