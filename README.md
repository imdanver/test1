# Тестовое задание
Блок добавления комментариев для сайта
## Установка проекта в Ubuntu 20.04
#### Установка и настройка базы даных mysql
Установка mysql-сервера
```
apt install mysql-server
```
Запуск mysql
```
mysql
```
Создание пароля для пользователя root
```
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY <пароль_базы_даных>';
```
Создание базы данных
```
CREATE SCHEMA `dzencode` DEFAULT CHARACTER SET utf8mb4;
```
```
exit
```
#### Установка и настройка node  js
Установка curl
```
apt install curl
```
Установка системы контроля версий nvm
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```
```
source ~/.bashrc
```
Выбор необходимой версии nodejs  
```
nvm list-remote
```
Установка необходимой версии nodejs  
```
nvm install v<версия_nodejs>
```
Скопировать файлы проекта на сервер

Установить зависимости проекта  
```
npm i
```

В файле проекта .env.production указать ваш хост

В файле проекта model.js указать пароль базы данных

Оптимизация клиентской части проекта
```
npm run build
```


Запустить проект  
```
npm start
```
Проект будет доступен по адресу: <ваш_хост>:3000




