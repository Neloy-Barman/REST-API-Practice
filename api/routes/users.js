const express = require('express');

const checkAuth = require('../middleware/check-auth');

const usersController = require('../controllers/users');

const router = express.Router();

router.get("/", usersController.users_get_users);

router.post("/signup", usersController.users_signup);

router.post("/login", usersController.users_login);

router.delete("/:userId", checkAuth, usersController.users_delete_user);

module.exports = router;