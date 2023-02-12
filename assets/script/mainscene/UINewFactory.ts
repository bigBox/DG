

const {ccclass, property} = cc._decorator;

@ccclass
export default class UINewFactory extends cc.Component {
    @property({ type: cc.Node, displayName: "引导", tooltip: "引导箭头" })
    helpNode: cc.Node = null;
    curSelIdx: number;
    itemSpace: number;
    root: any;
    showtPosition: any;
    hidePosition: any;
    ndTemplateItem: any;
    isDargItem: boolean;
    isDragFactory: boolean;
    ndDragFactory: any;
    isShow: boolean;
    data: any[];
    clickStartPos: any;
    state: number;
    itemClass: any;
    isMovecell: boolean;
    constructor() {
        super();
        this.curSelIdx = 0;
        this.itemSpace = 0;
        this.state = 0;//0刚点击 1上下滚动 2左右拖动建筑出去
        this.root = null;
        this.showtPosition = null;
        this.hidePosition = null;
        this.ndTemplateItem = null;
        this.isDargItem = false;

        this.isDragFactory = false;
        this.ndDragFactory = null;

        this.isShow = false;

        this.data = new Array();
    };

    start() {

    };

    onLoad() {
        this.root = this.node.getChildByName('root');
        this.ndDragFactory = this.node.getChildByName('ndDragFactory');

        this.hidePosition = this.root.getPosition();
        let withX = global.Manager.Sdk.sizeMath();
        this.hidePosition.x -=withX
        this.showtPosition = cc.v2(this.hidePosition);
        this.showtPosition.x += 300+withX*3;
        // let ndBox = this.root.getChildByName('ndBox');
        // ndBox.width = 270+(global.Manager.Sdk.sizeMath()/2);
        this.btnHide();
        cc.systemEvent.on('10001', this.setData, this);
        this.setData();
      
    };

    onEnable() {

        this.ndDragFactory.active = false;

        let itemScroll = this.root.getChildByName('ndFactorys').getChildByName('factoryBack').getChildByName('itemScorll');
        itemScroll.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        itemScroll.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        itemScroll.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        itemScroll.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        global.Manager.UIManager.add('UINewFactory', this);
    };

    onDisable() {
        let itemScroll = this.root.getChildByName('ndFactorys').getChildByName('factoryBack').getChildByName('itemScorll');
        itemScroll.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        itemScroll.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        itemScroll.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        itemScroll.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);

        this.enableTouch(false);

        global.Manager.UIManager.remove('UINewFactory');
        cc.systemEvent.off('10001', this.setData, this);
        this.setData();
    };
    setData() {
        if (!this.helpNode)
            return;
        this.helpNode.active = false;
        let scene = cc.director.getScene();
        if (scene.name == 'PlayerScene')
            return;
        let taskdata = global.Module.TaskData.getHasAcceptTaskData();
        if (!taskdata || !this.node)
            return;
       
        let task = global.Manager.DBManager.findData('Tasks', 'ID', taskdata.taskId);
        var data = global.Proxys.ProxyNewFactory.getNeedShow();
        for (let i = 0; i < data.length; i++) {
            if (data[i].ID == task.FactoryID && taskdata.state == 1) 
                this.helpNode.active = true;
        }

    };
    getIsShow() {
        return this.isShow;
    };

    reflash(page) {
        this.curSelIdx = page;
        let itemSpace = this.itemSpace;
        this.data = global.Proxys.ProxyNewFactory.getNeedShow();
        let ndView = this.root.getChildByName('ndFactorys').getChildByName('factoryBack').getChildByName('itemScorll').getChildByName('view');
        let ndItems = ndView.getChildByName('content');
        let itemScroll = this.root.getChildByName('ndFactorys').getChildByName('factoryBack').getChildByName('itemScorll').getComponent(cc.ScrollView);
        ndItems.removeAllChildren();
        global.Instance.Log.debug('',this.data)
        if (this.data != null && this.data.length > 0) {
            let itemNum = this.data.length;
            this.ndTemplateItem = this.node.getChildByName('ndTemplateItem');

            let sizeWidth = ndItems.getContentSize().width;
            let siezHeight = this.ndTemplateItem.getContentSize().height;
            ndItems.setContentSize(sizeWidth, siezHeight * itemNum + (itemSpace - 1) * itemNum);


            let itemPosY = -siezHeight / 2 * this.ndTemplateItem.scale;

            // let nextLevel = cc.Module.MainPlayerData.getLevel()+1;
            let isFirst = true;
            for (let key in this.data) {
                let value = this.data[key];

                let item = cc.instantiate(this.ndTemplateItem);
                ndItems.addChild(item);
                item.active = true;
                item.setPosition(cc.v2(50, itemPosY));
                let itemClass = item.getComponent(global.CommonClass.FactoryItemNew);
                itemClass.setFactory(value.ID);

                item.getChildByName('direct').active = isFirst;

                if (isFirst)
                    isFirst = false;
                itemPosY -= (siezHeight * this.ndTemplateItem.scale + itemSpace);
            }
        }
    };

    enableTouch(isEnable) {
        if (isEnable) {
            this.node.on(cc.Node.EventType.TOUCH_MOVE, this.dragFactoryEvent, this);
            this.node.on(cc.Node.EventType.TOUCH_END, this.dragFactoryEvent, this);
            this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.dragFactoryEvent, this);
            this.node.on(cc.Node.EventType.TOUCH_START, this.dragFactoryEvent, this);
        }
        else {
            this.node.off(cc.Node.EventType.TOUCH_MOVE, this.dragFactoryEvent, this);
            this.node.off(cc.Node.EventType.TOUCH_END, this.dragFactoryEvent, this);
            this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.dragFactoryEvent, this);
            this.node.off(cc.Node.EventType.TOUCH_START, this.dragFactoryEvent, this);
        }
    };

    show(isShow) {
        if (isShow) {
            this.reflash(this.curSelIdx);
            let moveTo = cc.moveTo(0.5, this.showtPosition);
            this.root.stopAllActions();

            this.root.runAction(moveTo);

            if (global.Proxys.ProxyGuide.stepNextGuide('OpenNewFactoryUI')) {
                global.Instance.Dynamics["MainMap"].centerToFactoryByTableID(3020);
            }
        }
        else {


            this.helpNode.active = false;
            let moveTo = cc.moveTo(0.5, this.hidePosition);
            this.root.stopAllActions();

            let self = this;
            let runEnd = function () {
                let ndView = self.root.getChildByName('ndFactorys').getChildByName('factoryBack').getChildByName('itemScorll').getChildByName('view');
                let ndItems = ndView.getChildByName('content');
                ndItems.removeAllChildren();
            };

            let endFunction = cc.callFunc(runEnd);
            let seq = cc.sequence(moveTo, endFunction);

            this.root.runAction(seq);
        }

        this.isShow = isShow;

    };

    dragFactoryEvent(event) {
       

        let touchPoint = event.getLocation();;
        if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            if (this.isDragFactory) {
                let mainMap = global.Instance.Dynamics['MainMap'];
                let touchPoint = event.getLocation();
                global.Instance.Log.debug("xxx " + touchPoint.x+"yyy " + touchPoint.y);
                if (this.isMovecell == true) {
                    let positX = touchPoint.x;
                    let positY = touchPoint.y;
                    let distanceW = 0;
                    let distanceH = 0;
                    if (positX > 1200)
                        distanceW = -300;
                    if (positX < 200)
                        distanceW = 300;
                    if (positY > 600)
                        distanceH = -300;
                    if (positY < 100)
                        distanceH = 200;
                    let self = this
                    let callback = function () {
                        self.isMovecell = true;
                        // self.unschedule(self.callback);
                        // self.callback = null;
                    }
                    this.isMovecell = false;
                    mainMap.movecell(distanceW, distanceH, callback)
                  
                }
               
                let position = this.node.convertToNodeSpaceAR(touchPoint);
                this.ndDragFactory.setPosition(position);

                let factory = this.ndDragFactory.getChildByName('newFactory');
                if (factory != null) {
                    
                    let isCross = mainMap.checkIsCross(factory);
                    let factoryClass = factory.getComponent(global.CommonClass.FactoryBase);
                    factoryClass.showCross(isCross);
                }
            }
        }
        else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
            if (this.isDragFactory) {
                this.ndDragFactory.active = false;
                this.isDragFactory = false;
                this.enableTouch(false);

                let mainMap = global.Instance.Dynamics['MainMap'];
                let factory = this.ndDragFactory.getChildByName('newFactory');
                if (factory != null) {
                    let isCross = mainMap.checkIsCross(factory);
                    if (!isCross) {
                        let factoryID = this.ndDragFactory.tagEx;
                        mainMap.addFactoryByWorldPos(factoryID, touchPoint);

                        global.Proxys.ProxyNewFactory.removeFactory(factoryID);
                    }
                }
            }
        }

    };

    touchEvent(event) {
        let touchPoint = event.getLocation();;
        if (event.type == cc.Node.EventType.TOUCH_START) {
            this.clickStartPos = touchPoint;
            this.state == 0
            let ndView = this.root.getChildByName('ndFactorys').getChildByName('factoryBack').getChildByName('itemScorll').getChildByName('view');
            let ndItems = ndView.getChildByName('content');
            this.itemClass = null;
            let children = ndItems.getChildren();
            for (let key in children) {
                let ndItem = children[key];
                let box = ndItem.getChildByName('ndItem').getBoundingBoxToWorld();
                this.itemClass = ndItem.getComponent(global.CommonClass.FactoryItemNew);
                if (box.contains(touchPoint) && !this.itemClass.getLocked()){
                    this.itemClass.node.scale = 1.2;
                    break;
                }
                    
            }
        }
        else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
            this.state = 0;
            if(this.itemClass){
                this.itemClass.node.scale = 1;
            }
            if (!this.isDragFactory) {
                if (this.isDargItem) {
                    let dragItem = this.node.getChildByName('dragItem');
                    dragItem.active = false;
                    this.isDargItem = false;
          
                    let itemScroll = this.root.getChildByName('ndFactorys').getChildByName('factoryBack').getChildByName('itemScorll');
                    let scrollView = itemScroll.getComponent(cc.ScrollView);
                    scrollView.enabled = true;
                }
            }
        }
        else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            let distanceX = Math.abs(touchPoint.x - this.clickStartPos.x);
            let distanceY = Math.abs(touchPoint.y - this.clickStartPos.y);
           
            if (this.state == 0) {
                if (distanceY > 20)
                    this.state = 1;
                if (distanceX > 20)
                    this.state = 2;
                if (this.state == 2 && this.itemClass) {
                    this.onItemClick(this.itemClass);
                    this.isDargItem = true;
                    this.isMovecell = true
                }
            }
            if (this.state==2&&!this.isDragFactory) {
                if (this.isDargItem) {

                    let dragItem = this.node.getChildByName('dragItem');
                    let position = this.node.convertToNodeSpaceAR(touchPoint);
                    dragItem.setPosition(position);
                    let ndFactorys = this.root.getChildByName('ndFactorys')
                    let ndBox = ndFactorys.getChildByName('ndBox');
                    let box = ndBox.getBoundingBoxToWorld();
                    if (ndBox.active && !box.contains(touchPoint)) {
                        this.show(false);
                        dragItem.active = false;

                        this.isDragFactory = true;
                        this.ndDragFactory.active = true;
                        this.enableTouch(true);

                        let factoryID = dragItem.tagEx;
                        this.createFactory(factoryID);
                    }
                }
            }
        }
    };

    createFactory(templateID) {
        let factoryData = global.Manager.DBManager.findData("Factory", 'ID', templateID);
        let filePath = factoryData.prefabFile;

        this.ndDragFactory.removeAllChildren();

        let self = this;
        cc.loader.loadRes(filePath, function (err, prefab) {
            if (err == null) {
                let newNode = cc.instantiate(prefab);
                if (self.ndDragFactory != null)
                    self.ndDragFactory.addChild(newNode, cc.macro.MAX_ZINDEX);
                newNode.setPosition(0, 0);
                newNode.setName('newFactory');

                let dragLayer = global.CommonClass.DragLayer.getDragLayer('MainMap');
                let scale = dragLayer.getItemScale();
                newNode.setScale(scale);

                self.ndDragFactory.tagEx = templateID;

                let factoryClass = newNode.getComponent(global.CommonClass.FactoryBase);
                factoryClass.setID(templateID);
             
                let isShow = global.Module.GameData.getIsShowFactoryName();
                factoryClass.showName(isShow);   //是否显示建筑名字
            }
        });
    };

    onItemClick(itemClass) {
        let touchPoint = itemClass.node.getPosition();
        let itemScroll = this.root.getChildByName('ndFactorys').getChildByName('factoryBack').getChildByName('itemScorll');
        let scrollView = itemScroll.getComponent(cc.ScrollView);
        scrollView.enabled = false;

        let factoryID = itemClass.getFactoryID();
        let factory = global.Manager.DBManager.findData("Factory", 'ID', factoryID);

        let dragItem = this.node.getChildByName('dragItem');

        let spItem = dragItem.getChildByName('spItem');
        global.CommonClass.Functions.setTexture(spItem, factory.filePath, function () {

        });

        let position = this.node.convertToNodeSpaceAR(touchPoint);
        dragItem.setPosition(position);
        dragItem.tagEx = factoryID;
        dragItem.active = true;
    };

    btnSelPage(event, arg) {
        let pageIdx = parseInt(arg);
        for (let i = 1; i <= 4; ++i) {
            let btnPage = this.root.getChildByName('ndFactorys').getChildByName('btnPage' + i.toString());
            btnPage.getComponent(cc.Button).interactable = (pageIdx != i);

            if (pageIdx == i)
                btnPage.zIndex = (cc.macro.MAX_ZINDEX);
            else
                btnPage.zIndex = (-1);
        }

        // if (event != null)
        this.reflash(pageIdx);
    };

    btnHide() {
        this.show(false);
    };
}
