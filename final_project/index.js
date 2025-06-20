const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if session has an authorization object with accessToken
    if (!req.session.authorization) {
        return res.status(403).json({ message: "User not logged in" });
    }

    const accessToken = req.session.authorization.accessToken;

    // Verify JWT token using the same secret used during login
    jwt.verify(accessToken, 'access', (err, user) => {
        if (err) {
            return res.status(403).json({ message: "User not authenticated" });
        }

        // Optional: attach user data to request
        req.user = user;
        next(); // Allow access to route
    });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
