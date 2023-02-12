

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIFriend extends cc.Component {
    @property({ type: cc.Node, displayName: "spBackNode", tooltip: "spBackNode" })
    spBackNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndTemplateItem", tooltip: "ndTemplateItem" })
    ndTemplateItem: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndItems", tooltip: "ndItems" })
    ndItems: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndView", tooltip: "ndView" })
    ndView: cc.Node = null;
    hidePosition: any;
    showPosition: any;
    startPosY: number;
    isShow: boolean;
    sortType: any;
    constructor() {
        super();
        this.hidePosition = null;
        this.showPosition = null;

        this.startPosY = 0;
        this.isShow = false;//是否关闭

        this.sortType = global.Enum.FriendMode.MODE_LEVEL;
    };

    onLoad() { }

    onEnable() {
        global.Manager.UIManager.add('UIFriend', this);

        let self = this;

        this.node.on('onFriendItemClick', function (event) {
            self.onFriendItemClick(event);
        });

        this.show();
        this.move(true);
    };

    start() {

    };

    onDisable() {
        this.node.off('onFriendItemClick');
        global.Manager.UIManager.remove('UIFriend');
    };
    toAddClick() {
        global.Manager.UIManager.close('UIFriendChoose');
        global.Manager.UIManager.open('UIRank', null, function (panel) {
            panel.show(global.Enum.RankType.SELL);
        });
    }
    move(isShow) {
        this.isShow = isShow;
        this.node.stopAllActions();
        if (this.isShow) {
            let moveTo = cc.moveTo(0.5, this.showPosition);
            this.spBackNode.runAction(moveTo);
        }
        else {
            let moveTo = cc.moveTo(0.5, this.hidePosition);
            let jumFunction = cc.callFunc(function () {
                global.Manager.UIManager.close('UIFriend');
            }, this);
            let seq = cc.sequence(moveTo, jumFunction);

            this.spBackNode.runAction(seq);

        }
    };

    show() {
        let windowSize = cc.winSize;
        this.showPosition = cc.v2(windowSize.width / 2, this.spBackNode.y);
        this.hidePosition = cc.v2(windowSize.width / 2 + this.spBackNode.getContentSize().width, this.spBackNode.y);
        this.spBackNode.setPosition(this.hidePosition);
        let data = {};
        let self = this;

        global.Instance.MsgPools.send('friendList', data, function (msg) {
            if (!msg.errorID) {
                self.btnSort();
            }
        });
    };

    reflashFriends(friends) {
        let itemSize = this.ndTemplateItem.getContentSize();
        let itemNum = friends.length;
        let sizeWidth = this.ndItems.getContentSize().width;
        this.ndItems.setContentSize(sizeWidth, (itemSize.height + 10) * itemNum);
        this.ndItems.removeAllChildren();

        this.startPosY = -(itemSize.height / 2 + 20);

        let itemPosY = this.startPosY;
        let sortType = this.sortType;

        for (let key in friends) {
            let item = friends[key];
            global.CommonClass.FriendItem.create(item, this.ndItems, cc.v2(0, itemPosY), function (newItem) {
                newItem.setMode(sortType);
            });
            itemPosY -= itemSize.height + 10;
        }
    };
    btnMove() {
        this.move(false);
    };

    btnSort() {
        let friends = global.Module.FriendData.listSort(this.sortType);
        this.reflashFriends(friends);
    };

    onFriendItemClick(event) {
        let node = event.getUserData();
        let ID = node.tagEx;

        let mainRoleID = global.Module.MainPlayerData.getRoleID();
        let scene = cc.director.getScene();
        let friend = global.Module.FriendData.getFriend(ID);
        let UIGuJiList = global.Manager.UIManager.get('UIGuJiList');
        if (UIGuJiList) {
            UIGuJiList.onFriendItemClick(friend.roleInfo.roleId);
        } else {
            if (mainRoleID != ID) {
                global.Instance.MsgPools.send('scenePosition', { roleId: ID }, function (msg) {
                    global.Module.PlayerMapData.setRoleInfo(friend.roleInfo);
                    global.CommonClass.Functions.loadScene("PlayerScene", null);
                });
            } else {
                global.CommonClass.UITip.showTipTxt('不能拜访自己', global.Enum.TipType.TIP_BAD);
            }
        }


    };

    // update (dt) {}
}
