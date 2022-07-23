import Discord, {
    ColorResolvable,
    MessageEmbed,
    TextInputComponent,
    MessageActionRow,
    Modal, TextChannel
} from "discord.js";
import { SPWorlds } from "spworlds";
import CardsConfig from '../configurations/cards.json';
import AppearanceConfig from '../configurations/appearance.json'
import ChannelsConfig from '../configurations/channels.json'
import mcdata from "mcdata";

export = {
    async execute (client: Discord.Client, interaction: Discord.Interaction): Promise<void> {
        if (interaction.isButton()) {
            if (interaction.customId === 'support_delete') {
                await interaction.channel.delete()
            }
        }
    }
}
