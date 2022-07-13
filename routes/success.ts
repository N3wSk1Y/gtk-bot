import express from "express";
import {SPWorlds} from "spworlds";
import CardsConfig from "../configurations/cards.json";
import {client} from "../index";
import {ColorResolvable, MessageEmbed, UserResolvable} from "discord.js";
import AppearanceConfig from "../configurations/appearance.json";
import mcdata from "mcdata";
import {DBRequest} from "../database";
import {topupBalance} from "../bank_handling";

const router = express.Router();
const sp = new SPWorlds(CardsConfig.CARD_ID, CardsConfig.CARD_TOKEN);

router.get('/success', function(req, res, next) {
    res.send("Оплата успешно проведена!\nМожете вернуться в Discord");
});

router.post('/callback', async (req, res, next) => {
    if (req.hostname === 'gtk-sp.ru') {
        return next();
    }
    // const isValid = sp.verifyHash(req.body, req.headers['X-Body-Hash'] as any)
    const isValid = true

    // const user = await client.users.fetch(parseInt(req.body.data) as any)
    const user = await client.users.fetch(332149563831877632 as unknown as UserResolvable)
    console.log(user.username)
    const minecraftUser = await mcdata.playerStatus(req.body.payer, { renderSize: 2 })

    if (isValid) {
        const account = (await DBRequest(`SELECT * FROM users WHERE minecraft_username = '${req.body.payer}'`) as any[])[0]
        const balance = await topupBalance(account.id, req.body.amount, "Пополнение счет в ГлорианБанке")

        const embed = new MessageEmbed()
            .setColor(AppearanceConfig.Colors.Success as ColorResolvable)
            .setTitle(`Пополнение счета`)
            .setDescription(`**Ваш счет успешно пополнен на ${req.body.amount} <:diamond_ore:990969911671136336>**`)
            .setThumbnail(minecraftUser.skin.avatar)
            .addField("**Текущий баланс:**", `${balance} <:diamond_ore:990969911671136336>`)
            .setFooter(AppearanceConfig.Tags.Bank, AppearanceConfig.Images.MainLogo)
        await user.send({embeds:[embed]})
    } else {
        const embed = new MessageEmbed()
            .setColor(AppearanceConfig.Colors.Error as ColorResolvable)
            .setTitle(`Ошибка пополнения счета`)
            .setDescription(`**Произошла ошибка при пополнении счета. Если вы считаете, что все сделали правильно, обратитесь в #поддержка и приложите этот скриншот.**`)
            .setFooter(AppearanceConfig.Tags.Bank, AppearanceConfig.Images.MainLogo)
        await user.send({embeds:[embed]})
    }
});

module.exports = router;