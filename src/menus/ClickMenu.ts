import Eris, { ActionRowComponents } from "eris";
import global from "../global";
import { ClickerUser } from "../models";
import { ButtonStyles, ComponentTypes } from "../utils/CommandUtils";
import Menu from "./Menu";

export default class ClickMenu {
    clickerUser: ClickerUser;
    interaction: Eris.CommandInteraction;
    cookieButton: ActionRowComponents;

    constructor(clickerUser: ClickerUser, interaction: Eris.CommandInteraction) {
        this.clickerUser = clickerUser;
        this.interaction = interaction;

        this.cookieButton = {
            type: ComponentTypes.Button,
            custom_id: `${Math.random()}|CookieButton`,
            style: ButtonStyles.Success,
            emoji: { name: "🍪" },
        };

        let menu = new Menu(
            global.bot,
            interaction,
            {
                embeds: [
                    {
                        title: "CookieClicker!",
                        description: `You currently have ${clickerUser.cookies.toLocaleString(
                            "en-US"
                        )} cookies! \nClick the button to get more`,
                        color: global.defaultColor,
                    },
                ],
                components: [
                    {
                        type: ComponentTypes.ActionRow,
                        components: [this.cookieButton],
                    },
                ],
            },

            [{ button: this.cookieButton, func: this.onClick }],
            { allowedUsers: [clickerUser.userID], maxTime: 120000 }
        );
    }

    async onClick(interaction: Eris.ComponentInteraction): Promise<void> {
        interaction.acknowledge();
        this.clickerUser.cookies++;
        this.clickerUser.save();
        let original = await this.interaction.getOriginalMessage();
        original.edit({
            embeds: [
                {
                    title: "CookieClicker!",
                    description: `You currently have ${this.clickerUser.cookies.toLocaleString(
                        "en-US"
                    )} cookies! \nClick the button to get more`,
                    color: global.defaultColor,
                },
            ],
            components: [
                {
                    type: ComponentTypes.ActionRow,
                    components: [this.cookieButton],
                },
            ],
        });
    }
}
