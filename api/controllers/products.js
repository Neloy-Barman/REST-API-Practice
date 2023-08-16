const mongoose = require("mongoose");
const Product = require("../models/product");
exports.products_get_all = (req, res, next) => {
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
};

exports.products_create_product = (req, res, next) => {
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
};

exports.products_get_product = (req, res, next) => {
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
};

exports.products_delete_product = (req, res, next) => {
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
};

exports.products_update_product = (req, res, next) => {
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
};