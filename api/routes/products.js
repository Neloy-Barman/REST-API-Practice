const express = require("express");

// multer is used to parse form-data type    
const multer = require('multer');

const productsController = require('../controllers/products');

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

const router = express.Router();

// We can pass as much as handlers we want through the request methods.
// upload.single is a handler, that means we will get one file only. 
router.post("/", checkAuth, upload.single('productImage'), productsController.products_create_product);

router.get("/", productsController.products_get_all);

router.get("/:productId", checkAuth, productsController.products_get_product);

router.patch("/:productId", checkAuth, productsController.products_update_product);

router.delete("/:productId", checkAuth, productsController.products_delete_product);


module.exports = router;