# mail-bag
email client app

Чтобы запустить проект необходимо:

0. Заполнить файл `/server/serverInfo.json` по образцу:
```
{
  "smtp": {
    "host": "smtp.gmail.com",
    "port": 465,
    "auth": {
      "user": "username@gmail.com",
      "pass": "yourpassword"
    }
  },
  "imap": {
    "host": "imap.gmail.com",
    "port": 993,
    "auth": {
      "user": "username@gmail.com",
      "pass": "yourpassword"
    }
  }
}
```

1. Открыть терминал и перейти в нём в папку `/client`
```
cd client/
```
Устанавливаем зависимости
```
npm install
```
Запускаем сборку
```
npm run build
```
После завершения сборки, терминал можно закрыть

2. Открываем ещё один терминал и переходим в папку `/server`
```
cd server/
```
Устанавливаем зависимости
```
npm install
```
Запускаем сборку сервера и сам сервер
```
npm run dev
```

3. Открываем файл `/client/dist/index.html`
