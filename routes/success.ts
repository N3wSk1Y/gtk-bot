import express from "express";
const router = express.Router();

router.get('/success', function(req, res, next) {
    res.send("Оплата успешно проведена!");
});

router.post('/callback', function(req, res, next) {
    res.send(req.body);
    console.log(req.body)
    console.log(req.headers)
});

module.exports = router;