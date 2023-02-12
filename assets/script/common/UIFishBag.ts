
const { ccclass, property } = cc._decorator;

@ccclass
export default class UIFishBag extends cc.Component {
    static filePath: "prefab/common/";
    itemSpace: number;
    root: any;
    showtPosition: any;
    hidePosition: any;
    ndTemplateItem: any;
    isDargItem: boolean;
    autoHide: boolean;
    curSelItem: any;
    touchStart: any;
    showEndCall: any;
    dragEndCall: any;
    dragEventCall: any;
    isDragItem: boolean;
    ndDragItem: any;
    isShow: boolean;
    isShowPopBtn: boolean;
    isShowHide: boolean;
    spDropItem: any;
    topSpcace: number;
    items: any[];
    itemType: any;
    lastTouchPos: any;
    moveDis: cc.Vec2;
    pickItem: any;
    isMoved: any;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    constructor() {
        super();
        this.itemSpace = 25;

        this.root = null;
        this.showtPosition = null;
        this.hidePosition = null;
        this.ndTemplateItem = null;
        this.isDargItem = false;
        this.autoHide = false;
        this.curSelItem = null;

        this.touchStart = null;
        this.showEndCall = null;
        this.dragEndCall = null;
        this.dragEventCall = null;

        this.isDragItem = false;
        this.ndDragItem = null;

        this.isShow = false;
        this.isShowPopBtn = true;
        this.isShowHide = true;

        this.spDropItem = null;
        this.topSpcace = 0;

        this.items = new Array();
    };

    onLoad() {
        this.root = this.node.getChildByName('root');

        this.ndDragItem = this.node.getChildByName('ndDragItem');
        this.ndTemplateItem = this.node.getChildByName('ndTemplateItem');
        this.spDropItem = this.node.getChildByName('spDropItem');

        let sizeW = this.root.getContentSize().width;
        this.hidePosition = cc.v2(this.root.getPosition());

        this.showtPosition = cc.v2(this.root.getPosition());
        this.showtPosition.x += sizeW;
    };

    onEnable() {
        this.ndDragItem.active = false;

        let itemScroll = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
        itemScroll.on(cc.Node.EventType.TOUCH_MOVE, this.touchScrollEvent, this);
        itemScroll.on(cc.Node.EventType.TOUCH_END, this.touchScrollEvent, this);
        itemScroll.on(cc.Node.EventType.TOUCH_CANCEL, this.touchScrollEvent, this);
        itemScroll.on(cc.Node.EventType.TOUCH_START, this.touchScrollEvent, this);

        global.Manager.UIManager.add('UIFishBag', this);
    };
  
    onDisable() {
        let itemScroll = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
        itemScroll.off(cc.Node.EventType.TOUCH_MOVE, this.touchScrollEvent, this);
        itemScroll.off(cc.Node.EventType.TOUCH_END, this.touchScrollEvent, this);
        itemScroll.off(cc.Node.EventType.TOUCH_CANCEL, this.touchScrollEvent, this);
        itemScroll.off(cc.Node.EventType.TOUCH_START, this.touchScrollEvent, this);

        this.enableTouch(false);

        global.Manager.UIManager.remove('UIFishBag');
    };

    getIsShow() {
        return this.isShow;
    };

    setTopSpace(space) {
        this.topSpcace = space;
    };

    showItems(itemType, condition) {
        this.setItemData(itemType, condition);

        let itemSpace = this.itemSpace;

        let ndView = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');

        let itemNum = this.items.length;
        let scale = this.ndTemplateItem.scale;

        let sizeWidth = ndItems.getContentSize().width;
        let siezHeight = this.ndTemplateItem.getContentSize().height * scale;
        ndItems.setContentSize(sizeWidth, siezHeight * itemNum + (itemSpace - 1) * itemNum + this.topSpcace);
        ndItems.removeAllChildren();

        let itemPosY = -siezHeight / 2 - this.topSpcace;
        let itemPosX = sizeWidth / 2-20;

        let isFirstItem = true;

        for (let key in this.items) {
            let ID = this.items[key].ID;

            let item = cc.instantiate(this.ndTemplateItem);
            ndItems.addChild(item);

            item.active = true;
            item.setPosition(cc.v2(itemPosX, itemPosY));

            let itemCount = global.Module.PackageData.getItemCount(ID);
            let itemClass = item.getComponent(global.CommonClass.ItemIcon);
            itemClass.setItem(ID, itemCount);

            itemPosY -= (siezHeight + itemSpace);

            if (isFirstItem) {
                this.changeSel(item);
                isFirstItem = false;
            }
        }

    };

    reflashCount(itemID) {
        let itemCount = global.Module.PackageData.getItemCount(itemID);

        let item = this.getItemNodeByItem(itemID);
        let itemClass = item.getComponent(global.CommonClass.ItemIcon);
        itemClass.setNum(itemCount);
    };

    setItemCount(itemID, count) {
        let item = this.getItemNodeByItem(itemID);
        let itemClass = item.getComponent(global.CommonClass.ItemIcon);
        itemClass.setNum(count);
    };

    getItemNodeByItem(itemID) {
        let ndView = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let ndItem = ndItems.getChildByName(itemID.toString());
        return ndItem;
    };

    setTitle(title) {
        let lblName = this.node.getChildByName('root').getChildByName('lblName');
        lblName.getComponent(cc.Label).string = title;
    };

    setAutoHide(isAuto) {
        this.autoHide = isAuto;
    };

    setDragEndCall(callBack) {
        this.dragEndCall = callBack;
    };

    setShowEndCall(callBack) {
        this.showEndCall = callBack;
    };

    setDragEventCall(callBack) {
        this.dragEventCall = callBack;
    };

    setItemData(itemType, condition) {
        this.itemType = itemType;

        this.items = global.Manager.DBManager.getItemDataByType(this.itemType);
        this.items = global.CommonClass.Functions.filterItemData(this.items, condition);
    };

    setShowPopBtn(isShow) {
        this.isShowPopBtn = isShow;

        // let btnShow = this.node.getChildByName('root').getChildByName('btnShow');
        // btnShow.active = isShow;
    };

    setShowHideBtn(isShow) {
        this.isShowHide = isShow;

        // let btnHide = this.node.getChildByName('root').getChildByName('btnHide');
        // btnHide.active = isShow;
    };

    reflashGuide(isShow) {
        this.root.getChildByName('ndItems').active = isShow;
    };

    enableTouch(isEnable) {
        if (isEnable) {
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
            this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        }
        else {
            this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
            this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
            this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
            this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        }
    };

    scrollToItem(itemID) {
        let scale = this.ndTemplateItem.scale;
        let siezHeight = this.ndTemplateItem.getContentSize().height * scale;

        let index = 0;
        for (let key in this.items) {
            ++index;

            let item = this.items[key];

            if (itemID == item.ID) {
                let offset = siezHeight * index + this.itemSpace * index;

                let itemScroll = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
                let scrollView = itemScroll.getComponent(cc.ScrollView);
                scrollView.scrollToOffset(cc.v2(0, offset));

                return index;
            }
        }

        return -1;
    };

    show(isShow, isQuickShow) {
        if (isShow) {
            let self = this;
            let runEnd = function () {
                if (self.showEndCall)
                    self.showEndCall(isShow);
            }

            let time = 0.5;
            if (isQuickShow)
                time = 0.00001;

            let endFunction = cc.callFunc(runEnd);
            let moveTo = cc.moveTo(time, this.showtPosition);
            let seq = cc.sequence(moveTo, endFunction);

            this.root.stopAllActions();
            this.root.runAction(seq);

            this.enableTouch(true);

           

        }
        else {
            let moveTo = cc.moveTo(0.5, this.hidePosition);
            this.root.stopAllActions();

            let self = this;
            let runEnd = function () {

                self.enableTouch(false);

                if (self.showEndCall)
                    self.showEndCall(isShow);
            };

            let endFunction = cc.callFunc(runEnd);
            let seq = cc.sequence(moveTo, endFunction);

            this.root.runAction(seq);

        }
        this.reflashGuide(isShow);
        // this.ndPages.active = isShow;
        this.isShow = isShow;
    };

    createDrop(offset, callBack) {
        if (offset == null)
            offset = cc.v2(0, 0);

        let dropPos = this.ndDragItem.getPosition();
        let position = cc.v2(dropPos.x + offset.x, dropPos.y + offset.y);

        let ndDrop = this.node.getChildByName('ndDrop');

        let itemID = this.ndDragItem.tagEx;
        let newItem = cc.instantiate(this.spDropItem);
        global.CommonClass.Functions.setItemTexture(newItem, itemID, null);

        newItem.setPosition(position);
        ndDrop.addChild(newItem);
        newItem.active = true;

        let moveTo = cc.moveTo(1, dropPos);
        let fadeIn = cc.fadeTo(0.8, 100);
        let spawn = cc.spawn(moveTo, fadeIn);

        let endFun = function () {

            let position = ndDrop.convertToWorldSpaceAR(dropPos);
            if (callBack)
                callBack(position);

            newItem.removeFromParent();
        };

        let endFunction = cc.callFunc(endFun);
        let seq = cc.sequence(spawn, endFunction);

        newItem.stopAllActions();
        newItem.runAction(seq);
    };

    touchEvent(event) {
        let itemID = this.ndDragItem.tagEx;

        if (event.type == cc.Node.EventType.TOUCH_START) {
        }
        else if (event.type == cc.Node.EventType.TOUCH_MOVE) {

        }//放养鱼|| event.type == cc.Node.EventType.TOUCH_CANCEL
        else if (event.type == cc.Node.EventType.TOUCH_END) {
            if (this.autoHide) {
                this.show(false, null);
            }

            this.ndDragItem.tagEx = -1;
        }

        if (this.dragEventCall)
            this.dragEventCall(event, itemID);

    };

    getPickItem(touchPoint) {
        let itemScroll = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
        let ndView = itemScroll.getChildByName('view');
        let ndItems = ndView.getChildByName('content');

        let children = ndItems.getChildren();
        for (let key in children) {
            let ndItem = children[key];
            let spItem = ndItem.getChildByName('spItem');
            let box = spItem.getBoundingBoxToWorld();
            if (box.contains(touchPoint)) {
                return ndItem;
            }
        }

        return null;
    };


    changeSel(selItem) {
        if (selItem != null) {
            if (this.curSelItem != null) {
                let spDirect = this.curSelItem.getChildByName('spDirect');

                if (spDirect != null)
                    spDirect.active = false;
            }

            this.curSelItem = selItem;
            let spDirect = this.curSelItem.getChildByName('spDirect');
            if (spDirect != null)
                spDirect.active = true;
        }
    };

    touchScrollEvent(event) {
        let touchPoint = event.getLocation();
        if (event.type == cc.Node.EventType.TOUCH_START) {
            this.touchStart = touchPoint;
            this.lastTouchPos = touchPoint;

            this.moveDis = cc.v2(0, 0);

            this.pickItem = this.getPickItem(touchPoint);
            if(this.pickItem)
            this.pickItem.scale = 1.2;
            let itemClass = this.pickItem.getComponent(global.CommonClass.ItemIcon);
            itemClass.getItemID();
            this.changeSel(this.pickItem);

            let self = this;
            let delayEnd = function () {
                if (self.pickItem != null) {
                }
            };

            let delayAction = cc.delayTime(1);
            let endFunction = cc.callFunc(delayEnd)
            let seq = cc.sequence(delayAction, endFunction);
            this.node.runAction(seq);
        }
        else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
            if(this.pickItem)
            this.pickItem.scale = 1;
            if (this.isDargItem) {
                this.ndDragItem.active = false;
                this.isDargItem = false;

                let itemScroll = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
                let scrollView = itemScroll.getComponent(cc.ScrollView);
                scrollView.enabled = true;

                if (this.dragEndCall) {
                    let distance =  touchPoint.sub(this.touchStart).mag();;
                    if (distance > 200) {
                        let itemID = this.ndDragItem.tagEx;
                        this.dragEndCall(itemID, touchPoint);
                    }
                }

                this.touchStart = null;
            }
            this.node.stopAllActions();

        }
        else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            let touchPoint = event.getLocation();;
            let distance = touchPoint.sub(this.touchStart).mag();
            if (distance > 5) {
                this.isMoved = true;
            }

            if (this.pickItem) {
                this.moveDis.x += Math.abs(touchPoint.x - this.lastTouchPos.x);
                this.moveDis.y += Math.abs(touchPoint.y - this.lastTouchPos.y);

                if (this.moveDis.x > this.moveDis.y && this.moveDis.x > 4) {
                    this.isDargItem = true;

                    let itemClass = this.pickItem.getComponent(global.CommonClass.ItemIcon);
                    if (itemClass.getItemID() > 0)
                        this.onItemClick(itemClass, touchPoint);
                }
            }
            if (this.isDargItem) {
                let position = this.node.convertToNodeSpaceAR(touchPoint);
                this.ndDragItem.setPosition(position);
            }

            this.lastTouchPos = touchPoint;
        }

    };

    onItemClick(itemClass, touchPoint) {
        let itemScroll = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
        let scrollView = itemScroll.getComponent(cc.ScrollView);
        scrollView.enabled = false;

        let itemID = itemClass.getItemID();

        let spItem = this.ndDragItem.getChildByName('spItem');
        let picPath = global.CommonClass.Functions.getItemPicPathNew(itemID);
        global.CommonClass.Functions.setTexture(spItem, picPath, null);

        let position = this.node.convertToNodeSpaceAR(touchPoint);
        this.ndDragItem.setPosition(position);

        this.ndDragItem.tagEx = itemID;
        this.ndDragItem.active = true;
    };

    btnHide() {

        this.show(false, null);
    };

    btnShow() {
        global.Proxys.ProxyGuide.stepNextGuide('OpenPreciousRoomBag');
        this.show(true, null);
    };
    btnSelPage(event, arg) {
        let pageIdx = parseInt(arg);
        let ID = global.Module.MainPlayerData.getRoleID();
        let data = {};
        let uiFishRoom = global.Manager.UIManager.get('UIFishRoom');

        switch (pageIdx) {
            case 1:
                break;
            case 2:
                if (uiFishRoom)
                    uiFishRoom.btnClose();
                break;
            case 3:
                if (uiFishRoom)
                    uiFishRoom.btnClose();
                global.Manager.UIManager.open('UIAnimalPools',null,null);
                break;
            default:
                break;
        }

    };
}
