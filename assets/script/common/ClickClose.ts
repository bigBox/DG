const { ccclass, property } = cc._decorator;

@ccclass
export default class ClickClose extends cc.Component {
    static filePath: "prefab/common/";
    @property({ displayName: "UIName", tooltip: "UIName" })
    UIName: string ='';
    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
    };

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
    };

    touchEvent(event) {
        if (event.type == cc.Node.EventType.TOUCH_START) {

        }
        else if (event.type == cc.Node.EventType.TOUCH_MOVE) {

        }
        else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
            if (this.UIName.length > 0)
                global.Manager.UIManager.close(this.UIName);
        }
    };

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    };

    btnClose() {

    };

    // update (dt) {}
}
