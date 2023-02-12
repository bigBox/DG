import UIBase from "../common/UIBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UIFriendChoose extends UIBase {
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
    // clickFriend: any;
    clickHome: any;
    curIdx: number;
    sortType: any;
    curSelItem: any;
    isShow: boolean;
    lblDec: any;
    btnHome: any;
    homeCall: any;
    startPosY: number;
    constructor() {
        super();
        this.hidePosition = null;
        this.showPosition = null;

        // this.clickFriend = null;
        this.clickHome = null;
        this.curIdx = 1;               //第一0是小寻 第二1是自己 默认是1

        this.sortType = global.Enum.FriendMode.MODE_LEVEL;

        this.curSelItem = null;
        this.isShow = false;//是否关闭

        this.lblDec = null;
    };

    onLoad() {
        global.Module.FriendChooseData.synchronFriendData(null);
    };

    start() {

    };
    onEnable() {
        global.Manager.UIManager.add('UIFriendChoose', this);
        let self = this;
        this.node.on('onFriendItemClick', function (event) {
            self.onFriendItemClick(event);
        });
        this.show(null);
        this.btnHome = this.spBackNode.getChildByName('btnHome');
        this.enableTouch(false);
    };

    onDisable() {
        global.Manager.UIManager.remove('UIFriendChoose');
        this.node.off('onFriendItemClick');
        this.enableTouch(false);
    };

    enableTouch(isEnable) {
        if (isEnable) {
            this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        } else {
            this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
            this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
            this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
            this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        }
    };

    touchEvent(event) {
        if (event.type == cc.Node.EventType.TOUCH_END) {
            this.move(false);
        }
    };
    toAddClick() {
        global.Manager.UIManager.close('UIFriendChoose');
        global.Manager.UIManager.open('UIRank', null, function (panel) {
            panel.show(global.Enum.RankType.SELL);
        });
    }
    move(isShow) {
        this.spBackNode.stopAllActions();
        this.isShow = isShow;

        if (this.isShow) {
            let moveTo = cc.moveTo(0.5, this.showPosition);
            this.spBackNode.runAction(moveTo);
        } else {
            let moveTo = cc.moveTo(0.5, this.hidePosition);
            let jumFunction = cc.callFunc(function () {
                global.Manager.UIManager.close('UIFriendChoose');
            }, this);
            let seq = cc.sequence(moveTo, jumFunction);
            this.spBackNode.runAction(moveTo);
        }

        this.enableTouch(this.isShow);
    };

    show(closeCall) {
        let self = this;
        this.homeCall = closeCall;
        let windowSize = cc.winSize;
        this.showPosition = cc.v2(windowSize.width / 2, this.spBackNode.y);
        this.hidePosition = cc.v2(windowSize.width / 2 + this.spBackNode.getContentSize().width, this.spBackNode.y);
        this.spBackNode.setPosition(this.hidePosition);
        global.Instance.MsgPools.send('friendList', {}, function (msg) {
            global.Instance.Log.debug("UIFriendChoose show msg", msg)
            if (!msg.errorID) {
                global.Module.FriendChooseData.listSort(self.sortType);
                global.Module.FriendChooseData.synchronFriendData(msg.friends);
                let friends = global.Module.FriendChooseData.getFriendData();
                global.Instance.Log.debug("UIFriendChoose show getFriendData", friends)
                self.reflashFriends(friends);
                let roleId = global.Module.FriendChooseData.getSelectID();
                self.autoSelect(roleId);
            }
        });

        this.reflash();
    };

    reflash() {
        let friend = global.Module.FriendChooseData.getSelectFriend();
        let friendItem: any = this.node.getChildByName('friendItem');
        let itemClass = friendItem.getComponent(global.CommonClass.FriendItem);

        itemClass.setData(friend);
        itemClass.setMode(this.sortType);
    };

    setFriendInfo(index) {
        let friendItem: any = this.node.getChildByName('friendItem');

        let friends = global.Module.FriendData.getFriendData();;
        friendItem.active = true;

        if (friends[index] != null) {
            let itemClass = friendItem.getComponent(global.CommonClass.FriendItem);
            itemClass.setData(friends[index]);
            itemClass.setMode(this.sortType);
        }
    };

    setClickData(friendCB, homeCB) {
        // this.clickFriend = friendCB;
        this.clickHome = homeCB;
    };

    reflashFriends(friends) {
        let itemSize = this.ndTemplateItem.getContentSize();
        let itemNum = friends.length;
        this.ndTemplateItem.active = false;

        let sizeWidth = this.ndItems.getContentSize().width;
        this.ndItems.setContentSize(sizeWidth , (itemSize.height + 10) * itemNum);
        this.ndItems.removeAllChildren();

        this.startPosY = -(itemSize.height / 2);
        let startPosY = this.startPosY;

        let sortType = this.sortType;

        let selectID = global.Module.FriendChooseData.getSelectID();
        for (let key in friends) {
            let item = friends[key];
            global.CommonClass.FriendItem.create(item, this.ndItems, cc.v2(0, startPosY), function (newItem) {
                newItem.setMode(sortType);
            });
            startPosY -= itemSize.height + 10;
        }
     
    };


    changeSelect(newSelItem) {
        let ID = newSelItem.node.tagEx;
        global.Module.FriendChooseData.setSelectID(ID);
        this.curSelItem = newSelItem;
        return false;
    };

    autoSelect(roleId) {
        let ndItem:any = this.ndItems.getChildByName(roleId.toString());
        if (ndItem != null) {
            let itemClass = ndItem.getComponent(global.CommonClass.FriendItem);
            this.changeSelect(itemClass);
        }
    };

    onFriendItemClick(event) {
        let node = event.getUserData();
        let ID = node.tagEx;
        let friend = global.Module.FriendChooseData.getFriend(ID);

        let newSelItem = node.getComponent(global.CommonClass.FriendItem);
        let isChangeSel = this.changeSelect(newSelItem);

        let friendIdx = global.Module.FriendChooseData.getFriendIndex(ID);
        if (friendIdx >= 0)
            this.reflash();

        // if (this.clickFriend)
        //     this.clickFriend(friend.roleInfo.roleId, isChangeSel);
        this.clickFriend(ID);
        if (!isChangeSel) {
            if (global.Module.FriendData.isSelf(friend.roleInfo.roleId)){//是否是自己的展厅
                global.CommonClass.UITip.showTipTxt('自己家', global.Enum.TipType.TIP_NORMAL);
            } else {
                this.move(false);
            }
        }
    };
   clickFriend(ID){
       let uiPreciousRoom = global.Manager.UIManager.get("UIPreciousRoom");
       let UIPreciousFriend = global.Manager.UIManager.get("UIPreciousFriend");
       let UIIdentify = global.Manager.UIManager.get("UIIdentify");
       let UIIdentifyFriend = global.Manager.UIManager.get("UIIdentifyFriend");
       let target = null;
       let callback = null;
       if (uiPreciousRoom != null || UIPreciousFriend != null) {
           target = global.Module.PreciousRoomData;
           callback = target.gotoRoom.bind(target, 0,ID);
       }
       if (UIIdentify != null || UIIdentifyFriend != null) {
           target = global.Module.IdentifyData;
           callback = target.gotoRoom.bind(target,ID);
       }
       callback();
   
   };
    showSimple(isSimple) {
        let friendItem = this.node.getChildByName('friendItem');

        friendItem.active = !isSimple;
    };

    btnMove() {
        this.move(false);
    };

    btnShow() {
        this.move(true);
    };

    btnGoHome(event) {

        if (this.clickHome)
            this.clickHome();

        global.CommonClass.Functions.changeScene('MainScene');
    };

    btnPage(event) {
        let pageDec = { 1: '等级', 2: '馆藏', 3: '声望' };

        this.sortType++;
        if (this.sortType > 3)
            this.sortType = 1;

        let dec = pageDec[this.sortType];
        let lblDec = this.spBackNode.getChildByName('btnPage').getChildByName('lblType');
        lblDec.getComponent(cc.Label).string = dec;

        this.show(null);
    };


    // update (dt) {}
}
