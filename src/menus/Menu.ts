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
    protected client: Client;
    protected interaction: CommandInteraction;
    protected message: InteractionContent;
    protected buttons: MenuButton[];
    protected readonly options: MenuOptions;
    protected timeout: NodeJS.Timeout;

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

    protected handleButtonPress = (interaction: Interaction): Promise<void> => {
        if (!(interaction instanceof ComponentInteraction)) {
            return;
        }
        if (InteractionUtils.isInDm(interaction)) {
            return;
        }

        let custom_id = interaction.data.custom_id;
        this.buttons.forEach((button) => {
            if (button.button.custom_id === custom_id) {
                button.func(interaction);
            }
        });

        this.timeout = this.resetTimeout();
    };

    protected resetTimeout = (): NodeJS.Timeout => {
        clearTimeout(this.timeout);
        return setTimeout(() => this.emit("cancel", null), this.options.maxTime);
    };
}

export class MenuOptions {
    public allowedUsers: string[];
    public maxTime: number = 120000;
}

export interface MenuButton {
    button: InteractionButton;
    func: Function;
}
