import Eris, { ActionRowComponents } from "eris";
import { ClickerUser } from "../models";
import InteractionUtils from "../utils/InteratctionUtils";
import SlashCommand from "../utils/SlashCommand";
import { ButtonStyles, ComponentTypes } from "../utils/CommandUtils";
import global from "../global";
import Menu from "../menus/Menu";
import ClickMenu from "../menus/ClickMenu";

export default class ClickCmd extends SlashCommand {
    constructor() {
        super();
        this.name = "Click";
        this.description = "Click the cookie!";
        this.onRun = async (interaction) => {
            await interaction.acknowledge();

            let user = InteractionUtils.getUser(interaction);
            let clickerUser = await ClickerUser.findUser(user, interaction.guildID);
            clickerUser.updateCookies();
            clickerUser.save();

            new ClickMenu(clickerUser, interaction);
        };
    }
}
