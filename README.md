### Installation
First you must install node js. Duplicate and rename the `.env`files, then remove the `.example` in the file names.


Change `.env` file, for example in below.

| key                       | value                         |
| :----------------------   | :---------------------------- |
| `DATABASE_UR`             | *url database                 |
| `NODE_CHAT_ACCESS_TOKEN`  | *random value                 |
| `NODE_CHAT_REFRESH_TOKEN` | *random value                 |

Now that run the command below.

``` bash
npm install
npx prisma generate
```

Run this project.
```
npm start
```

