import Eris, { ComponentInteraction, Interaction } from "Eris";
import global from "../global";

export interface MenuButton {
    button: Eris.InteractionButton;
    func: Function;
}

export default class Menu {
    buttons: MenuButton[];

    constructor(
        buttons: MenuButton[],
        message: string | Eris.InteractionContent,
        interaction: Eris.CommandInteraction,
        timeout: number = 120000
    ) {
        this.buttons = buttons;

        interaction.createFollowup(message);

        global.bot.on("interactionCreate", this.onInteraction);

        setTimeout(() => {
            global.bot.off("interactionCreate", this.onInteraction);
        }, timeout);
    }

    onInteraction(interaction: ComponentInteraction): void {
        if (interaction.constructor.name === "ComponentInteraction") {
            let custom_id = interaction.data.custom_id;
            this.buttons.forEach((value: MenuButton) => {
                if (value.button.custom_id === custom_id) {
                    console.log("wow");
                    value.func(interaction);
                }
            });
        }
    }
}
