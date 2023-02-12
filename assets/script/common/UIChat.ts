import UIBase from "./UIBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UIChat extends UIBase {
    @property({ displayName: "channel", tooltip: "channel" })
    channel: number = 1;
    isShow: boolean;
    root: cc.Node;
    ndTempLate: cc.Node;
    onLoad() {
        this.isShow = false;
    };

    start() {

    }
    onEnable() {
        global.Module.ChatData.setPanel(this);

        this.root = this.node.getChildByName('root');

        this.ndTempLate = this.root.getChildByName('ndChatItem');
        this.ndTempLate.active = false;

        this.setChannel(this.channel);

        global.Manager.UIManager.add('UIChat', this);
    };

    onDisable() {
        global.Manager.UIManager.remove('UIChat');
        global.Module.ChatData.setPanel(null);
    };

    setChannel(channel) {
        this.channel = channel;

        let ndChannels = this.root.getChildByName('ndChannels');
        for (let i = 1; i < global.Enum.ChatChannel.CHAT_NUM; ++i) {
            let ndChannel = ndChannels.getChildByName('ndChannel' + i.toString());
            ndChannel.active = (channel == i);
        }

        if (channel == 1)
            this.showUnion()
        else if (channel == 2)
            this.showMine();
    };

    addChat(channel, data) {
        let newItem: any = cc.instantiate(this.ndTempLate);
        newItem.active = true;

        let chatItem = newItem.getComponent(global.CommonClass.ChatCell);
        chatItem.setData(data);

        let ndChannel = this.root.getChildByName('ndChannels').getChildByName('ndChannel' + channel.toString());
        let content = ndChannel.getChildByName('view').getChildByName('content');

        if (content.children.length <= 0) {
            let contentSize = content.getContentSize();
            contentSize.height = 0;
            content.setContentSize(contentSize);
        }

        content.addChild(newItem);

        this.resetPosition(channel, newItem);
    };

    showUnion() {
        let ndUnion = this.root.getChildByName('ndUnion');
        let ndMine = this.root.getChildByName('ndMine');
        let lblName = ndUnion.getChildByName('lblName').getComponent(cc.Label);
        let lblNumber = ndUnion.getChildByName('lblNumber').getComponent(cc.Label);

        let data = global.Module.UnionData.getSelfUnion();
        if (data && data.id > 0) {
            lblName.string = data.name;
            lblNumber.string = data.curMemberNums.toString() + '人';
        }

        ndUnion.active = true;
        ndMine.active = false;
    };

    showMine() {
        let ndUnion = this.root.getChildByName('ndUnion');
        let ndMine = this.root.getChildByName('ndMine');
        let lblName = ndMine.getChildByName('lblName').getComponent(cc.Label);
        let lblNumber = ndMine.getChildByName('lblNumber').getComponent(cc.Label);

        let sceneID = global.Proxys.ProxyDigGold.getSceneData().id;
        let friend = global.Module.FriendData.getFriend(sceneID);
        lblName.string = friend.roleInfo.roleName + '家的矿';

        let playerNum = global.Manager.DigGolderManager.getPlayerNum() + 1;
        lblNumber.string = playerNum + '人';

        ndUnion.active = false;
        ndMine.active = true;
    };

    removeTopChat(channel)     //最顶端最老的聊天记录移除
    {
        let ndChannel = this.root.getChildByName('ndChannels').getChildByName('ndChannel' + channel.toString());
        let content = ndChannel.getChildByName('view').getChildByName('content');

        let ndItems = content.children;
        let oldItem: any = ndItems[0];
        let oldClass = oldItem.getComponent(global.CommonClass.ChatCell);
        let box = oldClass.getCellSize();

        let contentSize = content.getContentSize();
        contentSize.height -= box.height;
        content.setContentSize(contentSize);

        let position = content.getPosition();
        content.setPosition(position.x, 0);

        oldItem.removeFromParent();
    };

    resetPosition(channel, newItem) {
        let ndChannel = this.root.getChildByName('ndChannels').getChildByName('ndChannel' + channel.toString());
        let content = ndChannel.getChildByName('view').getChildByName('content');

        let newItemClass = newItem.getComponent(global.CommonClass.ChatCell);
        let box = newItemClass.getCellSize();

        let contentSize = content.getContentSize();
        contentSize.height += box.height;
        content.setContentSize(contentSize);

        let position = content.getPosition();
        content.setPosition(position.x, 0);

        let items = content.children;
        for (let key in items) {
            let ndItem = items[key];
            let position = ndItem.getPosition();
            position.y += box.height;

            ndItem.setPosition(position);
        }

        let curPosY = box.height;
        newItem.setPosition(cc.v2(0, curPosY));
    };

    getIsShow() {
        return this.isShow;
    };

    show(isShow) {
        let btnHide = this.node.getChildByName('btnHide');

        this.isShow = isShow;

        if (isShow) {
            this.runShowAction(true, function () {
                btnHide.active = true;

            });
        }
        else {
            btnHide.active = false;
            this.runShowAction(false, function () {
                global.Manager.UIManager.close('UIChat');
            });
        }
    };

    runShowAction(isShow, callback) {
        this.root.stopAllActions();

        let position = this.root.getPosition();
        let contentSize = this.root.getContentSize();

        let width = contentSize.width;

        let endFun = function () {
            if (callback)
                callback();
        };

        if (isShow) {
            let moveTo = cc.moveTo(0.5, cc.v2(width, position.y));
            let funCall = cc.callFunc(endFun);
            let seq = cc.sequence(moveTo, funCall);
            this.root.runAction(seq);
        }
        else {
            let moveBack = cc.moveTo(0.5, cc.v2(0, position.y));
            let funCall = cc.callFunc(endFun);
            let seq = cc.sequence(moveBack, funCall);
            this.root.runAction(seq);
        }
    };

    editBoxReturn() {
        let root = this.node.getChildByName('root');
        let edtChat = root.getChildByName('edtChat').getComponent(cc.EditBox);

        let content = edtChat.string;

        let isSpace = true;
        for (let i = 0; i < content.length; ++i) {
            if (content[i] != ' ')
                isSpace = false;
        }

        if (!isSpace) {
            let data: any = {};
            let mainRoleID = global.Module.MainPlayerData.getRoleID();
            data.roleID = mainRoleID;
            data.content = content;
            data.channel = this.channel;

            edtChat.string = '';

            global.Instance.MsgPools.send('chatSend', data, null);
        }
    };

    btnShow() {
        this.show(true);
    };

    btnHide() {
        this.show(false);
    };
    // update (dt) {}
}
