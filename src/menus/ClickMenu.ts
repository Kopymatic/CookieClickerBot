import { EventEmitter } from "events";
import Eris, {
    Client,
    ComponentInteraction,
    InteractionButton,
    Interaction,
    CommandInteraction,
    InteractionContent,
    ActionRowComponents,
} from "eris";
import InteractionUtils from "../utils/InteratctionUtils";
import Menu, { MenuButton, MenuOptions } from "./Menu";
import { ClickerUser } from "../models";
import global from "../global";
import { ComponentTypes } from "../utils/CommandUtils";

export default class ClickMenu extends Menu {
    private clickerUser: ClickerUser;
    private button: MenuButton;
    constructor(
        client: Client,
        interaction: CommandInteraction,
        message: InteractionContent,
        clickerUser: ClickerUser,
        button: MenuButton
    ) {
        super(client, interaction, message, [button], {
            allowedUsers: [InteractionUtils.getUser(interaction).id],
            maxTime: 120000,
        });
        this.button = button;
        this.clickerUser = clickerUser;
    }

    protected handleButtonPress = (interaction: Interaction): Promise<void> => {
        if (!(interaction instanceof ComponentInteraction)) {
            return;
        }
        if (InteractionUtils.isInDm(interaction)) {
            return;
        }

        let custom_id = interaction.data.custom_id;
        if (custom_id === this.button.button.custom_id) {
            this.onClick(interaction, this.clickerUser, this.message);
        }

        this.timeout = this.resetTimeout();
    };

    public onClick = async (
        interaction: Eris.ComponentInteraction,
        clickerUser: ClickerUser,
        message: InteractionContent
    ): Promise<void> => {
        interaction.acknowledge();
        clickerUser.cookies++;
        clickerUser.save();
        let original = await interaction.getOriginalMessage();
        original.edit({
            embeds: [
                {
                    title: "CookieClicker!",
                    description: `You currently have ${clickerUser.cookies.toLocaleString(
                        "en-US"
                    )} cookies! \nClick the button to get more`,
                    color: global.defaultColor,
                },
            ],
            components: message.components,
        });
    };
}
