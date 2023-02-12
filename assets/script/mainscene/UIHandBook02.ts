

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIHandBook02 extends cc.Component {
    taskIsow: boolean;
    itemType: number;
    curPage: number;
    maxPage: number;
    books: any[];
    touchStart: cc.Vec2;
    @property({ type: cc.Node, displayName: "touchNode", tooltip: "touchNode" })
    touchNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "nodePageLeft", tooltip: "nodePageLeft" })
    nodePageLeft: cc.Node = null;
    @property({ type: cc.Node, displayName: "nodePageRight", tooltip: "nodePageRight" })
    nodePageRight: cc.Node = null;
    @property({ type: cc.Node, displayName: "nodeChangePage", tooltip: "nodeChangePage" })
    nodeChangePage: cc.Node = null;
    @property({ type: cc.Node, displayName: "nodeActionPageRight", tooltip: "nodeActionPageRight" })
    nodeActionPageRight: cc.Node = null;
    @property({ type: cc.Node, displayName: "nodeActionPageLeft", tooltip: "nodeActionPageLeft" })
    nodeActionPageLeft: cc.Node = null;
    @property({ type: cc.Node, displayName: "toggles", tooltip: "大分类" })
    toggles: any = [];
    @property({ type: cc.Node, displayName: "second", tooltip: "小分类" })
    smalltoggles: any = [];
    
    @property({ type: cc.Node, displayName: "templateItem", tooltip: "templateItem" })
    templateItem: cc.Node = null;

    @property({ type: cc.Node, displayName: "sortContainerNode", tooltip: "排序方式" })
    sortContainerNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "suitNode", tooltip: "套装名称" })
    suitNode: cc.Node = null;
    
    @property({ type: cc.Node, displayName: "helpNode", tooltip: "任务引导" })
    helpNode: cc.Node = null;
    isInChagne: boolean;
    bookArr: { itemType: number; index: number; name: string; titArr: { name: string; page: number; }[]; }[];
    secondID: number;
    sortType: number;

    constructor() {
        super();
        this.taskIsow = true;//是否领取第一个图鉴任务
        this.itemType = 0;
        this.curPage = 0;
        this.maxPage = 0;
        this.books = [];
        this.touchStart = cc.v2(0, 0);
        this.secondID = 0;//当前类型小分类
        this.sortType = 0;//排序默认0 珍稀度1
        
    };

    onLoad() {
        // this.indexToType = { 1: 5, 2: 4, 3: 2, 4: 1 };                     //ui中的图标位置对应服务器图鉴类型
        // this.typeDec = { 1: '宝物', 2: '宝贝', 3: '动物', 4: '植物' };
       this.reflashHelp();
    }
    reflashHelp(){
        var data = global.Module.TaskData.getHasAcceptTaskData();
        if (!data)
            return;
        if (data.state == 1 && data.taskId == 10020){
            this.taskIsow = false;
            this.helpNode.active = true;
        }
           
    };
    start() {

    }
    onEnable() {
        this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.isInChagne = false;
        this.nodeChangePage.active = false;
    };

    onDisable() {
        this.touchNode.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.touchNode.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.touchNode.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.touchNode.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
    };

    show(itemType) {
        this.itemType = itemType;
        this.bookArr = global.Module.HandBookData.getbookArr();
        for (let i = 0; i < this.bookArr.length; i++) {
            this.toggles[i].itemType = this.bookArr[i].itemType;
        }
        this.initDatas();
        this.fillPage();
        this.titArr();
    };
    titArr(){
      for (let i = 0; i < this.smalltoggles.length; i++) {
          let titArrData = this.bookArr[this.itemType].titArr[i]
          if (titArrData) {
              this.smalltoggles[i].active = true;
              this.smalltoggles[i].page = titArrData.page;
              let backlabel = this.smalltoggles[i].getChildByName('Background').getChildByName('Label')
              backlabel.getComponent(cc.Label).string = titArrData.name;
              let checklabel = this.smalltoggles[i].getChildByName('checkmark').getChildByName('Label')
              checklabel.getComponent(cc.Label).string = titArrData.name;
          } else {
              this.smalltoggles[i].active = false;
          }
      }
      this.smalltoggles[0].getComponent(cc.Toggle).isChecked = true;
    };
    //当前页数据
    initDatas() {
        this.curPage = 0;

        this.books = [];
        let tmp = [];
        let index = this.bookArr[this.itemType].index;
        if (index != 7) {
            for (let i = 0; i < 100; i++) {

                let tmpItems = global.Module.HandBookData.getDataByTypeAndPage(index, this.secondID, this.sortType, i + 1);
                if (tmpItems.length <= 0) {
                    break;
                }
                for (let k = 0; k < tmpItems.length; k++) {
                    tmp.push(tmpItems[k]);
                    if (tmp.length == 9) {
                        this.books.push(tmp);
                        tmp = [];
                    }
                }
            }
            if (tmp != []) {
                this.books.push(tmp);
                tmp = [];
            }
            
        } else {
            this.books = global.Module.HandBookData.getSuitDataTypePage(this.sortType);
            let leftNode = this.suitNode.getChildByName('left');
            let rightNode = this.suitNode.getChildByName('right');
            let leftLabel = leftNode.getChildByName('leftLabel').getComponent(cc.Label);
            let rightLabel = rightNode.getChildByName('rightLabel').getComponent(cc.Label);

            let books1 = this.books[0];
            let books2 = this.books[1];
            let books1Data = global.Manager.DBManager.findData('CollectionData', 'ID', books1[0].antiqueId);
            let books2Data = global.Manager.DBManager.findData('CollectionData', 'ID', books2[0].antiqueId);
            leftLabel.string = books1Data.name;
            rightLabel.string = books2Data.name;

        }
        this.sortContainerNode.active = this.itemType != 4;
        this.suitNode.active = this.itemType == 4;
        
        this.maxPage = this.books.length;
    };
    //换类型
    onToggleTab(event) {
        let itemType = event.node.itemType;
        this.secondID = 0;
        if (this.bookArr[itemType].name == '画') {
            global.CommonClass.UITip.showTipTxt('暂未开放', global.Enum.TipType.TIP_BAD);
            this.toggles[this.itemType].getComponent(cc.Toggle).isChecked = true;
            this.initDatas();
            this.fillPage();
            return;
        }
        this.itemType = itemType;
        this.initDatas();
        this.fillPage();
        this.titArr();
    };
    //换小类型
    onTogglesmall(event) {
        let page = event.node.page
        this.secondID = page;
        this.initDatas();
        this.fillPage();
    };
    //稀有度
    onSortTypemall(event,sortType){
        this.sortType = sortType;
        this.initDatas();
        this.fillPage();
    };
    setItemTexture(book, target) {

        let node = cc.instantiate(this.templateItem);
        target.addChild(node);
        let spItem = node.getChildByName('spItem');
        // 0:没有 1:破损 2:完美(有颜色) 
        let data = global.Manager.DBManager.findData('Items', 'ID', book.bookId);
        let path = '';
        let name = data.perfect;
        if (name == 0)
            name = book.bookId;
        if (book.state == 0) {
            path = global.Enum.handBookPath.pathWorn +name;
            global.CommonClass.Functions.setTexture(spItem, path, function (image) {
                target.active = true;
                spItem.scale = global.CommonClass.Functions.getToscale(spItem,148,140);
            }.bind(this));
           
        } else if (book.state == 1) {
            path = global.Enum.handBookPath.pathLoss + name;
            global.CommonClass.Functions.setTexture(spItem, path, function (image) {
                target.active = true;
                spItem.scale = global.CommonClass.Functions.getToscale(spItem,148,140);
            }.bind(this));
        } else if (book.state == 2) {
            path = global.Enum.handBookPath.pathPerfect + name;
            if (this.itemType == 1 || this.itemType == 2)
                path = data.path +name;
            global.CommonClass.Functions.setTexture(spItem, path, function (image) {
                target.active = true;
                spItem.scale = global.CommonClass.Functions.getToscale(spItem,148,140);
               
            }.bind(this));
        }
        

    };
    callback(arg0, arg1) {
        global.Instance.Log.debug('', arg0);
        global.Instance.Log.debug('', arg1);
    };

    fillLeftPage(page, nodeRoot) {
        let nodeScrollView = nodeRoot.getChildByName("nodeScrollView");
        let  nodeview = nodeScrollView.getChildByName("view");
        let  nodeContent = nodeview.getChildByName("content");
        nodeContent.removeAllChildren();
        let lblPage = nodeRoot.getChildByName("lblPage");
        lblPage.getComponent(cc.Label).string = page + 1;
        if (page < this.books.length) {
            let books = this.books[page];
            for (let i = 0; i < books.length; i++) {
                this.setItemTexture(books[i], nodeContent);
            }
        }
    };

    fillRightPage(page, nodeRoot) {
        let nodeScrollView = nodeRoot.getChildByName("nodeScrollView");
        let  nodeview = nodeScrollView.getChildByName("view");
        let  nodeContent = nodeview.getChildByName("content");
        nodeContent.removeAllChildren();
        let lblPage = nodeRoot.getChildByName("lblPage");
        lblPage.getComponent(cc.Label).string = page + 1;
        if (page < this.books.length) {
            let books = this.books[page];
            for (let i = 0; i < books.length; i++) {
                this.setItemTexture(books[i], nodeContent);
            }
        }
    };

    // 填充页面
    fillPage() {
        this.fillLeftPage(this.curPage, this.nodePageLeft);
        this.fillRightPage(this.curPage + 1, this.nodePageRight);
    };

    gotoItemDetail(touchPoint) {
        {
            let nodeScrollView = this.nodePageLeft.getChildByName("nodeScrollView").getComponent(cc.ScrollView);
            let nodeContent = nodeScrollView.content;
            let books = this.books[this.curPage];
            for (let i = 0; i < nodeContent.children.length; i++) {
                let spItem = nodeContent.children[i];
                let boundingBox = spItem.getBoundingBoxToWorld();
                if (boundingBox.contains(touchPoint)) {
                    global.Manager.UIManager.open('UIHandBook06', null, function (panel) {
                        if (panel != null) {
                            panel.show(books[i].itemId);
                        }
                    }.bind(this));
                    return;
                }
            }
        }
        {
            let nodeScrollView = this.nodePageRight.getChildByName("nodeScrollView").getComponent(cc.ScrollView);
            let nodeContent = nodeScrollView.content;
            let books = this.books[this.curPage + 1];
            for (let i = 0; i < nodeContent.children.length; i++) {
                let spItem = nodeContent.children[i];
                let boundingBox = spItem.getBoundingBoxToWorld();
                if (boundingBox.contains(touchPoint)) {
                    global.Manager.UIManager.open('UIHandBook06', null, function (panel) {
                        if (panel != null) {
                            panel.show(books[i].itemId);
                        }
                    }.bind(this));
                    return;
                }
            }

        }
    };

    touchEvent(event) {
        let touchPoint = event.getLocation();

        if (event.type == cc.Node.EventType.TOUCH_START) {
            this.touchStart = touchPoint;
        } else if (event.type == cc.Node.EventType.TOUCH_MOVE) {

        } else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
            if (!this.isInChagne) {
                let xMove = Math.abs(touchPoint.x - this.touchStart.x);
                if (xMove > 30) {
                    if (this.touchStart.x > touchPoint.x) {
                        this.changePage(null,1);
                    } else {
                        this.changePage(null,-1);
                    }
                } else {
                    this.gotoItemDetail(touchPoint);
                }
            }
        }
    };

    changePage(event,dir) {
        let tmpPage = this.curPage;
        var data = global.Module.TaskData.getHasAcceptTaskData();

        if (data && data.taskId == 10020 && data.state == 1)
            global.Instance.MsgPools.send('BookTurnPages', {}, function (msg) {
                if (msg.errorID != 0)
                    return;
                this.taskIsow = true;
            }.bind(this));
        let leftNode = this.suitNode.getChildByName('left');
        let rightNode = this.suitNode.getChildByName('right');
        let leftLabel = leftNode.getChildByName('leftLabel').getComponent(cc.Label);
        let rightLabel = rightNode.getChildByName('rightLabel').getComponent(cc.Label);
        if (dir == 1) {
            tmpPage += 2;
            if (tmpPage >= this.maxPage) {
                return;
            }
            this.helpNode.active = false;
            this.suitNode.active = false;
            this.sortContainerNode.active = false;

            
            this.fillRightPage(this.curPage + 1, this.nodeActionPageRight);
            this.fillLeftPage(this.curPage + 2, this.nodeActionPageLeft);

            
            if (this.itemType == 4) {
                let books1 = this.books[this.curPage + 2];
                let books2 = this.books[this.curPage + 3];
                let books1Data = global.Manager.DBManager.findData('CollectionData', 'ID', books1[0].antiqueId);
                let books2Data = global.Manager.DBManager.findData('CollectionData', 'ID', books2[0].antiqueId);
                leftLabel.string = books1Data.name;
                rightLabel.string = books2Data.name;
            }

            this.curPage = tmpPage;
            this.fillRightPage(this.curPage + 1, this.nodePageRight);

            this.isInChagne = true;
            this.nodeChangePage.active = true;
            let animation = this.nodeChangePage.getComponent(cc.Animation);
            animation.on('finished', function () {
                this.fillLeftPage(this.curPage, this.nodePageLeft);
                this.sortContainerNode.active = this.itemType != 4;
                this.suitNode.active = this.itemType == 4;
                animation.off('finished');
                this.nodeChangePage.active = false;
                this.isInChagne = false;
            }.bind(this));
            animation.play("animChangePage");
        } else {
            tmpPage -= 2;
            if (tmpPage < 0) {
                return;
            }
            this.helpNode.active = false;
            this.suitNode.active = false;
            this.sortContainerNode.active = false;


            this.fillRightPage(this.curPage - 1, this.nodeActionPageRight);
            this.fillLeftPage(this.curPage, this.nodeActionPageLeft);
            this.curPage = tmpPage;
            this.fillLeftPage(this.curPage, this.nodePageLeft);
            this.isInChagne = true;
            this.nodeChangePage.active = true;
            let animation = this.nodeChangePage.getComponent(cc.Animation);
            animation.on('finished', function () {
                this.fillRightPage(this.curPage + 1, this.nodePageRight);
                animation.off('finished');
                this.sortContainerNode.active = this.itemType != 4;
                this.suitNode.active = this.itemType == 4;
                this.nodeChangePage.active = false;
                this.isInChagne = false;
            }.bind(this));
            animation.play("animChangePage2");
            if (this.itemType == 4) {
                let books1 = this.books[this.curPage];
                let books2 = this.books[this.curPage + 1];
                let books1Data = global.Manager.DBManager.findData('CollectionData', 'ID', books1[0].antiqueId);
                let books2Data = global.Manager.DBManager.findData('CollectionData', 'ID', books2[0].antiqueId);
                
                leftLabel.string = books1Data.name;
                rightLabel.string = books2Data.name;
            }
        }
    };

    btnClose(event, arg) {
        if (this.taskIsow) {
            let panel = global.Manager.UIManager.get("UICollectionNew");
            if (panel)
                panel.colleisShow(true);

            global.Manager.UIManager.close('UIHandBook02');
        } else {
            global.CommonClass.UITip.showTipTxt('请先按箭头翻页', global.Enum.TipType.TIP_BAD);
        }
    }
    // update(dt) {}
}
