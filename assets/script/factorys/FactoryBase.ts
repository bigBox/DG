
let Man = window["Man"];
const { ccclass, property } = cc._decorator;

@ccclass
export default class FactoryBase extends cc.Component {
    factoryID: number;
    btnMove: any;
    spFactory: any;
    state: number;
    clickStartPos: any;
    scaleX: number;
    scaleY: number;
    isShow: boolean;

    @property({ displayName: "xPickRate", tooltip: "xPickRate" })
    xPickRate: number;
    @property({ displayName: "yPickRate", tooltip: "yPickRate" })
    yPickRate: number;
    @property({ displayName: "canMove", tooltip: "canMove" })
    canMove: boolean;
    @property({ displayName: "canPick", tooltip: "canPick" })
    canPick: boolean;
    static factoryID: any;
    static isPicked: any;
    isMoveMap: boolean;

    startClickTime=0;

    constructor() {
        super();
        this.factoryID = 0;
        this.btnMove = null;
        this.spFactory = null;
        this.state = 0;        //0.无状态 1.显示移动 2.选中状态
        this.clickStartPos = null;//手指刚按下的坐标
        this.isMoveMap = false;//是否移动
        this.scaleX = 1;
        this.scaleY = 1;
        this.xPickRate = 1;
        this.yPickRate = 1;

        this.canMove = true;
        this.canPick = true;
    };



    // use this for initialization
    onLoad() {

        this.btnMove = this.node.getChildByName('btnMove');
        this.spFactory = this.node.getChildByName('spFactory');
        if (this.spFactory) {
            this.scaleX = this.spFactory.scaleX;
            this.scaleY = this.spFactory.scaleY;
        }


        if (this.btnMove != null)
            this.btnMove.active = false;

        let spPick = this.node.getChildByName('spPick');
        if (spPick != null)
            spPick.active = false;

        let ndExPick = this.node.getChildByName('ndExPick');
        if (ndExPick)
            ndExPick.active = false;

        let ndCross = this.node.getChildByName('ndCross');
        if (ndCross != null) {
            ndCross.active = false;
        }
        let ndHelp = this.node.getChildByName('helpNode');
        if (ndHelp != null) {
            ndHelp.active = false;
        }
        cc.systemEvent.on('10001', this.setData, this);

        var data = global.Module.TaskData.getHasAcceptTaskData();
        let scene = cc.director.getScene();
        if (data && data.taskId == 10009 && data.state == 1 && scene.name == 'PlayerScene') {
            this.setmyData();
        } else {
            this.setData();
        }
        cc.systemEvent.on('applies', this.setApplies, this);
        this.setApplies();
    };
    setApplies(){
        let apply = this.node.getChildByName('apply');
        if(apply){
            let applies = global.Module.FriendData.getAppliesData();
            apply.active = !(applies.length == 0)
        }
      
    };
    setmyData() {
        let ndHelp = this.node.getChildByName('helpNode');
        if (!ndHelp)
            return;
        if (this.node.name == 'Identify'){
            ndHelp.active = true;
            this.node.zIndex = 999;
        } else{
            ndHelp.active = false;
            this.node.zIndex = 1;
        }
           

    };
    setData() {
        let scene = cc.director.getScene();
        if (scene.name == 'PlayerScene') {
            let ndHelp = this.node.getChildByName('helpNode');
            if (ndHelp)
                ndHelp.active = false;
            return;
        }

        let ndHelp = this.node.getChildByName('helpNode');
        let taskdata = global.Module.TaskData.getHasAcceptTaskData();
        let task = null;
        if (taskdata)
            task = global.Manager.DBManager.findData('Tasks', 'ID', taskdata.taskId);
        if (task && task.FactoryID != taskdata.taskId) {
            if (this.node.tagEx == task.FactoryID) {
                let mailArr = global.Module.SummonData.getinvestmentMail();
                if (taskdata && taskdata.state == 1) {
                    if (ndHelp != null){
                        let isShow = (taskdata.actionType != 7 || (taskdata.actionType == 7 && mailArr.length == 0))
                        ndHelp.active = isShow;
                        if (isShow == true)
                            this.node.zIndex = 999;
                        else
                            this.node.zIndex = 1;
                    }
                       
                } else {
                    if (ndHelp != null) {
                        ndHelp.active = false;
                        this.node.zIndex = 1;
                    }
                        
                    
                }
            }
        }
    };

    onDisable() {
        cc.systemEvent.off('10001', this.setData, this);
        cc.systemEvent.off('applies', this.setApplies, this);
    };
    onDestroy() {
       
    };
    setID(factoryID) {
        this.factoryID = factoryID;
    };
    getID() {
        return this.factoryID;
    };

    showName(isShow) {
        let lblName = this.node.getChildByName('lblName');
        if (lblName != null)
            lblName.active = isShow;
    };

    setGray(bGray) {
        let spFactory = this.node.getChildByName('spFactory').getComponent(cc.Sprite);
        if (spFactory)
            global.CommonClass.Functions.grayTexture(spFactory, bGray);

        let lblName = this.node.getChildByName('lblName');
        if (bGray)
            lblName.color = cc.color(144, 144, 144, 255);
        else
            lblName.color = cc.color(255, 255, 255, 255);
    };

    runGuideAction(isRun) {
        let spFactory = this.node.getChildByName('spFactory');
        if (isRun) {
            let fadeIn = cc.fadeIn(1);
            let fadeOut = cc.fadeOut(1);
            let seq = cc.sequence(fadeIn, fadeOut);
            let action = cc.repeatForever(seq);

            spFactory.runAction(action);
        }
        else {
            spFactory.stopAllActions();
            spFactory.opacity = 255;
        }
    };

    createHelp() {
        this.showName(true);
    };

    removeHelp() {
        this.showName(false);
    };
    getIsShow() {
        return this.isShow;
    };
    /**
     * 设置拖动颜色
     * @param {*}  isShow  是否可以拖动
     */
    showCross(isShow: boolean) {
        this.isShow = isShow;
        let ndCross = this.node.getChildByName('ndCross');
        ndCross.active = true;
        let ndCross1 = ndCross.getChildByName('ndCross');
        if (isShow) {
            ndCross.color = cc.color(255, 0, 0, 255);//红
            if (ndCross1)
                ndCross1.color = cc.color(255, 0, 0, 255);//红
        }
        else {
            ndCross.color = cc.color(0, 255, 0, 255);//绿
            if (ndCross1)
                ndCross1.color = cc.color(0, 255, 0, 255);//绿
        }

        if (isShow)
            this.spFactory = cc.color(255, 0, 0, 255);//红
        else
            this.spFactory = cc.color(255, 255, 255, 255);//白
    };
    //点击选取
    isPicked(touchPoint) {
        if (!this.canPick)
            return false;

        if (this.xPickRate == 0 || this.yPickRate == 0) {
            let boundingBox = this.node.getBoundingBoxToWorld();
            return boundingBox.contains(touchPoint);
        }
        else {
            let spPick = this.node.getChildByName('spPick');
            let ndExPick = this.node.getChildByName('ndExPick');

            if (ndExPick == null && spPick == null) {
                let boundingBox = this.node.getBoundingBoxToWorld();
                return boundingBox.contains(touchPoint);
            }
            else {
                if (spPick != null) {
                    if (global.CommonClass.Geometry.checkSlantingSpIsInPoint(touchPoint, spPick, this.xPickRate, this.yPickRate)) {
                        return true;
                    }
                }

                if (ndExPick != null) {
                    let ndExPicks = ndExPick.children;
                    for (let key in ndExPicks) {
                        let ndPick = ndExPicks[key];
                        let boundingBox = ndPick.getBoundingBoxToWorld();
                        if (boundingBox.contains(touchPoint))
                            return true;
                    }
                }
            }
        }
    };

    getFactoryWorldBox() {
        return this.node.getChildByName('spFactory').getBoundingBoxToWorld();
    };
    //拖动碰撞
    isCross(ndFactory) {
        if (ndFactory != null) {
            let factory = ndFactory.getComponent(FactoryBase);
            //本身碰撞节点
            let curspPick = this.node.getChildByName('spPick');//主要碰撞点
            let curspPick1 = curspPick.getChildByName('spPick');//次要碰撞点
            //拖动的碰撞节点
            let spPick = ndFactory.getChildByName('spPick');//主要碰撞点
            let spPick1 = spPick.getChildByName('spPick');//次要碰撞点
            let isCross1 = false;
            let isCross2 = false;
            let isCross3 = false;
            let isCross4 = false;
            let isCross = false;//结果

            isCross1 = global.CommonClass.Geometry.checkSlantingSpIsCross(spPick, factory.xPickRate, factory.yPickRate, curspPick, this.xPickRate, this.yPickRate);//主要碰撞点
            if (curspPick1) {
                isCross2 = global.CommonClass.Geometry.checkSlantingSpIsCross(spPick, factory.xPickRate, factory.yPickRate, curspPick1, this.xPickRate, this.yPickRate);
                if (spPick1)
                    isCross3 = global.CommonClass.Geometry.checkSlantingSpIsCross(spPick1, factory.xPickRate, factory.yPickRate, curspPick1, this.xPickRate, this.yPickRate);
            }
            if (spPick1)
                isCross4 = global.CommonClass.Geometry.checkSlantingSpIsCross(spPick1, factory.xPickRate, factory.yPickRate, curspPick, this.xPickRate, this.yPickRate);
            if (isCross1 == false && isCross2 == false && isCross3 == false && isCross4 == false) {
                isCross = false;
            } else {
                isCross = true;
            }
            // global.Instance.Log.debug('是否相交false没有相交', isCross)
            return isCross;
        }

        return false;
    };
    getItemState() {
        return this.state;
    };
    //隐藏建筑底板
    setUnselect() {

        this.state = 0;

        let ndCross = this.node.getChildByName('ndCross');
        ndCross.active = false;
        ndCross.stopAllActions();

        this.node.stopAllActions();

    };

    runFadeAction() {
        let fadeIn = cc.fadeIn(0.4);
        let fadeOut = cc.fadeOut(0.4);
        let seq = cc.sequence(fadeIn, fadeOut);
        let action = cc.repeatForever(seq);

        let ndCross = this.node.getChildByName('ndCross');
        ndCross.active = true;
        ndCross.runAction(action);
    };

    runSelectAction() {
        let self = this;
        let onDelayEnd = function () {
            self.state = 2;
            self.node.stopAllActions();
            self.runFadeAction();

            let evt = new cc.Event.EventCustom('onFactorySelect', true);
            evt.setUserData(self.node);
            self.node.dispatchEvent(evt);
        }

        this.node.stopAllActions();
        let endFun = cc.callFunc(onDelayEnd);
        this.node.runAction(endFun);
    };

    playScaleAction() {
        let spFactory = this.node.getChildByName('spFactory');
        spFactory.stopAllActions();
        spFactory.scaleY = this.scaleY;
        spFactory.scaleX = this.scaleX;

        let scaleX = this.scaleX;
        let scaleY = this.scaleY;
        let targetX = scaleX;
        let targetY = scaleY;
        if (targetX < 0)
            targetX -= 0.2;
        else
            targetX += 0.2;
        if (targetY < 0)
            targetY -= 0.2;
        else
            targetY += 0.2;

        let scaleTo = cc.scaleTo(0.2, targetX, targetY);
        let scaleBack = cc.scaleTo(0.2, scaleX, scaleY);
        let seq = cc.sequence(scaleTo, scaleBack);
        spFactory.runAction(seq);
    };
    onMouseEvent(event) {
        let self = this;

        if (event.type == cc.Node.EventType.TOUCH_START) {
            let touchPoint = event.getLocation();
            this.clickStartPos = touchPoint;
            this.isMoveMap = false;
            this.startClickTime=new Date().getTime();
            if (this.state == 0 && this.canMove) {
                let funMoveFade = function () {
                    if(self.isMoveMap == false){
                        let dragLayer = global.CommonClass.DragLayer.getDragLayer('MainMap');
                        if (dragLayer != null) {
                            if (!dragLayer.getScaleiShow()) {
                                self.state = 1;
                                self.runSelectAction();
                            }
                        }
                    }
                }
                this.node.stopAllActions();
                let delay = cc.delayTime(0.6);
                let endFun = cc.callFunc(funMoveFade);
                let seq = cc.sequence(delay, endFun);
                this.node.runAction(seq);
            }
            this.playScaleAction();
            let helpNode = this.node.getChildByName('helpNode')
            if (helpNode)
                helpNode.active = false;
        }
        else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            let touchPoint = event.getLocation();
            if (this.clickStartPos != null) {
                let distance = touchPoint.sub(this.clickStartPos).mag();
                if (distance > 20) {
                    this.isMoveMap = true;
                    if (this.state == 0) {//0.无状态 1.显示移动 2.选中状态
                        this.node.stopAllActions();
                    }
                }
            }
        }
        else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
            this.node.stopAllActions();
            if (this.state == 1)
                this.state = 0;

            this.clickStartPos = null;
        }
    };

    onClick(touchPoint) {

    };

    onReflash(event) {
        let evt = new cc.Event.EventCustom('onRotateX', true);
        evt.setUserData(this.node);
        this.node.dispatchEvent(evt);
    };

}

