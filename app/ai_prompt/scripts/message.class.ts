export default class Message {
    content: string;
    isUser: boolean;

    constructor(content: string, isUser: boolean) {
        this.content = content;
        this.isUser = isUser;
    }
}