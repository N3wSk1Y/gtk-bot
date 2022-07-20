import express from "express";
const router = express.Router();

router.get('/', async (req, res, next) => {
    res.sendFile(__dirname + "/public/stock.html")
});

module.exports = router;