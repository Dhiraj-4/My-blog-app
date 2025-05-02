# DevsConner Blog App Backend

This is the backend API for **DevsConner Blog App**, a full-featured blogging platform that supports user authentication, OTP verification, profile management, and blog CRUD operations with AWS S3 integration for media uploads.

## 🔧 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **Zod** – schema validation
- **AWS S3** – file storage
- **JWT** – authentication
- **Nodemailer** – email OTP services

---

## 🚀 Features

### 🔐 Authentication
- Email OTP-based sign-up
- Login with email & password
- Password reset via OTP
- Secure token system: Access, Refresh, OTP, Delete, and Update tokens

### 👤 User
- Upload & save profile image via AWS S3 pre-signed URLs
- Update login credentials
- Delete profile & associated blogs

### ✍️ Blog
- Create, Read, Update, Delete (CRUD)
- Upload & manage cover images via AWS S3
- View all blogs or filter by user

---

## 📁 Project Structure
.
├── controllers/
├── routes/
├── validators/
├── services/
├── utils/
├── models/
└── server.js


---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/devsconner-blog-backend.git
cd devsconner-blog-backend

2. Install Dependencies

npm install

3. Create .env File

PORT=8080
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your_s3_bucket_name
MY_MAIL=myblogapp.devsconner@gmail.com
APP_PASSWORD=your_app_password

4. Start the Server

npm run dev

📫 API Endpoints
Auth Routes (Prefix: /api/auth)

    GET /email-verify

    PUT /email-verify-otp

    POST /signup

    POST /login

    GET /forgetpassword

    POST /otp-verification

    POST /restPassword

    POST /refresh

    GET /users

    GET /users/me

    POST /users/upload-url

    PUT /users/profileImg

    DELETE /users/profileImg

    POST /users/updateLogin

    PUT /users/updateUser

    POST /delLogin

    DELETE /delUser

Blog Routes (Prefix: /api/blogs)

    GET / – All blogs

    GET /:id – Single blog

    GET /users – Authenticated user's blogs

    POST /upload-url – Get blog image upload URL

    POST / – Create blog

    PUT /:id – Update blog

    PUT /coverImage/:id – Save blog cover image

    DELETE /:id – Delete blog

    DELETE /coverImage/:id – Delete cover image

📧 Email Example

From: myblogapp.devsconner@gmail.com
Subject: Your OTP Code

Your OTP is: 123456
This code will expire in 10 minutes.

🧑‍💻 Developer : Dhiraj Dipak Londhe


