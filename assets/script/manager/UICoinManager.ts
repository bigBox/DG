
const {ccclass, property} = cc._decorator;

@ccclass
export default class UICoinManager {
    panels: any[];

    constructor()
    {
        this.panels = new Array();
    };
    addPanel(panel: any) {
        this.panels.push(panel);
    };

    updateCallback() {
       // //cc.Instance.Log.debug("xxx");
    };

    onCoinChange(coinType: any) {
        let length = this.panels.length;
        for (let i =0; i<length; ++i)
        {
           let coin = this.panels[i].getComponent(global.CommonClass.UICommonCoin);
           coin.reflash(coinType);
        }
    };

    clearCoins() {
        let length = this.panels.length;
        for (let i =0; i<length; ++i)
            this.panels.pop();
    };
}
