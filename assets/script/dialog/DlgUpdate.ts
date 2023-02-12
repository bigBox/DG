import UIBase from "../common/UIBase";


const {ccclass, property} = cc._decorator;

@ccclass
export default class DlgUpdate extends UIBase {
    item: any;
    constructor () {
        super();
        this.item = null;
    }
    onLoad () {}

    start () {

    }
    Tobtn () {
        cc.sys.openURL("http://www.xbaoba.com/extension/xunbao.html");
    };
    // update (dt) {}
}
