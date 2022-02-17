import { ClickerUser } from "../models";
import InteractionUtils from "../utils/InteratctionUtils";
import SlashCommand from "../utils/SlashCommand";

export default class TestCmd extends SlashCommand {
    constructor() {
        super();
        this.name = "Test";
        this.description = "TEST!";
        this.onRun = async (interaction) => {
            let user = InteractionUtils.getUser(interaction);
            let clickerUser = await ClickerUser.findUser(user, interaction.guildID);
            clickerUser.updateCookies();
            clickerUser.save();
            interaction.createMessage({ content: clickerUser.cookies.toLocaleString("en-US") });
        };
    }
}
