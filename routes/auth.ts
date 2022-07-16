import express from "express";
import {SPWorlds} from "spworlds";
import CardsConfig from "../configurations/cards.json";

const router = express.Router();

router.get('/callback', function(req, res, next) {
    res.send({
        body: req.body,
        headers: req.headers
    });
});


module.exports = router;