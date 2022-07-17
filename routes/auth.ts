import express from "express";
import {SPWorlds} from "spworlds";
import BotConfig from '../configurations/bot.json'
import {HTTPRequest} from "../database";

const router = express.Router();

router.get('/callback', async (req, res, next) => {
    const { code } = req.query;
    const response = await HTTPRequest({
        'method': 'POST',
        'url': 'https://discord.com/api/v10/oauth2/token',
        'headers': {
            'Content-Type': ' application/x-www-form-urlencoded'
        },
        formData: {
            client_id: BotConfig.CLIENT_ID,
            client_secret: BotConfig.CLIENT_SECRET,
            grant_type: "authorization_code",
            code: code,
            redirect_uri: "https://gtk-sp.ru/auth/callback"
        }
    }) as any
    res.send(response.body)
});


module.exports = router;