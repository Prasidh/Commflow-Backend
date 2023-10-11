const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const userRoutes = require("./routes/UserRoutes");
const EmailRoutes = require("./routes/EmailRoutes");
const SubscriptionRoutes = require('./routes/SubscriptionRoutes');
const SubscribersRoutes = require('./routes/SubscribersRoutes');
const session = require('express-session');
const cors = require("cors");
const PORT = process.env.PORT_NUMBER;
const APP_SECRET_KEY = process.env.APP_SECRET_KEY;
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.json());
app.use(session({ secret: APP_SECRET_KEY, resave: true, saveUninitialized: true }));

let corsOptions = {
    origin: "*"
};
app.use(cors(corsOptions));
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("connected to Database");
})
.catch((error) => {
    console.log(error);
})

//Routes
app.use("/api/users", userRoutes);
app.use("/api/emails", EmailRoutes);
app.use("/api/subscriptions", SubscriptionRoutes);
app.use("/api/subscribers", SubscribersRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
