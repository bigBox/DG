
const { ccclass, property } = cc._decorator;
@ccclass
export default class UIGuideMask extends cc.Component {

    factoryID: number = 0;
    maskUI: string = '';

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);

        this.setFactoryID(this.factoryID);
    };

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
    };

    touchEvent(event) {
        if (event.type == cc.Node.EventType.TOUCH_START) {
            let factory = global.Manager.DBManager.findData("Factory", 'ID', this.factoryID);
            if (factory != null)
                global.CommonClass.UITip.showTipTxt('功能将在' + factory.levelRequire.toString() + '级开放', global.Enum.TipType.TIP_BAD);


            //  return false;
        }
        else if (event.type == cc.Node.EventType.TOUCH_MOVE) {

        }
        else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {

        }
    };

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {};

    start() {

    };

    setFactoryID(ID) {
        this.factoryID = ID;

        let level = global.Module.MainPlayerData.getLevel();
        let factory = global.Manager.DBManager.findData("Factory", 'ID', this.factoryID);
        if (factory == null || factory.levelRequire <= level)
            this.node.active = false;
        else
            this.node.active = true;
    };

    btnClose() {
        global.Manager.UIManager.close(this.maskUI);
    };
    // update (dt) {}
}
