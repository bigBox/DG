
let Man = window["Man"];
const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemIcon extends cc.Component {
    static className: string = 'ItemIcon';
    @property({ displayName: "itemID", tooltip: "itemID" })
    itemID: number;
    @property({ displayName: "itemNum", tooltip: "itemNum" })
    itemNum: number;
    @property({ displayName: "itemSize", tooltip: "itemSize" })
    itemSize: number;

    @property({
        type: cc.Node,
        displayName: "引导节点",
        tooltip: "提示的引导节点"
    })
    helpNode: cc.Node = null;
    size: any;
    constructor() {
        super();
        this.itemID = 0;
        this.itemNum = 1;
        this.itemSize = 220;
    };
    static create(itemID, itemNum, size, parent, position, callback) {
        let filePath = "prefab/component/ItemIcon";
        cc.loader.loadRes(filePath, function (err, prefab) {
            if (err == null) {
                let newNode = cc.instantiate(prefab);
                if (parent != null)
                    parent.addChild(newNode, cc.macro.MAX_ZINDEX);
                newNode.setPosition(position.x, position.y);
                let itemIcon = newNode.getComponent(ItemIcon);
                itemIcon.setItem(itemID, itemNum);

                if (size != null)
                    itemIcon.setItemSize(size);

                if (callback)
                    callback(itemIcon);
            }
        });
    };
    state(){};

    setItem(itemId, itemNum) {
        this.itemID = itemId;

        (itemNum != null) ? (this.itemNum = itemNum) : (this.itemNum = 0);

        let data = global.Manager.DBManager.getItemNew(itemId);
        let lblName = this.node.getChildByName('lblName');
        if (lblName != null)
            lblName.getComponent(cc.Label).string = data.resume;
        this.setNum(this.itemNum);



        let spItem = this.node.getChildByName('spItem');
      
        if (itemId > 0) {
            let iconFile = "images/pictrue/items/default";
            if (data != null)
                iconFile = data.path + data.picName;
            let bgNode = this.node.getChildByName('bg');
            let self = this;
         
            global.CommonClass.Functions.setTexture(spItem, iconFile, function (item) {
                if (item) {
                    item.scale = global.CommonClass.Functions.getToscale(item, self.itemSize, self.itemSize);
                    
                }
            });

           
        } else {
            spItem.active = false;
        }
        let lblValue = this.node.getChildByName('lblValue');
        if (lblValue != null)
            lblValue.active = false;

        let spUnIndentify = this.node.getChildByName('spUnIndentify');
        if (spUnIndentify != null)
            spUnIndentify.active = false;

        let lblGrow = this.node.getChildByName('lblGrow');
        let lblNumber = this.node.getChildByName('lblNumber');
        if (lblGrow != null)
            lblGrow.active = false;

        if (data != null) {
            if (data.warehouseType == 5) {
                if (data.color == 1) {   //未鉴定宝物显示标签
                    // if (spUnIndentify != null)
                    // spUnIndentify.active = true
                }
                if (lblValue != null) {
                    lblValue.active = true;
                    let fortuneString = global.Module.PreciousRoomData.formatFortune(data.recyclePrice);
                    lblValue.getComponent(cc.Label).string = fortuneString;
                }
            }
            else {
                // ndSpItem.setScale(1.3);
            }
            if (lblGrow != null)
                lblGrow.active = (data.subType == 1);
        }


        this.node.name = itemId.toString();
        this.node.tagEx = itemId;
        this.showSell(false);
        this.setData(itemId);
    };
    setmask(isShow) {
        let spItem = this.node.getChildByName('spItem');
        if (spItem != null) {
            if (!isShow)
                spItem.color = cc.color(255, 255, 255, 255);
            else
                spItem.color = cc.color(134, 134, 134, 255);
        }
        
    };
    setNameLabel() {
        let data = global.Manager.DBManager.getItemNew(this.itemID);
        let lblName = this.node.getChildByName('lblName');
        if (lblName && data) {
            var stmp = data.name;
            stmp = stmp.replace('种子', '');
            lblName.getComponent(cc.Label).string = stmp;
        }

    };
    setData(itemId) {
        var data = global.Module.TaskData.getHasAcceptTaskData();
        if (data && itemId == '270030001' && data.taskId == 10016 && data.state == 1)
            if (this.helpNode)
                this.helpNode.active = true;
    };

    disableClick(isDisable) {
        let itemClick = this.node.getChildByName('itemClick');
        if (itemClick)
        itemClick.active = isDisable;
    };

    setItemSize(itemSize) {
        this.size = itemSize;
        let curSize = this.node.getContentSize();
        this.node.setScale(itemSize / curSize.width, itemSize / curSize.height);
    };

    setNum(itemNum) {
        this.itemNum = itemNum;

        let lblNumberNode = this.node.getChildByName('lblNumber');
        if (lblNumberNode != null) {
            let lblNumberLabel = lblNumberNode.getComponent(cc.Label);
            lblNumberLabel.string = this.itemNum.toString();
            if (this.itemNum > 999)
                lblNumberLabel.string = '999';
            lblNumberNode.active = true;
        }

        this.reflashEditNumber();
    };

    getNum() {
        return this.itemNum;
    };

    showNumber(isShow) {
        let lblNumber = this.node.getChildByName('lblNumber');
        if (lblNumber != null) {
            lblNumber.active = isShow;
        }
    };

    showSell(isShow) {
        let ndSell = this.node.getChildByName('ndSell');
        if (ndSell != null && ndSell.active != isShow) {
            ndSell.active = isShow;
            this.reflashEditNumber();
        }
        this.showNumber(!isShow);
    };

    reflashEditNumber() {
        let ndSell: any = this.node.getChildByName('ndSell');
        if (ndSell && ndSell.active) {
            let number: any = Math.floor(this.itemNum / 2);
            let countChange = ndSell.getChildByName('numChange').getComponent(global.CommonClass.UICountChange);
            countChange.setNumber(number);

            countChange.setMax(this.itemNum);
            countChange.setMin(1);
        }
    };

    getItemID() {
        if (this.helpNode)
            this.helpNode.active = false;
        return this.itemID;
    };

    getSellNum() {
        let numChanggeNode: any = this.node.getChildByName('ndSell').getChildByName('numChange');
        let countChange = numChanggeNode.getComponent(global.CommonClass.UICountChange);
        let num = countChange.getCurNumber();

        return num;
    };

    showNew(isShow) {
        let btnNew = this.node.getChildByName('btnNew');
        if (btnNew!= null)
        btnNew.active = isShow;
    };

    showValue(isShow) {
        let lblValue = this.node.getChildByName('lblValue');
        if (lblValue != null)
            lblValue.active = isShow;
    };
    scaleTo(){
        this.node.scale  = 0;
        let scaleTo = cc.scaleTo(1, 1);
        this.node.stopAllActions();
        this.node.runAction(scaleTo);
    }





    btnShowItem() {
        let itemId = this.itemID;
        global.Manager.UIManager.open('UIPackageShow', null, function (panel) {
            if (panel != null) {
                panel.show(itemId);
            }
        });
    };
    touchSell() {

    };

    btnClick() {
        let event = new cc.Event.EventCustom('onItemIconClick', true);
        event.setUserData(this);
        this.node.dispatchEvent(event);
    };
    btnSell() {
        let event = new cc.Event.EventCustom('onItemSell', true);
        event.setUserData(this);
        this.node.dispatchEvent(event);
    };
}
