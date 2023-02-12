
const { ccclass, property } = cc._decorator;

@ccclass
export default class DlgAdultConfirm extends cc.Component {
    callback: any;

    ctor() {
        this.callback = null;
    }
    // use this for initialization
    onLoad() {

    }

    setTitle(title) {
        let lblTitle = this.node.getChildByName("lblTitle");
        let titleComp = lblTitle.getComponent(cc.Label);
        titleComp.string = title;
    }

    setTxt(txt) {
        let lblTxt = this.node.getChildByName("lblTxt");
        let txtComp = lblTxt.getComponent(cc.RichText);

        txt = '<outline color=#000000 width=3>' + txt + '</outline>';
        txtComp.string = txt;
    }

    setCallBack(callback) {
        this.callback = callback;
    }

    btnNo() {
        if (this.callback)
            this.callback(false);

        this.node.removeFromParent();
    }

    btnYes() {
        if (this.callback)
            this.callback(true);

        this.node.removeFromParent();
    }

    onEnable() {

    }

    onDisable() {
    }

    // update (dt) {}
}
