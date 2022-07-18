import express from "express";
import {SPWorlds} from "spworlds";
import CardsConfig from "../configurations/cards.json";
import Discord, {Client, ColorResolvable, Intents, MessageEmbed, UserResolvable} from "discord.js";
import AppearanceConfig from "../configurations/appearance.json";
import BotConfig from '../configurations/bot.json'
import mcdata from "mcdata";
import {DBRequest} from "../database";
import {topupBalance} from "../bank_handling";

const router = express.Router();
const sp = new SPWorlds(CardsConfig.CARD_ID, CardsConfig.CARD_TOKEN);
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_MEMBERS
    ]
});
client.login(BotConfig.BOT_TOKEN)
    .catch((error) => {
        console.error("Ошибка при авторизации бота:\n" + error);
    })

router.get('/success', async (req, res, next) => {
    res.sendFile(__dirname + "/public/success.html")
});

router.post('/callback', async (req, res, next) => {
    if (req.hostname === 'gtk-sp.ru') {
        return next();
    }

    const user = await client.users.fetch(req.body.data)
    const minecraftUser = await mcdata.playerStatus(req.body.payer, { renderSize: 2 })

    const account = (await DBRequest(`SELECT * FROM users WHERE minecraft_username = '${req.body.payer}'`) as any[])[0]
    const balance = await topupBalance(account.id, req.body.amount, "Пополнение счет в ГлорианБанке")

    const embed = new MessageEmbed()
        .setColor(AppearanceConfig.Colors.Success as ColorResolvable)
        .setTitle(`Пополнение счета`)
        .setDescription(`**Ваш счет успешно пополнен на \`${req.body.amount}\` <:diamond_ore:990969911671136336>**`)
        .setThumbnail(minecraftUser.skin.avatar)
        .addField("**Текущий баланс:**", `**\`${balance}\`** <:diamond_ore:990969911671136336>`)
        .setFooter(AppearanceConfig.Tags.Bank, AppearanceConfig.Images.MainLogo)
    await user.send({embeds:[embed]})

    // const embed = new MessageEmbed()
    //     .setColor(AppearanceConfig.Colors.Error as ColorResolvable)
    //     .setTitle(`Ошибка пополнения счета`)
    //     .setDescription(`**Произошла ошибка при пополнении счета. Если вы считаете, что все сделали правильно, обратитесь в #поддержка и приложите этот скриншот.**`)
    //     .setFooter(AppearanceConfig.Tags.Bank, AppearanceConfig.Images.MainLogo)
    // await user.send({embeds:[embed]})

});

module.exports = router;