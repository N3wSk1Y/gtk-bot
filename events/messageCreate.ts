import Discord, {ColorResolvable, MessageActionRow, MessageButton, MessageEmbed, TextChannel} from "discord.js";
import { SPWorlds } from "spworlds";
import mcdata from "mcdata";
import CardsConfig from '../configurations/cards.json';
import AppearanceConfig from '../configurations/appearance.json'
import ChannelsConfig from '../configurations/channels.json'

const sp = new SPWorlds(CardsConfig.CARD_ID, CardsConfig.CARD_TOKEN);

export = {
    name: 'messageCreate',
    once: false,
    async execute (client: Discord.Client, message: Discord.Message): Promise<void> {
        if (message.author.bot) return;
        if (message.channelId === ChannelsConfig.REVIEWS_CHANNEL) {
            const username = await sp.findUser(message.author.id);
            const minecraftUser = await mcdata.playerStatus(username, { renderSize: 2 })
            const embed = new MessageEmbed()
                .setTitle(`Отзыв/Пожелание клиента ${username}`)
                .setColor(AppearanceConfig.Colors.Default as ColorResolvable)
                .setDescription("```" + message.content + "```" + "\n**Вы можете оставить свой отзыв/пожелание, просто написав его в этом канале**")
                .setThumbnail(minecraftUser.skin.avatar)
                .setFooter(AppearanceConfig.Tags.GTK, AppearanceConfig.Images.MainLogo)
            await ( client.channels.cache.get(ChannelsConfig.REVIEWS_CHANNEL) as TextChannel ).send({ embeds: [embed] });
            await message.delete()
        }

        if (message.channelId === ChannelsConfig.SUPPORT_CHANNEL) {
            const username = await sp.findUser(message.author.id);
            const minecraftUser = await mcdata.playerStatus(username, { renderSize: 2 })
            const channel = await message.guild.channels.create(username)
                .then( async (channel) => {

                    const category = await message.guild.channels.cache.find(c => c.name == "поддержка");
                    console.log(category)
                    await channel.setParent(category.id);
                    await channel.permissionOverwrites.edit(message.author, {
                        SEND_MESSAGES: true,
                        VIEW_CHANNEL: true
                    })
                    const embed = new MessageEmbed()
                        .setTitle(`Обращение клиента ${username}`)
                        .setColor(AppearanceConfig.Colors.Default as ColorResolvable)
                        .setDescription("```" + message.content + "```")
                        .setThumbnail(minecraftUser.skin.avatar)
                        .setFooter(AppearanceConfig.Tags.GTK, AppearanceConfig.Images.MainLogo)
                    const row = new MessageActionRow()
                        row.addComponents(
                            new MessageButton()
                            .setCustomId(`support_delete`)
                            .setLabel(`Закрыть обращение`)
                            .setStyle('DANGER')
                        )

                    await channel.send({content: `<@&992411016791076894> <@${message.author.id}>`, embeds: [embed], components:[row]})
                })
            await message.delete()
        }
    }
}
