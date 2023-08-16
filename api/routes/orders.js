const exprees = require("express");
const checkAuth = require('../middleware/check-auth');
const ordersController = require('../controllers/orders');

const router = exprees.Router();

router.post("/", checkAuth, ordersController.orders_create_order);

router.get("/", checkAuth, ordersController.orders_get_all);

router.get("/:orderId", checkAuth, ordersController.orders_get_order);

router.delete("/:orderId", checkAuth, ordersController.order_delete_order);

module.exports = router;