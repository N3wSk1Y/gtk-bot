"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const discord_js_1 = require("discord.js");
const spworlds_1 = require("spworlds");
const cards_json_1 = __importDefault(require("../configurations/cards.json"));
const appearance_json_1 = __importDefault(require("../configurations/appearance.json"));
const channels_json_1 = __importDefault(require("../configurations/channels.json"));
const mcdata_1 = __importDefault(require("mcdata"));
var Vacancies;
(function (Vacancies) {
    Vacancies["delivery"] = "\u0421\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A \u043E\u0442\u0434\u0435\u043B\u0430 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438";
    Vacancies["production"] = "\u0421\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A \u043E\u0442\u0434\u0435\u043B\u0430 \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u0441\u0442\u0432\u0430";
    Vacancies["finance"] = "\u0421\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A \u0444\u0438\u043D\u0430\u043D\u0441\u043E\u0432\u043E\u0433\u043E \u043E\u0442\u0434\u0435\u043B\u0430";
    Vacancies["manager"] = "\u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u043F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u0430";
    Vacancies["lawyer"] = "\u042E\u0440\u0438\u0441\u0442";
})(Vacancies || (Vacancies = {}));
const sp = new spworlds_1.SPWorlds(cards_json_1.default.CARD_ID, cards_json_1.default.CARD_TOKEN);
module.exports = {
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const username = yield sp.findUser(interaction.user.id);
            const minecraftUser = yield mcdata_1.default.playerStatus(username, { renderSize: 2 });
            // Выбор вакансии TODO: Подгружать доступные и недоступные вакансии из БД
            if (interaction.isSelectMenu()) {
                if (interaction.customId === 'apply_job') {
                    const vacancy = interaction.values[0];
                    const modal = new discord_js_1.Modal()
                        .setCustomId(`apply_job_${vacancy}`)
                        .setTitle('Заявка на трудоустройство');
                    const about = new discord_js_1.TextInputComponent()
                        .setCustomId('about')
                        .setLabel("Расскажите о себе")
                        .setPlaceholder("Возраст, часовой пояс, опыт и.т.д.")
                        .setStyle('PARAGRAPH')
                        .setRequired(true);
                    const timeperday = new discord_js_1.TextInputComponent()
                        .setCustomId('timeperday')
                        .setLabel("Сколько вы готовы работать в день")
                        .setStyle('SHORT')
                        .setRequired(true);
                    const income = new discord_js_1.TextInputComponent()
                        .setCustomId('income')
                        .setLabel("Желаемая з/п")
                        .setStyle('SHORT')
                        .setRequired(true);
                    const firstActionRow = new discord_js_1.MessageActionRow().addComponents(about);
                    const secondActionRow = new discord_js_1.MessageActionRow().addComponents(timeperday);
                    const thirdActionRow = new discord_js_1.MessageActionRow().addComponents(income);
                    modal.setComponents(firstActionRow, secondActionRow, thirdActionRow);
                    yield interaction.showModal(modal);
                }
            }
            // Отправка вакансии в канал, а также уведомление пользователю об отправке
            if (interaction.isModalSubmit()) {
                if (interaction.customId.startsWith('apply_job_')) {
                    const vacancy = Vacancies[interaction.customId.slice(interaction.customId.indexOf('apply_job_') + 10)];
                    const about = interaction.fields.getTextInputValue('about');
                    const timeperday = interaction.fields.getTextInputValue('timeperday');
                    const income = interaction.fields.getTextInputValue('income');
                    const notifyEmbed = new discord_js_1.MessageEmbed()
                        .setColor(appearance_json_1.default.Colors.Success)
                        .setTitle(`Заявка отправлена`)
                        .setThumbnail(minecraftUser.skin.avatar)
                        .setDescription("Заявление будет рассмотрено в течении суток.\nВам напишут в личные сообщения с результатом.")
                        .setFooter(appearance_json_1.default.Tags.GTK, appearance_json_1.default.MainLogo);
                    yield interaction.reply({ ephemeral: true, embeds: [notifyEmbed] });
                    const requestEmbed = new discord_js_1.MessageEmbed()
                        .setColor(appearance_json_1.default.Colors.Default)
                        .setTitle(`Заявка на трудоустройство от ${username}`)
                        .setThumbnail(minecraftUser.skin.avatar)
                        .setTimestamp()
                        .setFooter(appearance_json_1.default.Tags.GTK, appearance_json_1.default.MainLogo)
                        .setFields({ name: 'Никнейм', value: "```" + username + "```" }, { name: 'Вакансия', value: "```" + vacancy + "```" }, { name: 'О себе', value: "```" + about + "```" }, { name: 'Готов уделять работе', value: "```" + timeperday + "```" }, { name: 'Желаемая з/п', value: "```" + income + "```" }, { name: 'Discord', value: `<@${interaction.user.id}>` });
                    yield client.channels.cache.get(channels_json_1.default.EMPLOYMENT_APPLICATIONS_CHANNEL).send({ embeds: [requestEmbed] });
                }
            }
        });
    }
};
