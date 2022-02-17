import Eris, { Interaction } from "Eris";
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

    onInteraction(interaction: Interaction): void {
        console.log("interaction recieved");
        console.log(typeof interaction);
        if (interaction instanceof Eris.ComponentInteraction) {
            console.log("Its a component interaction");
            let custom_id = interaction.data.custom_id;
            this.buttons.forEach((value: MenuButton) => {
                console.log("In foreach");
                if (value.button.custom_id === custom_id) {
                    console.log("wow");
                    value.func(interaction);
                }
            });
        }
    }
}
