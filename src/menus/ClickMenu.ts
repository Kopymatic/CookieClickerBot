import Eris, { ActionRowComponents } from "eris";
import global from "../global";
import { ClickerUser } from "../models";
import { ButtonStyles, ComponentTypes } from "../utils/CommandUtils";
import Menu, { MenuButton } from "./Menu";

export default class ClickMenu {
    clickerUser: ClickerUser;
    interaction: Eris.CommandInteraction;

    constructor(clickerUser: ClickerUser, interaction: Eris.CommandInteraction) {
        let cookieButton: ActionRowComponents = {
            type: ComponentTypes.Button,
            custom_id: `${Math.random()}|CookieButton`,
            style: ButtonStyles.Success,
            emoji: { name: "🍪" },
        };

        let menu = new Menu(
            [{ button: cookieButton, func: this.onClick }],
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
                        components: [cookieButton],
                    },
                ],
            },
            interaction
        );
    }

    onClick(interaction: Eris.ComponentInteraction): void {
        console.log("penis");
    }
}
