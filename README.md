<div align="center">
  <h1>Squared API</h1>
  
  <p>
    <strong>API for a mobile app for posting content, like Medium</strong><br/>
    Backend REST API built with Node.js + Express
  </p>

  <p>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-20.x-339933?style=flat&logo=nodedotjs&logoColor=white" alt="Node.js version" /></a>
    <a href="https://expressjs.com"><img src="https://img.shields.io/badge/Express-4.x-000000?style=flat&logo=express&logoColor=white" alt="Express version" /></a>
    <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
    <img src="https://img.shields.io/badge/JWT-Authentication-2e86de?style=flat" alt="JWT Auth" />
    <img src="https://img.shields.io/badge/ESM-Modern%20JavaScript-blue?style=flat" alt="ESM" />
  </p>

  <p>🚀 REST API powering a mobile-first content creation & reading platform</p>
</div>

<br/>

## ✨ Features

- User authentication & authorization (JWT)
- Rich article creation (title, content, cover image)

## To Add 

- Reading list / bookmarks
- Like reactions
- Followers & following system
- Comments & nested replies
- Drafts & scheduled publishing
- Rate limiting & basic abuse protection

## 🛠 Tech Stack

- **Runtime**: Node.js 22+
- **Framework**: Express
- **Database**: PostgreSQL
- **Auth**: JWT + refresh tokens
- **ORM**: Prisma
<!-- - **File uploads**: Multer + Cloudinary / S3 / local storage -->
<!-- - **Validation**: Zod or Joi -->
<!-- - **Logging**: Pino or Winston -->
<!-- - **Documentation**: Swagger / OpenAPI (optional) -->
<!-- - **Testing**: Jest + Supertest (recommended) -->

## Quick Start

```bash
# 1. Clone & enter directory
git clone https://github.com/AkhatorEnosa/squared_api.git
cd squared_api

# 2. Install dependencies
npm install

# 3. Create .env file (see .env.example)
cp .env.example .env

# 4. Start development server
npm run dev