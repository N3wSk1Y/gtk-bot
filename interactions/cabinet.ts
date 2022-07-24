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
import {withdrawBalance} from "../bank_handling";

const bankCard = new SPWorlds(CardsConfig.CARD_ID, CardsConfig.CARD_TOKEN);

export = {
    async execute (client: Discord.Client, interaction: Discord.Interaction): Promise<void> {
        const username = await bankCard.findUser(interaction.user.id);
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

                    const referal = new TextInputComponent()
                        .setCustomId('registration_referal')
                        .setLabel("Введите пользователя, который пригласил вас")
                        .setStyle('SHORT')
                        .setPlaceholder("Например: Spagetik")
                        .setRequired(false)


                    const firstActionRow = new MessageActionRow().addComponents(cardnumber);
                    const secondActionRow = new MessageActionRow().addComponents(referal);
                    modal.addComponents(firstActionRow as any, secondActionRow as any);
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
                                .setCustomId('history')
                                .setLabel('История операций')
                                .setStyle('PRIMARY'),
                            new MessageButton()
                                .setCustomId('settings')
                                .setLabel('Настройки')
                                .setStyle('SECONDARY'),
                        );

                    const embed = new MessageEmbed()
                        .setColor(AppearanceConfig.Colors.Default as ColorResolvable)
                        .setTitle('Личный кабинет')
                        .setDescription('Кабинет клиента ГТК')
                        .setThumbnail(minecraftUser.skin.avatar)
                        .setFooter(AppearanceConfig.Tags.Bank, AppearanceConfig.Images.MainLogo)
                        .addFields(
                            { name: 'Никнейм', value: `\`${bank_account.minecraft_username}\``, inline: true },
                            { name: 'Баланс счета', value: `\`${bank_account.balance}\` <:diamond_ore:990969911671136336>`, inline: true },
                            { name: 'Карта spworlds.ru', value: `\`${bank_account.card_number}\` 💳`, inline: true },
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

            // Обработка истории
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
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('withdraw_history')
                            .setLabel('История снятия средств')
                            .setStyle('SECONDARY')
                    );

                await interaction.reply({ ephemeral: true, components: [row] })
            }

            // Обработка настроек
            if (interaction.customId === 'settings') {
                const response = await DBRequest(`SELECT * FROM users WHERE minecraft_username = '${username}'`) as any[]
                const embed = new MessageEmbed()
                    .setTitle(`Настройки ${username}`)
                    .setColor(AppearanceConfig.Colors.Default as ColorResolvable)
                    .setFooter(AppearanceConfig.Tags.GTK, AppearanceConfig.Images.MainLogo)
                    .addField("Карта:", `${response[0].card_number} 💳`)
                    .addField("Реферал:", response[0].referal ? response[0].referal : "Отсутствует")
                    .addField("Адрес по умолчанию:", response[0].address ? response[0].address : "Отсутствует")

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('cardnumber-settings')
                            .setLabel('Изменить номер карты')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('referal-settings')
                            .setLabel('Установить реферала')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('address-settings')
                            .setLabel('Изменить адрес по умолчанию')
                            .setStyle('SECONDARY')
                    );

                await interaction.reply({ ephemeral: true, embeds: [embed], components: [row] })
            }

            // Обработка настроек (выбор по кнопке)
            if (interaction.customId.endsWith('_settings')) {
                const response = await DBRequest(`SELECT * FROM users WHERE minecraft_username = '${username}'`) as any[]
                const modal = new Modal()
                switch (interaction.customId) {
                    case 'cardnumber-settings': {
                        modal.setCustomId('cardnumber_settings_modal')
                        modal.setTitle('Изменить номер карты по умолчанию')
                        const value = new TextInputComponent()
                            .setCustomId('value')
                            .setLabel('Введите новый номер карты')
                            .setMinLength(5)
                            .setMaxLength(5)
                            .setPlaceholder(`Ваш текущий номер: ${response[0].card_number}`)
                            .setRequired(true)
                            .setStyle('SHORT')
                        const firstActionRow = new MessageActionRow().addComponents(value);
                        modal.addComponents(firstActionRow as any)
                        break
                    }

                    case 'referal-settings': {
                        if (response[0].referal) {
                            const embed = new MessageEmbed()
                                .setTitle("Вы уже ввели пользователя, который вас пригласил")
                                .setColor(AppearanceConfig.Colors.Default as ColorResolvable)
                                .setFooter(AppearanceConfig.Tags.GTK, AppearanceConfig.Images.MainLogo)

                            // @ts-ignore
                            await interaction.reply({ephermal: true, embeds: [embed]})
                            return
                        }
                        modal.setCustomId('referal_settings_modal')
                        modal.setTitle('Изменить реферала')
                        const value = new TextInputComponent()
                            .setCustomId('value')
                            .setLabel('Введите пользователя, который вас пригласил')
                            .setPlaceholder(`Реферала невозможно изменить`)
                            .setRequired(true)
                            .setStyle('SHORT')
                        const firstActionRow = new MessageActionRow().addComponents(value);
                        modal.addComponents(firstActionRow as any)
                        break
                    }

                    case 'address-settings': {
                        modal.setCustomId('address_settings_modal')
                        modal.setTitle('Изменить адрес по умолчанию')
                        const value = new TextInputComponent()
                            .setCustomId('value')
                            .setLabel('Введите новый адрес по умолчанию')
                            .setRequired(true)
                            .setStyle('PARAGRAPH')
                        const firstActionRow = new MessageActionRow().addComponents(value);
                        modal.addComponents(firstActionRow as any)
                        break
                    }
                }
                await interaction.showModal(modal);
            }

            // Обработка историй (выбор по кнопке)
            if (interaction.customId.endsWith('_history')) {
                const embed = new MessageEmbed()
                    .setFooter(AppearanceConfig.Tags.Bank, AppearanceConfig.Images.MainLogo)
                    .setThumbnail(minecraftUser.skin.avatar)
                    .setColor(AppearanceConfig.Colors.Default as ColorResolvable)
                const users = await DBRequest(`SELECT * FROM users WHERE uuid = '${minecraftUser.uuid}'`) as any[]
                switch (interaction.customId) {
                    case 'transfer_history':
                        const transferHistory = await DBRequest(`SELECT * FROM transfer_history WHERE userid = ${users[0].id}`) as any[]
                        let transferLog = ""
                        for (const responseElement of transferHistory) {
                            transferLog += `**${responseElement.date}** | **${responseElement.value}**  <:diamond_ore:990969911671136336> | **${responseElement.reason}**\n\n`
                        }
                        embed.setTitle("История покупок")
                        embed.setDescription(transferLog)
                        break
                    case 'withdraw_history':
                        const withdrawHistory = await DBRequest(`SELECT * FROM withdraw_history WHERE userid = ${users[0].id}`) as any[]
                        let withdrawLog = ""
                        for (const responseElement of withdrawHistory) {
                            withdrawLog += `**${responseElement.date}** | **${responseElement.value}**  <:diamond_ore:990969911671136336>\n\n`
                        }
                        embed.setTitle("История снятия средств")
                        embed.setDescription(withdrawLog)
                        break
                    case 'topup_history':
                        const topupHistory = await DBRequest(`SELECT * FROM topup_history WHERE userid = ${users[0].id}`) as any[]
                        let topupLog = ""
                        for (const responseElement of topupHistory) {
                            topupLog += `**${responseElement.date}** | **${responseElement.value}**  <:diamond_ore:990969911671136336>\n\n`
                        }
                        embed.setTitle("История пополнений")
                        embed.setDescription(topupLog)
                        break
                }
                interaction.message.embeds.splice(1, 0, embed)
                await interaction.update({ embeds: [embed] })
            }

            // Обработка кредитов
            if (interaction.customId === 'takecredit') {
                const modal = new Modal()
                    .setCustomId('takecredit_modal')
                    .setTitle('Заявка на кредитование')

                const value = new TextInputComponent()
                    .setCustomId('takecredit_value')
                    .setLabel("Введите сумму кредитования (АР)")
                    .setStyle('SHORT')
                    .setRequired(true)
                    .setMinLength(1)
                    .setMaxLength(6)

                const time = new TextInputComponent()
                    .setCustomId('takecredit_time')
                    .setLabel("Введите время на выплату кредита (дней)")
                    .setStyle('SHORT')
                    .setRequired(true)
                    .setMinLength(1)
                    .setMaxLength(3)

                const target = new TextInputComponent()
                    .setCustomId('takecredit_target')
                    .setLabel("Введите цель кредитования")
                    .setStyle('PARAGRAPH')
                    .setRequired(true)

                const firstActionRow = new MessageActionRow().addComponents(value);
                const secondActionRow = new MessageActionRow().addComponents(time);
                const thirdActionRow = new MessageActionRow().addComponents(target);
                modal.addComponents(firstActionRow as any, secondActionRow as any, thirdActionRow as any);
                await interaction.showModal(modal);
            }

            // Обработка снятие со счета
            if (interaction.customId === 'withdraw') {
                const username = await bankCard.findUser(interaction.user.id);
                const response = await DBRequest(`SELECT * FROM \`users\` WHERE \`minecraft_username\` = '${username}'`) as any[]
                const modal = new Modal()
                    .setCustomId('withdraw_modal')
                    .setTitle(`Снятие средств (Баланс: ${response[0].balance} АР)`)

                const value = new TextInputComponent()
                    .setCustomId('withdraw_value')
                    .setLabel(`Введите сумму снятия средств (АР)`)
                    .setStyle('SHORT')
                    .setRequired(true)
                    .setPlaceholder(`Баланс: ${response[0].balance} АР`)
                    .setMinLength(1)
                    .setMaxLength(6)

                const cardNumber = new TextInputComponent()
                    .setCustomId('card_number')
                    .setLabel(`Введите карту SPWorlds для снятия средств`)
                    .setStyle('SHORT')
                    .setRequired(false)
                    .setPlaceholder(`По умолчанию: ${response[0].card_number}`)
                    .setMinLength(5)
                    .setMaxLength(5)

                const firstActionRow = new MessageActionRow().addComponents(value);
                const secondActionRow = new MessageActionRow().addComponents(cardNumber);
                modal.addComponents(firstActionRow as any, secondActionRow as any);
                await interaction.showModal(modal);
            }
        }

        if (interaction.isModalSubmit()) {
            // Форма регистрации
            if (interaction.customId === 'registration_modal') {
                const cardnumber = interaction.fields.getTextInputValue('registration_cardnumber')
                const referal = interaction.fields.getTextInputValue('registration_referal') ? interaction.fields.getTextInputValue('registration_referal') : null
                await DBRequest(`INSERT INTO \`users\` (\`uuid\`, \`minecraft_username\`, \`card_number\`, referal) VALUES ('${minecraftUser.uuid}', '${username}', '${cardnumber}', '${referal}')`)
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
                const username = await bankCard.findUser(interaction.user.id);
                const options = {
                    'method': 'POST',
                    'url': 'https://spworlds.ru/api/public/payment',
                    'headers': {
                        'Authorization': `Bearer ${CardsConfig.CARD_BASE64}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "amount": parseInt(value),
                        "redirectUrl": "https://gtk-sp.ru/payment/success",
                        "webhookUrl": "https://gtk-sp.ru/payment/callback",
                        "data": interaction.user.id
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

            // Форма кредитования
            if (interaction.customId === 'takecredit_modal') {
                const value = interaction.fields.getTextInputValue('takecredit_value')
                const time = interaction.fields.getTextInputValue('takecredit_time')
                const target = interaction.fields.getTextInputValue('takecredit_target')
                const username = await bankCard.findUser(interaction.user.id);
                const minecraftUser = await mcdata.playerStatus(username, { renderSize: 2 })
                const notifyEmbed = new MessageEmbed()
                    .setColor(AppearanceConfig.Colors.Success as ColorResolvable)
                    .setTitle(`Заявка на кредит отправлена`)
                    .setThumbnail(minecraftUser.skin.avatar)
                    .setDescription("Заявление будет рассмотрено в течении дня.")
                    .setFooter(AppearanceConfig.Tags.Bank, AppearanceConfig.Images.MainLogo)
                    .setFields(
                        { name: 'Никнейм', value: `\`${username}\`` },
                        { name: 'Сумма кредитования', value: `\`${value}\` <:diamond_ore:990969911671136336>` },
                        { name: 'Время кредитования', value: `${time} дней` },
                        { name: 'Цель кредитования', value: target },
                        { name: 'Процентная ставка', value: "Будет определена при составлении договора с сотрудником Банка." },
                    )
                await interaction.reply({ ephemeral: true, embeds: [notifyEmbed] });


                const requestEmbed = new MessageEmbed()
                    .setColor(AppearanceConfig.Colors.Default as ColorResolvable)
                    .setTitle(`Заявка на кредитование`)
                    .setThumbnail(minecraftUser.skin.avatar)
                    .setTimestamp()
                    .setFooter(AppearanceConfig.Tags.Bank, AppearanceConfig.Images.MainLogo)
                    .setFields(
                        { name: 'Никнейм', value: `\`${username}\`` },
                        { name: 'Сумма кредитования', value: `\`${value}\` <:diamond_ore:990969911671136336>` },
                        { name: 'Время кредитования', value: `${time} дней` },
                        { name: 'Цель кредитования', value: target },
                        { name: 'Процентная ставка', value: "Не определена" },
                    )

                await ( client.channels.cache.get(ChannelsConfig.CREDITS_APPLICATIONS_CHANNEL) as TextChannel ).send({ embeds: [requestEmbed] });
            }

            // Форма снятия средств
            if (interaction.customId === 'withdraw_modal') {
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('lk')
                            .setLabel('👨‍💼 Вернуться в Личный кабинет')
                            .setStyle('PRIMARY')
                    )

                const username = await bankCard.findUser(interaction.user.id);
                const value = parseInt(interaction.fields.getTextInputValue('withdraw_value'))
                const response = await DBRequest(`SELECT * FROM \`users\` WHERE \`minecraft_username\` = '${username}'`) as any[]
                const cardNumber = interaction.fields.getTextInputValue('card_number') ? interaction.fields.getTextInputValue('card_number') : response[0].card_number
                if (response[0].balance - value >= 0) {
                    await withdrawBalance(response[0].id, username, value, cardNumber)

                    const embed = new MessageEmbed()
                        .setColor(AppearanceConfig.Colors.Success as ColorResolvable)
                        .setTitle(`Оплата успешно проведена (-${value} <:diamond_ore:990969911671136336>)`)
                        .setFooter(AppearanceConfig.Tags.Bank, AppearanceConfig.Images.MainLogo)
                        .addFields(
                            { name: 'Сумма списания', value: `\`${value}\` <:diamond_ore:990969911671136336>`, inline: true },
                            { name: 'Текущий баланс', value: `\`${response[0].balance - value}\` <:diamond_ore:990969911671136336>`, inline: true },
                            { name: 'Карта spworlds.ru', value: `\`${cardNumber}\` 💳`, inline: true },
                        )

                    await interaction.reply({ ephemeral: true, embeds: [embed], components: [row] });
                } else {
                    const embed = new MessageEmbed()
                        .setColor(AppearanceConfig.Colors.Error as ColorResolvable)
                        .setTitle(`Ошибка списания`)
                        .setFooter(AppearanceConfig.Tags.Bank, AppearanceConfig.Images.MainLogo)
                        .setDescription(`Недостаточно средств.\nНа вашем счету \`${response[0].balance}\` <:diamond_ore:990969911671136336>`)
                    await interaction.reply({ ephemeral: true, embeds: [embed], components: [row] });
                }
            }

            // Форма изменения настроек
            if (interaction.customId.endsWith('_settings_modal')) {
                const embed = new MessageEmbed()
                    .setColor(AppearanceConfig.Colors.Default as ColorResolvable)
                    .setFooter(AppearanceConfig.Tags.GTK, AppearanceConfig.Images.MainLogo)
                const value = interaction.fields.getTextInputValue('value')
                switch (interaction.customId) {
                    case 'cardnumber_settings_modal': {
                        await DBRequest(`UPDATE users SET card_number = ${parseInt(value)} WHERE minecraft_username = '${username}'`)
                        embed.setTitle("Карта по умолчанию обновлена")
                        embed.addField('Карта:', `${value} 💳`)
                        break
                    }
                    case 'referal_settings_modal': {
                        await DBRequest(`UPDATE users SET referal = '${value}' WHERE minecraft_username = '${username}'`)
                        embed.setTitle("Реферал установлен")
                        embed.setDescription("Реферал не может быть изменен")
                        embed.addField('Реферал:', `${value}`)
                        break
                    }
                    case 'address_settings_modal': {
                        await DBRequest(`UPDATE users SET address = '${value}' WHERE minecraft_username = '${username}'`)
                        embed.setTitle("Адрес по умолчанию обновлен")
                        embed.addField('Адрес:', `${value}`)
                        break
                    }
                }
                await interaction.reply({ephemeral: true, embeds: [embed]})
            }



        }

    }
}
