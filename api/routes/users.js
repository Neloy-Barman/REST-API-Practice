const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
    const user = User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: bcrypt.hash(req.body.password, 10, (error, hash) => {
            if (error) {
                return res.status(500).json({
                    error: error
                });
            } else {
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash
                });
                user.save().then(result => {
                    res.status(201).json({
                        message: "User created"
                    });
                }).catch(error => {
                    res.status(500).json({
                        error: error
                    });
                });
            }
        })
    });
});


module.exports = router;