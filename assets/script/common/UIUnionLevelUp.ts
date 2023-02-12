
import UIBase from "../common/UIBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIUnionLevelUp extends UIBase {
    callBack: any;

    constructor() {
        super();
        this.callBack = null;
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    }

    onLoad() {

    }

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
    }

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
    }

    show(level) {
        let lblLevel = this.node.getChildByName('lblLevel').getComponent(cc.Label);
        lblLevel.string = (level - 1).toString();//'级农场吧主';

        let lblNewLevel = this.node.getChildByName('lblNewLevel').getComponent(cc.Label);
        lblNewLevel.string = (level).toString();
    }

    setCloseCB(callBack) {
        this.callBack = callBack;
    }

    btnClose() {
        if (this.callBack)
            this.callBack();

        global.Manager.UIManager.close('UIUnionLevelUp');
    }

    touchEvent(event) {
        if (event.type == cc.Node.EventType.TOUCH_END) {
            this.btnClose();
        }
    }

}
