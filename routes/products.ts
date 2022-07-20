import express from "express";
import {DBRequest} from "../database";

const router = express.Router();

router.get('/', async (req, res, next) => {
    const products = await DBRequest("SELECT * FROM `products` ORDER BY category_id")
    res.send(products)
});

router.delete('/', async (req, res, next) => {
    if (!req.query.id) {
        res.send({
            error: "Параметр id указан некорректно"
        })
        return;
    }
    const products = await DBRequest(`SELECT * FROM products WHERE products.id = '${req.query.id}'`) as object[]
    if (products.length === 0) {
        res.send({
            error: "Такого товара не существует"
        })
        return;
    }
    await DBRequest(`DELETE FROM products WHERE id = '${req.query.id}'`)
    res.send({
        notification: "Товар удален"
    })
});

router.post('/', async (req, res, next) => {
    if (!req.query.id && !req.query.name && !req.query.description && !req.query.emoji_id && !req.query.category_id && !req.query.price) {
        res.send({
            error: "Параметр id указан некорректно"
        })
        return;
    }
    await DBRequest(`INSERT INTO products (id, name, description, emoji_id, category_id, price) VALUES ('${req.query.id}', '${req.query.name}', '${req.query.description}', '${req.query.emoji_id}', '${req.query.category_id}', ${req.query.price})`)
    res.send({
        notification: "Товар добавлен"
    })
});

router.put('/', async (req, res, next) => {
    if (req.query.id && (req.query.name || req.query.description || req.query.emoji_id || req.query.category_id || req.query.price)) {
        const products = await DBRequest(`SELECT * FROM products WHERE products.id = '${req.query.id}'`) as object[]
        if (products.length === 0) {
            res.send({
                error: "Такого товара не существует"
            })
            return;
        }
        if (req.query.name)
            await DBRequest(`UPDATE products SET name = '${req.query.name}' WHERE  products.id = '${req.query.id}'`)
        if (req.query.description)
            await DBRequest(`UPDATE products SET description = '${req.query.description}' WHERE  products.id = '${req.query.id}'`)
        if (req.query.emoji_id)
            await DBRequest(`UPDATE products SET emoji_id = '${req.query.emoji_id}' WHERE  products.id = '${req.query.id}'`)
        if (req.query.category_id)
            await DBRequest(`UPDATE products SET category_id = '${req.query.category_id}' WHERE  products.id = '${req.query.id}'`)
        if (req.query.price)
            await DBRequest(`UPDATE products SET price = ${req.query.price} WHERE  products.id = '${req.query.id}'`)

        res.send({
            notification: "Товар обновлен"
        })
    } else {
        res.send({
            error: "Параметр id указан некорректно"
        })
    }
});

router.put('/stock', async (req, res, next) => {
    if (req.query.id && req.query.amount) {
        const products = await DBRequest(`SELECT * FROM products WHERE products.id = '${req.query.id}'`) as any[]
        if (products.length === 0) {
            res.send({
                error: "Такого товара не существует"
            })
            return;
        }
        const currentStock = products[0].stock as number
        if (req.query.name)
            await DBRequest(`UPDATE products SET stock = ${currentStock + parseInt(req.query.amount as string)} WHERE  products.id = '${req.query.id}'`)

        if (currentStock + parseInt(req.query.amount as string) < 1)
            await DBRequest("UPDATE products SET enabled = 0 WHERE  products.id = '${req.query.id}' ")
        else
            await DBRequest("UPDATE products SET enabled = 1 WHERE  products.id = '${req.query.id}' ")

        res.send({
            notification: "Склад обновлен"
        })
    } else {
        res.send({
            error: "Параметры id и amount указаны некорректно"
        })
    }
});

module.exports = router;