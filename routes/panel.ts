import express from "express";
const router = express.Router();

router.get('/categories', async (req, res, next) => {
    res.sendFile(__dirname + "/public/panel/categories.html")
});

module.exports = router;