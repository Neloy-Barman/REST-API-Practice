const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // Creating relation with the Product database
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    // If even nothing added, the quantity will be 1.
    quantity: { type: Number, default: 1, }
});

module.exports = mongoose.model("Order", orderSchema);