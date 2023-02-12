//tip管理器
const { ccclass, property } = cc._decorator;

@ccclass
export default class UITipManager extends cc.Component {
    Tips: any[];
    index: number;
    delayTime: number;
    constructor() {
        super();
        this.Tips = [];
        this.index = 0;
        this.delayTime = 0;
    };
    getIndex(){
        return this.Tips.length;
    }

    addTip(tipType: any, params: any) {
        this.index = this.Tips.length;
        let item = { type: tipType, arg: params, index: this.index };
        this.Tips.unshift(item);
        let clickAnim = global.Manager.UIManager.getResident('clickAnim');
        if (clickAnim && this.Tips.length > 2)
            clickAnim.popTip();
        
    };
    clearTip() {

        let clickAnim = global.Manager.UIManager.getResident('clickAnim');
        if (clickAnim)
            clickAnim.popTip();
        this.Tips.pop();
    };
    clear() {
        this.Tips.pop();
    };
    clearTips() {
        let length = this.Tips.length;
        for (let i = 0; i < length; ++i)
            this.Tips.pop();
    };

}
