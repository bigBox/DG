//暂时用不到
const {ccclass, property} = cc._decorator;

@ccclass
export default class UIPaoPaoTipManager{
    Tips: any[];

    constructor () 
    {
       this.Tips = new Array();
    };

    addTip(params)
    {
        let item = {arg:params};
        this.Tips.unshift(item);
    };

    popTip()
    {
        if (this.Tips.length<=0)
            return false;

        let item = this.Tips.pop();
        global.CommonClass.UIPaoPaoTip.create(item.arg);
        return true;
    };

    clearTips()
    {
        let length = this.Tips.length;
        for (let i =0; i<length; ++i)
            this.Tips.pop();
    };

    updateCallback(dt)
    {
        this.popTip();
    };
    // update (dt) {}
}
