import { ClickerUser } from "../models";
import { ButtonPaginator } from "../utils/ButtonPaginator";
import InteractionUtils from "../utils/InteratctionUtils";
import SlashCommand from "../utils/SlashCommand";
import global from "../global";

export default class TestCmd extends SlashCommand {
    constructor() {
        super();
        this.name = "Test";
        this.description = "TEST!";
        this.toDelete = true;
        this.onRun = async (interaction) => {
            await interaction.createMessage("TEST");
            let user = InteractionUtils.getUser(interaction);
            new ButtonPaginator(global.bot, await interaction.getOriginalMessage(), {
                allowedUsers: [user.id],
                maxTime: 12000,
                pages: [
                    { title: "pisdjfgioasjf", type: "rich" },
                    { title: "apsdjfipasdj", type: "rich" },
                ],
                startingPage: 0,
            });
        };
    }
}
