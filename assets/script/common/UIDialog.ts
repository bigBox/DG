const {ccclass, property} = cc._decorator;
@ccclass
export default class UIDialog extends cc.Component {
    callback: any;

    constructor () {
        super();
        this.callback = null;
    };
    static create(title: any, txt: any, callback: any): any {
        let filePath = "prefab/common/UIDialog";
        cc.loader.loadRes(filePath, function (err, prefab) {
            if (err == null) {
                let newNode = cc.instantiate(prefab);
                let parent = global.CommonClass.Functions.getRoot();
                parent.addChild(newNode, cc.macro.MAX_ZINDEX);
    
                let dialog = newNode.getComponent(UIDialog);
                dialog.setTitle(title);
                dialog.setTxt(txt);
                dialog.setCallBack(callback);
            }
        });
    }
    setTitle (title: string) {
        let lblTitle = this.node.getChildByName("lblTitle");
        let titleComp = lblTitle.getComponent(cc.Label);
        titleComp.string = title;
    };
    setTxt (txt: string) {
        let lblTxt = this.node.getChildByName("lblTxt");
        let txtComp = lblTxt.getComponent(cc.RichText);
        txt = '<outline color=#336FBA width=2>' + txt + '</outline>';
        txtComp.string = txt;
    };

    setCallBack (callback: any) {
        this.callback = callback;
    };

    btnNo () {
        if (this.callback)
            this.callback(false);

        this.node.removeFromParent();
    };

    btnYes () {
        if (this.callback)
            this.callback(true);

        this.node.removeFromParent();
    };
    // update (dt) {}
}
