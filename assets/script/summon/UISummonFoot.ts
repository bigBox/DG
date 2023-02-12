
const {ccclass, property} = cc._decorator;

@ccclass
export default class UISummonFoot extends cc.Component {
    @property({ type: cc.Node, displayName: "itemNode", tooltip: "克隆节点" })
    itemNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "content", tooltip: "滚动视图" })
    content: cc.Node = null;
    @property({ type: cc.Label, displayName: "totalLabel", tooltip: "挖宝次数" })
    totalLabel: cc.Label = null;
    mailData: { totalNum: number; trapNum: number; itemArr: {}; };


    start() {
        this.refalsh();
    };
    refalsh(): void {
        let data = global.Module.SummonData.getMailData();
      
        let items = [];
        for (let key in data.itemArr) {
            let date = data.itemArr[key];
            if (date.ID != 11) {
                let itemData = global.Manager.DBManager.getItemNew(date.ID);
                if (itemData.isRare && itemData.isRare == 2) {
                    items.unshift(date)
                } else {
                    items.push(date)
                }
            }
        }
        if (data.itemArr[11])
            items.unshift(data.itemArr[11]);


        this.totalLabel.string = '总共'+data.totalNum+'个包裹,'+data.trapNum+'投资包裹';
       
        for (let key in items) {
            let date = items[key];
            
            let item = cc.instantiate(this.itemNode);
            this.content.addChild(item);
            item.active = true;
            this.refalshItem(item,date);
        }
    };
    refalshItem(itemNode, date): void {
        let itemData = global.Manager.DBManager.getItemNew(date.ID);
        if (itemData != null) {
            let path = itemData.path + itemData.picName
            let spItem = itemNode.getChildByName('spItem');
            global.CommonClass.Functions.setTexture(spItem, path, function () {
                spItem.scale = global.CommonClass.Functions.getToscale(spItem, 100, 100);
            });
            let lblNum = itemNode.getChildByName('NumLabel').getComponent(cc.Label);
            let strNum = global.CommonClass.Functions.formatMoney(date.contNum);
            lblNum.string = strNum;
            if (date.contNum == 1)
                lblNum.node.active = false;
            let bgNode1 = itemNode.getChildByName('bg1');
            let bgNode2 = itemNode.getChildByName('bg2');
            bgNode1.active = !(itemData.isRare && itemData.isRare == 2);
            bgNode2.active = (itemData.isRare && itemData.isRare == 2);
        }
       
    };
    btnClose(): void {
        let roleId = global.Module.MainPlayerData.getRoleID();
        global.Instance.MsgPools.send('summonInfo', { roleId: roleId }, null);
        global.Manager.UIManager.close('UISummonFoot');
    };
    // update (dt) {}
}
