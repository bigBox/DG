//

const { ccclass, property } = cc._decorator;

@ccclass
export default class ChatData {
    chats: {};
    panel: any;
    maxChat: number;

    constructor() {
        this.chats = {};
        this.panel = null;

        this.maxChat = 20;
    };
    setPanel(panel: any) {
        this.panel = panel;

        if (panel == null)
            this.chats = {};
    };

    addChat(channel: string | number, data: { name: any; level: any; content: any; channel: any; }) {
        if (this.chats[channel] == null)
            this.chats[channel] = [];

        let length = this.chats[channel].length;
        if (length >= this.maxChat) {
            this.chats[channel].splice(0, 1);
            this.panel.removeTopChat(channel);
        }
        this.chats[channel].push(data);

        if (this.panel)
            this.panel.addChat(channel, data);
    };

    onChatSendRsp(msg: { errorID: number; }) {
        if (msg.errorID == 0) {
        }

    };

    onChatSendNtf(msg: { roleInfo: { roleName: any; level: any; }; content: any; channel: any; }) {
        let data = {
            name: msg.roleInfo.roleName,
            level: msg.roleInfo.level,
            content: msg.content,
            channel: msg.channel,
        };
        this.addChat(data.channel, data);
    };
}
