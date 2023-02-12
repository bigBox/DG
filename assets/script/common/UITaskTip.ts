

const {ccclass, property} = cc._decorator;

@ccclass
export default class UITaskTip extends cc.Component {
    
    @property({ type: cc.Label, displayName: "rhTxt", tooltip: "文字" })
    rhTxt: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    show(txt){
        if(txt =='')
        return;
        this.rhTxt.string = txt;
    }
    btnClose(){
        global.Manager.UIManager.close('UITaskTip');
    }

    // update (dt) {}
}
