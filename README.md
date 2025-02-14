
# My First Sample Project
### Technology stack used:
1. NodeJS
2. Express
3. Typescript
4. JEST
5. Micro ORM
6. Knex
7. Postgresql
8. Google pub/sub
9. Docker
10. Kubernetes

## 1. Environment Setup

To set up the environment for the project, you need to create two `.env` files:

### 1.1. `.env` file (for development environment)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=root
DB_NAME=romandb
GOOGLE_APPLICATION_CREDENTIALS=D:/Projects_Intern/GoogleCloudKey/internet-shop-sample-433befcac104.json
```

GOOGLE_APPLICATION_CREDENTIALS - Your path to Google Cloud Key

### 1.2. `.env.test` file (for testing environment)

```env
DB_HOST=localhost
DB_PORT=5434
DB_USER=postgres
DB_PASSWORD=root
DB_NAME=testdb
GOOGLE_APPLICATION_CREDENTIALS=D:/Projects_Intern/GoogleCloudKey/internet-shop-sample-433befcac104.json
```

These environment files will hold the database connection settings for both the development and testing environments.

## 2. Database Migration

To apply database migrations, run the following command:

```bash
knex migrate:latest
```

```bash
knex seed:run --specific=users.js
```
```bash
knex seed:run --specific=orders.js
```

This will ensure that the database schema is up-to-date with the latest changes.

## 3. Testing with Postman. API Endpoints
Below are the available routes for managing **users** and **orders** in your system:

### 3.1. Users Routes (`/api/users`)

- **POST /api/users**  
  Creates a new user.  
  **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

- **POST /api/users/createUserWithPubSub**  
  Creates a new user.  
  **Request Body:**
  ```json
  {
    "name": "Mark Test",
    "email": "mark.test@example.com",
    "password": "password1553"
  }
  ```

- **GET /api/users/top**  
  Retrieves the top-N users based on the number of orders they have.


- **GET /api/users/:id**  
  Retrieves a user by their unique ID.


- **PUT /api/users/:id**  
  Updates user details by ID.  
  **Request Body:**
  ```json
  {
    "name": "Updated User",
    "email": "updated.email@example.com",
    "password": "newpassword"
  }
  ```

- **DELETE /api/users/:id**  
  Deletes a user by ID.


- **POST /api/users/_list**  
  Retrieves a list of users with filtering and pagination.  
  **Request Body:**
  ```json
  {
    "page": 1,
    "size": 10
  }
  ```

- **POST /api/users/upload**  
  Uploads a JSON file containing user data and inserts it into the database.


- **GET /api/users/:id/orders**  
  Retrieves a user by ID along with their associated orders.

Uploading Users from a JSON File
**POST Request URL:**  
`http://localhost:3000/api/users/upload`

Follow the instructions below for uploading users from a JSON file:

**Steps in Postman:**

1. Select the request type as **POST**.
2. In the **Body** section, choose **form-data**.
3. In the form-data fields, add a key-value pair:
  - **Key**: `file`
  - **Type**: File
  - **Value**: Select the JSON file containing user data (located in the resources folder).

4. Click on **Send** and review the response.

If everything is set up correctly, the JSON data should be uploaded to the database, and you will receive a response indicating the number of successfully uploaded users.


### 3.2. Orders Routes (`/api/orders`)

- **POST /api/orders**  
  Creates a new order.  
  **Request Body:**
  ```json
  {
    "user_id": 1,
    "total_amount": 100.50,
    "status": "new"
  }
  ```

- **GET /api/orders/user/:userId**  
  Retrieves all orders for a specific user by their user ID.


- **GET /api/orders/:id**  
  Retrieves an order by its unique ID.


- **PUT /api/orders/:id**  
  Updates an existing order by its ID.  
  **Request Body:**
  ```json
  {
    "total_amount": 150.00,
    "status": "paid"
  }
  ```

- **DELETE /api/orders/:id**  
  Deletes an order by its ID.


- **POST /api/orders/_list**  
  Retrieves a list of orders with pagination.  
  **Request Body:**
  ```json
  {
    "page": 1,
    "size": 20
  }
  ```

## 4. Running Tests

You can run the tests by using the following command:

```bash
npm run test
```

This will execute the tests for the application and ensure everything is functioning correctly.

---

### Explanation of Methods

- **createOrder** — Creates a new order and returns it in the response.
- **getOrdersByUserId** — Retrieves all orders for a specific user based on their `userId`.
- **getOrderById** — Retrieves a specific order by its unique `id`.
- **updateOrder** — Updates an existing order's details, such as the total amount or status.
- **deleteOrder** — Deletes an order by its `id`.

These routes are available through the `/api/orders` endpoint and are accessible via HTTP requests.

---

## 5. Running Kubernetes in Docker Desktop
Включить Kubernetes в Docker Desktop
Открыть Docker Desktop
Перейти в Settings → Kubernetes
включить "Enable Kubernetes"
Нажать "Apply & Restart"
Дождаться, пока Kubernetes поднимется (займет пару минут)

✅ Если все прошло успешно, увидим Kubernetes is running.

Проверить, что Kubernetes работает
Открыть PowerShell или Командную строку и ввести:
```bash
kubectl version --client
kubectl cluster-info
kubectl get nodes
```

Если Kubernetes запущен, увидим информацию о кластере и узле.

### 5.1. Разворачивание приложения в Kubernetes.
Теперь можно применить манифесты из папки с файлами (k8s/).
1. Переключится на Kubernetes-контекст Docker Desktop.
```bash
kubectl config use-context docker-desktop
```

2. Перейди в папку с манифестами Kubernetes, где находятся файлы *.yaml. Например, путь:
   У меня это cd D:\Projects_Intern\Internet-shop-sample\k8s
```bash
cd D:\Projects_Intern\Internet-shop-sample\k8s
```

3. Создадим секрет с Google Cloud ключом для использования в приложении:
```bash
kubectl create secret generic google-cloud-key --from-file=D:/Projects_Intern/GoogleCloudKey/internet-shop-sample-433befcac104.json

```
4. Используем локальный реестр
   Перед тем как Kubernetes попытается загрузить образ, нужно указать путь к локальному реестру:
   Построение и запуск контейнера для локального реестра:
```bash
   docker run -d -p 5000:5000 --name my-registry registry:2
   docker build -t my-app:latest .
   docker tag my-app:latest localhost:5000/my-app:latest
   docker push localhost:5000/my-app:latest
   
   kubectl run my-app --image=host.docker.internal:5000/my-app:latest --restart=Never
```

5. Применить манифесты (создать ресурсы в Kubernetes)
```bash
   kubectl apply -f .
```

6. Проверить созданные поды и сервисы
```bash
kubectl get pods
kubectl get services
```

7. Открытие приложения в браузере
Открыть браузер и зайти на http://localhost:3000

8. Удалить все ресурсы, созданные в текущей папке. Очищаем все
```bash
kubectl delete -f .

kubectl delete pods --all
kubectl delete deployments --all
kubectl delete replicasets --all
```

Help: Перезапуск контейнеров:
```bash 
docker-compose down
docker-compose up -d
```

---

### Conclusion

This project provides a simple API for managing users and orders. By following the setup instructions and using Postman 
for testing, you should be able to interact with the API and verify its functionality. 

![img_5.png](resources/images/img_5.png)

![img.png](resources/images/img.png)

![img_1.png](resources/images/img_1.png)

![img_2.png](resources/images/img_2.png)

![img_3.png](resources/images/img_3.png)

![img_4.png](resources/images/img_4.png)