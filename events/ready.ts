import Discord from "discord.js";
import { STATUS } from "../configurations/bot_configuration.json"

module.exports = {
    name: 'ready',
    once: true,
    async execute (client: Discord.Client): Promise<void> {
        console.log(`${client.user.username} включен!`);
        if (STATUS.enable)
            client.user.setPresence(STATUS as Discord.PresenceData);
    }
}
