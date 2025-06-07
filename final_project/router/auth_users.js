const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if user exists and password matches
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Generate JWT token
    const accessToken = jwt.sign({ username: username }, 'your_jwt_secret_key', { expiresIn: '1h' });

    // Save token and username in session
    req.session.authorization = { accessToken, username };

    return res.status(200).json({ message: "User successfully logged in", accessToken });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review; // review text in query param
  const username = req.session.authorization ? req.session.authorization.username : null;

  if (!username) {
    return res.status(401).json({ message: "User not logged in" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review text is required as query parameter" });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Initialize reviews object if not present
  if (!book.reviews) {
    book.reviews = {};
  }

  // Add or update review for the username
  book.reviews[username] = review;

  return res.status(200).json({ message: `Review for ISBN ${isbn} added/updated successfully`, reviews: book.reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization ? req.session.authorization.username : null;
  
    if (!username) {
      return res.status(401).json({ message: "User not logged in" });
    }
  
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!book.reviews || !book.reviews[username]) {
      return res.status(404).json({ message: "Review by this user not found" });
    }
  
    // Delete the review by the logged-in user
    delete book.reviews[username];
  
    return res.status(200).json({ message: `Review for ISBN ${isbn} deleted successfully`, reviews: book.reviews });
  });

  function getBookByISBNPromise(isbn) {
    axios.get(`https://johnjarrett-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`)
      .then(response => {
        console.log("Book found:");
        console.log(response.data);
      })
      .catch(error => {
        console.error("Error:", error.message);
      });
  }

  function getBooksByAuthorPromise(author) {
    axios.get(`https://johnjarrett-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/${encodeURIComponent(author)}`)
      .then(response => {
        console.log("Books by author:", author);
        console.log(response.data);
      })
      .catch(error => {
        console.error("Error:", error.message);
      });
  }

  function getBooksByTitlePromise(title) {
    axios.get(`https://johnjarrett-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/${encodeURIComponent(title)}`)
      .then(response => {
        console.log("Books with title:", title);
        console.log(response.data);
      })
      .catch(error => {
        console.error("Error:", error.message);
      });
  }
  
  getBookByISBNPromise('1');

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
