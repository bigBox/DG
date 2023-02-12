const {ccclass, property} = cc._decorator;

@ccclass
export default class UIFirstTalk extends cc.Component {
    static filePath: any = "prefab/mainscene/";
    static zOrder: any = global.Enum.PanelZOrder.PanelZ_TOP;
    @property({ type: cc.Label, displayName: "lblTitle", tooltip: "lblTitle" })
    lblTitle: cc.Label = null;
    @property({ type: cc.RichText, displayName: "lblDec", tooltip: "lblDec" })
    lblDec: cc.RichText = null;
    @property({ type: cc.Node, displayName: "btnPre", tooltip: "btnPre" })
    btnPre: cc.Node = null;
    @property({ type: cc.Node, displayName: "btnNext", tooltip: "btnNext" })
    btnNext: cc.Node = null;
    @property({ type: cc.Node, displayName: "nodeShow", tooltip: "nodeShow" })
    nodeShow: cc.Node = null;
    @property({ type: cc.Node, displayName: "ShowUI", tooltip: "ShowUI" })
    ShowUI: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndSpeek", tooltip: "ndSpeek" })
    ndSpeek: cc.Node = null;
    @property({ type: cc.Node, displayName: "moveTo", tooltip: "moveTo" })
    moveTo: cc.Node = null;
    @property({ type: cc.Node, displayName: "nodeContent", tooltip: "nodeContent" })
    nodeContent: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndTemplate", tooltip: "ndTemplate" })
    ndTemplate: any = null;
    @property({ type: cc.Node, displayName: "ndTemplate1", tooltip: "ndTemplate1" })
    ndTemplate1: any = null;
    @property({ type: cc.Node, displayName: "ndTemplate2", tooltip: "ndTemplate2" })
    ndTemplate2: any = null;
    @property({ type: cc.Node, displayName: "spImg", tooltip: "spImg" })
    spImg: cc.Node = null;
    @property({ type: cc.Node, displayName: "jlsitem", tooltip: "jlsitem" })
    jlsitem: cc.Node = null;

    callback: any;
    guideData: { title: string; };
    curIdx: number;
    guide: any;
    nodeNode: any;
    constructor() {
        super();
        this.callback = null;
        UIFirstTalk.zOrder = global.Enum.PanelZOrder.PanelZ_TOP;
        this.guideData =
        {
            title: "游戏介绍",
        }
        this.curIdx = 0;
        this.guide = null;
    };

    onLoad() {
        this.nodeContent.active = false;
    };

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.on(cc.Node.EventType.MOUSE_WHEEL, this.touchEvent, this);
        this.lblTitle.string = this.guideData.title;
    };

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.off(cc.Node.EventType.MOUSE_WHEEL, this.touchEvent, this);
    };
    touchEvent(event) {
        if (event.type == cc.Node.EventType.TOUCH_END)
            this.btnPage(null, '1');
    };
    showPage(idx) {
        global.Module.MainPlayerData.setguideID(idx);
        let desc = global.Manager.DBManager.findData('NoveGuide', 'ID', idx);
        this.guide = desc
        if (desc) {
            this.lblDec.string = desc.talk;
            this.ndSpeek.active = true;
            this.nodeContent.active = false;
            this.ndTemplate.active = false;
            this.ndTemplate1.active = false;
            this.ndTemplate2.active = false;
            this.spImg.active = false;;
            this.jlsitem.active = false;
            let data = global.Manager.DBManager.findData('NoveGuide', 'ID', this.curIdx-1);
            this.btnPre.active = (data&&data.guidend==0);
            this.ndSpeek.active = desc.talk.length > 0
            this.nodeContent.active = false;
            let guideContent = desc;
    
            if (guideContent.ID == 8002) {
                this.nodeContent.active = true;
                this.ndTemplate.active = true;
                this.ndTemplate1.active = true;
                this.ndTemplate2.active = true;
                this.ndTemplate.y = 20;
                this.ndTemplate1.y = 20;
                this.ndTemplate2.y = 20;
                let itemClass = this.ndTemplate.getComponent(global.CommonClass.ItemIcon);
                itemClass.setItem(260030001, 1);
                let itemClass1 = this.ndTemplate1.getComponent(global.CommonClass.ItemIcon);
                itemClass1.setItem(500134, 1);
                let itemClass2 = this.ndTemplate2.getComponent(global.CommonClass.ItemIcon);
                itemClass2.setItem(170060001, 1);
                this.jlsitem.active = false;
            }
            else if (guideContent.ID == 8003) {
                this.nodeContent.active = true;
                this.spImg.active = true;
                this.spImg.scale = 0.45;
                this.jlsitem.active = true;
                global.CommonClass.Functions.setTexture(this.spImg, 'images/ui/guide/1',null);
            }
            else if (guideContent.ID == 8004) {
                this.nodeContent.active = true;
                this.spImg.active = true;
                this.spImg.scale = 0.45;
                this.jlsitem.active = true;
                global.CommonClass.Functions.setTexture(this.spImg, 'images/ui/guide/2',null);
            }else if (guideContent.ID == 8005) {
                this.nodeContent.active = true;
                this.spImg.active = true;
                this.spImg.scale = 0.45;
                this.jlsitem.active = true;
                global.CommonClass.Functions.setTexture(this.spImg, 'images/ui/guide/3',null);
            }else if (guideContent.ID == 8006) {
                this.nodeContent.active = true;
                this.spImg.active = true;
                this.spImg.scale = 0.45;
                this.jlsitem.active = true;
                global.CommonClass.Functions.setTexture(this.spImg, 'images/ui/guide/4',null);
            }
            
            this.scheduleOnce(function () {
                if (guideContent.ID == 8007 || guideContent.ID == 8008) {
                    let newNode = cc.instantiate(this.nodeNode);
                    this.ShowUI.addChild(newNode);
                    this.fitPos(newNode);
                    this.moveclick(newNode);
                    let factoryClass = newNode.getComponent(global.CommonClass.FactoryBase);
                    factoryClass.setUnselect();
                    newNode && newNode.on(cc.Node.EventType.TOUCH_START, function (params) {//打开任务
                        let data = {};
                        global.Instance.MsgPools.send('taskList', data, function (msg) {
                            global.Module.TaskData.uiFirstTalkShow = true;
                            this.btnClose();
                            global.Manager.UIManager.open('UITask', null, function (panel) {
                            }.bind(this));
                        }.bind(this));
                    }.bind(this))
                    return;
                }
                if (guideContent.ID > 8008 && (guideContent.guidend == 1 || guideContent.guidend == 2 || guideContent.guidend == 3) && this.nodeNode && guideContent.ID != 8020) {
                    let newNode = cc.instantiate(this.nodeNode);
                    this.ShowUI.addChild(newNode);
                    var position = global.Manager.UIManager.coortrans(this.nodeNode, this.ShowUI);
                    newNode.setPosition(position);
                    newNode._components = this.nodeNode._components;
                    if (guideContent.ID == 8009) {
                        this.moveclick(newNode.getChildByName("btnAccept"));
                    } else {
                        this.moveclick(newNode);
                    }
                }
            }, 0.2);
            
        } else {
            this.btnClose();
        }
    };
    movePosition() {
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('MainMap');
        let startX = dragLayer.getDragItemPosition().x;
        let startY = dragLayer.getDragItemPosition().y;
        let endX = -100;
        let endY = -288;
        let dtX = endX - startX;
        let dtY = endY - startY;
        dragLayer.lockMove(true);
        this.btnClose();
        dragLayer.delayMove(dtX, dtY, 0.5, function () {
            cc.systemEvent.emit('10001');
            dragLayer.lockMove(false);
        }.bind(this));
    };
    fitPos(newNode) {
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('MainMap');
        var getScale = dragLayer.getItemScale();
        newNode.scaleX = getScale;
        newNode.scaleY = getScale;
        let mainMap = global.Instance.Dynamics['MainMap'];
        if (mainMap != null) {
            let factory = mainMap.getFactoryByName('Task');
            global.CommonClass.Functions.setNodePosToTarget(newNode, factory.node,null);
        }
    };
    fitPosload(newNode) {
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('MainMap');
        var getScale = dragLayer.getItemScale();
        newNode.scaleX = getScale;
        newNode.scaleY = getScale;
        let mainMap = global.Instance.Dynamics['MainMap'];
        if (mainMap != null)
        global.CommonClass.Functions.setNodePosToTarget(newNode, global.Manager.UIManager.getChild(cc.find("Canvas"), this.guide.guideName),null);
    };
    moveclick(newNode) {
        this.moveTo.active = true;
        this.moveTo.zIndex = 999;
        var width = newNode.width;
        var height = newNode.height+20;
        if (width < 100)
            width = width * 3
        if (height < 100)
            height = height * 2
        if (width < this.node.width / 2 && newNode.y > -150) {
            if (newNode.x >= 0) {
                this.moveTo.angle = 0;
                this.moveTo.y = newNode.y;
                this.moveTo.x = newNode.x - width;
            } else {
                this.moveTo.x = newNode.x + width;
                this.moveTo.y = newNode.y;
                this.moveTo.angle = 180;
            }
        } else {
            if (newNode.y >= 0) {
                this.moveTo.angle = 0;
                this.moveTo.y = newNode.y - height;
                this.moveTo.x = newNode.x;
                this.moveTo.angle = 90;
            } else {
                this.moveTo.x = newNode.x;
                this.moveTo.y = newNode.y + height;
                this.moveTo.angle = -90;
            }
        }
    };
    show(key, node) {
        if (key && key > -1)
            this.curIdx = key;
        if (node)
            this.nodeNode = node
            // if (this.curIdx == 8016) {
            //     this.movePosition();
            // }else{
                this.showPage(this.curIdx);
            // }
           
        
    };
    btnPage(event, arg) {
        let flag = parseInt(arg);
        if (flag == 1) {
            if (this.guide.guidend == 2)
                return;
            if (this.guide.guidend == 3) {
                if (this.guide.ID == 8010) {
                    cc.systemEvent.emit('8010');
                }
                this.btnClose();
                return;
            }
        } else {
            let desc = global.Manager.DBManager.findData('NoveGuide', 'ID', this.curIdx + flag);
            if (desc == null)
                return;
            if (desc.guidend == 2 && desc.guidend == 2)
                return;
        }
        this.curIdx += flag;
        this.showPage(this.curIdx);
    };
    btnClose() {
        if (this.guide && this.guide.ID == 8011) {
            let panel = global.Manager.UIManager.get('UIGuJi');
            if (panel != null)
                panel.reflashHelp();
        }
      
        global.Manager.UIManager.close('UIFirstTalk');
    };
    btnLookBack() {
        this.curIdx--;
        if (this.curIdx <= 0)
            this.curIdx = 0;

        this.showPage(this.curIdx);
    };
}

