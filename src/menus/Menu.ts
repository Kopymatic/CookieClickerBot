import { EventEmitter } from "events";
import {
    Client,
    ComponentInteraction,
    InteractionButton,
    Interaction,
    CommandInteraction,
    InteractionContent,
} from "eris";
import InteractionUtils from "../utils/InteratctionUtils";

export default class Menu extends EventEmitter {
    private client: Client;
    private interaction: CommandInteraction;
    private message: InteractionContent;
    private buttons: MenuButton[];
    private readonly options: MenuOptions;
    private timeout: NodeJS.Timeout;

    constructor(
        client: Client,
        interaction: CommandInteraction,
        message: InteractionContent,
        buttons: MenuButton[],
        options: MenuOptions
    ) {
        super();
        this.client = client;
        this.interaction = interaction;
        this.message = message;
        this.options = options;
        this.buttons = buttons;
        this.timeout = this.resetTimeout();

        this.initialize();
    }

    private async initialize() {
        this.client.on("interactionCreate", this.handleButtonPress);

        this.once("end", () => {
            clearTimeout(this.timeout);
            this.client.off("interactionCreate", this.handleButtonPress);
        });

        this.once("cancel", () => {
            clearTimeout(this.timeout);
            this.client.off("interactionCreate", this.handleButtonPress);
        });

        this.interaction.createFollowup(this.message);
    }

    private handleButtonPress = async (interaction: Interaction): Promise<void> => {
        console.log("interaction recieved");
        if (!(interaction instanceof ComponentInteraction)) {
            console.log("WHYYYYYYYYYYYYYY");
            return;
        }
        if (InteractionUtils.isInDm(interaction)) {
            console.log("???");
            return;
        }

        let custom_id = interaction.data.custom_id;
        this.buttons.forEach((button) => {
            console.log("In foreach");
            if (button.button.custom_id === custom_id) {
                console.log("wow");
                button.func(interaction);
            }
        });

        this.timeout = this.resetTimeout();
    };

    private resetTimeout = (): NodeJS.Timeout => {
        clearTimeout(this.timeout);
        return setTimeout(() => this.emit("cancel", null), this.options.maxTime);
    };
}

class MenuOptions {
    public allowedUsers: string[];
    public maxTime: number = 120000;
}

interface MenuButton {
    button: InteractionButton;
    func: Function;
}
