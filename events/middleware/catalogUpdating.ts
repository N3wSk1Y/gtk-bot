import {
    Client, ColorResolvable, MessageEmbed, TextChannel,
} from "discord.js";
import {DBRequest} from "../../database";
import AppearanceConfig from "../../configurations/appearance.json"
import ChannelsConfig from "../../configurations/channels.json"
import crypto from 'crypto';


export async function SendCatalog (client: Client) {
    const categories = await DBRequest("SELECT * FROM categories") as any[]
    let embeds = []

    const embedMarketMenu = new MessageEmbed()
        .setColor(AppearanceConfig.Colors.Default as ColorResolvable)
        .setTitle(AppearanceConfig.Tags.iMarket)
        .setImage(AppearanceConfig.Images.iMarket[crypto.randomInt(0, AppearanceConfig.Images.iMarket.length)])
        .setFooter("© Все права защищены.", AppearanceConfig.Images.MainLogo)
    embeds.push(embedMarketMenu)
    for (const category of categories) {
        const embed = new MessageEmbed()
            .setTitle(category.name)
            .setColor(AppearanceConfig.Colors.Default as ColorResolvable)
            .setFooter(AppearanceConfig.Tags.iMarket, AppearanceConfig.Images.MainLogo)
            .setDescription(category.description + "\n-----------------------------------------\n\n")
        const products = await DBRequest(`SELECT * FROM products WHERE category_name = '${category.id}'`) as any[]
        for (const product of products) {
            if (product.enabled == 1)
                embed.description += `${client.emojis.cache.find(emoji => emoji.id === product.emoji_id)} ${product.name} - ${product.price} АР\n`
            else
                embed.description += `~~${client.emojis.cache.find(emoji => emoji.id === product.emoji_id)} ${product.name} - ${product.price} АР~~\n`
        }
        embeds.push(embed)
    }
    const channel = await client.channels.cache.get(ChannelsConfig.CATALOG_CHANNEL) as TextChannel
    await channel.bulkDelete(15)
    await channel.send({ embeds: embeds })
}