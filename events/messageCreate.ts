import Discord, {ColorResolvable, MessageEmbed, TextChannel} from "discord.js";
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
                .setFooter(AppearanceConfig.Tags.GTK, AppearanceConfig.MainLogo)
            await ( client.channels.cache.get(ChannelsConfig.REVIEWS_CHANNEL) as TextChannel ).send({ embeds: [embed] });
            await message.delete()
        }
    }
}
