const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose")
const bodyparser = require("body-parser");


const productsRouter = require("./api/routes/products");
const ordersRouter = require("./api/routes/orders");
const userRouter = require("./api/routes/users");

mongoose.connect("mongodb+srv://nel:nel@cluster0.icsmgmt.mongodb.net/");

const app = express();

app.use(morgan("dev"));

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Origin, Access, Authorization");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', "GET, POST, PUT, PATCH, DELETE");
        res.status(200).json({});
    }
    next();
});

app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
app.use("/users", userRouter);

// app.use((req, res, next) => {
//     res.status(200).json({
//         message: "It works"
//     })
// });

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message
        }
    });
});


module.exports = app;