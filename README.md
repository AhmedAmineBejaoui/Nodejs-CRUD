# Node.js CRUD

A small Express and Mongoose application for managing customer records with EJS views.

## Setup

1. Install Node.js and MongoDB (or use a MongoDB Atlas database).
2. Run `npm ci`.
3. Set the `MONGODB_URI` environment variable to your own MongoDB connection string.
4. Run `npm start` and open `http://localhost:3000` (or set `PORT`).

Example for macOS/Linux:

```sh
export MONGODB_URI='mongodb://127.0.0.1:27017/nodejs-crud'
npm start
```

For PowerShell:

```powershell
$env:MONGODB_URI = 'mongodb://127.0.0.1:27017/nodejs-crud'
npm start
```

The application will exit with an explanatory error if `MONGODB_URI` is missing. Do not commit connection strings, database passwords, or local `.env` files. The project previously contained a hard-coded database credential: **rotate/revoke that credential in MongoDB Atlas**. Removing it from the latest source does not erase it from Git history.

## Development notes

The project currently enables LiveReload in `app.js` and has no functional automated test suite. Treat it as a learning project rather than a production-ready service.
