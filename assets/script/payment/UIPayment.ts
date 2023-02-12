import UIBase from "../common/UIBase";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UIPayment extends UIBase {
    @property({ type: cc.Label, displayName: "moneyLabel", tooltip: "现金数目" })
    moneyLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: "makeNode", tooltip: "makeNode" })
    makeNode: cc.Node = null;
    data: any;
    @property({ type: cc.ToggleContainer, displayName: "conNode", tooltip: "conNode" })
    conToggle: cc.ToggleContainer = null;
    @property({ type: cc.EditBox, displayName: "diamondEdBox", tooltip: "其他数目输入框" })
    diamondEdBox: cc.EditBox = null;
    
    temp: number;//输入框输入数字缓存
    
    

    onLoad () {}

    start () {

    }
    show() {
        let type = 3;
        let data = global.Module.ShopData.getDataByType(type);
        let cfgData = global.Manager.DBManager.findData('MiniMall', 'Id', data[0].id);
        this.data = { itemID:  cfgData.ItemId, count: cfgData.NumPerPackage, amount: cfgData.money, account: global.Module.GameData.getAccount(), roleID: global.Module.MainPlayerData.getRoleID() };
        let money = (this.data.amount / 100).toFixed(2);
        this.moneyLabel.string = money;
        for (let i = 0; i < data.length; i++) {
            let element = data[i];
            let toggleNode:any =  this.conToggle.node.children[i]
            toggleNode.element = element
        }
    };
    recordData(ID){
         if(ID == 3005){

         }else{
            let cfgData = global.Manager.DBManager.findData('MiniMall', 'Id', ID);
            this.data.itemID = cfgData.ItemId;
            this.data.count = cfgData.NumPerPackage;
            this.data.amount = cfgData.money;
         }
        //  let money = (this.data.amount / 100).toFixed(2);
         this.moneyLabel.string = this.data.amount;
    }
    toggleclick(event){
        this.recordData(event.node.element.id);
    };
    EDidBegan(event){
        this.temp = 0;
        this.conToggle.node.getChildByName('toggle5').getComponent(cc.Toggle).isChecked = true;
    };
    TextChanged(num){
        num = Number(num)
        if (num == NaN) {
        
        } else {
            this.temp = num;
            this.moneyLabel.string = (num*0.05).toString();
        }
     //this.diamondEdBox.string = num.toString();
        
    };

    VX_Pay() {
        let self = this;
        this.makeNode.active = true;
        global.Instance.Log.debug("VX支付",this.data)
        global.Instance.MsgPools.send('wechatPrePay', this.data, function (msg) {
            global.Instance.Log.debug("VX",msg)
            if (msg.errorID == 0) {
                if (msg.nonceStr!="") {
                    self.XV_ZFSDK(msg); 
                }else{
                    self.makeNode.active = false;
                    global.CommonClass.UITip.showTipTxt("订单号获取失败", global.Enum.TipType.TIP_BAD);
                }
                
            }else{
                self.makeNode.active = false;
                var type = '未成年不允许充值。'
                if (global.Module.GameData.getage() < 8) {
                    type = "未满8周岁以下玩家无法充值"
                }else if (global.Module.GameData.getage() < 16) {
                    type = "8周岁以上未满16周岁的用户，单次充值金额不超过50元人民币，每月充值金额累计不超过200元人民币。"
                }else if (global.Module.GameData.getage() < 18) {
                    type = "16周岁以上未满18周岁的用户，单次充值金额不超过100元人民币，每月充值金额累计不超过400元人民币。" 
                }
            global.Manager.UIManager.open('DlgAdultConfirm', null, function (panel) {
                if (panel)
                    panel.setTxt(type);
            }) 
            }
        }); 
        

    };
    XV_ZFSDK(data) {
        global.Instance.Log.debug('支付' , data.nonceStr);
        if (cc.sys.platform === cc.sys.ANDROID) {
            if (jsb) {
                global.Manager.Sdk.setprepayId(this.data.prepayId);
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "toWXPay", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", data.prepayId, data.nonceStr, data.timeStamp, data.sign);
            }
        }   
    };
    ZFB_Pay() {
        let self = this;
        this.makeNode.active = true;
        // this.data.amount = (this.data.amount / 100).toFixed(2);
        global.Instance.Log.debug("ZFB支付",this.data)
        global.Instance.MsgPools.send('zfbPrePay', this.data, function (msg) {
            global.Instance.Log.debug("ZFB",msg)
            if (msg.errorID == 0) {
                if (msg.nonceStr!="") {
                    self.ZFB_ZFSDK(msg); 
                }else{
                    self.makeNode.active = false;
                    global.CommonClass.UITip.showTipTxt("订单号获取失败", global.Enum.TipType.TIP_BAD);
                }
                
            }else{
                self.makeNode.active = false;
                var type = '未成年不允许充值。'
                if (global.Module.GameData.getage() < 8) {
                    type = "未满8周岁以下玩家无法充值"
                }else if (global.Module.GameData.getage() < 16) {
                    type = "8周岁以上未满16周岁的用户，单次充值金额不超过50元人民币，每月充值金额累计不超过200元人民币。"
                }else if (global.Module.GameData.getage() < 18) {
                    type = "16周岁以上未满18周岁的用户，单次充值金额不超过100元人民币，每月充值金额累计不超过400元人民币。" 
                }
            global.Manager.UIManager.open('DlgAdultConfirm', null, function (panel) {
                if (panel)
                    panel.setTxt(type);
            }) 
            }
        });  
    };
    ZFB_ZFSDK(data) {
        global.Instance.Log.debug('支付' , data);
        if (cc.sys.platform === cc.sys.ANDROID) {
            if (jsb) {
                global.Manager.Sdk.setprepayId(data.prepayId);
                let str = data.orderString
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "payV2", "(Ljava/lang/String;)V", str);
            }
        }

    };
    btnClose() {
        global.Manager.UIManager.close('UIPayment');
    };
    // update (dt) {}
}
 