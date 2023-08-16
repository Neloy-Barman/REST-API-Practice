const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require("../models/user");

exports.users_signup = (req, res, next) => {
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
};

exports.users_get_users = (req, res, next) => {
    User.find().exec().then(result => {
        res.status(200).json({
            users: result
        });
    }).catch(error => {
        error: error
    });
};

exports.users_login = (req, res, next) => {
    User.find({ email: req.body.email }).exec().then(user => {
        if (user.length < 1) {
            res.status(404).json({
                message: "Auth failed!"
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: "Auth failed!"
                });
            }
            if (result) {
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id
                }, 'secret', {
                    expiresIn: "1h",
                });
                return res.status(200).json({
                    message: "Auth successful",
                    token: token
                });
            }
            res.status(401).json({
                message: "Auth failed",
                token: token,
            });
        })
    }).catch(error => {
        res.status(500).json({
            error: error
        });
    });
};

exports.users_delete_user = (req, res, next) => {
    User.deleteOne({ email: req.params.userId }).exec().then(res => {
        res.status(200).json({
            message: "User deleted"
        });
    }).catch(error => {
        res.status(500).json({
            error: error
        });
    });
};