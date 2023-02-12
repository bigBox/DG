import UIBase from "../common/UIBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UITrade extends UIBase {
    @property({ type: cc.Node, displayName: "nodeSVContent", tooltip: "nodeSVContent" })
    nodeSVContent: cc.Node = null;
    @property({ type: cc.ScrollView, displayName: "itemscrollView", tooltip: "itemscrollView" })
    itemscrollView: cc.ScrollView = null;
    @property({ type: cc.Node, displayName: "viewNode", tooltip: "viewNode" })
    viewNode: cc.Node = null;
    @property({ type: cc.Prefab, displayName: "nodeTradeItem", tooltip: "nodeTradeItem" })
    nodeTradeItem: cc.Prefab = null;
    @property({ type: cc.Node, displayName: "helpNode", tooltip: "helpNode" })
    helpNode: cc.Node = null;
    pageType: number;
    itemDatas: any[];
    moneyType: number;
    sortType: number;
    curActiveBtn: any;
    curQuality: number;
    increaseDec: any[];
    curIncrease: number;
    curPrice: number;
    rowItemCounts: number;
    items: any[];
    topMax: number;
    bottomMax: number;
    lastListY: number;
    itemHeight: number;
    spacingY: number;
    positionvalue: number;
    indexY: number;
    itemIndex: number;
    isShow: boolean;
    constructor() {
        super();
        this.pageType = 0; // 0:品相 1:涨跌 2:买卖价 
        this.itemDatas = [];//预加载的item的数据
        this.moneyType = 1;
        this.sortType = 0;    //0.ID 1.价格 2.涨幅升 3.涨幅跌
        this.curActiveBtn = null;
        this.curQuality = 0;

        this.increaseDec = [];
        this.increaseDec.push({ color: cc.color(255, 255, 255), dec: '涨跌' });
        this.increaseDec.push({ color: cc.color(255, 255, 255), dec: '涨幅' });
        this.increaseDec.push({ color: cc.color(255, 255, 255), dec: '跌幅' });
        this.curIncrease = 0;

        this.curPrice = 0;
        this.rowItemCounts = 0; //当前可视区域内部填充满需要的item数量
        this.items = [];//创建的item节点的数组
        this.topMax = 0; //顶部最大Y
        this.bottomMax = 0; //底部最小Y
        this.lastListY = -1;//上一次listnode的Y坐标
        this.itemHeight = 0; //itemprefab的高度
        this.spacingY = 0;
        this.positionvalue = 0;
        this.indexY = 0;
        this.itemIndex = 0;//循环起点
        this.isShow = false;
    };

    onLoad() { }

    start() {

    }

    onEnable() {
        global.Instance.AudioEngine.playSound('transaction', false, 1,null);
        let self = this;
        this.node.on('onTradeItemClick', function (event) {
            self.onTradeItemClick(event);
        });

        this.node.on('onTradeClickSale', function (event) {
            self.onTradeClickSale(event);
        });

        this.curActiveBtn = this.node.getChildByName('btnQuality');
        global.Module.GameData.setMaskSound(true,null);
       
    };
    setData() {
        var data = global.Module.TaskData.getHasAcceptTaskData();
        if (data && data.taskId == 10022 && data.state == 1)
            this.helpNode.active = true;

    };
    onDisable() {
        this.node.off('onItemClick', function (event) {
        });
        global.Module.GameData.setMaskSound(false,null);
    };

    show() {
        global.Module.TradeData.setItemQulity(this.curQuality);
        let self = this;
        global.Module.TradeData.sort(this.sortType,function(items){
            self.itemDatas = items
            self.reflash();
        });
        
    };

    reflash() {
        this.isShow = false;
        this.itemscrollView.scrollToOffset(cc.v2(0, 0));
        this.reflashItems();
        // this.reflashPage();
        this.setData();
    };

    reflashItems() {
        this.items = [];
        this.nodeSVContent.removeAllChildren();
        let itemDatas = this.itemDatas;
        //保存高度
        let height = 0;
        //创建newNode 
        let newNode:any = cc.instantiate(this.nodeTradeItem);
        height = newNode.height;
        this.itemHeight = height;
        //计算可视区域内部填充满需要的item数量
        this.rowItemCounts = Math.ceil(this.viewNode.height / (height + this.spacingY))+6;
        this.itemIndex = 0;
        //设置list的高度 不设置无法滑动
        this.nodeSVContent.height = 20 + (itemDatas.length) * height + (itemDatas.length) * this.spacingY
        //计算顶部最大Y
        this.topMax = (5 * height + 4 * this.spacingY)
        //计算底部最小Y
        this.bottomMax = -(this.viewNode.height + this.topMax)
        global.Instance.Log.debug('计算底部最小Y',this.bottomMax)
        //保存list的当前Y坐标
        this.lastListY = -1;
        this.isShow = true;
    };

    reflashPage() {
        // let lblIncrease = this.node.getChildByName('btnIncrease').getChildByName('Label').getComponent(cc.Label);
        // lblIncrease.node.color = this.increaseDec[this.curIncrease].color;
        // lblIncrease.string = this.increaseDec[this.curIncrease].dec;
    };

    setCurSelPage(newButton) {
        if (this.curActiveBtn != null) {
            let spPage = this.curActiveBtn.getChildByName('spPage');
            spPage.active = false;
        }
        this.curActiveBtn = newButton;
        let spPage = this.curActiveBtn.getChildByName('spPage');
        spPage.active = true;
    };
    btnQuality(event, arg) {
        this.curIncrease = 0;
        this.curPrice = 0;

        this.setCurSelPage(event.target);
        this.pageType = 0;
        this.curQuality = 0;
        this.sortType = 0;
        let self = this;
        global.Module.TradeData.sort(this.sortType,function(items){
            self.itemDatas = items
            self.reflash();
        });
    };

    btnStock(event) {
        this.curQuality = 0;
        this.curPrice = 0;
        this.pageType = 1;

        this.setCurSelPage(event.target);

        if (this.curIncrease == 0)
            this.curIncrease = 1;
        else if (this.curIncrease == 1)
            this.curIncrease = 2;
        else if (this.curIncrease == 2)
            this.curIncrease = 1;

        this.sortType = this.curIncrease + 2;
        let self = this;
        global.Module.TradeData.sort(this.sortType,function(items){
            self.itemDatas = items
            self.reflash();
        });
    };

    btnPrice(event, arg) {
        this.curQuality = 0;
        this.curIncrease = 0;
        this.pageType = 2;

        this.setCurSelPage(event.target);

        if (this.curPrice == 0)
            this.curPrice = 1;
        else if (this.curPrice == 1)
            this.curPrice = 2;
        else if (this.curPrice == 2)
            this.curPrice = 1;

        this.sortType = this.curPrice;
        let self = this;
        global.Module.TradeData.sort(this.sortType,function(items){
            self.itemDatas = items
            self.reflash();
        });
    };

    // 订单
    btnNote() {
        let data1 = { type: 0 };
        global.Instance.MsgPools.send('tradeRole', data1,null);    //先发卖的队列

        let data2 = { type: 1 };
        global.Instance.MsgPools.send('tradeRole', data2, function (msg)   //后发买的队列
        {
            global.Manager.UIManager.open('UITradeNote',null,null);
        });
    };

    // 刷新
    btnReflash() {
        let items = global.Manager.DBManager.getData('TradeItems');
        let data = { itemIDs: [] };
        for (let key in items) {
            let value = items[key];
            data.itemIDs.push(value.ID);
        }
        // data.orderIds.push(2);

        let self = this;
        global.Instance.MsgPools.send('stockList', data, function (msg) {
            global.Module.TradeData.setItemQulity(self.curQuality);
            global.Module.TradeData.sort(self.sortType,function(items){
                self.itemDatas = items
                self.reflashItem();
            });
            
            // self.itemscrollView.scrollToOffset(cc.v2(0, self.nodeSVContent.y-0.1));
        });
    };
    reflashItem() {
        for (let i in this.items) {
            let newNode = this.items[i]
            let itemPos = this.nodeSVContent.convertToWorldSpaceAR(newNode.position)
            itemPos.y -= this.viewNode.height / 2
            itemPos = this.viewNode.convertToNodeSpaceAR(itemPos)
            let itemClass = newNode.getComponent("TradeItem");
            let item = this.itemDatas[newNode.__itemID]
            item.index = parseInt(newNode.__itemID)
            itemClass.setData(this.pageType, item);
        }
    };
    //列表点击事件
    onTradeItemClick(event) {

     
    };
    onTradeClickSale(event) {
        let item = event.getUserData();
      
        global.Instance.Log.debug('onTradeClickSale',item);
        let tradeItem = this.itemDatas[item.node.tagEx];

        let dataSale = { type: 0, itemID: tradeItem.ID };
        this.helpNode.active = false;
        global.Instance.MsgPools.send('tradeTop', dataSale, function (msg) {
            
            global.Instance.Log.debug('msg',msg)
            global.Module.TradeData.setTradeItemID(tradeItem.ID);
            global.Manager.UIManager.open('UITradeDlg', null, function (panel) {
                panel.show(global.Enum.TradeType.TRADE_WANT_SELL);
            });
        });
    };

    btnClose() {
        global.Instance.MsgPools.send('tradeClose', {}, function (msg) {
        });

        global.Manager.UIManager.close('UITrade');
    };
    update() {
        if (this.isShow == false)
            return;
        if (this.lastListY == -1 && this.items.length < this.rowItemCounts) {
            let newNode: any = cc.instantiate(this.nodeTradeItem);
            if (typeof this.itemDatas[this.itemIndex] != 'undefined') {
                let item = this.itemDatas[this.itemIndex];
                item.index = Number(this.itemIndex)
                let itemClass = newNode.getComponent("TradeItem");
                itemClass.setData(this.pageType, item);
                newNode.__itemID = this.itemIndex;
                this.items.push(newNode)
                this.nodeSVContent.addChild(newNode);
                newNode.x = 0
                newNode.y = - (newNode.height / 2 + this.itemIndex * (newNode.height + this.spacingY))
            }
            if (this.items.length == this.rowItemCounts) {
                this.lastListY = this.nodeSVContent.y
            }
            this.itemIndex++;
            return;
        }
        //判断是否往下滑动
        if (this.lastListY == -1)
            return;
        let isDown = this.nodeSVContent.y > this.lastListY
        let countOfItems = this.items.length
        let dataLen = this.itemDatas.length
        for (let i in this.items) {
            let newNode = this.items[i]
            let itemPos = this.nodeSVContent.convertToWorldSpaceAR(newNode.position)
            itemPos.y -= this.viewNode.height / 2
            itemPos = this.viewNode.convertToNodeSpaceAR(itemPos)
            if (isDown) {
                if (itemPos.y > this.topMax) {
                    let newId = newNode.__itemID + countOfItems
                    if (newId >= dataLen) return
                    newNode.__itemID = newId
                    newNode.y = newNode.y - countOfItems * this.itemHeight - (countOfItems) * this.spacingY
                    let itemClass = newNode.getComponent("TradeItem");
                    let item = this.itemDatas[newNode.__itemID]
                    item.index = parseInt(newNode.__itemID)
                    itemClass.setData(this.pageType, item);
                }
            } else {
                if (itemPos.y < this.bottomMax) {
                    let newId = newNode.__itemID - countOfItems
                    if (newId < 0) return
                    newNode.__itemID = newId
                    newNode.y = newNode.y + countOfItems * this.itemHeight + (countOfItems) * this.spacingY
                    let itemClass = newNode.getComponent("TradeItem");
                    let item = this.itemDatas[newNode.__itemID]
                    item.index = parseInt(newNode.__itemID)
                    itemClass.setData(this.pageType, item);
                }
            }
        }
        //存储下当前listnode的Y坐标 
        this.lastListY = this.nodeSVContent.y
    };
}
