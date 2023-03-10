import UIBase from "../common/UIBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UIShopNew extends UIBase {

    @property({ type: cc.Node, displayName: "nodeTemplate", tooltip: "nodeTemplate" })
    nodeTemplate: cc.Node = null;
    @property({ type: cc.ScrollView, displayName: "nodeScrollView", tooltip: "nodeScrollView" })
    nodeScrollView: cc.ScrollView = null;
    @property({ type: cc.Node, displayName: "nodeScrollViewContent", tooltip: "nodeScrollViewContent" })
    nodeScrollViewContent: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndSpeek", tooltip: "ๅๅไป็ป" })
    ndSpeek: cc.Node = null;
    @property({ type: cc.Node, displayName: "spMoneyTag", tooltip: "spMoneyTag" })
    spMoneyTag: cc.Node = null;

    chooseShopId: number;
    data: any[];
    buyCallback: any;
    constructor() {
        super();
        this.chooseShopId = -1;
        this.data = [];
        this.buyCallback = null;
    };

    onLoad() {
        this.ndSpeek.active = false;
    };

    start() {

    };
    refreshMoney(type) {
        // if (type == 1) {
        //     let lblMoney = this.spMoneyTag.getChildByName("lblMoney");
        //     let diamond = global.Module.MainPlayerData.getDataByKey('Diamond');
        //     if (diamond != null) {
        //         lblMoney.getComponent(cc.Label).string = diamond.toString();
        //     } else {
        //         lblMoney.getComponent(cc.Label).string = '0';
        //     }
        //     global.CommonClass.Functions.setTexture(this.spMoneyTag, "images/pictrue/virtualitem/diamond", null);
        // } else if (type == 2) {
        //     let lblMoney = this.spMoneyTag.getChildByName("lblMoney");
        //     let money = global.Module.MainPlayerData.getDataByKey('GuildScore');
        //     if (money != null) {
        //         lblMoney.getComponent(cc.Label).string = money.toString();
        //     } else {
        //         lblMoney.getComponent(cc.Label).string = '0';
        //     }
        //     global.CommonClass.Functions.setTexture(this.spMoneyTag, "images/pictrue/virtualitem/union", null);
        // }
    };

    onEnable() {
        this.nodeScrollView.node.on('scrolling', this.scrollingCB, this);

        // 1:้ป็ณ 0:็งฏๅ
        let type = 1;
        this.data = global.Module.ShopData.getDataByType(type);
        global.Instance.Log.debug("this.data", this.data)

        this.refreshMoney(type);

        this.nodeScrollViewContent.removeAllChildren();

        {
            let nodeLeft = new cc.Node("nodeLeft");
            nodeLeft.width = this.node.width / 2;
            nodeLeft.height = 480;
            this.nodeScrollViewContent.addChild(nodeLeft);
        }

        let i = 0;
        for (let key in this.data) {
            let idx = i;

            let shopId = this.data[key].id;
            let cfgData = global.Manager.DBManager.findData('MiniMall', 'Id', shopId);
            let nodeItem = cc.instantiate(this.nodeTemplate);
            nodeItem.active = true;
            nodeItem.x = 0;
            nodeItem.y = 0;
            this.nodeScrollViewContent.addChild(nodeItem);
            global.Instance.Log.debug("shopId", shopId)
            if (shopId != 1007) {
                let nodeTouch = nodeItem.getChildByName("nodeTouch");
                nodeTouch.on('click', function () {
                    let posX = idx * 280;
                    this.nodeScrollView.scrollToOffset(cc.v2(posX, 0), 1.0);
                    if (this.chooseShopId == shopId) {
                        this.chooseShopId = -1;
                    } else {
                        this.chooseShopId = shopId;
                    }
                    this.showItemTips();
                }.bind(this), this);

                let spItem = nodeItem.getChildByName("spItem");
                let lblNum = nodeItem.getChildByName("lblNum");
                let lblCost = nodeItem.getChildByName("lblCost");
                let spCostTag = nodeItem.getChildByName("spCostTag");

                let btnBuy = nodeItem.getChildByName("btnBuy");
                btnBuy.on('click', function () {
                    this.buyCallback = null;
                    this.showBuyDlg(nodeItem, type, cfgData, function () {
                        let tmp = {};
                        tmp[shopId] = 1;

                        let sendData = { type: 0, buyType: type - 1, items: tmp };
                        global.Instance.MsgPools.send('mallBuy', sendData, function (msg) {
                            if (!msg.errorID) {
                                // global.CommonClass.UITip.showTipTxt('่ดญไนฐๆๅ', global.Enum.TipType.TIP_GOOD);
                                this.playDrop(shopId);
                                this.refreshMoney();
                            } else {
                                global.CommonClass.UITip.showTipTxt('่ดญไนฐๅคฑ่ดฅ', global.Enum.TipType.TIP_BAD);
                            }
                        }.bind(this));
                    }.bind(this))
                }.bind(this), this);

                lblNum.getComponent(cc.Label).string = 'X' + cfgData.NumPerPackage.toString();

                if (type == 1) {
                    lblCost.getComponent(cc.Label).string = cfgData.Price.toString();

                    let filePath = "images/pictrue/virtualitem/diamond";
                    global.CommonClass.Functions.setTexture(spCostTag, filePath, null);
                } else if (type == 2) {
                    lblCost.getComponent(cc.Label).string = cfgData.guildScore.toString();

                    let filePath = "images/pictrue/virtualitem/union";
                    global.CommonClass.Functions.setTexture(spCostTag, filePath, null);
                }

                let cfgItem = global.Manager.DBManager.getItemNew(cfgData.ItemId);
                if (cfgItem != null) {
                    let iconFile = cfgItem.path + cfgItem.picName;
                    global.CommonClass.Functions.setTexture(spItem, iconFile, null);
                }

                i++;
            } else {
                nodeItem.getChildByName("spCostTag").active = false;
                let nodeTouch = nodeItem.getChildByName("nodeTouch");
                let btnBuy = nodeItem.getChildByName("btnBuy");
                btnBuy.on('click', this.paymentclick.bind(this));
                nodeTouch.on('click', this.paymentclick.bind(this));
                global.CommonClass.Functions.setTexture(nodeItem.getChildByName("btnBuy").getChildByName("Background"), "images/ui/common/xan000", null);
                i++;
            }

        }

        {
            let nodeRight = new cc.Node("nodeRight");
            nodeRight.width = this.node.width / 2;
            nodeRight.height = 480;
            this.nodeScrollViewContent.addChild(nodeRight);
        }

        this.nodeScrollViewContent.getComponent(cc.Layout).updateLayout();
        this.nodeScrollView.scrollToOffset(cc.v2(280 + 140 + 280, 0), 0.5);
    };

    playDrop(shopId) {
        let allItems = [];
        let mallData = global.Manager.DBManager.findData('MiniMall', 'Id', shopId);
        let item = { itemID: mallData.ItemId, itemNum: mallData.NumPerPackage, type: 0 };
        allItems.push(item);

        if (allItems.length > 0) {
            global.Manager.UIManager.open('DlgCollectDrop', null, function (panel) {
                panel.show(allItems);
            });
        }
    };
    paymentclick() {
        var data = { itemID: 2, count: 500, amount: 1, account: global.Module.GameData.getAccount(), roleID: global.Module.MainPlayerData.getRoleID() };
        global.Manager.UIManager.open('UIPayment', null, function (panel) {
            panel.show(data);
        });
        // global.Instance.MsgPools.send('wechatPrePay', data, function (msg) {
        //     if (msg.errorID == 0) {
        //         if (data.nonceStr!="") {
        //             global.Manager.UIManager.open('UIPayment',null, function(panel)
        //             {
        //                 panel.show(msg);
        //             });  
        //         }else{
        //             global.CommonClass.UITip.showTipTxt("่ฎขๅๅท่ทๅๅคฑ่ดฅ", global.Enum.TipType.TIP_BAD);
        //         }

        //     }else{
        //         var type = 'ๆชๆๅนดไธๅ่ฎธๅๅผใ'
        //         if (global.Module.GameData.getage() < 8) {
        //             type = "ๆชๆปก8ๅจๅฒไปฅไธ็ฉๅฎถๆ?ๆณๅๅผ"
        //         }else if (global.Module.GameData.getage() < 16) {
        //             type = "8ๅจๅฒไปฅไธๆชๆปก16ๅจๅฒ็็จๆท๏ผๅๆฌกๅๅผ้้ขไธ่ถ่ฟ50ๅไบบๆฐๅธ๏ผๆฏๆๅๅผ้้ข็ดฏ่ฎกไธ่ถ่ฟ200ๅไบบๆฐๅธใ"
        //         }else if (global.Module.GameData.getage() < 18) {
        //             type = "16ๅจๅฒไปฅไธๆชๆปก18ๅจๅฒ็็จๆท๏ผๅๆฌกๅๅผ้้ขไธ่ถ่ฟ100ๅไบบๆฐๅธ๏ผๆฏๆๅๅผ้้ข็ดฏ่ฎกไธ่ถ่ฟ400ๅไบบๆฐๅธใ" 
        //         }
        //     global.Manager.UIManager.open('DlgAdultConfirm', null, function (panel) {
        //         if (panel)
        //             panel.setTxt(type);
        //     }) 
        //     }
        // }); 
    };
    ndSpeekISshow(){
        this.ndSpeek.active = false;    
    };
    showItemTips() {
        if (this.chooseShopId == -1) {
            this.ndSpeek.active = false;
            return;
        }
        this.ndSpeek.active = true;

        let cfgData = global.Manager.DBManager.findData('MiniMall', 'Id', this.chooseShopId);
        let cfgItem = global.Manager.DBManager.getItemNew(cfgData.ItemId);

        let lblDec = this.ndSpeek.getChildByName("lblDec");
        lblDec.getComponent(cc.Label).string = cfgItem.resume2;
    };

    onDisable() {
        this.nodeScrollView.node.off('scrolling', this.scrollingCB, this);
    };

    scrollingCB() {
    };

    btnClose() {
        global.Manager.UIManager.close('UIShopNew');
    };

    showBuyDlg(nodeItem, type, cfgData, callback) {

        if (callback != null) {
            callback();
        }
     
    };


    // update (dt) {}
}
