import UIBase from "./UIBase";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UISocketLock extends UIBase {

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
   };

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
   };

    touchEvent(event) {
        if (event.type == cc.Node.EventType.TOUCH_START) {
            // global.CommonClass.UITip.showTipTxt('等待通讯中... ', global.Enum.TipType.TIP_BAD);
        }
   };

    // use this for initialization
    onLoad() {
        //cc.Instance.Log.debug("ui " + this.className + " load...");
   };

    // update (dt) {}
}
