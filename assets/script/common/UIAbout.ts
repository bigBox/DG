

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIAbout extends cc.Component {
    helpKey: string;
    arg: number;
    constructor(){
        super();
        this.arg = 0;
        this.helpKey = '';
    };

    onLoad () {};

    start () {

    };
    btnClose() {
        global.Manager.UIManager.close('UIAbout');
    };
    dlgBtn() {
        cc.sys.openURL("http://www.xbaoba.com/webto/aboutus.html");
    };
    dlgclick() {
        cc.sys.openURL("http://www.xbaoba.com/index.html");
    };

    // update (dt) {}
}
