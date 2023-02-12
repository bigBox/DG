const { ccclass, property } = cc._decorator;

@ccclass
export default class EditBoxEx extends cc.Component {

    onLoad() { }

    start() {

    }
    removeSpace() {
        let edtBox = this.node.getComponent(cc.EditBox);

        let txt = edtBox.string;
        txt = txt.replace(/\s+/g, "");
        edtBox.string = txt;
    };
    // update (dt) {}
}
