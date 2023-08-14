const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require("../models/user");

router.post("/signup", (req, res, next) => {
    User.find({ email: req.body.email }).exec().then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: "Mail exists"
            });
        } else {
            bcrypt.hash(req.body.password, 10, (error, hash) => {
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
            });
        }
    }).catch();
});


router.delete("/:userId", (req, res, next) => {
    User.deleteOne({ email: req.params.userId }).exec().then(res => {
        res.status(200).json({
            message: "User deleted"
        });
    }).catch(error => {
        res.status(500).json({
            error: error
        });
    });
});

module.exports = router;