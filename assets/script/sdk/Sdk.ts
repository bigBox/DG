const { ccclass, property } = cc._decorator;

@ccclass
export default class Sdk extends cc.Component {
    prepayId: any = 0;//支付id
    sizeX: any = -1;
    setprepayId(prepayId) {
        this.prepayId = prepayId
    };
    getprepayId() {
        return this.prepayId;
    };
    wxLoginResult(response) {
        global.Instance.Log.debug(response,'wxLoginResult')
        cc.systemEvent.emit('wxLoginResult', response);
    };
    toWXPay(response) {
        var prepayId = this.getprepayId();
        global.Instance.Log.debug("支付回调", response)
        let self = this;
        if (prepayId == 0)
            return;
        var data = { account: global.Module.GameData.getAccount(), prepayId: prepayId, roleID: global.Module.MainPlayerData.getRoleID() };
        global.Instance.MsgPools.send('wechatPayQuery', data, function (msg) {
            global.Instance.Log.debug("支付回调", msg.errorID)
            self.setprepayId(0);
            if (msg.errorID == 0) {
                global.Manager.UIManager.close('UIPayment');
                let UIShopNew = global.Manager.UIManager.getMutiPanel('UIShopNew');
                if (UIShopNew)
                    UIShopNew.refreshMoney();
                global.CommonClass.UITip.showTipTxt('支付成功', global.Enum.TipType.TIP_BAD);
            } else {
                global.Manager.UIManager.close('UIPayment');
                global.CommonClass.UITip.showTipTxt('支付失败', global.Enum.TipType.TIP_BAD);
            }
        });

    };
    /**
     * 
     * @param {*} type 1成功 2失败 
     * @param {*} response 
     * @returns 
     */
    toZFBPay(type, response) {
        let prepayId = this.getprepayId();
        let msg = JSON.parse(response);
        global.Instance.Log.debug("支付宝支付回调", msg)
        let self = this;
        if (type == 2 || prepayId == 0) {
            global.Manager.UIManager.close('UIPayment');
            global.CommonClass.UITip.showTipTxt('支付失败', global.Enum.TipType.TIP_BAD);
        } else {
            let tradeNo = msg.alipay_trade_app_pay_response.trade_no
            let data = { account: global.Module.GameData.getAccount(), tradeNo: tradeNo, roleID: global.Module.MainPlayerData.getRoleID() };
            global.Instance.MsgPools.send('zfbPayQuery', data, function (msg) {
                global.Instance.Log.debug("支付回调", msg.errorID)
                self.setprepayId(0);
                if (msg.errorID == 0) {
                    let UIShopNew = global.Manager.UIManager.getMutiPanel('UIShopNew');
                    if (UIShopNew)
                        UIShopNew.refreshMoney();
                    global.Manager.UIManager.close('UIPayment');
                    global.CommonClass.UITip.showTipTxt('支付成功', global.Enum.TipType.TIP_BAD);
                } else {
                    global.Manager.UIManager.close('UIPayment');
                    global.CommonClass.UITip.showTipTxt('支付失败', global.Enum.TipType.TIP_BAD);
                }
            });

        }

    };
    Bangs(sizeX) {
        this.sizeX = sizeX;
    };
    sizeMath() {
        let windowSize = cc.view.getFrameSize();
        if (this.sizeX == -1) {
            var a = parseInt((windowSize.width / windowSize.height * 100).toString());
            var b = parseInt((16 / 9 * 100).toString());
            if (a > b) {
                if (cc.sys.platform == cc.sys.ANDROID) {
                    this.sizeX = 60;
                } else if (cc.sys.os == cc.sys.OS_IOS) {
                    this.sizeX = 54;
                } else {
                    this.sizeX = 60;
                }

            } else {
                this.sizeX = 0
            }
        }
        return this.sizeX;
    }

    // update (dt) {}
}
