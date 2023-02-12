
const {ccclass, property} = cc._decorator;

@ccclass
export default class UISpecimenBag extends cc.Component {

    static filePath:"prefab/mainscene/";
    itemSpace: number;
    root: any;
    showtPosition: any;
    hidePosition: any;
    ndTemplateItem: any;
    isDargItem: boolean;
    autoHide: boolean;
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
    isMoved: any;
    lastTouchPos: any;
    moveDis: cc.Vec2;
    pickItem: any;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    constructor() {
        super();
        this.itemSpace  = 25;
        
        this.root            = null;
        this.showtPosition   = null;
        this.hidePosition    = null;
        this.ndTemplateItem  = null;
        this.isDargItem      = false;
        this.autoHide        = false;

        this.touchStart     = null;
        this.showEndCall    = null;
        this.dragEndCall    = null;
        this.dragEventCall   = null;

        this.isDragItem    = false;
        this.ndDragItem    = null;

        this.isShow          = false;
        this.isShowPopBtn    = true;
        this.isShowHide      = true;

        this.spDropItem      = null;
        this.topSpcace       = 0;

        this.items       = new Array();
   };

    start () {

   };

    onLoad() {
        this.root = this.node.getChildByName('root');

        this.ndDragItem     = this.node.getChildByName('ndDragItem');
        this.ndTemplateItem = this.node.getChildByName('ndTemplateItem');
        this.spDropItem     = this.node.getChildByName('spDropItem');

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

        global.Manager.UIManager.add('UISpecimenBag', this);

        //this.node.zIndex=(99);
        this.showTip(false,null,null);

        let condition = function(item)
       {
           let isFit = false;
           let itemNum = global.Module.PackageData.getItemCount(item.ID);
            isFit = (itemNum>0  && item.subType==8);
       
           return isFit;
       };

       this.showItems(2, condition);
   };

    onDisable() {
        let itemScroll = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
        itemScroll.off(cc.Node.EventType.TOUCH_MOVE, this.touchScrollEvent, this);	
        itemScroll.off(cc.Node.EventType.TOUCH_END, this.touchScrollEvent, this);	
        itemScroll.off(cc.Node.EventType.TOUCH_CANCEL, this.touchScrollEvent, this);	
        itemScroll.off(cc.Node.EventType.TOUCH_START, this.touchScrollEvent, this);	

        this.enableTouch(false);

        global.Manager.UIManager.remove('UISpecimenBag');
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

        let itemNum    =   this.items.length;
        let scale      =  this.ndTemplateItem.scale;

        let sizeWidth = ndItems.getContentSize().width;
        let siezHeight = this.ndTemplateItem.getContentSize().height*scale;
        ndItems.setContentSize(sizeWidth, siezHeight*itemNum+(itemSpace-1)*itemNum+this.topSpcace+50);
        ndItems.removeAllChildren();

        let itemPosY = -siezHeight/2-this.topSpcace;
        let itemPosX = sizeWidth/2;

       
        for (let key in this.items)
        {
            let ID = this.items[key].ID;
            
            let item = cc.instantiate(this.ndTemplateItem);
            ndItems.addChild(item);
    
            item.active = true;
            item.setPosition(cc.v2(itemPosX, itemPosY));
    
            let itemCount = global.Module.PackageData.getItemCount(ID);
            let itemClass = item.getComponent(global.CommonClass.ItemIcon);
            itemClass.setItem(ID, itemCount);
    
            itemPosY -= (siezHeight+itemSpace);
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
        this.itemType   = itemType;
       
        this.items = global.Manager.DBManager.getItemDataByType(this.itemType);  
        this.items = global.CommonClass.Functions.filterItemData(this.items, condition);
        global.CommonClass.Functions.sort(this.items, function(lhs, rhs) {
            if (lhs.color<rhs.color)
            {
                return true;
            }
            else if(lhs.color>rhs.color)
            {
                return false;
            }
            else
            {
                return lhs.ID<rhs.ID;
            }

          //  return lhs.color<rhs.color;
        });
   };

    enableTouch(isEnable) {
        if (isEnable) {
            this.node.on(cc.Node.EventType.TOUCH_MOVE,  this.touchEvent, this);	
            this.node.on(cc.Node.EventType.TOUCH_END,   this.touchEvent, this);	
            this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.touchEvent, this);	
            this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        } else {
            this.node.off(cc.Node.EventType.TOUCH_MOVE,   this.touchEvent, this);	
            this.node.off(cc.Node.EventType.TOUCH_END,    this.touchEvent, this);	
            this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);	
            this.node.off(cc.Node.EventType.TOUCH_START,  this.touchEvent, this);
        }
   };

    scrollToItem(itemID) {
        let scale      = this.ndTemplateItem.scale;
        let siezHeight = this.ndTemplateItem.getContentSize().height*scale;

        let index = 0;
        for (let key in this.items)
        {
            ++index;

            let item = this.items[key];

            if (itemID==item.ID)
            {
                let offset = siezHeight*index+this.itemSpace*index;

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
            let btnShow = this.root.getChildByName('btnShow');
            btnShow.active = false;

          //  let btnHide = this.root.getChildByName('btnHide');
           // btnHide.active = this.isShowHide;

            let self = this;
            let runEnd = function() {
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

           // this.reflashGuide();
        } else {
            let moveTo = cc.moveTo(0.5, this.hidePosition);
            this.root.stopAllActions();

            let self = this;
            let runEnd = function()
            {
                let btnShow = self.root.getChildByName('btnShow');
                btnShow.active = self.isShowPopBtn;

                self.enableTouch(false);

                if (self.showEndCall)
                    self.showEndCall(isShow);
            };

            let endFunction = cc.callFunc(runEnd);
            let seq = cc.sequence(moveTo, endFunction);

            this.root.runAction(seq);
        }

        this.isShow = isShow;

        this.node.stopAllActions();
   };

    createDrop(offset, callBack) {
        if (offset == null)
            offset = cc.v2(0,0);

        let dropPos  = this.ndDragItem.getPosition();
        let position = cc.v2(dropPos.x+offset.x, dropPos.y+offset.y);
        //let dropPos = cc.v2(position.x+offset.x, position.y+offset.y);

        let ndDrop = this.node.getChildByName('ndDrop');
       // ndDrop.removeAllChildren();

        let itemID = this.ndDragItem.tagEx;
        let newItem = cc.instantiate(this.spDropItem);
        global.CommonClass.Functions.setItemTexture(newItem, itemID,null);

        newItem.setPosition(position);
        ndDrop.addChild(newItem);
        newItem.active = true;

        let moveTo = cc.moveTo(1, dropPos);
        let fadeIn = cc.fadeTo(0.8, 100);
        let spawn =  cc.spawn(moveTo, fadeIn);

        //let self = this;
        let endFun = function()
        {
           // cc.Instance.Log.debug('on drop end....')

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

    touchEvent(event)
    {
        let itemID = this.ndDragItem.tagEx;
        let touchPoint = event.getLocation();

        if (event.type==cc.Node.EventType.TOUCH_START)
        {
            this.touchStart  = touchPoint;
            
            let self = this;
            let delayEnd = function()
            {
                self.showTip(!self.isMoved, itemID, touchPoint);
            };

            let delayAction = cc.delayTime(1);
            let endFunction = cc.callFunc(delayEnd)
            let seq = cc.sequence(delayAction, endFunction);
            this.node.runAction(seq);
        }
        else if (event.type==cc.Node.EventType.TOUCH_MOVE)
        {
            let distance = touchPoint.sub(this.touchStart).mag();
            if (distance>5)
            {
                this.isMoved = true;
                this.showTip(false,null,null);
            }
        }
        else if (event.type==cc.Node.EventType.TOUCH_END || event.type==cc.Node.EventType.TOUCH_CANCEL)
        {
            if (this.autoHide)
            {
                this.show(false,null);
            }

            this.showTip(false,null,null);
            this.ndDragItem.tagEx = -1; 
        }

      //  cc.Instance.Log.debug('touchEvent..' + event.type.toString());
       
        if (this.dragEventCall)
            this.dragEventCall(event, itemID);
       
   };

    getPickItem(touchPoint)
    {
        let itemScroll = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
        let ndView =  itemScroll.getChildByName('view');
        let ndItems = ndView.getChildByName('content');

        let children = ndItems.getChildren();
        for (let key in children)
        {
            let ndItem = children[key];
            let spItem = ndItem.getChildByName('spItem');
            let box = spItem.getBoundingBoxToWorld();
            if (box.contains(touchPoint))
            {
                return ndItem;
            }
        }

        return null;
   };

    showTip(isShow, itemID, touchPoint)
    {
        let ndTip = this.node.getChildByName('ndTip');
        if (ndTip==null) return;
        
        ndTip.active = isShow;

        if (isShow)
        {
            let itemData = global.Manager.DBManager.getItemNew(itemID);
            if (itemData != null)
            {
                let lblName         = ndTip.getChildByName('lblName').getComponent(cc.Label);
                let lblDec          = ndTip.getChildByName('lblDec').getComponent(cc.Label);
    
                lblName.string = itemData.name;
                lblDec.string  = itemData.resume;
            }

            let position = this.node.convertToNodeSpaceAR(touchPoint);
            position.x += 50;
            ndTip.setPosition(position);
        }

        //let lblTime         = this.node.getChildByName('lblTime').getComponent(cc.Label);
       // let lblGreenValue   = this.node.getChildByName('lblGreenValue').getComponent(cc.Label);
   };

    touchScrollEvent(event)
    {
        let touchPoint = event.getLocation();;
        if (event.type==cc.Node.EventType.TOUCH_START)
        {
            this.touchStart   = touchPoint;
            this.lastTouchPos = touchPoint;

            this.moveDis = cc.v2(0,0);

            this.pickItem = this.getPickItem(touchPoint);

            let self = this;
            let delayEnd = function()
            {
                if (self.pickItem != null)
                {
                    let itemClass = self.pickItem.getComponent(global.CommonClass.ItemIcon);
                    let itemID = itemClass.getItemID()
                    self.showTip(!self.isMoved, itemID, touchPoint);
                }
            };

            let delayAction = cc.delayTime(1);
            let endFunction = cc.callFunc(delayEnd)
            let seq = cc.sequence(delayAction, endFunction);
            this.node.runAction(seq);
        }
        else if (event.type==cc.Node.EventType.TOUCH_END || event.type==cc.Node.EventType.TOUCH_CANCEL)
        {
            if (this.isDargItem)
            {
                this.ndDragItem.active = false;
                this.isDargItem = false;
               // this.isMoved = false;

                let itemScroll = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
                let scrollView = itemScroll.getComponent(cc.ScrollView);
                scrollView.enabled = true;

                if (this.dragEndCall)
                {
                    let distance = touchPoint.sub(this.touchStart).mag();
                    if (distance > 50)
                    {
                        let itemID = this.ndDragItem.tagEx;
                        let contentSize = this.ndDragItem.getContentSize();
                        touchPoint.y -= contentSize.height/2;
                        
                        this.dragEndCall(itemID, touchPoint);
                    }
                }

                this.touchStart = null;
            }
            this.node.stopAllActions();

            this.showTip(false,null,null);
        }
        else if(event.type==cc.Node.EventType.TOUCH_MOVE)
        {
            let touchPoint  = event.getLocation();
            let distance    = touchPoint.sub(this.touchStart).mag();
            if (distance>5)
            {
                this.isMoved = true;
                this.showTip(false,null,null);
            }

            if (this.pickItem)
            {
                this.moveDis.x += Math.abs(touchPoint.x-this.lastTouchPos.x);
                this.moveDis.y += Math.abs(touchPoint.y-this.lastTouchPos.y);

                if (this.moveDis.x>this.moveDis.y && this.moveDis.x>4)
                {
                    this.isDargItem = true;

                    let itemClass = this.pickItem.getComponent(global.CommonClass.ItemIcon);
                    if (itemClass.getItemID()>0)
                        this.onItemClick(itemClass, touchPoint);
                }
            }
            if (this.isDargItem)
            {
                let position = this.node.convertToNodeSpaceAR(touchPoint);
                let contentSize = this.ndDragItem.getContentSize();
                position.y -= contentSize.height/2;

                this.ndDragItem.setPosition(position);

                let uiPreciousRoom = global.Manager.UIManager.get('UIPreciousRoom');
                if (uiPreciousRoom != null)
                {
                    let mode = 1;
                    if (!uiPreciousRoom.canPutItem(this.ndDragItem))
                        mode = 2;
                       
                    let preciousClass = this.ndDragItem.getComponent(global.CommonClass.PreciousItem);
                    preciousClass.showCanPut(mode); 
                }
            }

            this.lastTouchPos = touchPoint;
        }

       // cc.Instance.Log.debug('touchScroll..' + event.type.toString());
      
   };

    onItemClick(itemClass, touchPoint)
    {
        let itemScroll = this.root.getChildByName('ndItems').getChildByName('itemBack').getChildByName('itemScorll');
        let scrollView = itemScroll.getComponent(cc.ScrollView);
        scrollView.enabled = false;
        
        let itemID = itemClass.getItemID();

        let itemData = {index:-1, templateID:itemID}
        let dragClass = this.ndDragItem.getComponent(global.CommonClass.PreciousItem); 
        dragClass.setItem(itemData);

        let position = this.node.convertToNodeSpaceAR(touchPoint);
        this.ndDragItem.setPosition(position);
       
        this.ndDragItem.tagEx = itemID;
        this.ndDragItem.active = true;
   };

    btnHide()
    {
        //cc.Proxys.ProxyGuide.stepNextGuide('CloseFlyBag');
        this.show(false,null);
   };

    btnShow()
    {
        global.Proxys.ProxyGuide.stepNextGuide('OpenPreciousRoomBag');

        this.show(true,null);
   };
}
