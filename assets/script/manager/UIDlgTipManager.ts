//tip管理器

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIDlgTipManager {
    Tips: any[];
    state: number;

    constructor () {
        this.Tips = new Array();

        this.state = 0; //0.正常 1.正在弹出中 2.锁定中
    };
    addTip (tipType: any, data: any) {
        if (this.isLockAdd())
            return false;

        let item = {
            type: tipType,
            data: data
        };
        this.Tips.push(item);

        if (this.state == 0) {
            this.popTip();
        }
        return true;
    };
    popTip () {
        if (this.Tips.length <= 0) {
            this.state = 0;
            return false;
        } else
            this.state = 1;

        let item = this.Tips[0];
        this.Tips.shift();

        this.showDlgTip(item.type, item.data);
        return true;
    };
    clearTips () {
        this.Tips = [];
        this.state = 0;
    };
    showDlgTip (type: any, data: { itemID: any; num: any; bookID: any; idxs: any; gains: any; dropND: any; type: any; callBack: (arg0: any) => void; arg: any; }) {
        let self = this;

        if (type == global.Enum.DlgTipType.DLG_LEVELUP) {
            global.Manager.UIManager.open('UILevelUpNew', null, function (panel: { setCloseCB: (arg0: any) => void; }) {
                panel.setCloseCB(self.popTip.bind(self));
            })
            self.popTip();
        } else if (type == global.Enum.DlgTipType.DLG_ITEMGET) {
            //global.CommonClass.ItemDrop.createOneDrop(data.itemID, data.num, null, null, self.popTip.bind(self));

            let gains = [];
            let ganisItem = {
                itemID: data.itemID,
                itemNum: data.num,
                type: 0
            };
            gains.push(ganisItem);

            global.Manager.UIManager.open('DlgCollectDrop', null, function (panel: { show: (arg0: any[]) => void; setCloseCB: (arg0: any) => void; }) {
                panel.show(gains);
                panel.setCloseCB(self.popTip.bind(self));
            });

        } else if (type == global.Enum.DlgTipType.DLG_HANDBOOK) {
            //图鉴点亮弹框已删除
        } else if (type == global.Enum.DlgTipType.DLG_MULITEMGET) {
            global.CommonClass.ItemDrop.createMultiDrop(data.gains, data.dropND, null, self.popTip.bind(self));
        } else if (type == global.Enum.DlgTipType.DLG_MULDROP) {
            global.Manager.UIManager.open('DlgCollectDrop', null, function (panel: { show: (arg0: any) => void; setCloseCB: (arg0: any) => void; }) {
                panel.show(data);
                panel.setCloseCB(self.popTip.bind(self));
            });
        } else if (type == global.Enum.DlgTipType.DLG_COINDROP) {
            global.CommonClass.CoinDrop.create(data.type, data.num);

            let endCall = function () {
                this.popTip();
            };
            let timeDelay = cc.delayTime(1);
            let endFunc = cc.callFunc(endCall);
            let seq = cc.sequence(timeDelay, endFunc);


        } else if (type == global.Enum.DlgTipType.DLG_FUNCTION) {
            data.callBack(data.arg);
            this.popTip();
        }
    };
    isLockAdd () {
        return this.state == 2;
    };
    lockAdd (isLock: any) {
        if (isLock) {
            this.state = 2;
        } else {
            this.state = 0;
            this.popTip();
        }
    };
}
