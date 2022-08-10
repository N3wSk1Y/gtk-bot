import Discord from "discord.js";

export = {
    async execute (client: Discord.Client, interaction: Discord.Interaction): Promise<void> {
        if (interaction.isButton()) {
            if (interaction.customId === 'support_delete') {
                await interaction.channel.delete()
            }
        }
    }
}
