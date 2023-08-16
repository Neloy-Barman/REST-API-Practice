const exprees = require("express");
const mongoose = require("mongoose");
const Order = require("../models/order");
const Product = require("../models/product");
const checkAuth = require('../middleware/check-auth');
const router = exprees.Router();

router.post("/", checkAuth, (req, res, next) => {
    Product.findById(req.body.productId).then(product => {
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            product: req.body.productId,
            quantity: req.body.quantity
        });
        return order.save();
    }).then(result => {
        res.status(201).json({
            message: "Order added",
            order: result,
            request: {
                type: "GET",
                url: "http://localhost:3000/orders/" + result._id
            }
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message
        })
    });
});

router.get("/", checkAuth, (req, res, next) => {
    Order.find()
        .select("_id product quantity")
        .populate("product", "_id title") // Marging another table information with one
        .exec().then(result => {
            res.status(200).json({
                count: result.length,
                orders: result.map(item => {
                    return {
                        _id: item._id,
                        product: item.product,
                        quantity: item.quantity,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/orders/" + item._id
                        }
                    };
                }),
            });
        }).catch(error => {
            res.status(500).json({
                message: error.message
            })
        });
});


router.get("/:orderId", checkAuth, (req, res, next) => {
    const id = req.params.orderId;
    Order.findById({ _id: id })
        .select("_id product quantity")
        .populate("product") // Marging another table information with one
        .exec().then(result => {
            if (!result) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }
            res.status(200).json({
                message: "Order fetched",
                order: result,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders"
                }
            });
        }).catch(error => {
            res.status(500).json({
                message: error.message
            })
        });
});

router.delete("/:orderId", checkAuth, (req, res, next) => {
    Order.deleteOne({ _id: req.params.orderId }).exec().then(result => {
        res.status(200).json({
            message: "Order deleted",
            request: {
                type: "POST",
                url: "http://localhost:3000/orders",
                body: {
                    productId: "ID",
                    quantity: "Number"
                }
            }
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message
        })
    });
});


module.exports = router;