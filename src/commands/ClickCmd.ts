import Eris, { ActionRowComponents } from "eris";
import { ClickerUser } from "../models";
import InteractionUtils from "../utils/InteratctionUtils";
import SlashCommand from "../utils/SlashCommand";
import { ButtonStyles, ComponentTypes } from "../utils/CommandUtils";
import global from "../global";
import ClickMenu from "../menus/ClickMenu";

export default class ClickCmd extends SlashCommand {
    constructor() {
        super();
        this.name = "Click";
        this.description = "Click the cookie!";
        this.onRun = async (interaction) => {
            if (InteractionUtils.isInDm(interaction)) {
                interaction.createMessage({ content: "This command is not allowed in dms!" });
                return;
            }

            await interaction.acknowledge();

            let user = InteractionUtils.getUser(interaction);
            let clickerUser = await ClickerUser.findUser(user, interaction.guildID);
            clickerUser.updateCookies();
            clickerUser.save();

            new ClickMenu(clickerUser, interaction);
        };
    }
}
