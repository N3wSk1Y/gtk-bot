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
const sp = new spworlds_1.SPWorlds(cards_json_1.default.CARD_ID, cards_json_1.default.CARD_TOKEN);
module.exports = {
    name: 'guildMemberAdd',
    once: false,
    execute(client, member) {
        return __awaiter(this, void 0, void 0, function* () {
            if (member.user.bot)
                return;
            const username = yield sp.findUser(member.id);
            if (username === null) {
                const embed = new discord_js_1.MessageEmbed()
                    .setTitle(`Ошибка синхронизации`)
                    .setColor(appearance_json_1.default.Colors.Error)
                    .setDescription("К сожалению, ваш Discord не привязан к Minecraft-аккаунту с купленной проходкой на СП.")
                    .setFooter(appearance_json_1.default.Tags.GTK, appearance_json_1.default.MainLogo);
                yield member.send({ embeds: [embed] });
                yield member.kick("Отсутствует проходка на СП");
            }
        });
    }
};
