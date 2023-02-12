
const {ccclass, property} = cc._decorator;

@ccclass
export default class UIGujiFoot extends cc.Component {
    @property({ type: cc.Node, displayName: "itemNode", tooltip: "克隆节点" })
    itemNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "content", tooltip: "滚动视图" })
    content: cc.Node = null;
    @property({ type: cc.Label, displayName: "totalLabel", tooltip: "挖宝次数" })
    totalLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: "trapLabel", tooltip: "踩陷阱次数" })
    trapLabel: cc.Label = null;
    // totalData: { totalNum: number; trapNum: number; itemArr: {}; };


    start () {

    };
    refalsh(data): void{
        this.totalLabel.string = '挖宝' + data.totalNum + '次';
        this.trapLabel.string = '踩中陷阱' + data.trapNum + '次';
        let items = [];
        for (let key in data.itemArr) {
            let date = data.itemArr[key];
            if (date.ID != 1) {
                let itemData = global.Manager.DBManager.getItemNew(date.ID);
                if (itemData.isRare && itemData.isRare == 2) {
                    items.unshift(date)
                } else {
                    items.push(date)
                }
            }
        }
        if (data.itemArr[2])
            items.push(data.itemArr[2]);
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
            let path = itemData.path + itemData.picName;
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
    btnGame():void {
        global.Manager.UIManager.close('UIGujiFoot');
    };
    btnClose() {
        global.Proxys.ProxyGuJi.setGuJI(true);
        this.scheduleOnce(function () {
    
            if(global.Proxys.ProxyGuJi.getGuJI()){
                global.Proxys.ProxyGuJi.setGuJI(false)
                global.CommonClass.Functions.loadScene("WorldMapScene", null);
            }  

        },1.5);

       
    };
    // update (dt) {}
}
