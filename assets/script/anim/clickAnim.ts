
const { ccclass, property } = cc._decorator;

@ccclass
export default class clickAnim extends cc.Component {
    _clickPool: any;
    @property({ type: cc.Node, displayName: "spine", tooltip: "克隆节点" })
    spine: cc.Node = null;
    @property({ type: cc.Node, displayName: "makeChilren", tooltip: "点击动画放置节点" })
    makeChilren: cc.Node = null;
    @property({ type: cc.Node, displayName: "tipNode", tooltip: "提示放置节点" })
    tipNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "tipNode1", tooltip: "任务完成提示" })
    tipNode1: cc.Node = null;
    @property({ type: cc.Label, displayName: "tipLabel", tooltip: "任务完成提示" })
    tipLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: "btnEntry", tooltip: "一键打开任务屋" })
    btnEntry: cc.Node = null;
    @property({ type: cc.Node, displayName: "seneNode", tooltip: "按钮层级" })
    seneNode: cc.Node = null;
    
    touchStart: any;
    isMoved: boolean;
    pos: cc.Vec2;
    
    
    constructor() {
        super();
    };
    private _eventManager = cc["internal"]["eventManager"];
    private _touchListener: any;
    private InitTouch() {
        const EventListener = cc["EventListener"];
        this._touchListener = EventListener.create({
            event: EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,//是否吞噬touch事件
            owner: this.node,
            mask: null,
            onTouchBegan: this._onTouchBegin.bind(this),
            onTouchMoved: null,
            onTouchEnded: this._onTouchBegin.bind(this),
            onTouchCancelled: null,
        });
        this._eventManager.addListener(this._touchListener, this.node);
    }

    onLoad() {
        cc.game.addPersistRootNode(this.node);
        global.Manager.UIManager.addResident('clickAnim', this);
        this.InitTouch();
        this.btnEntry.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.btnEntry.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.btnEntry.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.btnEntry.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.btnEntry.active = false;
    }
    showReflash(isShow){
        let UISocketLock = this.node.getChildByName('UISocketLock');
        UISocketLock.active = isShow;
    };
    reflashEntry(isShow){
       
        let data = global.Module.TaskData.getHasAcceptTaskData();
        this.btnEntry.active = false;
        let lighteffect = this.btnEntry.getChildByName("lighteffect");
        let donebg = this.btnEntry.getChildByName("donebg");
        let Label = donebg.getChildByName('Label').getComponent(cc.Label)
        let spItem = this.btnEntry.getChildByName("spItem");
        let help = this.btnEntry.getChildByName("help");
        lighteffect.active = false;
        help.active = false;
        if (isShow == false || data == null)
            return;
        if (data.state == 1) 
            Label.string = '进行中';
        this.btnEntry.active = (data.state == 1 || data.state == 2);
        if (data.state == 1 || data.state == 2) {
            var cfgData = global.Manager.DBManager.findData('Tasks', 'ID', data.taskId);
            if (cfgData) {
                var url = "images/pictrue/taskicon/" + cfgData.taskIcon;
               
                if (spItem)
                global.CommonClass.Functions.setTextureNew(spItem, url, null);
                    // cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
                    //     if (err == null) {
                    //         if (spItem != null) {
                    //             let spComponent = spItem.getComponent(cc.Sprite);
                    //             if (spComponent) {
                    //                 spComponent.spriteFrame = spriteFrame;
                    //             }
                    //         }
                    //     } else {
                    //         global.Instance.Log.debug("setTexture error", err);
                    //     }
                    // });
            }
        }
        if(data.state == 2){
            Label.string = '已完成';
            lighteffect.active = true;
            help.active = (data.taskId == 10000 || data.taskId == 10001 || data.taskId == 10002);
        }
       
    }
    reflashHelpEntry(isShow) {
        let help = this.node.getChildByName('seneNode').getChildByName("help")
        if (help) {
            help.active = false;
            let name = global.CommonClass.Functions.getSceneName();
            if (name == 'MainScene')
                return;
            help.active = isShow;
        }
    };
    onEntryClick(){
        let data = {};
        let taskData = global.Module.TaskData.getHasAcceptTaskData();
        if (taskData.state == 2) {
            let self = this;
            global.Instance.MsgPools.send('taskList', data, function (msg) {
                let name = global.CommonClass.Functions.getSceneName();
                if (name == 'MainScene'){
                    global.Manager.UIManager.clearRemove();
                    global.Manager.UIManager.open('UITask', null, function (panel) {
                        global.Manager.UIManager.open('UITaskDetail', null, function (panel) {
                            if (panel) {
                                panel.show(taskData);
                                panel.showType();

                            }
                        }.bind(this));
                    });
                }else{
                    global.CommonClass.Functions.loadScene('MainScene', function (scene) {
                        self.scheduleOnce(function () {
    
                            global.Manager.UIManager.open('UITask', null, function (panel) {
                                global.Manager.UIManager.open('UITaskDetail', null, function (panel) {
                                    if (panel) {
                                        panel.show(taskData);
                                        panel.showType();
    
                                    }
                                }.bind(this));
                            });
    
    
                        }, 0.5);
                    });
                }
               
            });
        } else {
            global.Manager.UIManager.open('UITaskDetail', null, function (panel) {
                if (panel) {
                    panel.show(taskData);
                    panel.showType();

                }
            }.bind(this));
        }
    };
    getTipNode(){
        return this.tipNode;
    }
    popTip() {
        for (let i = 0; i < this.tipNode.children.length; i++) {
            let item = this.tipNode.children[i].getComponent('UITip');
            item.tipClose(item.itemClass); 
        }
       
    };
    start() {
        this._initNodeTouchEvent();
        this.pos = this.btnEntry.getPosition();
    }
    reflashPosEntry(){
        this.btnEntry.setPosition(this.pos);
    }
    _initNodeTouchEvent() {
        //监听事件
        // this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
    };

    _destroyTouchEvent() {
        //销毁事件
        // this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegin, this);
    };
    reflash(txt) {
       
        this.tipLabel.string = txt;
        this.tipNode1.active = false;
        let self = this;
        cc.tween(this.tipNode1).stop();
        cc.tween(this.tipNode1)
            .call(() => {
                self.tipNode1.active = true;
            })
            .to(0, { opacity: 255 })
            .delay(2)
            .to(0.16, { opacity: 0 })
            .call(() => {
                self.tipNode1.active = false;
            })
            .start()
    };
    _onTouchBegin(event) {
        // event.preventSwallow = true;
        //获取当前点击的全局坐标
        let temp = event.getLocation();
        //获取当前点击的局部坐标
        let tempClick = this.node.convertToNodeSpaceAR(temp);

        this.newClickNode(tempClick, function (node) {
            if (!node) return
            node.active = true;
            let skeleton = node.getComponent(sp.Skeleton);
            node.scale = 0.3;
            skeleton.loop = false;
            skeleton.paused = false;
            skeleton.animation = 'dianji';
            skeleton.setCompleteListener((element, loopCount) => {
                if (element.name === 'clickNode') {

                    element.active = false
                    this._clickPool.put(element);
                }
            });
        }.bind(this));
    };
    //使用对象池动态实例化预制资源
    newClickNode(position, callBack) {
        let newNode = null;
        if (!this._clickPool) {

            //初始化对象池
            this._clickPool = new cc.NodePool();
        }
        if (this._clickPool.size() > 0) {

            //从对象池请求对象
            newNode = this._clickPool.get();
            this.setClickNode(newNode, position, callBack);
        } else {
            newNode = cc.instantiate(this.spine);
            this.setClickNode(newNode, position, callBack);
        }

    };

    setClickNode(newNode, position, callBack) {
        newNode.name = "clickNode"; //设置节点名称
        newNode.setPosition(position); //设置节点位置
        this.makeChilren.addChild(newNode); //将新的节点添加到当前组件所有节点上
        if (callBack) {
            callBack(newNode); //回调节点
        }

    };
    touchEvent(event) {
        let point = this.seneNode.convertToNodeSpaceAR(event.getLocation());

        // let point = event.getLocation();
        if (event.type == cc.Node.EventType.TOUCH_START) {
            this.touchStart = point;
            this.isMoved = false;
        } else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            let distance = point.sub(this.touchStart).mag();
            if (distance > 5)
                this.isMoved = true;
            if (this.isMoved == true)
                this.btnEntry.setPosition(point);
        } else if (event.type == cc.Node.EventType.TOUCH_CANCEL || event.type == cc.Node.EventType.TOUCH_END) {
            //触摸结束
            if(this.isMoved == false)
                this.onEntryClick();
           this.isMoved = false;
        }

    };
    onDestroy() {
        this.btnEntry.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);//开始
        this.btnEntry.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);//移动
        this.btnEntry.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);//内部结束
        this.btnEntry.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);//外部结束
        //销毁事件
        this._destroyTouchEvent();
    };
    onDisable() {
      
    };
    // update (dt) {}
}
