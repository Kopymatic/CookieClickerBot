import { EventEmitter } from "events";
import {
    AnyChannel,
    Client,
    ComponentInteraction,
    Embed,
    Guild,
    Message,
    InteractionButton,
    Emoji,
    Interaction,
} from "eris";
import { ButtonStyles, ComponentTypes } from "./CommandUtils";

export class ButtonPaginator extends EventEmitter {
    private client: Client;
    private message: Message;
    private readonly options: MenuCollectorOptions;
    public currentIndex: number;
    private timeout: NodeJS.Timeout;
    private backButton: InteractionButton;
    private forwardButton: InteractionButton;
    private skipBackButton: InteractionButton;
    private skipForwardButton: InteractionButton;

    constructor(client: Client, message: Message, options: MenuCollectorOptions) {
        super();
        this.client = client;
        this.message = message;
        this.options = options;

        this.currentIndex = options.startingPage;
        this.timeout = this.resetTimeout();

        this.initialize();
    }

    private async initialize() {
        this.backButton = {
            type: ComponentTypes.Button,
            label: "",
            custom_id: `BackButton|${this.message.id}`,
            emoji: { name: "◀️" },
            style: ButtonStyles.Primary,
        };

        this.forwardButton = {
            type: ComponentTypes.Button,
            label: "",
            custom_id: `ForwardButton|${this.message.id}`,
            emoji: { name: "▶️" },
            style: ButtonStyles.Primary,
        };

        this.skipBackButton = {
            type: ComponentTypes.Button,
            label: "",
            custom_id: `SkipBackButton|${this.message.id}`,
            emoji: { name: "⏪" },
            style: ButtonStyles.Primary,
        };

        this.skipForwardButton = {
            type: ComponentTypes.Button,
            label: "",
            custom_id: `SkipForwardButton|${this.message.id}`,
            emoji: { name: "⏩" },
            style: ButtonStyles.Primary,
        };

        this.client.on("interactionCreate", this.handleButtonPress);
        this.client.on("channelDelete", this.channelDeleteHandler);
        this.client.on("guildDelete", this.guildDeleteHandler);

        this.once("end", () => {
            clearTimeout(this.timeout);
            this.client.off("interactionCreate", this.handleButtonPress);
            this.client.off("channelDelete", this.channelDeleteHandler);
            this.client.off("guildDelete", this.guildDeleteHandler);
        });

        this.once("cancel", () => {
            clearTimeout(this.timeout);
            this.client.off("interactionCreate", this.handleButtonPress);
            this.client.off("channelDelete", this.channelDeleteHandler);
            this.client.off("guildDelete", this.guildDeleteHandler);
        });

        this.message.edit({
            content: "",
            embed: {
                ...this.options.pages[this.currentIndex],
                footer: {
                    text: `Page (${this.currentIndex + 1}/${this.options.pages.length})`,
                },
            },
            components: [
                {
                    type: ComponentTypes.ActionRow,
                    components: [
                        this.skipBackButton,
                        this.backButton,
                        this.forwardButton,
                        this.skipForwardButton,
                    ],
                },
            ],
        });
    }

    private handleButtonPress = async (interaction: Interaction): Promise<void> => {
        if (interaction instanceof ComponentInteraction) {
        } else {
            return;
        }

        if (this.message.id !== interaction.message.id) {
            return;
        } else {
            try {
                await interaction.acknowledge();
            } catch (error) {
                console.error(error);
                return;
            }

            if (interaction.data.custom_id == this.backButton.custom_id) {
                //check all buttons
                this.currentIndex--;
            } else if (interaction.data.custom_id == this.forwardButton.custom_id) {
                this.currentIndex++;
            } else if (interaction.data.custom_id == this.skipBackButton.custom_id) {
                this.currentIndex -= 10;
            } else if (interaction.data.custom_id == this.skipForwardButton.custom_id) {
                this.currentIndex += 10;
            }

            if (this.currentIndex < 0) {
                //make sure that it isnt a negative or too high value
                this.currentIndex = this.options.pages.length - 1;
            } else if (this.currentIndex > this.options.pages.length - 1) {
                this.currentIndex = 0;
            }

            await this.message.edit({
                //Edit the message
                content: "",
                embed: {
                    ...this.options.pages[this.currentIndex],
                    footer: {
                        text: `Page (${this.currentIndex + 1}/${this.options.pages.length})`,
                    },
                },
                components: [
                    {
                        type: ComponentTypes.ActionRow,
                        components: [
                            this.skipBackButton,
                            this.backButton,
                            this.forwardButton,
                            this.skipForwardButton,
                        ],
                    },
                ],
            });
        }
        this.timeout = this.resetTimeout();
    };

    private channelDeleteHandler = (channel: AnyChannel): void => {
        if (channel.id === this.message.channel.id) this.emit("cancel", null);
    };
    private guildDeleteHandler = (guild: Guild): void => {
        if (guild.id === this.message.guildID) this.emit("cancel", null);
    };

    private resetTimeout = (): NodeJS.Timeout => {
        clearTimeout(this.timeout);
        return setTimeout(() => this.emit("cancel", null), this.options.maxTime);
    };
}

class MenuCollectorOptions {
    public allowedUsers: string[];
    public pages: Embed[];
    public maxTime: number;
    public startingPage?: number = 0;
}
