import UIBase from "../common/UIBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UIPackage extends UIBase {
    @property({ type: cc.Node, displayName: "ndItemNode", tooltip: "ndItemNode" })
    ndItemNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndtitleSelect", tooltip: "ndtitleSelect" })
    ndtitleSelect: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndPageSelect", tooltip: "ndPageSelect" })
    ndPageSelect: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndTempLateNode", tooltip: "克隆节点" })
    ndTempLateNode: cc.Node = null;
    
    packageType: number;
    pageIdx: number;
    itemEventCB: any;
    curSelItem: any;
    firstItem: any;
    itemColNum: number;
    itemSpace: number;
    isDargItem: boolean;
    isInRecover: boolean;
    isMoved: boolean;
    isDeleteMode: boolean;
    data: any[];
    dataArr: any[];
    factoryID: any;
    idx: number;
    packData: { ID: number; typeID: number; name: string; page0: string; page1: string; page2: string; page3: string; page4: string; page5: string; subType0: number; subType1: number; subType2: number; subType3: number; subType4: number; subType5: number; }[];
    load: boolean;
    constructor() {
        super();
        this.packageType = 0;
        this.pageIdx = 0;
        this.itemEventCB = null;
        this.curSelItem = null;
        this.firstItem = null;

        this.itemColNum = 5;
        this.itemSpace = 40;

        this.isDargItem = false;
        this.isInRecover = false;

        this.isMoved = false;
        this.isDeleteMode = false;

        this.data = [];
        this.dataArr = [];
        this.idx = 0;//加载到哪
        this.packData = [
            { ID: 4, typeID: 1, name: '植物仓库', page0: '全部', page1: '种子', page2: '作物', page3: '稀有', page4: '待定', page5: '待定', subType0: 0, subType1: 1, subType2: 2, subType3: 3, subType4: 4, subType5: 5 },
            { ID: 4, typeID: 2, name: '动物仓库', page0: '全部', page1: '畜产', page2: '陆地', page3: '飞行', page4: '水',   page5: '待定', subType0: 0, subType1: 1, subType2: 2, subType3: 3, subType4: 5, subType5: 4 },
            { ID: 4, typeID: 4, name: '工业仓库', page0: '全部', page1: '基材', page2: '工具', page3: '元素', page4: '待定', page5: '待定', subType0: 0, subType1: 1, subType2: 2, subType3: 11, subType4: 3, subType5: 4 },
            { ID: 4, typeID: 3, name: '食品仓库', page0: '全部', page1: '食材', page2: '菜品', page3: '饮品', page4: '待定', page5: '待定', subType0: 0, subType1: 1, subType2: 2, subType3: 3, subType4: 4, subType5: 5 },
            { ID: 5, typeID: 5, name: '宝物仓库', page0: '全部', page1: '陶瓷', page2: '玉石', page3: '金木', page4: '杂',   page5: '字画', subType0: 0, subType1: 1, subType2: 2, subType3: 3, subType4: 4, subType5: 5 },
            { ID: 5, typeID: 6, name: '道具仓库', page0: '全部', page1: '消耗', page2: '待定', page3: '待定', page4: '待定', page5: '待定', subType0: 0, subType1: 3, subType2: 2, subType3: 1, subType4: 4, subType5: 5 },
        ];
    };

    onLoad() { }

    start() {

    }
    onEnable() {
        global.Module.GameData.setMaskSound(true,null);
    };

    onDisable() {
        global.Module.GameData.setMaskSound(false,null);
    };

    show(factoryID) {
        let factory = global.Manager.DBManager.findData("Factory", 'ID', factoryID)
        this.factoryID = factoryID;
        this.packageType = factory.userData;
        this.dataArr = global.Manager.DBManager.fixedDataArr(this.packData, 'ID', this.packageType);
        this.reflashtitBtn(this.dataArr);


        let ndtitSel = this.ndtitleSelect.getChildByName('btnPage1');
        this.ontitleClick({ type: 'touchend', target: ndtitSel });
    };
    reflashtitBtn(data) {
        for (let key in this.ndtitleSelect.children) {
            this.ndtitleSelect.children[key].active = false;
        }
        for (let i = 0; i < data.length; ++i) {
            let ndSel = this.ndtitleSelect.children[i];
            let lblName = ndSel.getChildByName('lblPageName').getComponent(cc.Label);
            let pageNode = ndSel.getChildByName('page1');
            let lblNamePage = pageNode.getChildByName('lblPageName').getComponent(cc.Label);
            lblName.string = data[i].name;
            lblNamePage.string = data[i].name;
            let tagEx = i;
            ndSel.tagEx = tagEx;
            ndSel.active = true;
        }

        let lblName = this.node.getChildByName('lblName');
        lblName.getComponent(cc.Label).string = data.name;
        this.reflashPageBtn(this.dataArr[0]);
    };
    reflashPageBtn(data) {
        this.packageType = data.typeID;
        for (let key in this.ndPageSelect.children)
            this.ndPageSelect.children[key].active = false;
        let typeNum = 5;
        for (let i = 0; i <= typeNum; ++i) {
            let ndSel = this.ndPageSelect.getChildByName('btnPage' + i.toString());
            let lblName = ndSel.getChildByName('lblPageName').getComponent(cc.Label);
            let pageNode = ndSel.getChildByName('page1');
            let lblNamePage = pageNode.getChildByName('lblPageName').getComponent(cc.Label)
            let pageName = 'page' + i.toString();
            lblName.string = data[pageName];
            lblNamePage.string = data[pageName];
            let subTypeName = 'subType' + i.toString();
            let tagEx = data[subTypeName];
            ndSel.tagEx = tagEx;
            ndSel.active = (data[pageName] != '待定');
        }

        let lblName = this.node.getChildByName('lblName');
        lblName.getComponent(cc.Label).string = data.name;
        let ndSel = this.ndPageSelect.getChildByName('btnPage0');
        this.pageIdx = -1;
        this.onPageClick({ type: 'touchend', target: ndSel });


    };

    reflashItem(itemID) {
        let ndItem: any = this.ndItemNode.getChildByName(itemID.toString());
        if (ndItem != null) {
            let itemNum = 0;
            let packageItem = global.Module.PackageData.getItem(itemID);
            if (packageItem != null)
                itemNum = packageItem.Count;

            let itemIcon = ndItem.getComponent(global.CommonClass.ItemIcon);
            itemIcon.setNum(itemNum);
        }
    };

    setItemEventCallBack(callback) {
        this.itemEventCB = callback;
    };
    ontitleClick(event) {
        if (event.type == 'touchend') {
            let arg = event.target.tagEx;
            let btnSel = event.target;

            let pageSels = this.ndtitleSelect.children;
            for (let key in pageSels) {
                let btn = pageSels[key];
                btn.getComponent(cc.Button).interactable = btn != btnSel;
                btn.getChildByName('page1').active = (btn == btnSel);
            }

            let pageIdx = parseInt(arg);
            this.reflashPageBtn(this.dataArr[pageIdx]);

        }
    };
    onPageClick(event) {
        if (event.type == 'touchend') {
            let arg = event.target.tagEx;
            let btnSel = event.target;
            let pageSels = this.ndPageSelect.children;
            for (let key in pageSels) {
                let btn = pageSels[key];
                btn.getComponent(cc.Button).interactable = btn != btnSel;
                btn.getChildByName('page1').active = (btn == btnSel);
            }
            let pageIdx = parseInt(arg);
            this.onSelPage(pageIdx);
        }
    };

    showItemsNumber(isShow) {
        let items: any = this.ndItemNode.children;
        for (let key in items) {
            let ndItem = items[key];
            let itemIcon = ndItem.getComponent(global.CommonClass.ItemIcon);
            itemIcon.showNumber(isShow);
        }
    };

    showItemByPage(pageIdx) {
        this.ndItemNode.removeAllChildren();
        let itemSubType = pageIdx + (this.packageType - 1) * 5;
        this.data = global.Manager.DBManager.getItemDataByType(this.packageType);
        if (pageIdx >= 1) {

            let condition = function (item) {
                let itemData = global.Module.PackageData.getItem(item.ID);
                return (item.subType == itemSubType && (itemData && itemData.Count > 0));
            }
            this.data = global.CommonClass.Functions.filterItemData(this.data, condition);
        }else if (pageIdx == 0) {
            let condition = function (item) {
                let itemData = global.Module.PackageData.getItem(item.ID);
                return (itemData && itemData.Count > 0);
            }
            this.data = global.CommonClass.Functions.filterItemData(this.data, condition);    
        }
        // if (itemSubType == 21 || itemSubType == 23 || itemSubType == 24) {
        //     this.lineItem();
        // }
        // else {
        //     this.sortItem();
        // }
        this.idx = 0;
        this.load = true;
        let ndTempLate = this.node.getChildByName('ndTempLate');
        ndTempLate.active = false;
    };
    //宝物特殊处理, 按行排
    lineItem() {
        global.CommonClass.Functions.sort(this.data, function (lhs, rhs) {
            if (lhs.rowID > rhs.rowID)
                return true;
            else {
                return false;
            }
        });

        global.CommonClass.Functions.sort(this.data, function (lhs, rhs) {
            if (lhs.isRare >= rhs.isRare)
                return true;
            else {
                return false;
            }
        });

        let newItems = [];
        let curItems = [];
        let sameNum = 0;

        if (this.data.length > 0) {
            let itemRowID = this.data[0].rowID;

            let needConcat = false;     //标志最后一组是否要追加
            let isRare = false;

            for (let key in this.data) {
                let item = this.data[key];
                let rowID = item.rowID;
                if (itemRowID != rowID) {
                    itemRowID = rowID;

                    global.CommonClass.Functions.sort(curItems, function (lhs, rhs) {
                        if (lhs.color < rhs.color)
                            return true;
                        else {
                            return false;
                        }
                    });

                    //补全没有的品质
                    if (isRare) {
                        for (let i = 1; i <= 5; ++i) {
                            let curItem = curItems[i - 1];
                            if (curItem != null) {
                                if (curItem.color != i) {
                                    let spaceItem = { ID: -1, color: i };
                                    curItems.splice(i - 1, 0, spaceItem);
                                }
                            }
                            else {
                                let spaceItem = { ID: -1, color: i };
                                curItems.splice(i - 1, 0, spaceItem);
                            }
                        };
                    }

                    isRare = item.isRare == 2;

                    newItems = newItems.concat(curItems);
                    needConcat = false;

                    curItems = [];
                    sameNum = 0;
                }
                else {
                    sameNum++;
                    curItems.push(item);

                    needConcat = true;
                }
            }

            if (needConcat)
                newItems = newItems.concat(curItems);
        }
        this.data = newItems;
       
    };

    sortItem() {
        global.CommonClass.Functions.sort(this.data, function (lhs, rhs) {
            if (lhs.recyclePrice > rhs.recyclePrice)
                return true;
            else {
                if (lhs.recyclePrice == rhs.recyclePrice) {
                    if (lhs.rare)
                        return true;
                    else {
                        if (lhs.color > rhs.color) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                }
                else {
                    return false;
                }
            }
        });
        
    };

    onSelPage(pageIdx) {
        if (this.pageIdx != pageIdx) {
            this.pageIdx = pageIdx;
            this.showItemByPage(pageIdx);

        }
    };
    btnClose(event, arg) {
        global.Manager.UIManager.close('UIPackage');
    };

    btnSell() {
        global.CommonClass.UITip.showTipTxt('功能待开放', global.Enum.TipType.TIP_BAD);
    }
    update (dt) {
        if (this.load == false){
            this.load = false;
            return;
        }
            
        let item = this.data[this.idx];
        if (item&&item.ID != -1) {
            let itemNum = 0;
            let packageItem = global.Module.PackageData.getItem(item.ID);
            if (packageItem != null)
                itemNum = packageItem.Count;
            let newNode: any = cc.instantiate(this.ndTempLateNode);
            newNode.active = item.ID > 0;
            this.ndItemNode.addChild(newNode);
            let itemIcon = newNode.getComponent(global.CommonClass.ItemIcon);
            itemIcon.setItem(item.ID, itemNum);
            itemIcon.setNameLabel();
            itemIcon.setmask(item.color == 1 && item.warehouseType == 5);
            itemIcon.disableClick(true);
            itemIcon.showValue(false);
            
        }else{
            this.load = false;  
        }
        this.idx++;
       
    }
}
