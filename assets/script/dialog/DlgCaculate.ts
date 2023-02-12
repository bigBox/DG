// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UIBase from "../common/UIBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DlgCaculate extends UIBase {
    ID: number;
    callback: any;

    constructor() {
        super();
        this.ID = 0;
        this.callback = null;
    }

    // use this for initialization
    onLoad() {

    }

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.on(cc.Node.EventType.MOUSE_WHEEL, this.touchEvent, this);

    }

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.off(cc.Node.EventType.MOUSE_WHEEL, this.touchEvent, this);
    }

    show(money, callback) {
        this.callback = callback;

        let lblMoeny = this.node.getChildByName('lblMoeny').getComponent(cc.Label);
        lblMoeny.string = '+' + money.toString();
    }
    btnYes() {
        if (this.callback)
            this.callback(true);

        global.Manager.UIManager.close('DlgCaculate');
    }

    btnNo() {
        let isOpen = global.Proxys.ProxyGuide.getIsOpen('PreciousGold');
        if (isOpen)
            global.CommonClass.UITip.showTipTxt('请您先完成引导', global.Enum.TipType.TIP_BAD);
        else
            global.Manager.UIManager.close('DlgCaculate');
    }

    touchEvent(event) {
        if (event.type == cc.Node.EventType.TOUCH_END) {
            global.Manager.UIManager.close('DlgCaculate');
        }
    }
}
