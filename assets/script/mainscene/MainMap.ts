

const { ccclass, property } = cc._decorator;

@ccclass
export default class MainMap extends cc.Component {

    static EditorMode: {
        NONE: 0,
        MOVE_FACTORY: 1,
    };
    @property({ type: cc.Node, displayName: "引导", tooltip: "引导提示" })
    helpNode: any = [];
    @property({ type: cc.Node, displayName: "sackNode", tooltip: "捡漏" })
    sackNode: any = [];
    
    curSelFactory: any;//拖动建筑
    curPickFactory: any;//打开建筑
    ndFactorys: any;//放置建筑的节点
    startPosition: any;//按下建筑初始坐标
    isMoveState: boolean;//建筑是否可以拖动
    isMouseMoved: boolean;//手指移动超过一定像素进入移动状态
    curSelObstacle: any; //选中的扩地节点
    ndObstacles: any;  //地图上的扩地节点
    ndOut: any;//阴影不可放置位置
    clickStartPos: any;//手指按下位置
    isInAutoStart: boolean;//登陆游戏是否是第一次进入
    touchCount: number;//几个手指按下双指用
    beginScale: number; //屏幕比例
    animation: boolean;//开场动画是否播完
    ndBalloon: cc.Node;//热气球动画节点
    curMapScale: number; // 自动缩放比例
    curMapPos: any;//自动移图坐标
    isMovecell: boolean;//是否可以进入自动移图模式
    callback: () => void;//贴边移动时通过该方法确定继续计算位置
    touchPoint: any; //手指拖动的坐标
    point: any;//拖动建筑初始坐标保存最开始移动点

    constructor() {
        super();
        this.curSelFactory = null;
        this.curPickFactory = null;
        this.ndFactorys = null;
        this.startPosition = null;
        this.isMoveState = false;
        this.isMouseMoved = false;

        this.curSelObstacle = null;
        this.ndObstacles = null;
        this.ndOut = null;

        this.clickStartPos = null;
        this.isInAutoStart = false;
        this.touchCount = 0;

        this.beginScale = 0;
        this.animation = true;
        this.isMovecell = true;
    };

    start() {
       
    };

    // use this for initialization
    onLoad() {
        this.ndFactorys = this.node.getChildByName('ndFactorys');
        this.ndObstacles = this.node.getChildByName('ndObstacles');
        this.ndOut = this.node.getChildByName('ndOut');
        this.ndBalloon =  this.node.getChildByName('ndBalloon');
        this.ndBalloon.active = false;

        this.isInAutoStart = false;

        let ndAnimation = this.node.getChildByName('ndAnimation');
        let ndPerson = ndAnimation.getChildByName('ndPerson');
        ndPerson.active = false;
        global.Instance.Dynamics["MainMap"] = this;
        cc.systemEvent.on('10001', this.setData, this);
        this.setData();
        this.centerMap();
        

    };

    onEnable() {
        let self = this;
        this.node.on('onFactorySelect', function (event) {
            global.Instance.Log.debug('onFactorySelect', 'a')
            self.onFactorySelect(event);
        });

        this.node.on('onRotateX', function (event) {
            global.Instance.Log.debug('onRotateX', 'b')
            self.onRotateX(event);
        });
        let panel = global.Manager.UIManager.getPersistUI('UIProgress');
        if (panel != null) {
            panel.setProgress(1, 1);
            panel.setFinishCall(this.onFinishLoading.bind(this));
        }
        
        global.Module.MainMapData.setMap(this);
        let roleID = global.Module.MainPlayerData.getRoleID();
        global.Instance.MsgPools.send('obstaclesList', { roleId: roleID }, function (msg) {
            self.refalashObstacle();
        });
        global.Manager.UIDlgTipManager.clearTips();
        this.scheduleOnce(function () {
            this.loadMapData();
        }, 0.5);
       
    };
    setData() {
        let scene = cc.director.getScene();
        if (scene.name == 'PlayerScene' || !this.node)
            return;
        if (!this.node)
            return;
        let taskdata = global.Module.TaskData.getHasAcceptTaskData();
        this.helpNode[1].active = false;      
        this.helpNode[5].active = false;    
        let task = null;
        if (taskdata)
            task = global.Manager.DBManager.findData('Tasks', 'ID', taskdata.taskId);
        let mailArr = global.Module.SummonData.getinvestmentMail();
        if (task && task.FactoryID == 7031 && taskdata.state == 1) {
            if (taskdata.taskId == 10007) {
                if (mailArr.length != 0) {
                    this.helpNode[5].active = true;    //精灵  
                }
            }
        } else {
            this.helpNode[1].active = false;
        }
        this.helpNode[0].active = (task && task.FactoryID == 7030 && taskdata.state == 1);//采矿
        this.helpNode[2].active = (task && task.FactoryID == 7007 && taskdata.state == 1);//户外
        this.helpNode[3].active = (task && task.ID == 10021 && taskdata.state == 1);//生态园 只有养鱼的时候用
        this.helpNode[4].active = (task && task.ID == 10026 && taskdata.state == 1);//扩地任务

    };
    onDisable() {
        this.node.off('onFactorySelect');
        this.node.off('onRotateX');
        this.node.off('onCenterMap');
        cc.systemEvent.off('Union');
        cc.systemEvent.off('10001', this.setData, this);
        cc.systemEvent.off('dirhelp');
        cc.systemEvent.off('8010');
        global.Instance.Dynamics["MainMap"] = null;
    };
    //打开建筑页面
    onOpenUI(factoryID, touchPoint) {
        let factory = global.Manager.DBManager.findData("Factory", 'ID', factoryID)
        let level = global.Module.MainPlayerData.getLevel();
        //建筑等级限制置灰
        if (!factory.lookUI && factory.levelRequire > level) {    //lookUI 是否需要在未激活时候打开UI
            global.CommonClass.UITip.showTipTxt('功能将在' + factory.levelRequire.toString() + '级开放', global.Enum.TipType.TIP_BAD);
            return false;
        };
        let guideFactoryID = global.Proxys.ProxyFactoryGuide.getCurGuideFactory();
        if (guideFactoryID > 0 && guideFactoryID != factoryID) {
            let guideFactory = global.Manager.DBManager.findData("Factory", 'ID', guideFactoryID)
            global.CommonClass.UITip.showTipTxt('请先点击' + guideFactory.name, global.Enum.TipType.TIP_BAD);
            return false;
        }

        global.Proxys.ProxyFactoryGuide.setCurFactoryID(factoryID);
        global.Instance.Log.debug("-------------------------------", factory.type)
        global.Instance.AudioEngine.playSound('click', null, null, null);
        if (factory.type == 'compose')//合成
        {
            global.Manager.UIManager.open('UICompose', null, null);
        }
        else if (factory.type == 'package')//仓库
        {
            global.Manager.UIManager.open('UIPackage', null, function (panel) {
                panel.show(factoryID);
            });
        }
        else if (factory.type == 'makeGoods')  //制作
        {
            let self = this;
            global.Instance.MsgPools.send('manufactureInfo', {}, function (msg) {
                global.Manager.UIManager.open('UIMakeGoods', null, function (panel) {
                    if (factory.userData == 1)     //炼炉
                        global.Proxys.ProxyGuide.stepNextGuide('OpenMakeIron');
                    else if (factory.userData == 3) //制作上海菜
                        global.Proxys.ProxyGuide.stepNextGuide('OpenMakeMeal');
    
                    let factoryClass = self.getFactoryClassByID(factoryID);
                    panel.show(factoryClass.node);
                });   
            });
            
        }
        else if (factory.type == 'task1') //任务
        {
            this.openTaskUI();
        }
        else if (factory.type == 'mine2') //矿洞
        {
            let ID = global.Module.MainPlayerData.getRoleID();
            let data = { id: ID, password: "", pos: 0 };
            global.Instance.MsgPools.send('enterDigRoom', data, function (msg) {
                if (msg.errorID) {
                    global.Instance.Log.debug('矿洞error', data);
                }
            });
        }
        else if (factory.type == 'guji2') {//精灵
            this.enterGuJi();
        }
        else if (factory.type == 'playground1')//游乐场
        {
            global.Manager.UIManager.open('UICatchGoods', null, null);
        }
        else if (factory.type == 'showRoom') //展厅
        {
            // let ID = global.Module.MainPlayerData.getRoleID();
            // 
            let ID = global.Module.MainPlayerData.getRoleID();
            let data = { roleId: ID, type: 0, page: 1 };
            global.Instance.MsgPools.send('showTable', data, function (msg) {
                global.Instance.MsgPools.send('getshowTableInfo', { roleId: ID, page: 1 }, function (msg) {
                    global.Manager.UIManager.open('UIPreciousRoom', null, null);
                });
            });
           
        }
        else if (factory.type == 'fishRoom')   //鱼室
        {
            let ID = global.Module.MainPlayerData.getRoleID();
            let data = { roleId: ID, type: 1 };
            global.Instance.MsgPools.send('showTable', data, function (msg) {
                global.Manager.UIManager.open('UIFishRoom', null, null);
            });
        }
        else if (factory.type == 'paintRoom')      //字画
        {
            let ID = global.Module.MainPlayerData.getRoleID();
            let data = { roleId: ID, type: 3 };
            global.Instance.MsgPools.send('showTable', data, function (msg) {
            });
        }
        else if (factory.type == 'identify')//鉴定
        {
            if (!global.Proxys.ProxyGuide.getIsFinish('GoGuJiBack')) {
                global.CommonClass.UITip.showTipTxt('请先完成野外引导', global.Enum.TipType.TIP_BAD);
            }
            else {
                global.Instance.MsgPools.send('verifiedQueue', {}, function (msg) {
                    global.Manager.UIManager.open('UIIdentify', null, null);
                });
            }
        }
        else if (factory.type == 'handbook')//图鉴
        {
            global.Instance.MsgPools.send('bookInfo', {}, function (msg) {
                if (msg.errorID != 0)
                    return;
                global.Manager.UIManager.open('UIHandBook02', null, function (panel) {
                    if (panel != null)
                        panel.show(0);
                }.bind(this));
            }.bind(this));
        }
        else if (factory.type == 'farmpark') {
            let ID = global.Module.MainPlayerData.getRoleID();
            global.Instance.MsgPools.send('parkInfo', { roleId: ID }, function (msg) {//生态园数据
                if (msg.errorID == 0) {
                    global.CommonClass.Functions.loadScene("FarmParkScene", null);
                    global.Proxys.ProxyGuide.stepNextGuide('GoFarmPark');
                }
            })
        }
        else if (factory.type == 'shop1') //商店
        {
            let data = { type: 0 };
            global.Instance.MsgPools.send('mallList', data, function (msg) {
                if (msg.errorID == 0)
                    global.Manager.UIManager.open('UIShopNew', null, null);
            });
        }
        else if (factory.type == 'trade') //交易所
        {
            
            let items = global.Manager.DBManager.getData('TradeItems');
            let tradeData = { itemIDs: [] };
            for (let key in items) {
                let value = items[key];
                tradeData.itemIDs.push(value.ID);
            }
            // tradeData.orderIds.push(2);
            global.Instance.MsgPools.send('stockList', tradeData, function (msg) {
                global.Manager.UIManager.open('UITrade', null, function (panel) {
                    if (panel) {
                        panel.show();
                    }
                }.bind(this));
            }.bind(this));
        }
        else if (factory.type == 'worldMapEnter') //大地图
        {
            if (global.Proxys.ProxyGuide.stepNextGuide('GoWorldMapPick')) {

            }
            else {
                global.CommonClass.Functions.loadScene("WorldMapScene",null);
            }
        }
        else if (factory.type == '') {

        }
        else if (factory.type == 'union')          //商会
        {
            let unionClass = this.curPickFactory.getComponent(global.CommonClass.FactoryBase);
            unionClass.onClick(touchPoint);
        }
        else if (factory.type == 'rank')  {     //个人排行榜
        

           
            // let rankType = parseInt(global.Enum.RankType.LEVEL);
            // let data = { type: global.Enum.RankType.COLLECTION };
            // global.Instance.MsgPools.send('rankTop', data, function (msg) {
            global.Manager.UIManager.open('UIRank', null, function (panel) {
                let applies = global.Module.FriendData.getAppliesData();
                if (applies.length == 0)
                    panel.show(global.Enum.RankType.COLLECTION);
                else
                    panel.show(global.Enum.RankType.APPLY);

            });
            // });
        }
        else if (factory.type == 'summon1') {
            global.CommonClass.Functions.loadScene("WorldMapScene", null);
        }
        else if (factory.type == 'collection') {
            let roleId = global.Module.MainPlayerData.getRoleID();
            global.Instance.MsgPools.send('collectionList', { type: 0, roleId:roleId}, function (msg) {
              
                if (msg.errorID != 0) {
                    return;
                }
                global.Manager.UIManager.open('UICollectionNew', null, function (panel) {
                    if (panel)
                        panel.show();
                });
            }.bind(this));
            

        }
        else if (factory.type == 'preciousRank')       //宝物排行榜
        {
            global.Manager.UIManager.open('UIPreciousRank', null, function (panel) { });
        }
        else if (factory.type == 'equip')       //装备
        {
            global.Manager.UIManager.open('UIEquip', null, function (panel) { });
        } else if (factory.type == 'parkrareanimal') {//打开动物园
            global.Manager.UIManager.open('UIAnimalPools', null, null);
        }
    };
    //打开任务界面
    openTaskUI() {
        global.Proxys.ProxyGuide.stepNextGuide('GoGrowTask');
        let data = {};
        global.Instance.MsgPools.send('taskList', data, function (msg) {
            global.Manager.UIManager.open('UITask', null, function (panel) {

            });
        });
    };
    //打开精灵信息
    enterGuJi() {
        let roleId = global.Module.MainPlayerData.getRoleID();
        global.Instance.MsgPools.send('summonInfo', { roleId: roleId }, function (msg) {
            global.Instance.Log.debug('精灵信息接口', msg)
            global.Manager.UIManager.open('UISummon', null, null);
        });
    };
    //启动云动画
    onFinishLoading() {
      
        if (global.Module.MainMapData.getFristLoad()) {//是否是初始化第一次进入
            this.scheduleOnce(function () {
                let clickAnim = global.Manager.UIManager.getResident('clickAnim');
                if (clickAnim)
                    clickAnim.reflashEntry();
            }, 3);
            this.animation = false
            this.isInAutoStart = true;

            let panel = global.Manager.UIManager.get('UIMainScene');
            if (panel != null)
                panel.playCloudAction();

            let delayTime = cc.delayTime(0.8);
            let callback = cc.callFunc(function () {
                this.playBalloonAction(true);
                this.scheduleOnce(function () {
                    this.autoNearMap(true);
                }, 1);
                 
                
            }.bind(this));
            this.node.runAction(cc.sequence(delayTime, callback));

            global.Module.MainMapData.setFristLoad(false);
        }else {
            // let clickAnim = global.Manager.UIManager.getResident('clickAnim');
            // if (clickAnim)
            //     clickAnim.reflashEntry();
            let ndAnimation = this.node.getChildByName('ndAnimation');
            ndAnimation.active = false;
            this.animation = true
            this.reflashFactoryGuides();
            this.dealGuideLogic();
        }
       
        
        global.Module.GameData.openLockSocketOp(true);
    };
    //自动移动地图位置
    updateNearMap(dt) {
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('MainMap');
        let maxScale = 0.8;

        let timeCost = 1;
        let needScale = maxScale - this.beginScale;
        this.curMapScale = this.curMapScale*1.01;
        if (this.curMapScale >= maxScale)
            cc.director.getScheduler().unschedule(this.updateNearMap, this);
        dragLayer.scaleItemLayer(1.01);
    };
    //屏幕缩放比例推进
    autoNearMap(isPlay) {
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('MainMap');
        this.curMapScale = dragLayer.getMinScale();
        this.curMapPos = dragLayer.getDragItemPosition();
        this.beginScale = this.curMapScale;
        if (isPlay){
            cc.director.getScheduler().schedule(this.updateNearMap, this, 0.01, cc.macro.REPEAT_FOREVER, 0, false);
        }else{
            cc.director.getScheduler().unschedule(this.updateNearMap, this);
        }  
    };
   //自动更新地图距离
    updateFarMap(dt) {
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('MainMap');
        let minScale = 0.355;

        let timeCost = 2;
        let needScale = this.beginScale - minScale;
        let addScale = dt / timeCost * needScale;
        if (this.curMapScale <= minScale) {
            this.curMapPos = dragLayer.getDragItemPosition();
            cc.director.getScheduler().unschedule(this.updateFarMap, this);
          
        }
        else {
            this.curMapScale -= addScale;
            dragLayer.setLayerScale(this.curMapScale);
        }
    };

    autoFarMap(isPlay) {
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('MainMap');
        this.curMapScale = dragLayer.getItemScale();
        this.curMapPos = dragLayer.getDragItemPosition();

        this.beginScale = this.curMapScale;
        if (isPlay) {
            this.movePosition(-100,-288);
            cc.director.getScheduler().schedule(this.updateFarMap, this, 0.01, cc.macro.REPEAT_FOREVER, 0, false);
        } else
            cc.director.getScheduler().unschedule(this.updateFarMap, this);
    };
    //移动到指定坐标地图
    centerToFactoryByTableID(templateID) {
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('MainMap');
        let factory = global.Manager.DBManager.findData('Factory', 'ID', templateID);
        if (factory) {
            let itemClass = this.getFactoryClassByID(templateID);
            if (itemClass) {
                let itemNode = itemClass.node
                let scale = dragLayer.getItemScale();
                let position = cc.v2(itemNode.x * scale, itemNode.y * scale);
                dragLayer.setDragItemPosition(position);
            } else {
                this.movePosition(0, 500);
            }
        }else{
            if(templateID == '10027'){
                this.movePosition(0, 1000);
            }
        }
        
        // getFactoryClassByID
        if (factory != null) {
           
        }
    };
    //是否可以移动地图
    lockMove(isLock) {
        let dragLayer = this.node.parent.parent.getComponent('DragLayer');
        dragLayer.lockMove(isLock);
    };
    //遍历大厅建筑
    loadMapData() {
        let factorys = global.Module.MainMapData.getFactorys();
        let factoryNum = 0;
        let self = this;
        if (factorys != null) {
            this.ndFactorys.removeAllChildren();
            let loadCount = 0;
            for (let key in factorys) {
                if (key != null) {
                    let item = factorys[key];
                    let loadCallBack = function (ID) {
                        ++loadCount;
                        if (loadCount >= factoryNum)
                            self.onLoadFactoryFinish();
                    }

                    if (this.createFactory(item, loadCallBack))
                        ++factoryNum;
                }
            }
        }
    };
    //地图移动到指定位置大小
    centerMap() {
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('MainMap');
        dragLayer.setDragItemPosition(cc.v2(0, 960));
        dragLayer.scaleItemLayer(0.35);
    };
    //新手引导
    dealGuideLogic() {
        let guideID = global.Module.MainPlayerData.getguideID();
        if (guideID == 8001) {
            let Farmdata = global.Module.TaskData.gettaskphase(10000);
            if(Farmdata&&Farmdata.state != 0){
                global.Instance.MsgPools.send('updateGuide', { guideId: 8020, state: 1 }, function (data: any) {
                    global.Module.MainPlayerData.setguideID(8020);
                });
            }else{
                let NoveGuide = global.Manager.DBManager.findData('NoveGuide', 'ID', 8001);
                global.Manager.UIManager.open('UIFirstTalk', null, function (panel) { 
                    panel.show(8001, global.Manager.UIManager.getChild(cc.find("Canvas"), NoveGuide.guideName));
                });
            }
               
           
           
        }
    };
    //便利大厅结束后关闭云动画关闭进度条
    onLoadFactoryFinish() {
        global.Proxys.ProxyNewFactory.setFactoryData();

        this.reflashDemonMail();

        this.reflashHoneycomb();

        global.Instance.MsgPools.send('manufactureInfo', {}, null);

    };
    //加载气球动画
    playBalloonAction(isPlay): void {
        this.ndBalloon.active = isPlay;
        if (isPlay == false)
            return;

        let self = this;
        let delay = cc.delayTime(3);
        let onDelayEnd = function () {
            self.playHouseAction(true);
            self.autoNearMap(false);
            self.autoFarMap(true);
        }
        let endFun = cc.callFunc(onDelayEnd);
        let seq = cc.sequence(delay, endFun);
        this.node.stopAllActions();
        this.node.runAction(seq);
        let ndAnimation = this.node.getChildByName('ndAnimation');
        let ndPerson = ndAnimation.getChildByName('ndPerson');
        let position = ndPerson.getPosition();
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('MainMap');
        if (dragLayer){
            let worldPos = ndPerson.convertToWorldSpaceAR(cc.v2(0, 0));
            dragLayer.getPostion(worldPos);
        }
           

        let flyOutEnd = function () {
            self.ndBalloon.active = false;
        };
        {
            let ndBalloon = self.ndBalloon.getChildByName('ndBalloonIn1');
            ndBalloon.active = true;
            ndBalloon.setPosition(position);
            let skeletonIn = ndBalloon.getComponent(sp.Skeleton);
            skeletonIn.loop = false;
            skeletonIn.paused = false;
            skeletonIn.animation = "reqiqiu";
            skeletonIn.setCompleteListener(flyOutEnd);
        }
    };
    //气球落下后让人物地图是否显示
    playHouseAction(isPlay): void {
        let ndAnimation = this.node.getChildByName('ndAnimation');
        let ndPerson = ndAnimation.getChildByName('ndPerson');
        ndPerson.active = false;
        if (isPlay)
            cc.tween(ndPerson)
                .call(function () {
                    ndPerson.active = isPlay;
                }.bind(this))
                .delay(2)
                .call(function () {
                    this.isInAutoStart = false;
                }.bind(this))
                .to(2, { opacity: 0 })
                .call(function () {
                    ndPerson.active = false;
                    ndPerson.opacity = 255;
                }.bind(this))
                .start()
    };
    //移动结束打开引导
    stopAutoMoveMap(): void {
        global.Instance.Log.debug('------------------stopAutoMoveMap', this.isInAutoStart)
        if (this.isInAutoStart) {
            this.playBalloonAction(false);
            this.dealGuideLogic();
            this.isInAutoStart = false;
        }
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('MainMap');
        dragLayer.lockMove(false);
    };
    //设置移动地图位置
    movePosition(endX,endY): void {
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('MainMap');
        let startX = dragLayer.getDragItemPosition().x;
        let startY = dragLayer.getDragItemPosition().y;
        let dtX = endX - startX;
        let dtY = endY - startY;
        this.scheduleOnce(function () {
            this.isInAutoStart = true
            this.stopAutoMoveMap();
        }, 0.5);
        dragLayer.lockMove(true);
        dragLayer.delayMove(dtX, dtY, 0.5, function () {
            dragLayer.lockMove(false);
        }.bind(this));

        this.animation = true
    };
    //显示隐藏建筑名称
    reflashFactoryGuide(factoryID, isGuideStart) {
        let factorys = this.ndFactorys.children;
        for (let key in factorys) {
            let factory = factorys[key];
            let factoryClass = factory.getComponent(global.CommonClass.FactoryBase);

            let ID = factoryClass.getID();
          
            if (ID == factoryID) {
                if (isGuideStart)
                    factoryClass.createHelp();
                else
                    factoryClass.removeHelp();

                return;
            }
        }
    };
    //显示隐藏建筑名称
    showFactoryName(isShow): void {
        let ndFactorys = this.getFactoryNode().children;
        for (let key in ndFactorys) {
            let curND = ndFactorys[key];
            let factoryID = curND.tagEx;
         
            let factoryClass = global.CommonClass.Functions.getFactoryClassType(factoryID);
            let itemClass = curND.getComponent(factoryClass);
            itemClass.showName(isShow);

        }
    };
    //建筑置灰
    refalashState(): void {
        let factorys = this.ndFactorys.children;
        for (let key in factorys) {
            let factory = factorys[key];
            let factoryClass = factory.getComponent(global.CommonClass.FactoryBase);
            let ID = factoryClass.getID();
            let factoryData = global.Manager.DBManager.findData("Factory", 'ID', ID);
            let level = global.Module.MainPlayerData.getLevel();
            factoryClass.setGray(factoryData.levelRequire > level);//建筑等级限制置灰
            if (level != 0)
                factoryClass.setGray(factoryData.levelRequire > level);
        }
    };
    //显示建筑名称
    reflashFactoryGuides() {
        let factorys = this.ndFactorys.children;
        for (let key in factorys) {
            let factory = factorys[key];
            let factoryClass = factory.getComponent(global.CommonClass.FactoryBase);
            let ID = factoryClass.getID();

            let needGuide = global.Proxys.ProxyFactoryGuide.getNeedShowGuide(ID);
            if (needGuide) {
                factoryClass.showName(true);
            }
        }
    };
    //加载建筑
    createFactory(item: any, callback: any) {
        let self = this;
        let ID = item.templateID;

        let factoryData = global.Manager.DBManager.findData("Factory", 'ID', ID);

        if (factoryData != null && factoryData.type == 'makeGoods')  //制作
        {
            global.Module.MakeGoodsData.addFactory(ID);
            this.reflashPickItem(ID, null);
        }

        if (factoryData == null) {
            return false;
        }

        if (factoryData.scene != 'MainScene') {
            return false;
        }

        let filePath = factoryData.prefabFile;
        global.CommonClass.Functions.setCreate(filePath, function (prefab) {
            if (prefab != null) {
                
                let newNode = cc.instantiate(prefab);
                let zOrder =  parseInt((((item.y + 2500) / 10)+((item.x + 2500) / 10)).toString());
                newNode.zIndex = zOrder;
                newNode.tagEx = ID;
                if (self.ndFactorys != null)
                    self.ndFactorys.addChild(newNode);
                newNode.setPosition(item.position.x, item.position.y);


                let level = global.Module.MainPlayerData.getLevel();
                if (global.Instance.Socket.isConnected())
                    newNode.active = factoryData.showLevel <= level;

                let factoryClass = newNode.getComponent(global.CommonClass.FactoryBase);
                factoryClass.setID(ID);

                let isShow = global.Module.GameData.getIsShowFactoryName();
                factoryClass.showName(isShow);
               
              
                
                if (factoryData.type == 'paintRoom')
                    newNode.active = false;
            }

            if (callback)
                callback(ID);
        }.bind(this));

        return true;
    };
    //拖动建筑是否与其他建筑相交
    checkIsCross(ndFactory) {
        let factorys = this.ndFactorys.children;
        for (let key in factorys) {
            let ndItem = factorys[key];

            if (ndFactory != ndItem) {
                let factoryClass = ndItem.getComponent(global.CommonClass.FactoryBase);
                if (factoryClass != null && factoryClass.isCross(ndFactory))
                    return true;
            }
        }

        let ndObstacles = this.ndObstacles.children;
        for (let key in ndObstacles) {
            let ndItem = ndObstacles[key];
            let obstacleClass = ndItem.getComponent(global.CommonClass.ObstacleBase);
            if (ndItem.active && obstacleClass && obstacleClass.isCross(ndFactory)) {
                return true;
            }
        }

        let ndOuts = this.ndOut.children;
        for (let key in ndOuts) {
            let ndItem = ndOuts[key];
            if (ndFactory != ndItem) {
                let outClass = ndItem.getComponent(global.CommonClass.FactoryBase);
                if (outClass != null && outClass.isCross(ndFactory))
                    return true;
            }
        }

        return false;
    };
    //取消拖动建筑选择恢复curSelFactory状态
    cancelSelect() {
        if (this.curSelFactory != null) {
            let factoryClass = this.curSelFactory.getComponent(global.CommonClass.FactoryBase);
            factoryClass.setUnselect();
            global.Instance.Log.debug('unselect factory ID: ', factoryClass.getID());

            this.curSelFactory = null;
        }
    };
    //取消拖动建筑选择恢复curPickFactory状态
    cancelPick() {
        if (this.curPickFactory != null) {
            let factoryClass = this.curPickFactory.getComponent(global.CommonClass.FactoryBase);
            factoryClass.setUnselect();
            global.Instance.Log.debug('unpick factory ID: ', factoryClass.getID());

            this.curPickFactory = null;
        }
    };
    //获取当前建筑状态
    getFactoryState(factory) {
        if (factory != null) {
            let factoryClass = factory.getComponent(global.CommonClass.FactoryBase);
            return factoryClass.getItemState();
        }

        return -1;
    };
    //精灵投资宝箱
    reflashDemonMail() {
        let mailArr = global.Module.SummonData.getinvestmentMail();
        global.Instance.Log.debug('精灵投资宝箱',mailArr)
        for (let i = 0; i < this.sackNode.length; i++) {
            this.sackNode[i].getComponent('summonInvest').show(mailArr[i]);
        }
    };
    //加载蜂场
    reflashHoneycomb() {
        let honeycomb = this.getFactoryByName('HoneycombSimple');
        if (honeycomb != null) {
            let beeTotalTime = global.Module.FarmParkData.getBeeTotalTime();
            let beeLeftTime = global.Module.FarmParkData.getBeeLeftTime();
            honeycomb.setLeftTime(beeLeftTime, beeTotalTime);
        }
    };
    //加载指定建筑
    getFactoryByName(name) {
        let ndFactorys = this.getFactoryNode().children;
        for (let key in ndFactorys) {
            let curND = ndFactorys[key];
            let factoryName = curND.getName();

            if (factoryName == name) {
                let factoryTempID = curND.tagEx;
                let factoryClass = global.CommonClass.Functions.getFactoryClassType(factoryTempID);
                return curND.getComponent(factoryClass);
            }
        }

        return null;
    };
    //通过ID获取建筑
    getFactoryClassByTempID(factoryTempID) {
        let factorys = global.Module.MainMapData.getFactorys();
        let ndFactorys = this.getFactoryNode().children;
        for (let key in ndFactorys) {
            let curND = ndFactorys[key];
            let ID = curND.tagEx;

            let facotryData = factorys[ID];
            if (facotryData != null && facotryData.templateID == factoryTempID) {
                let factoryClass = global.CommonClass.Functions.getFactoryClassType(factoryTempID);
                let itemClass = curND.getComponent(factoryClass);
                return itemClass;
            }
        }

        return null;
    };
    //通过id确定点击建筑
    getFactoryClassByID(factoryID) {
        let ndFactorys = this.getFactoryNode().children;
        for (let key in ndFactorys) {
            let curND = ndFactorys[key];
            let ID = curND.tagEx;

            if (ID == factoryID) {
                let factoryClass = global.CommonClass.Functions.getFactoryClassType(factoryID);
                let itemClass = curND.getComponent(factoryClass);

                return itemClass;
            }
        }

        return null;
    };
    //获取建筑列表
    getFactoryNode() {
        return this.ndFactorys;
    };
    //制作好的物品
    reflashPickItem(factoryID, pickItems) {
        let itemClass = this.getFactoryClassByID(factoryID);
        if (itemClass != null) {
            itemClass.reflashPickItem(pickItems);
        }
    };
    //场景建筑更新
    addFactoryByWorldPos(templateID, worldPos) {
        let position = this.ndFactorys.convertToNodeSpaceAR(worldPos);
        let self = this;
        let data = { id: templateID, x: parseInt(position.x), y: parseInt(position.y) };
        global.Instance.MsgPools.send('scenePosUpdate', data, function (msg) {
            if (msg.errorID == 0) {
                self.addFactory(templateID, position);
            }
        });

    };
    //添加建筑
    addFactory(templateID, position) {
        let self = this;

        let factoryData = global.Manager.DBManager.findData("Factory", 'ID', templateID);
        let filePath = factoryData.prefabFile;
        global.CommonClass.Functions.setCreate(filePath, function (prefab) {
            if (prefab != null) {
                let newNode = cc.instantiate(prefab);
                if (self.ndFactorys != null)
                    self.ndFactorys.addChild(newNode, cc.macro.MAX_ZINDEX);
                newNode.setPosition(position.x, position.y);
                let zOrder = parseInt((((position.y + 2500) / 10) + ((position.x + 2500) / 10)).toString());
                newNode.zIndex = zOrder;
                newNode.tagEx = templateID;;
                let factoryClass = newNode.getComponent(global.CommonClass.FactoryBase);
                factoryClass.setID(templateID);
                global.Module.MainMapData.setPosition(templateID, position);

                if (factoryData != null && factoryData.type == 'makeGoods')  //制作
                    global.Module.MakeGoodsData.addFactory(templateID);

                let needGuide = global.Proxys.ProxyFactoryGuide.getNeedShowGuide(templateID);
                if (needGuide)
                    factoryClass.createHelp();
            }
        })


        if (factoryData.type == 'showRoom') //鉴定,展厅
        {
            global.Proxys.ProxyGuide.setGuideFinish("NewFactory", true);

            let panel = global.Manager.UIManager.get('UINewFactory');
            if (panel != null)
                panel.reflashGuide();
        }
    };
    //制作数据
    addFactoryPickItem(factoryID, pickItem) {
        let itemClass = this.getFactoryClassByID(factoryID);
        if (itemClass != null) {
            itemClass.addPickItem(pickItem);
        }
    };
    //判断选取
    judagePick(node, touchPoint) {
        let isPick = false;

        if (!node.active)
            return false;

        let itemClass = node.getComponent(global.CommonClass.FactoryBase);
        if (itemClass != null) {
            isPick = itemClass.isPicked(touchPoint);
        }
        else {
            let boundingBox = node.getBoundingBoxToWorld();
            isPick = boundingBox.contains(touchPoint);
        }

        return isPick;
    };
    /**
     * 根据坐标获取建筑
     * @param touchPoint 
     * @returns 
     */
    intellectPick(touchPoint) {
        let ndFactorys = this.ndFactorys.children;
        let pickNode = null;
        for (let key in ndFactorys) {
            let curND = ndFactorys[key];

            if (this.judagePick(curND, touchPoint)) {
                pickNode = curND;

                let name = curND.getName();
                if (name != 'WorldMapEnter' && name != 'FarmPark')
                    break;
            }
        }

        return pickNode;
    };
    /**
     * 按下建筑
     * @param touchPoint 
     */
       
    onTouchFactoryBeginLogic(touchPoint) {
        if (this.curPickFactory != null&&this.curSelFactory) {
            this.curSelFactory.setPosition(this.startPosition);
            
            let zOrder = parseInt((((this.startPosition.y + 2500) / 10)+((this.startPosition.x + 2500) / 10)).toString());
            this.curSelFactory.zIndex = zOrder;
            let factoryClass = this.curPickFactory.getComponent(global.CommonClass.FactoryBase);
            factoryClass.setUnselect();
            let factoryID = factoryClass.getID();

            let curPosition = this.curSelFactory.getPosition();
            let data = { id: factoryID, x: parseInt(curPosition.x), y: parseInt(curPosition.y) };
            global.Instance.MsgPools.send('scenePosUpdate', data, function (msg) {
                if (!msg.errorID) {
                    global.Module.MainMapData.setPosition(factoryID, curPosition);
                }
            });
            this.isMoveState = false;
            this.lockMove(false);
            this.startPosition = null;
            this.curPickFactory = null;
        } else {
            this.curPickFactory = this.intellectPick(touchPoint);
            if (this.curPickFactory != null) {
                this.startPosition = this.curPickFactory.getPosition();

                let pickItemState = this.getFactoryState(this.curPickFactory);
                if (pickItemState == 2)
                    this.lockMove(false);

                if (this.curSelFactory != null && this.curPickFactory != this.curSelFactory)
                    this.cancelSelect();
            }
        }
       
        let uiFriend = global.Manager.UIManager.get('UIFriend');
        if (uiFriend)
            uiFriend.move(false);
    };
    /**
     * 拖动建筑是否可以
     * @param {*} touchPoint 
     */
    onTouchFactoryMoveLogic(touchPoint) {
        if (this.curPickFactory == null) {
            if (this.curSelFactory != null) {
            
            }
        }
        else {
            let selItemState = this.getFactoryState(this.curPickFactory);
            if (selItemState == 2) {
             
                let point1 = this.point;
                let point2 = this.ndFactorys.convertToNodeSpaceAR(touchPoint);
                let pointX = point1.x - point2.x;
                let pointY = point1.y - point2.y;
                let pos = new cc.Vec2(pointX, pointY)
                let position = new cc.Vec2(this.startPosition.x-pos.x, this.startPosition.y-pos.y)
                this.curPickFactory.setPosition(position);

                this.isMoveState = true;

                let isCross = this.checkIsCross(this.curPickFactory);
                let factoryClass = this.curPickFactory.getComponent(global.CommonClass.FactoryBase);
                factoryClass.showCross(isCross);//是否可以放置颜色设置
            }
        }
    };

    onTouchFactoryEndLogic(touchPoint) {
        let self = this;
        if (!this.isMoveState) {
            let dragLayer = global.CommonClass.DragLayer.getDragLayer('MainMap');
            if (dragLayer != null)
                if (dragLayer.getDrag())
                    return;
            
            let curPickFactory = this.curPickFactory;
                if (curPickFactory != null) {
                    let pickItemState = this.getFactoryState(curPickFactory);
                    if (pickItemState != 2) {
                        let factoryClass = curPickFactory.getComponent(global.CommonClass.FactoryBase);
                        let factoryID = factoryClass.getID();
                        let factory = global.Manager.DBManager.findData("Factory", 'ID', factoryID);
                        if (factory.type == 'makeGoods') {
                            let pickItems = global.Module.MakeGoodsData.getPickItems(factoryID);
                            if (pickItems.length <= 0)
                                this.onOpenUI(factoryID, touchPoint);
                            else {
                                let data = { buildingId: factoryID };
                                global.Instance.MsgPools.send('manufacturePickup', data, function (msg) {
                                    if (msg.errorID) {
                                        self.onOpenUI(factoryID, touchPoint);
                                    }
                                    else {
                                        let items = [];
                                        for (let key in pickItems) {
                                            let obj = { itemID: pickItems[key], itemNum: 1 };
                                            items.push(obj);
                                        }
                                        global.CommonClass.ItemDrop.createMultiDrop(items, curPickFactory, null, null);

                                        factoryClass.pickAllItem();
                                        global.Module.MakeGoodsData.pickAllItem(factoryID);
                                    }
                                });
                            }
                        } else {
                            this.onOpenUI(factoryID, touchPoint);
                        }
                }
            }
        } else {  //移动结束
            if (this.curSelFactory != null) {
                let factoryClass = this.curSelFactory.getComponent(global.CommonClass.FactoryBase);
                if (!factoryClass.getIsShow()) {
                    factoryClass.setUnselect();
                    if (this.checkIsCross(this.curSelFactory)) {    //相交
                        this.curSelFactory.setPosition(this.startPosition);
                    }
                   
                    let zOrder =  parseInt((((this.curSelFactory.y + 2500) / 10)+((this.curSelFactory.x + 2500) / 10)).toString());
                    this.curSelFactory.zIndex = zOrder;
                    let factoryID = factoryClass.getID();
                    let curPosition = this.curSelFactory.getPosition();
                    let data = { id: factoryID, x: parseInt(curPosition.x), y: parseInt(curPosition.y) };
                    global.Instance.MsgPools.send('scenePosUpdate', data, function (msg) {
                        if (!msg.errorID) {
                            global.Module.MainMapData.setPosition(factoryID, curPosition);
                        }
                    });
                    this.isMoveState = false;
                    this.lockMove(false);
                    this.startPosition = null;
                    this.curPickFactory = null;
                }

            }
        }
        
    };

    dealFacorysTouchEvent(event) {
        let ndFactorys = this.ndFactorys.children;
        for (let key in ndFactorys) {
            let touchPoint = event.getLocation();
            let curND = ndFactorys[key];

            if (this.judagePick(curND, touchPoint)) {
                let itemClass = curND.getComponent(global.CommonClass.FactoryBase);
                if (itemClass != null) {
                    itemClass.onMouseEvent(event);
                    break;
                }
            }
        }
    };
    /**
     * 选中 扩展地
     * @param touchPoint 
     * @returns 
     */
    onTouchObstacleBeginLogic(touchPoint) {
        let ndObstacles = this.ndObstacles.children;
        for (let key in ndObstacles) {
            let curND = ndObstacles[key];
            let itemClass = curND.getComponent(global.CommonClass.ObstacleBase);
            if (itemClass != null) {
                if (curND.active && itemClass.isPicked(touchPoint)) {
                    this.curSelObstacle = curND;
                    itemClass.setSelect(true);

                    return;
                }
            }
        }
    };

    onTouchObstacleMoveLogic(touchPoint) {
        if (this.isMouseMoved && this.curSelObstacle != null) {
            let itemClass = this.curSelObstacle.getComponent(global.CommonClass.ObstacleBase);
            itemClass.setSelect(false);
            this.curSelObstacle = null;
        }
    };

    onTouchObstacleEndLogic(touchPoint) {
        if (this.curSelObstacle != null) {
            let itemClass = this.curSelObstacle.getComponent(global.CommonClass.ObstacleBase);
            itemClass.setSelect(false);
            this.curSelObstacle = null;

            let self = this;

            let ID = itemClass.getID();
            global.Manager.UIManager.open('DlgExtendMap', null, function (panel) {
                panel.show(ID, function (isYes) {
                    if (isYes) {
                        //cc.Module.MainMapData.openObstacle(ID);
                        let data = { index: ID }
                        global.Instance.MsgPools.send('obstaclesOpenup', data, function (msg) {
                            if (!msg.errorID) {
                                self.openObstacle(ID);

                                global.CommonClass.UITip.showTipTxt('开地成功', global.Enum.TipType.TIP_GOOD);
                            }
                        });

                    }
                });
            })
        }
    };

    refalashObstacle() {
        let ndObstacles = this.node.getChildByName('ndObstacles').children;
        for (let key in ndObstacles) {
            let obstacle: any = ndObstacles[key];

            let itemClass = obstacle.getComponent(global.CommonClass.ObstacleBase);

            if (itemClass) {
                let ID = itemClass.getID();
                let item = global.Module.MainMapData.getObstacle(ID);
                obstacle.active = item == null || !item.isOpen;
            }

        }
    };

    openObstacle(ID) {
        let ndObstacles = this.node.getChildByName('ndObstacles').children;
        for (let key in ndObstacles) {
            let obstacle: any = ndObstacles[key];

            let itemClass = obstacle.getComponent(global.CommonClass.ObstacleBase);

            let itemID = itemClass.getID();
            if (itemID == ID) {
                obstacle.removeFromParent();
                return true;
            }
        }

        return false;
    };

    isPickOut(touchPoint) {
        let ndOuts = this.ndOut.children;
        for (let key in ndOuts) {
            let ndItem = ndOuts[key];
            return this.judagePick(ndItem, touchPoint);
        }

        return false;
    };

    scaleFactoryGuide(scaleX, scaleY) {
        let ndFactorys = this.ndFactorys.children;
        for (let key in ndFactorys) {
            let curND = ndFactorys[key];
            let guideHelp = curND.getChildByName('guideHelp');
            if (guideHelp != null && guideHelp.active) {
                guideHelp.scaleX = 1 / scaleX;
                guideHelp.scaleY = 1 / scaleY;
            }
        }
    };

   
    //拖拽事件
    onDragEvent(event) {
        if (!this.animation)
            return;
        if (event == null || event.touch == null)
            return;
        let length = event.getTouches().length;
       
        if (length >= 2) {
            this.cancelPick();
            this.cancelSelect();
            this.lockMove(false);

            this.isMoveState = false;
        }

        if (event.type == cc.Node.EventType.TOUCH_START) {
            if (length >= 2)
                this.touchCount = length;
            else
                this.touchCount = 0;
        }

        if (this.touchCount <= 0) {
            //处理建筑内部鼠标逻辑
            this.dealFacorysTouchEvent(event);

            if (event.type == cc.Node.EventType.TOUCH_START) {//触摸启动
                let touchPoint = event.getLocation(); {
                    let panel = global.Manager.UIManager.get('UINewFactory');
                    if (panel != null)
                        if (panel.getIsShow())
                            panel.show(false);
                    this.clickStartPos = touchPoint;
                    this.isMouseMoved = false;
                    this.isMovecell = true;
                    this.point = this.ndFactorys.convertToNodeSpaceAR(this.clickStartPos);
                    this.onTouchFactoryBeginLogic(touchPoint);
                    this.onTouchObstacleBeginLogic(touchPoint);
                }
            }else if (event.type == cc.Node.EventType.TOUCH_MOVE) {//触摸移动
                let touchPoint = event.getLocation();
                this.touchPoint = touchPoint;//实时更新，自动移图需要

                if (this.clickStartPos != null) {
                    let distance = touchPoint.sub(this.clickStartPos).mag();
                    if (distance > 15 && !this.isMouseMoved)
                        this.isMouseMoved = true;
                }
                
                if(this.isMouseMoved){
                    if (this.curPickFactory != null && this.isMovecell == true) {
                        let positX = touchPoint.x;
                        let positY = touchPoint.y;
                        let distanceW = 0;
                        let distanceH = 0;
                        if (positX > 1200)
                            distanceW = -200;
                        if (positX < 200)
                            distanceW = 200;
                        if (positY > 600)
                            distanceH = -200;
                        if (positY < 100)
                            distanceH = 200;
                        let self = this
                        let callback = function () {
                            self.isMovecell = true;
                            self.unschedule(self.callback);
                            self.callback = null;
                        }
                        this.isMovecell = false;
                        this.movecell(distanceW, distanceH, callback)
                        this.callback = function () {
                            self.onTouchFactoryMoveLogic(self.touchPoint); 
                        }
                        this.schedule(this.callback, 0.02);
                    }else{
                        if (this.curPickFactory != null)
                            this.onTouchFactoryMoveLogic(touchPoint);
                        if (this.curSelObstacle != null)
                            this.onTouchObstacleMoveLogic(touchPoint);
                    }
                   
                    
                }
            }else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {//触摸结束
                let touchPoint = event.getLocation();
                this.onTouchFactoryEndLogic(touchPoint);
                this.onTouchObstacleEndLogic(touchPoint);
            }
        }
        else {
            if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL)
                this.touchCount--;
        }

    };
    movecell(distanceW, distanceH, callback) {
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('MainMap');
        dragLayer.delayMove(distanceW, distanceH, 0.5, callback)
    };
    onFactorySelect(event) {
        this.curSelFactory = event.getUserData();
        this.curSelFactory.zIndex = 9999;
        this.lockMove(true);
    
    };

    onRotateX(event) {
        if (this.curSelFactory != null) {
            let spFactory = this.curSelFactory.getChildByName('spFactory');
            let scaleX = spFactory.scaleX || 1;
            spFactory.scaleX = -scaleX;
        }
    };

    onLevelUp(level) {
        global.Proxys.ProxyFactoryGuide.onLevelUp(level);
    };
}
