const express = require("express");
const mongoose = require("mongoose");
// multer is used to parse form-data type    
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');

// multer will store all the incoming files
// const upload = multer({ dest: "/uploads/" });

// We want to define how we store the file and want to make sure to store certain types of file.
// Implementing storage strategy
// It's a more detailed way to store the file.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // In callback, we want to pass the potential error and the path where to be stored. 
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});


const fileFilter = (req, file, cb) => {
    // To reject or accept the incoming file.
    // We will be accessing file information to keep or discard

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        // Accept
        cb(null, true);
    } else {
        // Rejection
        cb(new Error('Error occured'), false);
    }

};
// multer will store all the incoming files
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 5
        // Limiting the file size not to accept than this.
    },
    fileFilter: fileFilter
});

const Product = require("../models/product");

const router = express.Router();

// We can pass as much as handlers we want through the request methods.
// upload.single is a handler, that means we will get one file only. 
router.post("/", checkAuth, upload.single('productImage'), (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then(response => {
        res.status(200).json({
            message: "Product added",
            product: {
                id: product._id,
                title: product.title,
                price: product.price,
                productImage: product.productImage
            },
            request: {
                type: "GET",
                url: "http://localhost:3000/products/" + product._id
            }
        });
    }).catch(error => {
        res.status(404).json({
            error: error.message
        });
    });
});


router.get("/", (req, res, next) => {
    Product.find().select("title price _id productImage").exec().then(response => {
        res.status(200).json({
            message: "Products fetched",
            count: response.length,
            products: response
        });
    }).catch(error => {
        res.status(404).json({
            error: error.message
        });
    });
});


router.get("/:productId", checkAuth, (req, res, next) => {
    const id = req.params.productId;
    Product.findById({ _id: id }).select("_id title price").exec().then(response => {
        res.status(200).json({
            message: "Product fetched",
            product_details: response,
            request: {
                type: "GET",
                url: "http://localhost:3000/products/"
            }
        });
    }).catch(error => {
        res.status(404).json({
            error: error.message
        });
    });
});

router.patch("/:productId", checkAuth, (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({ _id: id }, { $set: updateOps }).exec().then(response => {
        res.status(200).json({
            message: "Product updated",
            product_details: response,
            request: {
                type: "GET",
                url: "http://localhost:3000/products/"
            }
        });
    }).catch(error => {
        res.status(404).json({
            error: error.message
        });
    });
});

router.delete("/:productId", checkAuth, (req, res, next) => {
    const id = req.params.productId;
    Product.deleteOne({ _id: id },).exec().then(response => {
        res.status(200).json({
            message: "Product Deleted",
            request: {
                type: "GET",
                url: "http://localhost:3000/products/"
            }
        })
    }).catch(error => {
        res.status(404).json({
            message: error.message
        });
    });
});


module.exports = router;