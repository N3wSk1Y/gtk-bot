import express from "express";
const router = express.Router();

router.get('/categories', async (req, res, next) => {
    res.sendFile(__dirname + "/public/panel/categories.html")
});

router.get('/products', async (req, res, next) => {
    res.sendFile(__dirname + "/public/panel/products.html")
});

module.exports = router;