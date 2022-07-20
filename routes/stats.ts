import express from "express";
import {DBRequest} from "../database";

const router = express.Router();

router.get('/', async (req, res, next) => {
    const products = await DBRequest("SELECT * FROM stats")
    res.send(products)
});

module.exports = router;