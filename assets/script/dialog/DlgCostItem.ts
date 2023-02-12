import UIBase from "../common/UIBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class DlgCostItem extends UIBase {
    ID: number;
    callback: any;
    constructor() {
        super();
        this.ID = 0;
        this.callback = null;
    };

    onLoad() { }

    start() {

    }
    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.on(cc.Node.EventType.MOUSE_WHEEL, this.touchEvent, this);
    };

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.off(cc.Node.EventType.MOUSE_WHEEL, this.touchEvent, this);
    };

    show(leftTime, callback) {
        this.callback = callback;
        let itemID = 2;
        let data = global.Manager.DBManager.findData('Sundry', 'name', 'accelerateConsumption');
        let itemNum = Math.ceil(leftTime / (data.value * 60));
        let itemCount = global.Module.PackageData.getItemCount(itemID);
        let lblNeed = this.node.getChildByName('lblNeed').getComponent(cc.Label);
        lblNeed.string = itemNum.toString() + '/' + itemCount.toString();
        if (itemCount >= itemNum)
            lblNeed.node.color = cc.color(0, 255, 0);
        else
            lblNeed.node.color = cc.color(255, 0, 0);
    };

    btnYes() {
        if (this.callback)
            this.callback(true);

        global.Manager.UIManager.close('DlgCostItem');
    };

    btnNo() {
        if (this.callback)
            this.callback(false);

        global.Manager.UIManager.close('DlgCostItem');
    };

    touchEvent(event) {

    };
    // update (dt) {}
}
