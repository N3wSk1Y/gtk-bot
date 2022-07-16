import express from "express";
import {DBRequest} from "../database";

const router = express.Router();

router.get('/', async (req, res, next) => {
    const categories = await DBRequest("SELECT * FROM `categories`")
    res.send(categories)
});

router.delete('/', async (req, res, next) => {
    if (!req.query.id) {
        res.send({
            error: "Параметр id указан некорректно"
        })
        return;
    }
    const category = await DBRequest(`SELECT * FROM categories WHERE categories.id = '${req.query.id}'`) as object[]
    if (category.length === 0) {
        res.send({
            error: "Такой категории не существует"
        })
        return;
    }
    await DBRequest(`DELETE FROM categories WHERE id = '${req.query.id}'`)
    res.send({
        notification: "Категория удалена"
    })
});

router.post('/', async (req, res, next) => {
    if (!req.query.id && !req.query.name && !req.query.description && !req.query.emoji_id) {
        res.send({
            error: "Параметр id указан некорректно"
        })
        return;
    }
    await DBRequest(`INSERT INTO categories (id, name, description, emoji_id) VALUES ('${req.query.id}', '${req.query.name}', '${req.query.description}', '${req.query.emoji_id}')`)
    res.send({
        notification: "Категория добавлена"
    })
});

router.put('/', async (req, res, next) => {
    if (req.query.id && (req.query.name || req.query.description || req.query.emoji_id)) {
        const category = await DBRequest(`SELECT * FROM categories WHERE categories.id = '${req.query.userid}'`) as object[]
        if (category.length === 0) {
            res.send({
                error: "Такой категории не существует"
            })
            return;
        }
        if (req.query.name)
            await DBRequest(`UPDATE categories SET name = '${req.query.name}' WHERE  categories.id = '${req.query.id}'`)
        if (req.query.description)
            await DBRequest(`UPDATE categories SET id = '${req.query.id}' WHERE  categories.id = '${req.query.id}'`)
        if (req.query.emoji_id)
            await DBRequest(`UPDATE categories SET emoji_id = '${req.query.emoji_id}' WHERE  categories.id = '${req.query.id}'`)

        res.send({
            notification: "Категория обновлена"
        })
    } else {
        res.send({
            error: "Параметр id указан некорректно"
        })
    }
});

module.exports = router;