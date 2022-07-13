import express from "express";
import {SPWorlds} from "spworlds";
import CardsConfig from "../configurations/cards.json";
import {client} from "../index";
import {ColorResolvable, MessageEmbed} from "discord.js";
import AppearanceConfig from "../configurations/appearance.json";
import mcdata from "mcdata";
import {DBRequest} from "../database";
import {topupBalance} from "../bank_handling";

const router = express.Router();
const sp = new SPWorlds(CardsConfig.CARD_ID, CardsConfig.CARD_TOKEN);

router.get('/success', function(req, res, next) {
    res.send("Оплата успешно проведена!");
});

router.post('/callback', async (req, res, next) => {
    if (req.hostname === 'gtk-sp.ru') {
        return next();
    }
    const isValid = sp.verifyHash(req.body, req.headers['X-Body-Hash'] as any)
    // @ts-ignore
    const user = await client.user.fetch(parseInt(req.body.data))
    const minecraftUser = await mcdata.playerStatus(req.body.payer, { renderSize: 2 })
    const account = (await DBRequest(`SELECT * FROM users WHERE minecraft_username = '${req.body.payer}'`) as any[])[0]
    const balance = await topupBalance(account.id, req.body.amount, "Пополнение счет в ГлорианБанке")
    if (isValid) {
        const embed = new MessageEmbed()
            .setColor(AppearanceConfig.Colors.Default as ColorResolvable)
            .setTitle(`Пополнение счета`)
            .setDescription(`**Ваш счет успешно пополнен на ${req.body.amount} <:diamond_ore:990969911671136336>**`)
            .setThumbnail(minecraftUser.skin.avatar)
            .addField("**Текущий баланс:**", `${balance} <:diamond_ore:990969911671136336>`)
            .setFooter(AppearanceConfig.Tags.Bank, AppearanceConfig.Images.MainLogo)
        await user.send({embeds:[embed]})
    } else {

    }
});

module.exports = router;