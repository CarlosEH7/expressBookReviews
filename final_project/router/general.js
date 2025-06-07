const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if user already exists
  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  // Add new user to the users array
  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully" });
});



// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book){
    res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author; // get author from URL param
    const booksArray = Object.values(books); // array of all books
  
    // Filter books with matching author (case-insensitive)
    const booksByAuthor = booksArray.filter(book => book.author.toLowerCase() === author.toLowerCase());
  
    if (booksByAuthor.length > 0) {
      res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
    } else {
      res.status(404).json({ message: "No books found by this author" });
    }
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title; // get title from URL param
  const booksArray = Object.values(books); // array of all books

  // Filter books with matching author (case-insensitive)
  const booksByTitle = booksArray.filter(book => book.title.toLowerCase() === title.toLowerCase());

  if (booksByTitle.length > 0) {
    res.status(200).send(JSON.stringify(booksByTitle, null, 4));
  } else {
    res.status(404).json({ message: "No books found by this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if(book){
    res.status(200).json(book.reviews || {});
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

// Wrap your logic in a Promise-returning function
const getBooksAsync = () => {
    return new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject("No books found");
      }
    });
  };
  
  public_users.get('/', async (req, res) => {
    try {
      const booksList = await getBooksAsync();
      res.status(200).send(JSON.stringify(booksList, null, 4));
    } catch (err) {
      res.status(500).json({ message: err });
    }
  });
  

module.exports.general = public_users;
