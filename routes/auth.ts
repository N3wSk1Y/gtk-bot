import express from "express";
import {SPWorlds} from "spworlds";
import BotConfig from '../configurations/bot.json'
import {HTTPRequest} from "../database";
import mcdata from "mcdata";
import CardsConfig from "../configurations/cards.json";

const router = express.Router();
const sp = new SPWorlds(CardsConfig.CARD_ID, CardsConfig.CARD_TOKEN);

router.get('/callback', async (req, res, next) => {
    const { code } = req.query;
    if (!code)
        return
    const tokenResponse = await HTTPRequest({
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
    const dataResponse = await HTTPRequest({
        'method': 'GET',
        'url': 'https://discord.com/api/users/@me',
        'headers': {
            authorization: `Bearer ${JSON.parse(tokenResponse).access_token}`
        }
    }) as any
    let data = JSON.parse(dataResponse)
    const username = await sp.findUser(data.id);
    if (!username) {
        data = { ...data, localdata: { permissions: 0 }}
    } else {
        const avatar = await mcdata.playerStatus(username, {renderSize: 2}).skin.avatar
        data = { ...data, localdata: { permissions: 1, avatar: avatar, minecraft_username: username }}
    }
    res.send(data)
});

router.get('/login', async (req, res, next) => {
    const { access_token } = req.query;
    const dataResponse = await HTTPRequest({
        'method': 'GET',
        'url': 'https://discord.com/api/users/@me',
        'headers': {
            authorization: `Bearer ${access_token}`
        }
    }) as any
    let data = JSON.parse(dataResponse)
    const username = await sp.findUser(data.id);
    if (!username) {
        data = { ...data, permissions: 0}
    } else {
        const avatar = await mcdata.playerStatus(username, {renderSize: 2}).avatar
        data = { ...data, localdata: { permissions: 1, avatar: avatar, minecraft_username: username }}
    }
    res.send(data)
});

router.post('/refresh', async (req, res, next) => {
    const { refresh_token } = req.query;
    const tokenResponse = await HTTPRequest({
        'method': 'POST',
        'url': 'https://discord.com/api/v10/oauth2/token',
        'headers': {
            'Content-Type': ' application/x-www-form-urlencoded'
        },
        formData: {
            client_id: BotConfig.CLIENT_ID,
            client_secret: BotConfig.CLIENT_SECRET,
            grant_type: "refresh_token",
            code: refresh_token
        }
    }) as any
    const tokenData = JSON.parse(tokenResponse)
    const dataResponse = await HTTPRequest({
        'method': 'GET',
        'url': 'https://discord.com/api/users/@me',
        'headers': {
            authorization: `${tokenData.token_type} ${tokenData.access_token}`
    }
    }) as any
    res.send(JSON.parse(dataResponse))
});


module.exports = router;