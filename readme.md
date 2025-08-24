# Library Management API with Express, TypeScript & MongoDB

### About the Project

This project is a RESTful API for managing a library system built with **Express**, **TypeScript**, and **MongoDB** using **Mongoose**. The API allows users to manage books, borrow them, and track borrowed book statistics. It supports operations such as creating, updating, deleting books, borrowing books, and fetching book details. Additionally, the API provides aggregation support to track borrowed book summaries.

---

## Features

- **Book Management**:
  - Create, read, update, and delete books.
  - Books have fields like title, author, genre, ISBN, description, available copies, and availability status.
  - Books are filtered and sorted based on different query parameters.

- **Borrowing System**:
  - Borrow books by verifying the available copies.
  - Deduct borrowed copies from the total stock and mark the book as unavailable if all copies are borrowed.
  - View borrowing history with aggregated data of total borrowed books.

- **Data Validation**:
  - Validates data for books and borrow records using **Zod**.
  - Ensures book genres are within predefined values.
  - ISBN and other fields are checked for uniqueness and required status.

- **API Endpoints**:
  - `POST /api/books`: Create a new book.
  - `GET /api/books`: Retrieve a list of books with optional filtering, sorting.
  - `GET /api/books/:bookId`: Retrieve a specific book by its ID.
  - `PUT /api/books/:bookId`: Update book details (like available copies).
  - `DELETE /api/books/:bookId`: Delete a book from the database.
  - `POST /api/borrow`: Borrow a book, verifying the availability and updating the inventory.
  - `GET /api/borrow`: View a summary of borrowed books, including total quantity borrowed per book.

---

## Technologies Used

- **Backend Framework**: Express.js
- **TypeScript**: Strongly typed programming language for building scalable applications.
- **MongoDB**: NoSQL database for storing book and borrowing information.
- **Mongoose**: MongoDB Object Data Modeling (ODM) library for working with MongoDB in an easier way.
- **Zod**: TypeScript-first schema validation library for validating data.

---

## Getting Started

### Prerequisites

- **Node.js** and **npm** installed on your machine.
- **MongoDB** setup locally or using a cloud database provider (e.g., MongoDB Atlas).
- A text editor like **VS Code** for editing the project files.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Samira-Shajahan-Borsha/library-management-system-server.git
   ```

2. Navigate to the project directory:

   ```bash
   cd library-management-system-server
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up your environment variables:
   - Create a `.env` file in the root directory.

   Example `.env`:

   ```
   NODE_DEV=development
   PORT=5000
   DATABSE_URL=
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

The application should now be running locally on `http://localhost:5000`.

---

## API Documentation

### Book Management

- **Create Book**  
  `POST /api/books`  
  **Request**:

  ```json
  {
    "title": "The Theory of Everything",
    "author": "Stephen Hawking",
    "genre": "SCIENCE",
    "isbn": "9780553380163",
    "description": "An overview of cosmology and black holes.",
    "copies": 5,
    "available": true
  }
  ```

  **Response**:

  ```json
  {
    "success": true,
    "message": "Book created successfully",
    "data": {
      "_id": "64f123abc4567890def12345",
      "title": "The Theory of Everything",
      "author": "Stephen Hawking",
      "genre": "SCIENCE",
      "isbn": "9780553380163",
      "description": "An overview of cosmology and black holes.",
      "copies": 5,
      "available": true,
      "createdAt": "2024-11-19T10:23:45.123Z",
      "updatedAt": "2024-11-19T10:23:45.123Z"
    }
  }
  ```

- **Get All Books**  
   `GET /api/books`

  Example Query:

  `/api/books?filter=FANTASY&sort=desc&limit=5`

  **Query Parameters**:
  - `filter`: Genre to filter by.
  - `sort`: Sorting order (`asc` or `desc`).
  - `limit`: Number of results to fetch.

  **Response**:

  ```json
  {
  "success": true,
  "message": "Books retrieved successfully",
  "data": [
    {
      "_id": "64f123abc4567890def12345",
      "title": "The Theory of Everything",
      "author": "Stephen Hawking",
      "genre": "SCIENCE",
      "isbn": "9780553380163",
      "description": "An overview of cosmology and black holes.",
      "copies": 5,
      "available": true,
      "createdAt": "2024-11-19T10:23:45.123Z",
      "updatedAt": "2024-11-19T10:23:45.123Z"
    }
    {...}
  ]
  }
  ```

- **Get Book by ID**  
   `GET /api/books/:bookId`  
   **Response**:

  ```json
  {
    "success": true,
    "message": "Book retrieved successfully",
    "data": {
      "_id": "64f123abc4567890def12345",
      "title": "The Theory of Everything",
      "author": "Stephen Hawking",
      "genre": "SCIENCE",
      "isbn": "9780553380163",
      "description": "An overview of cosmology and black holes.",
      "copies": 5,
      "available": true,
      "createdAt": "2024-11-19T10:23:45.123Z",
      "updatedAt": "2024-11-19T10:23:45.123Z"
    }
  }
  ```

- **Update Book**  
  `PUT /api/books/:bookId`  
  **Request**:

  ```json
  {
    "copies": 50
  }
  ```

  **Response**:

  ```json
  {
    "success": true,
    "message": "Book retrieved successfully",
    "data": {
      "_id": "64f123abc4567890def12345",
      "title": "The Theory of Everything",
      "author": "Stephen Hawking",
      "genre": "SCIENCE",
      "isbn": "9780553380163",
      "description": "An overview of cosmology and black holes.",
      "copies": 50,
      "available": true,
      "createdAt": "2024-11-19T10:23:45.123Z",
      "updatedAt": "2024-11-20T08:30:00.000Z"
    }
  }
  ```

- **Delete Book**  
   `DELETE /api/books/:bookId`  
  **Response**:
  ```json
  {
    "success": true,
    "message": "Book deleted successfully",
    "data": null
  }
  ```

### Borrow Management

- **Borrow a Book**  
   `POST /api/borrow`  
   **Request**:

  ```json
  {
    "book": "68a0e51834315c4a9a4660e2",
    "quantity": 1,
    "dueDate": "2025-08-20"
  }
  ```

  **Response**:

  ```json
  {
    "success": true,
    "message": "Book borrowed successfully",
    "data": {
      "book": "68a0e51834315c4a9a4660e2",
      "quantity": 1,
      "dueDate": "2025-08-20T00:00:00.000Z",
      "_id": "68a2601f41d7969942e25805",
      "createdAt": "2025-08-17T23:05:03.514Z",
      "updatedAt": "2025-08-17T23:05:03.514Z"
    }
  }
  ```

- **Borrowed Books Summary**  
   `GET /api/borrow`  
   **Response**:
  ```json
  {
    "success": true,
    "message": "Borrowed books summary retrieved successfully",
    "data": [
      {
        "totalQuantity": 4,
        "book": {
          "title": "Fantasy Adventures",
          "isbn": "978100006"
        }
      },
      {
        "totalQuantity": 2,
        "book": {
          "title": "Non-Fiction Deep Dive",
          "isbn": "978100013"
        }
      }
    ]
  }
  ```

---

## Links

- **GitHub Repository**: [GitHub Link](https://github.com/Samira-Shajahan-Borsha/library-management-system-server)
- **Live Deployment**: [Live Link](https://library-management-system-server-xi.vercel.app/)

---

## Conclusion

This Library Management API provides an efficient way to manage books and borrowing records. It’s built using modern technologies like Express, TypeScript, and MongoDB for robustness, scalability, and easy maintenance.
