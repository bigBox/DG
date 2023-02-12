//tip管理器
const {ccclass, property} = cc._decorator;

@ccclass
export default class UICoinDropManager {
    drops: any[];
    delayTime: number;

    constructor () {
       this.drops = [];
       this.delayTime = 0;
    };

    addDrop(type: any, number: any) {
        let item = {type:type, number:number};
        this.drops.unshift(item);
    };

    popDrop() {
        if (this.drops.length<=0)
            return false;

        let item = this.drops.pop();
        global.CommonClass.CoinDrop.create(item.type,  item.number);

        return true;
    };

    clearTips() {
        this.drops = [];
    };

    updateCallback(dt: number) {
        this.delayTime+=dt;
        if(this.delayTime>0.6)
        {
            this.popDrop();
            this.delayTime = 0;
        }
    };
}
