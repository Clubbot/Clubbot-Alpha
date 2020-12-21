export default interface BotConfig {
    token: string;
    prefix: string;
    status: {
        message: string,
        type: enum
    },
    ownerID: string
}