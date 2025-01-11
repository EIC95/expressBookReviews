const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post('/register', (req, res) => {
  const { username, password } = req.body; 

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "Username already exists. Please choose a different one." });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully." });
});


// Get the book list available in the shop
/*public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 2));
});*/
//promise
public_users.get('/', (req, res) => {
  new Promise((resolve, reject) => {
      resolve(books);
  })
  .then((books) => {
      res.status(200).send(JSON.stringify(books,null,2));
  })
  .catch((error) => {
      res.status(500).json({ message: "Error retrieving books", error });
  });
});


/* Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const { isbn } = req.params; 
  const book = books[isbn]; 
  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 2)); 
  }
  return res.status(404).json({ message: "Book not found." }); 
 });*/
 // Using Promises
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;

  new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
          resolve(book);
      } else {
          reject("Book not found");
      }
  })
  .then((book) => {
      res.status(200).send(JSON.stringify(book, null, 2));
  })
  .catch((error) => {
      res.status(404).json({ message: error });
  });
});
  
/* Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const { author } = req.params; // Retrieve author from request parameters
  const filteredBooks = Object.values(books).filter(book => book.author === author); // Filter books by author
  if (filteredBooks.length > 0) {
    return res.status(200).send(JSON.stringify(filteredBooks, null, 2)); // Pretty-print JSON
  }
  return res.status(404).json({ message: "No books found for the specified author." }); // Handle no matches
});*/
// Using Promises
public_users.get('/author/:author', (req, res) => {
  const { author } = req.params;

  new Promise((resolve, reject) => {
      const booksByAuthor = Object.values(books).filter(book => book.author === author);
      if (booksByAuthor.length > 0) {
          resolve(booksByAuthor);
      } else {
          reject("No books found for the given author");
      }
  })
  .then((booksByAuthor) => {
      res.status(200).send(JSON.stringify(booksByAuthor, null, 2));
  })
  .catch((error) => {
      res.status(404).json({ message: error });
  });
});


/* Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const { title } = req.params; // Retrieve title from request parameters
  const filteredBooks = Object.values(books).filter(book => book.title === title); // Filter books by title
  if (filteredBooks.length > 0) {
    return res.status(200).send(JSON.stringify(filteredBooks, null, 2)); // Pretty-print JSON
  }
  return res.status(404).json({ message: "No books found with the specified title." }); // Handle no matches
});*/
public_users.get('/title/:title', (req, res) => {
  const { title } = req.params;

  new Promise((resolve, reject) => {
      const bookByTitle = Object.values(books).find(book => book.title === title);
      if (bookByTitle) {
          resolve(bookByTitle);
      } else {
          reject("No book found with the given title");
      }
  })
  .then((bookByTitle) => {
      res.status(200).send(JSON.stringify(bookByTitle, null, 2));
  })
  .catch((error) => {
      res.status(404).json({ message: error });
  });
});


//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params; 
  const book = books[isbn]; 
  if (book && book.reviews) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 2)); 
  }
  return res.status(404).json({ message: "No reviews found for the specified ISBN." });
});


module.exports.general = public_users;
