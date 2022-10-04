import Discord, {
    MessageEmbed,
    MessageActionRow,
    MessageButton, ColorResolvable
} from "discord.js";
import AppearanceConfig from '../configurations/appearance.json'
import CardsConfig from "../configurations/cards.json";
import {DBRequest, HTTPRequest} from "../database";
import {returnTotal} from "../bank_handling";
import {SPWorlds} from "spworlds";

const bankCard = new SPWorlds(CardsConfig.CARD_ID, CardsConfig.CARD_TOKEN);

export = {
    async execute(client: Discord.Client, interaction: Discord.Interaction): Promise<void> {
        if (interaction.isButton()) {
            if (interaction.customId === 'accept_order') {
                const orderAuthor = await client.users.fetch(interaction.message.embeds[0].fields[1].value.replace('**`', '').replace('`**', ''))
                interaction.message.embeds[0].color = AppearanceConfig.Colors.Warning as any
                (interaction.message.embeds[0] as MessageEmbed).addFields(
                    { name: "**Курьер**:", value: `<@${interaction.user.id}>` },
                )

                const embed = new MessageEmbed()
                    .setTitle("Ваш заказ в обработке")
                    .addField("**Курьер:**", `<@${interaction.user.id}>`)
                    .setColor(AppearanceConfig.Colors.Warning as ColorResolvable)
                    .setFooter(AppearanceConfig.Tags.iMarket, AppearanceConfig.Images.MainLogo)

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('finish_order')
                            .setLabel('Завершить заказ')
                            .setStyle('SUCCESS'),
                    )

                await orderAuthor.send({ embeds: [embed] })
                await interaction.update({ content: `<@${interaction.user.id}>`, embeds: interaction.message.embeds, components: [row] })
            }

            if (interaction.customId === 'finish_order') {
                const deliverId = interaction.message.embeds[0].fields[4].value.replace('<@', '').replace('>', '')
                const total = parseInt(interaction.message.embeds[0].fields[0].value.slice(0, interaction.message.embeds[0].fields[0].value.indexOf("<")-1))
                if (interaction.user.id !== deliverId) {
                    const embed = new MessageEmbed()
                        .setTitle("Ошибка")
                        .setDescription(`Данный заказ уже в обработке курьером <@${deliverId}>`)
                        .setColor(AppearanceConfig.Colors.Error as ColorResolvable)
                        .setFooter(AppearanceConfig.Tags.iMarket, AppearanceConfig.Images.MainLogo)
                    await interaction.reply({ ephemeral: true, embeds: [embed]})
                    return;
                }

                const orderAuthor = await client.users.fetch(interaction.message.embeds[0].fields[1].value.replace('**`', '').replace('`**', ''))
                interaction.message.embeds[0].color = AppearanceConfig.Colors.Success as any

                const embed = new MessageEmbed()
                    .setTitle("Ваш заказ выполнен!")
                    .setDescription("Надеемся, вам все понравилось. Вы можете оставить свое пожелание или отзыв о нашем сервисе 😊")
                    .addField("**Вас обслуживал курьер:**", `<@${interaction.user.id}>`)
                    .setColor(AppearanceConfig.Colors.Success as ColorResolvable)
                    .setFooter(AppearanceConfig.Tags.iMarket, AppearanceConfig.Images.MainLogo)

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel('Оставить отзыв')
                            .setURL('https://discord.com/channels/990684607861116959/992504305527570442')
                            .setStyle('LINK'),
                    )
                const options = {
                    'method': 'POST',
                    'url': 'https://spworlds.ru/api/public/transactions',
                    'headers': {
                        'Authorization': `Bearer ${CardsConfig.CARD_BASE64}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "receiver": 22555,
                        "amount": total,
                        "comment": `Выполнение заказа iMarket`
                    })

                };
                await HTTPRequest(options)
                    .catch(err => {
                        console.log(err)
                    })

                let referalCashback = 0
                if (total >= 32)
                    referalCashback = 3

                try {
                    const username = await bankCard.findUser(`${orderAuthor.id}`)
                    const response = await DBRequest(`SELECT * from users WHERE minecraft_username = '${username}'`) as User[]
                    console.log(response[0].referal)
                    const referal = await DBRequest(`SELECT * FROM users WHERE minecraft_username = '${response[0].referal}'`) as User[]
                    await DBRequest(`UPDATE users SET balance = ${referal[0].balance + referalCashback} WHERE minecraft_username = '${referal[0].minecraft_username}'`)
                } catch (e) {
                    console.log(e)
                }
                await orderAuthor.send({ embeds: [embed], components: [row] })
                await interaction.update({ content: null, embeds: interaction.message.embeds, components: [] })
            }

            if (interaction.customId === 'outofstock_order') {
                const orderAuthor = await client.users.fetch(interaction.message.embeds[0].fields[1].value.replace('**`', '').replace('`**', ''))
                const total = parseInt(interaction.message.embeds[0].fields[0].value.slice(0, interaction.message.embeds[0].fields[0].value.indexOf("<")-1))
                interaction.message.embeds[0].color = AppearanceConfig.Colors.Error as any
                const embed = new MessageEmbed()
                    .setTitle("К сожалению, вашего товара нет на складе")
                    .setDescription("Приносим вам глубочайшие извинения за предоставленные неудобства:relaxed:\nЕсли у вас есть вопросы, обратитесь в канал <#997181105109213244>.\n\n**Средства были возвращены на ваш счет iMarket.**")
                    .setColor(AppearanceConfig.Colors.HighWarning as ColorResolvable)
                    .setFooter(AppearanceConfig.Tags.iMarket, AppearanceConfig.Images.MainLogo)
                const username = await bankCard.findUser(orderAuthor.id.toString())
                const users = await DBRequest(`SELECT * FROM users WHERE minecraft_username = '${username}'`) as User[]
                await returnTotal(users[0].id , total)
                await orderAuthor.send({ embeds: [embed], components: [] })
                await interaction.update({ content: null, embeds: interaction.message.embeds, components: [] })
            }
        }
    }
}