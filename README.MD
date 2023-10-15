# Invoices api

## Users should are able to:

- Register;
- Change Password (if registered);
- Login;
- Get all user profile informations;
- Change profile informations such as username and total balance;
- Create a new invoice as a draft or a pending payment;
- Edit invoice status to pending;
- When a invoice is paid the user total balance changes;
- Edit invoice informations;
- Delete an existing invoice;
- Get all user invoices;

## Technologies

- TypeScript
- Node
- Express
- Postgres (native driver)
- Docker
- Vitest (for unit tests)

## Installation guide

```
bash

$ git clone https://github.com/Paiva2/invoice-api.git

$ cd invoice-api

$ npm install

$ .env environment configuration

$ docker compose up

$ npm run dev

```

//

Check my front-end version of this app: https://github.com/Paiva2/invoice-app
