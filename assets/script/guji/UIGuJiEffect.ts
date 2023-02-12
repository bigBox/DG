import UIBase from "../common/UIBase";

const { ccclass, property } = cc._decorator;
@ccclass
export default class UIGuJiEffect extends UIBase {
    callback: any;
    animation: any;
    effectName: string;
    constructor() {
        super();
        this.animation = null;
        this.callback = null;

        this.effectName = '';
    };
    onLoad() { }

    start() {

    }


    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);

        let effects = this.node.getChildByName('ndEffect').children;
        for (let key in effects) {
            let ndEffect = effects[key];
            ndEffect.active = false;
        }
    };

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
    };

    btnClose() {
        global.Manager.UIManager.close('UIGuJiEffect');
        if (this.callback != null){
            this.callback(true);
            this.callback = null;
        }
        global.Instance.AudioEngine.stopSound(this.effectName);
    };

    playEnd() {
        if (this.callback != null)
            this.callback(this);
        let animation = this.node.getComponent(cc.Animation);
        animation.play('uiGuJiEffect');
        this.animation = null;
    };

    play(robId, callback) {
        let data = global.Manager.DBManager.findData('TrapEvent', 'ID', robId);

        this.effectName = data.effect;

        let ndEffect = this.node.getChildByName('ndEffect');
        let rhxDec = this.node.getChildByName('rhxDec').getComponent(cc.RichText);

        // this.scheduleOnce(function () {
        //         rhxDec.node.scale = 1;
        //         let pos = rhxDec.node.getPosition();
        //         rhxDec.node.setPosition(cc.v2(pos.x, pos.y + 100));

        //         ndEffect.scale = 0.75;
        // }, 0);
        setTimeout(() => {
            if (this.callback != null){
                this.callback(false);
                this.callback = null;
            }
                
        }, 1000);



        let spEffect = ndEffect.getChildByName(this.effectName);
        spEffect.active = true;

        this.callback = callback;

        this.animation = spEffect.getComponent(sp.Skeleton);
        this.animation.setCompleteListener(() => {
            this.btnClose();
        });
        let dec = '<outline color=#000000 width=3> <color=#ffffff>' + data.content + '  体力<color><color=#ff701c>' + data.actionValue.toString() + '</color></outline>';
        rhxDec.string = dec

        global.Instance.AudioEngine.replaySound(this.effectName, true, null);
    };

    touchEvent() {
        this.btnClose();
    };
    // update (dt) {}
}
