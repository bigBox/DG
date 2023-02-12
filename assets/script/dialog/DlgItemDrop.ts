// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class DlgItemDrop extends cc.Component {
    callBack: any;
    itemID: any;
    decType: number;

    constructor() {
        super();
        this.itemID = null;
        this.callBack = null;
        this.decType = 1;
    }

    onLoad() {

    }

    start() {

    }

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);

        // let widget = this.node.getComponent(cc.Widget);
        // widget.updateAlignment();
    }

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
    }

    touchEvent(event) {
        if (event.type == cc.Node.EventType.TOUCH_END)
            this.btnClose();
    }

    show(itemID, number) {
        this.setItem(itemID);
        this.setNumber(number);

    }

    setCloseCB(callBack) {
        this.callBack = callBack;
    }

    setItem(itemId) {
        this.itemID = itemId;

        let iconFile = "images/pictrue/items/default";
        let data = global.Manager.DBManager.getItemNew(itemId);
        if (data != null) {
            iconFile = data.path + data.picName;

            let itemDec = this.node.getChildByName('ItemDec');
            let itemDecSprite = itemDec.getChildByName('spItem');
            global.CommonClass.Functions.setTexture(itemDecSprite, iconFile,null);

            let itemDecName = itemDec.getChildByName('lblName');
            itemDecName.getComponent(cc.Label).string = data.name;
        }
    }

    itemDropAction(beginPos) {
        let targetPos = this.node.getPosition();

        let ndMask = this.node.getChildByName('ndMask');
        let endFun = function () {
            ndMask.active = true;
        };
        let moveTo = cc.moveTo(1, targetPos);
        let scaleTo = cc.scaleTo(1, 1);
        let endCall = cc.callFunc(endFun);

        let spawn = cc.spawn(moveTo, scaleTo);
        let seq = cc.sequence(spawn, endCall);
        this.node.stopAllActions();
        this.node.runAction(seq);
    }
    playItemDrop(itemID, number, beginPos) {
        let self = this;

        let delayEnd = function () {
            self.itemDropAction(beginPos);
        };

        this.show(itemID, number);

        this.node.setScale(0.1);
        let position = this.node.parent.convertToWorldSpaceAR(beginPos);
        this.node.setPosition(position);

        let ndMask = this.node.getChildByName('ndMask');
        ndMask.active = false;

        // self.itemDropAction(beginPos);

        let endFunction = cc.callFunc(delayEnd);
        let timeDelay = cc.delayTime(1);
        let seq = cc.sequence(timeDelay, endFunction);
        this.node.stopAllActions();
        this.node.runAction(seq);
    }
    setNumber(number) {
        let itemDec = this.node.getChildByName('ItemDec');
        let itemDecNum = itemDec.getChildByName('lblNumber');
        itemDecNum.getComponent(cc.Label).string = 'X' + number.toString();
    }

    setBackOpacity(opacity) {
        if (opacity != null) {
            let ndMask = this.node.getChildByName('mask');
            ndMask.opacity = opacity;
        }
    }

    btnClose() {
        global.Manager.UIManager.delete(this);

        if (this.callBack)
            this.callBack()
    }
}
