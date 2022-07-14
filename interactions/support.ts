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

enum Vacancies {
    delivery = "Сотрудник отдела доставки",
    production = "Сотрудник отдела производства",
    finance = "Сотрудник финансового отдела",
    manager = "Менеджер персонала",
    lawyer = "Юрист"
}

const sp = new SPWorlds(CardsConfig.CARD_ID, CardsConfig.CARD_TOKEN);

export = {
    async execute (client: Discord.Client, interaction: Discord.Interaction): Promise<void> {
        if (interaction.isButton()) {
            if (interaction.customId === 'support_delete') {
                await interaction.channel.delete()
            }
        }
    }
}
