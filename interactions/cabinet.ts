import Discord, {
    ColorResolvable,
    MessageEmbed,
    TextInputComponent,
    MessageActionRow,
    Modal, TextChannel, MessageButton
} from "discord.js";
import { SPWorlds } from "spworlds";
import CardsConfig from '../configurations/cards.json';
import AppearanceConfig from '../configurations/appearance.json'
import ChannelsConfig from '../configurations/channels.json'
import mcdata from "mcdata";
import {DBRequest, HTTPRequest} from "../database";

const sp = new SPWorlds(CardsConfig.CARD_ID, CardsConfig.CARD_TOKEN);

export = {
    async execute (client: Discord.Client, interaction: Discord.Interaction): Promise<void> {
        const username = await sp.findUser(interaction.user.id);
        const minecraftUser = await mcdata.playerStatus(username, { renderSize: 2 })

        if (interaction.isButton()) {
            // Обработка запросов в ЛК
            if (interaction.customId === 'lk') {
                const count = await DBRequest(`SELECT count(id) as count FROM \`users\` WHERE uuid='${minecraftUser.uuid}'`)

                // Проверка на наличие аккаунт => авторизация/регистрация
                if((count as any[])[0].count === 0) {
                    const modal = new Modal()
                        .setCustomId('registration_modal')
                        .setTitle('Регистрация')

                    const cardnumber = new TextInputComponent()
                        .setCustomId('registration_cardnumber')
                        .setLabel("Введите номер карты с spworlds.ru")
                        .setStyle('SHORT')
                        .setRequired(true)
                        .setMinLength(5)
                        .setMaxLength(5)

                    const firstActionRow = new MessageActionRow().addComponents(cardnumber);
                    modal.addComponents(firstActionRow as any);
                    await interaction.showModal(modal);
                } else {
                    const response = await DBRequest(`SELECT * FROM \`users\` WHERE \`minecraft_username\` = '${username}'`)
                    const bank_account = (response as any[])[0]

                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('topup')
                                .setLabel('Пополнить счет')
                                .setStyle('SUCCESS'),
                            new MessageButton()
                                .setCustomId('withdraw')
                                .setLabel('Снять со счета')
                                .setStyle('DANGER'),
                            new MessageButton()
                                .setCustomId('takecredit')
                                .setLabel('Взять кредит')
                                .setStyle('PRIMARY'),
                            new MessageButton()
                                .setCustomId('history')
                                .setLabel('История операций')
                                .setStyle('SECONDARY'),
                        );

                    const embed = new MessageEmbed()
                        .setColor(AppearanceConfig.Colors.Default as ColorResolvable)
                        .setTitle('Личный кабинет')
                        .setDescription('Заработок с процентов присылается раз в неделю.')
                        .setThumbnail(minecraftUser.skin.avatar)
                        .setFooter(AppearanceConfig.Tags.GTK, AppearanceConfig.Images.MainLogo)
                        .addFields(
                            { name: 'Никнейм', value: `\`${bank_account.minecraft_username}\``, inline: true },
                            { name: 'Баланс счета', value: `\`${bank_account.balance}\` <:diamond_ore:990969911671136336>`, inline: true },
                            { name: 'Заработано с процентов', value: `\`${0}\` <:diamond_ore:990969911671136336>`, inline: true },
                            { name: 'Текущий тариф', value: `\`${10}%\` годовых.`, inline: true },
                            { name: 'Карта spworlds.ru', value: `\`${bank_account.card_number}\` 💳`, inline: true },
                            { name: 'Активные кредиты', value: `Нет.`},
                        )
                    await interaction.reply({ ephemeral: true, embeds: [embed], components: [row] });
                }

            }

            // Пополнение счета (вызов формы)
            if (interaction.customId === 'topup') {
                const modal = new Modal()
                    .setCustomId('topup_modal')
                    .setTitle('Пополнение счета')

                const value = new TextInputComponent()
                    .setCustomId('topup_value')
                    .setLabel("Введите сумму пополнения (АР)")
                    .setStyle('SHORT')
                    .setRequired(true)
                    .setMinLength(1)
                    .setMaxLength(6)

                const firstActionRow = new MessageActionRow().addComponents(value);
                modal.addComponents(firstActionRow as any);
                await interaction.showModal(modal);
            }

            // Обработка истории операций
            if (interaction.customId === 'history') {
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('transfer_history')
                            .setLabel('История покупок')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('topup_history')
                            .setLabel('История пополнений')
                            .setStyle('SECONDARY')
                            .setDisabled(true),
                        new MessageButton()
                            .setCustomId('withdraw_history')
                            .setLabel('История снятия средств')
                            .setStyle('SECONDARY')
                            .setDisabled(true),
                    );

                await interaction.update({ components: [row] })
            }

            if (interaction.customId.endsWith('_history')) {
                const embed = new MessageEmbed()
                    .setFooter(AppearanceConfig.Tags.Bank, AppearanceConfig.Images.MainLogo)
                    .setThumbnail(minecraftUser.skin.avatar)
                switch (interaction.customId) {
                    case 'transfer_history':
                        const users = await DBRequest(`SELECT * FROM users WHERE uuid = '${minecraftUser.uuid}'`) as any[]
                        const response = await DBRequest(`SELECT * FROM transfer_history WHERE userid = ${users[0].id}`) as any[]
                        let log = ""
                        for (const responseElement of response) {
                            log += `**${responseElement.date}** | **${responseElement.value}** | **${responseElement.reason}**\n\n`
                        }
                        embed.setTitle("История покупок")
                        embed.setDescription(log)
                        break
                    case 'withdraw_history':

                        break
                    case 'topup_history':

                        break
                }
                interaction.message.embeds.splice(1, 0, embed)
                await interaction.update({ embeds: [embed] })
            }
        }

        if (interaction.isModalSubmit()) {
            // Форма регистрации
            if (interaction.customId === 'registration_modal') {
                const cardnumber = interaction.fields.getTextInputValue('registration_cardnumber')
                await DBRequest(`INSERT INTO \`users\` (\`uuid\`, \`minecraft_username\`, \`card_number\`) VALUES ('${minecraftUser.uuid}', '${username}', '${cardnumber}')`)
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('lk')
                            .setLabel('👨‍💼 Войти в Личный кабинет')
                            .setStyle('PRIMARY')
                    )

                const embed = new MessageEmbed()
                    .setColor(AppearanceConfig.Colors.Success as ColorResolvable)
                    .setTitle(`Аккаунт успешно зарегистрирован`)
                    .setFooter(AppearanceConfig.Tags.Bank, AppearanceConfig.Images.MainLogo)
                    .setDescription("Вы можете перейти в личный кабинет")
                await interaction.reply({ ephemeral: true, embeds: [embed], components: [row] });
            }

            // Форма пополнения счета
            if (interaction.customId === 'topup_modal') {
                const value = interaction.fields.getTextInputValue('topup_value')
                const username = await sp.findUser(interaction.user.id);
                const minecraftUser = await mcdata.playerStatus(username, { renderSize: 2 })
                const options = {
                    'method': 'POST',
                    'url': 'https://spworlds.ru/api/public/payment',
                    'headers': {
                        'Authorization': `Bearer ${CardsConfig.CARD_BASE64}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "amount": parseInt(value),
                        "redirectUrl": "https://sp-credit.herokuapp.com/success",
                        "webhookUrl": "https://sp-credit.herokuapp.com/callback", // TODO: Нужно поставить на сервер
                        "data": username
                    })

                };
                const response = await HTTPRequest(options)

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setLabel('Пополнить счет')
                            .setStyle('LINK')
                            .setURL(JSON.parse(response as string).url)
                    )

                const embed1 = new MessageEmbed()
                    .setColor(AppearanceConfig.Colors.Default as ColorResolvable)
                    .setTitle(`Пополнение счета на ${value} АР`)
                    .setFooter(AppearanceConfig.Tags.Bank, AppearanceConfig.Images.MainLogo)
                    .setFields(
                        { name: 'Никнейм', value: `\`${username}\``, inline: true },
                        { name: 'Сумма пополнения', value: `\`${value}\` <:diamond_ore:990969911671136336>`, inline: true },
                    )
                const embed2 = new MessageEmbed()
                    .setColor(AppearanceConfig.Colors.Default as ColorResolvable)
                    .setTitle(`Разрешите уведомления`)
                    .setDescription(`Не забудьте разрешить <@${client.user.id}> присылать вам сообщения, если вы блокировали их до этого.\nВам будут приходить уведомления об операциях, вкладах и доставке.`)
                    .setFooter(AppearanceConfig.Tags.Bank, AppearanceConfig.Images.MainLogo)
                await interaction.reply({ ephemeral: true, embeds: [embed1, embed2], components: [row] });
            }
        }

    }
}
