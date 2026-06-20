# 3legant Backend

## Description

3legant Backend is a RESTful API built with NestJS and TypeScript that powers the 3legant e-commerce platform. It provides secure authentication, product management, shopping cart operations, order processing, and user profile management while following a modular and scalable architecture.

## Functionality

- JWT-based authentication and authorization
- User registration and login
- Product management
- Category management
- Shopping cart API
- Wishlist management
- Order creation and processing
- User profile management
- Address management
- File and image upload support
- Request validation and error handling
- RESTful API architecture
- Database integration with Prisma ORM

## Tech Stack

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Passport.js
- bcrypt
- class-validator
- class-transformer
- Multer
- Swagger
- ESLint
- Prettier

## Run Locally

Clone the repository:

```bash
git clone https://github.com/Maksym-Dudar/3legant-back.git
```

Navigate to the project directory:

```bash
cd 3legant-back
```

Install dependencies:

```bash
npm install
```

Configure your environment variables by creating a `.env` file.

Run database migrations:

```bash
npx prisma migrate deploy
```

Generate Prisma Client:

```bash
npx prisma generate
```

Start the development server:

```bash
npm run start:dev
```

The API will be available at:

```text
http://localhost:5000
```
