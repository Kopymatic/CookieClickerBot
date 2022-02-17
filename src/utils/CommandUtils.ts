export enum CommandTypes {
    SLASH = 1,
    USER = 2,
    MESSAGE = 3,
}
export enum CommandOptionTypes {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONABLE = 9,
    NUMBER = 10,
}
export enum ResponseFlags {
    EPHEMERAL = 1 << 6,
}
export enum ComponentTypes {
    ActionRow = 1,
    Button = 2,
    SelectMenu = 3,
}
export enum ButtonStyles {
    Primary = 1,
    Secondary = 2,
    Success = 3,
    Danger = 4,
    Link = 5,
}
