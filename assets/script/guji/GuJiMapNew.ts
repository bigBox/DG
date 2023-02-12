

const { ccclass, property } = cc._decorator;

@ccclass
export default class GuJiMapNew extends cc.Component {
    @property({ type: cc.Node, displayName: "spBackNode", tooltip: "spBackNode" })
    spBackNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndMapGoods", tooltip: "ndMapGoods" })
    ndMapGoods: cc.Node = null;
    @property({ type: cc.Node, displayName: "mapGoodsItem", tooltip: "mapGoodsItem" })
    mapGoodsItem: cc.Node = null;
    @property({ type: cc.Node, displayName: "helpNode", tooltip: "提示" })
    helpNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "bombItem", tooltip: "bombItem" })
    bombItem: cc.Node = null;
    @property({ type: cc.Node, displayName: "ndBalloon", tooltip: "ndBalloon" })
    ndBalloon: cc.Node = null;
    @property({ type: cc.Node, displayName: "toolNodeBtn", tooltip: "toolNodeBtn" })
    toolNodeBtn: cc.Node = null;
    @property({ type: cc.Sprite, displayName: "toolSprite", tooltip: "toolSprite" })
    toolSprite: cc.Sprite = null;
    @property({ type: cc.SpriteFrame, displayName: "toolAtlasArr", tooltip: "toolAtlasArr" })
    toolAtlasArr: any[] = [];
    @property({ type: cc.SpriteFrame, displayName: "pathNewAtlasArr", tooltip: "pathNewAtlasArr" })
    pathNewAtlasArr: any[] = [];
    @property({ type: cc.SpriteFrame, displayName: "pathLAtlasArr", tooltip: "pathLAtlasArr" })
    pathLAtlasArr: any[] = [];
    @property({ type: cc.Node, displayName: "ndMapHelp", tooltip: "远近任务动画层" })
    ndMapHelp: cc.Node = null;
    
    ndPlayer: any;
    mainPlayer: any;
    standCell: any;
    mapGoodsItemPos: cc.Vec2;
    mapCellItemPos: cc.Vec2;
    cellEdgePos: cc.Vec2;
    lockMove: boolean;
    moveGoal: number;
    robId: number;
    digMsg: any;
    isMoveMap: boolean;
    clickStartPos: any;
    hurtEffect: any;
    ndSpine: any;
    curSelCell: any;
    ndMapMonster: any;
    monsterWuCell: any;
    monsterWenCell: any;
    wenTarget: number;
    guideMonster: any;
    guideBomb: any;
    curCellItem: any;
    mapItems: {};
    robCount: number;
    time: number;
    routeMap: any[];
    lineMap: any[];
    targetIdx: number;
    contentData: any;
    wenStart: any;
    ndMapCells: any;
    curDigType: any;
    pathColorType: any;
    DabaoisShow:boolean;//是否领取大宝藏
    ndSpine1: any;
    ndSpine2: any;
    ndpeng: any;
    cellItem: any;
    isMode:boolean;//回顾模式
    totalData: { totalNum: number; trapNum: number; itemArr: {}; };
    helpList: { curIdx: number; targetIdx: number; }[];
    index: number;
    lineMapHelp: any;
    DabaoisShow1: boolean;
    constructor() {
        super();
        this.ndPlayer = null;//操作层
        this.mainPlayer = null;//操作层下的人

        this.standCell = null;//人物停留位置

        this.mapGoodsItemPos = cc.v2(0, 0);//探险地坐标
        this.mapCellItemPos = cc.v2(0, 0);
        this.cellEdgePos = cc.v2(0, 0);

        this.lockMove = false; //是否可以点击 
        this.moveGoal = 0;            //  0:无 1：挖
        this.robId = 0;
        this.digMsg = null;

        this.isMoveMap = false;
        this.clickStartPos = null;
        this.hurtEffect = null;
        this.ndSpine = null;
        this.curSelCell = null;
        this.totalData = {
            totalNum:0,
            trapNum:0,
            itemArr:{},
        }//起点//终点
        this.helpList = [
            {curIdx :157, targetIdx : 130},
            {curIdx :130, targetIdx : 181},
            {curIdx :181, targetIdx : 240}
        ]

        this.ndMapMonster = null;
        this.monsterWuCell = null;
        this.monsterWenCell = null;
        this.wenTarget = -1;

        this.guideMonster = null;
        this.guideBomb = null;
        this.curCellItem = null;//选中位置{x: 0, y: 0}
        // this.guideMonsterCell = null;

        this.mapItems = {};
        this.robCount = 0;

        this.time = 0;
        this.DabaoisShow = false;
        this.DabaoisShow1 = false;
        this.routeMap = [];//路线id
        this.lineMap = [];//路线值
        this.targetIdx = -1;
        this.isMode = false;
    };
    getDabaoisShow(){
      return this.DabaoisShow;
    };

    onLoad() {
        global.Instance.Dynamics["GuJiMap"] = this;
        global.Instance.Log.debug("GuJiMapNew onLoad", "GuJiMapNew");
        this.contentData = global.Proxys.ProxyGuJi.getContentData();
        let size: any = { width: this.contentData.width, height: this.contentData.height }
        this.node.setContentSize(size);
        global.Proxys.ProxyGuJi.onLoadMap(this);
        let picPath = this.contentData.path + this.contentData.picName;
        global.CommonClass.Functions.setTextureNew(this.spBackNode, picPath, null);
        global.Manager.UIDlgTipManager.clearTips();
        
    };

    start() {
        let size = { width: this.contentData.width, height: this.contentData.height }
        let dragLayer = global.CommonClass.DragLayer.getDragLayer('GuJiMapNew');
        if (dragLayer != null) {
            // dragLayer.setMinScale(0.6);
            dragLayer.onsetMinScale(size)
            dragLayer.setMaxScale(1);
            dragLayer.scaleLayer(0.6);
            dragLayer.setndDragContentSize(size);
        }
    };
    onEnable() {
        /***动态修改地图范围 */
        this.createCells();     //cell goods mask三层 cell goods同步创建, mask异步加载
        let pathItem = this.node.getChildByName('pathItemD');
        pathItem.active = false;
    };

    onDisable() {
        cc.director.getScheduler().unschedule(this.selfUpdate, this);
        global.Instance.Dynamics["GuJiMap"] = null;
    };
    getTotalData(): { totalNum: number; trapNum: number; itemArr: {}; } {
        return this.totalData;
    }

    initPlayer() {
        this.ndPlayer = this.node.getChildByName('ndPlayer');
        this.mainPlayer = this.ndPlayer.getChildByName('mainPlayer').getComponent(global.CommonClass.MoveObject);
        this.mainPlayer.setMapOwner(this);
        this.ndSpine = this.mainPlayer.node.getChildByName('ndSpine');
        this.ndSpine1 = this.mainPlayer.node.getChildByName('ndSpine1');
        this.ndSpine2 = this.mainPlayer.node.getChildByName('ndSpine2');
        this.ndpeng = this.mainPlayer.node.getChildByName('peng');

        this.ndSpine.active = true;
        this.ndSpine1.active = false;
        this.ndSpine2.active = false;
        this.ndpeng.active = false;
        let self = this
        this.ndSpine2.getComponent(sp.Skeleton).setCompleteListener((element, loopCount) => {
            if (element.name === 'animation')
                self.lockOp(false);
        });
        this.ndPlayer.parent = this.ndMapGoods;
        this.ndPlayer.setPosition(cc.v2(0, 0));
        let cell = global.Proxys.ProxyGuJi.getZeroPos();
        let zorder = (1000 - cell.idx);
        let curCell = this.getCellByPathCell(cell);
        if (curCell != null) {
            this.standCell = curCell;
            let cellPos = curCell.getPosition();
            this.mainPlayer.node.setPosition(cellPos);
            this.ndPlayer.zIndex = zorder + 2;
            let mapData = global.Proxys.ProxyGuJi.getMapData();
            let openIdx = mapData.colNum + 1;
            global.Proxys.ProxyGuJi.openArround(openIdx);
            global.Proxys.ProxyGuJi.openArround(openIdx - 1);
            this.mainPlayer.node.active = false;

        }

    };
    playBalloonAction() {
        this.lockOp(true);
        this.ndBalloon.active = true;
        let cell = global.Proxys.ProxyGuJi.getZeroPos();

        let curCell = this.getCellByPathCell(cell);
        var position = cc.v2(0, 0);
        if (curCell != null) {
            let endPos = curCell.convertToWorldSpaceAR(cc.v2(0, 0));
            let distanceW = 100 - endPos.x;
            let distanceH = 300 - endPos.y;
            let dragLayer = global.CommonClass.DragLayer.getDragLayer('GuJiMapNew');
            position = cc.v2(curCell.getPosition().x + 1402, curCell.getPosition().y + 1037)
            if (dragLayer != null) {
                dragLayer.delayMove(distanceW, distanceH, 0.5);
            }
        }

        let self = this;
        let delay = cc.delayTime(2.4);
        let onDelayEnd = function () {
            global.Proxys.ProxyGuJi.setIsAnimation(true)
            self.mainPlayer.node.active = true;
        }
        let endFun = cc.callFunc(onDelayEnd);
        let seq = cc.sequence(delay, endFun);
        this.node.stopAllActions();
        this.node.runAction(seq);

        let flyOutEnd = function () {
            self.lockOp(false);
            self.ndBalloon.active = false;
            let uiGuJi = global.Manager.UIManager.get('UIGuJi');
            if (uiGuJi)
                uiGuJi.getndHelp();
                uiGuJi.reflash();
            self.reflash();
        };
       
        for (let i = 1; i <= 2; ++i) {
            let ndBalloon = self.ndBalloon.getChildByName('ndBalloonIn' + i.toString());
            ndBalloon.active = true;
            ndBalloon.setPosition(position)
            let skeletonIn = ndBalloon.getComponent(sp.Skeleton);
            skeletonIn.loop = false;
            skeletonIn.paused = false;
            if (i == 1) {
                skeletonIn.animation = "jiangluo hou";
                skeletonIn.setCompleteListener(flyOutEnd);
            } else {
                skeletonIn.animation = "jiangluo qian";
            }
              
        }
    };

    reflash(){
        this.helpNode.active = false;
        var data = global.Module.TaskData.getHasAcceptTaskData();
        
        let contentData = global.Proxys.ProxyGuJi.getContentData();

        if (data.state == 1 && (data.taskId == 10000)){
            let idx =global.Proxys.ProxyGuJi.getAdSide()
            let cell = this.getCell(idx);
            this.helpNode.active = true;
            if(cell){
                var position = global.Manager.UIManager.coortrans(cell, this.node);
                if(position.y>0){
                    this.helpNode.angle = 180;
                }else{
                    this.helpNode.angle = 0;
                }
                this.helpNode.setPosition(position);
            }
            
        }else if(data.state == 1 && (data.taskId == 10003)&&contentData.ID == 2){
            global.Manager.UIManager.open('UIHelpTip', null, function (panel) {
                panel.show({key:"Exploratory"});
                panel.setCloseCB(null);
            });
        }
    }
    reflashHelpTips(isShow){
        this.ndMapGoods.active = !isShow;
        this.ndMapHelp.active = isShow;
        if(isShow ==true){
            this.reflashHelp(-1);
        }
       
    };
    reflashHelp(index){
        if(this.ndMapHelp.active == false)
            return;
        index++;
        
        let ndPlayer = this.ndMapHelp.getChildByName('ndPlayer');
        let mainPlayer = ndPlayer.getChildByName('mainPlayer').getComponent(global.CommonClass.MoveObject);
        if(index==3){
            index = 0;
        }
        if(index == 0){
            this.DabaoisShow1 = false;
            let proxy = global.Proxys.ProxyGuJi;
            let list = proxy.getHelpMapData();
            
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                let index = item.idx;
                let mapData = proxy.getMapData();
                let zorder = (1000 - index);
                let row = Math.floor((index) / mapData.colNum);
                let type = Math.floor((index) % mapData.colNum);
                let cellSize = this.mapGoodsItem.getContentSize();
                let position = cc.v2(0, 0);

                if (this.mapGoodsItem != null && item) {
                    //goods item
                    let newGood: any = this.ndMapHelp.getChildByName('ndGoods' + (item.idx).toString())
                    if(newGood==null){
                        newGood = global.Proxys.ProxyGuJi.get();
                        this.ndMapHelp.addChild(newGood);
                    }
                    newGood.setPosition(position);
                    let nameGoods = 'ndGoods' + index.toString();
                    newGood.name = (nameGoods);
                    newGood.tagEx = (index);

                    newGood.zIndex = (zorder);
                    newGood.active = true;
                    position.x = cellSize.width / 2 + cellSize.width * type;
                    position.y = cellSize.height / 2 + cellSize.height * row;
                    newGood.setPosition(position);
                    let goodsClass = newGood.getComponent(global.CommonClass.GuJiGoodsItem);
                    goodsClass.setItem(item);

                }

                if (item.type != -1) {
                    let dragLayer = global.CommonClass.DragLayer.getDragLayer('GuJiMapNew');
                    if (dragLayer != null) {
                        let scale = dragLayer.getItemScale();
                        if (scale < 0.6) {
                            dragLayer.scaleLayer(0.6);
                        }
                        let curCell = this.ndMapGoods.getChildByName('ndGoods' + 130);
                        if (curCell != null) {
                            let endPos = curCell.convertToWorldSpaceAR(cc.v2(0, 0));
                            let distanceW = 100 - endPos.x;
                            let distanceH = 300 - endPos.y;
                            dragLayer.delayMove(distanceW, distanceH, 0.1);
                        }

                    }
                }else{
                    let index = item.idx;
                    let mapData = proxy.getMapData();
                    let row = Math.floor((index) / mapData.colNum);
                    let type = Math.floor((index) % mapData.colNum);
                    ndPlayer.zIndex = 99999;
                    let position = cc.v2(0, 0);
                    position.x = 130 / 2 +130 * type;
                    position.y = 130 / 2 + 130 * row;
                    mainPlayer.node.setPosition(position);
                }

            }
          
        }
        this.index = index;
        this.goHelpTarget(index,mainPlayer);//记录行走id
    }

    /**
     * 探险
     * @param {*} targetIdx 终点
     */
    goHelpTarget(index,mainPlayer) {
        if (this.lineMapHelp != null) {
            let obj: any = {};
            obj = this.lineMapHelp;
            let startClass = this.getGoodsClassByIndexHelp(obj.startID);
            startClass.showSelect(false);
            let endClass = this.getGoodsClassByIndexHelp(obj.endID);
            endClass.showSelect(false);
        }
        let curIdx = this.helpList[index].curIdx;//起点
        let targetIdx = this.helpList[index].targetIdx;//终点
        let ndPath = this.node.getChildByName('ndPath');
        ndPath.removeAllChildren();
        this.routelineMap(targetIdx);//记录行走id
        if (curIdx != null) {
            let dragLayer = global.CommonClass.DragLayer.getDragLayer('GuJiMapNew');
            if (dragLayer != null) {
                let scale = dragLayer.getItemScale();
                if (scale < 0.6) {
                    dragLayer.scaleLayer(0.6);
                }
                let curCell = this.ndMapHelp.getChildByName('ndGoods' + targetIdx.toString());
                if (curCell != null) {
                    let endPos = curCell.convertToWorldSpaceAR(cc.v2(0, 0));
                    let distanceW = 100 - endPos.x;
                    let distanceH = 300 - endPos.y;
                    dragLayer.delayMove(distanceW, distanceH, 0.1);
                }

            }
            let path = global.Proxys.ProxyGuJi.searchdPath(curIdx, targetIdx);//路线
            let goodsClass = this.getGoodsClassByIndex(targetIdx);
            this.curSelCell = goodsClass;
            this.curCellItem = global.Proxys.ProxyGuJi.indexToRowCol(targetIdx);
            let proxy = global.Proxys.ProxyGuJi;
            let list = proxy.getHelpMapData();
            let item = list[index + 1];
            let obj: any = {};
            let position1 = cc.v2(0, 0);
            let position2 = cc.v2(0, 0);
            {
                let index = curIdx;
                let mapData = proxy.getMapData();
                let row = Math.floor((index) / mapData.colNum);
                let type = Math.floor((index) % mapData.colNum);

                position1.x = 130 / 2 + 130 * type;
                position1.y = 130 / 2 + 130 * row;
            }
            {
                let index = targetIdx;
                let mapData = proxy.getMapData();
                let row = Math.floor((index) / mapData.colNum);
                let type = Math.floor((index) % mapData.colNum);

                position2.x = 130 / 2 + 130 * type;
                position2.y = 130 / 2 + 130 * row;
            }
            obj.startPos = position1;//起点坐标
            obj.endPos = position2;//终点坐标
            obj.startID = curIdx;//起点id
            obj.endID = targetIdx;//终点id
            let cellStart = global.Proxys.ProxyGuJi.indexToRowCol(curIdx);//出发点
            let cellEnd = global.Proxys.ProxyGuJi.indexToRowCol(targetIdx);//终点
            obj.startCell = cellStart;//起点XY点
            obj.endCell = cellEnd;//终点XY点
            this.lineMapHelp = (obj);
                this.exeHelpcute(path, targetIdx,mainPlayer,item);
           
        }
    };
    exeHelpcute(path, targetIdx,mainPlayer,item) {
        //选中格动画
        let self = this;
        let ndSpine = mainPlayer.node.getChildByName('ndSpine');
        let ndSpine1 = mainPlayer.node.getChildByName('ndSpine1');
       
        let showDown = function () {
            let cellPos = self.curSelCell.node.getPosition();
            mainPlayer.node.setPosition(cellPos);
           
            mainPlayer.play('daiji', true);
            ndSpine.x = ndSpine1.x;
            let scale = Math.abs(ndSpine.scaleX);
            if (ndSpine.x < 0) {
                ndSpine.scaleX = -scale;
            } else {
                ndSpine.scaleX = scale;
            }

            self.playDigActionHelp(item);
        }
 
        ndSpine.x = 0;
        mainPlayer.play('zoulu', true);
        path= [global.Proxys.ProxyGuJi.indexToRowCol(targetIdx)];
        global.Instance.AudioEngine.replaySound('walk', true, 4);
        mainPlayer.findPaths(path, function () {
            showDown();   
            global.Instance.AudioEngine.stopSound('walk');
        });
        return;
    };
    playDigActionHelp(item) {
        let ndPlayer = this.ndMapHelp.getChildByName('ndPlayer');
        let mainPlayer:any = ndPlayer.getChildByName('mainPlayer').getComponent(global.CommonClass.MoveObject);
        mainPlayer.node.active = true;
        let ndSpine = mainPlayer.node.getChildByName('ndSpine');
        let ndSpine1 = mainPlayer.node.getChildByName('ndSpine1');
        let ndSpine2 = mainPlayer.node.getChildByName('ndSpine2');
        if (item.type == 7 || item.type == 8) {
            mainPlayer.play1('sawang', false, this.digEndHelp.bind(this));
        } else {
            ndSpine.active = false;
            ndSpine1.active = true;
            ndSpine2.active = false;
            if (item.type == 4) { //水产
                mainPlayer.play1('yuwang', false, this.digEndHelp.bind(this));
            } else if (item.type == 1) { //树
                mainPlayer.play1('kanshu', false, this.digEndHelp.bind(this));
            } else if (item.type == 2) {//草
                mainPlayer.play1('kanshu', false, this.digEndHelp.bind(this));
            } else if (item.type == 3) {//石头
                ndSpine.active = false;
                ndSpine1.active = true;
                mainPlayer.play('wakuang-ce', false, this.digEndHelp.bind(this));
            } else if (item.type == 5) {//废墟
                mainPlayer.play1('fangdajing-xiao', false, this.digEndHelp.bind(this));
            }
        }

    };
    digEndHelp() {
        {
            let proxy = global.Proxys.ProxyGuJi;
            let list = proxy.getHelpMapData();
            let item = list[this.index + 1];
            item.isOpen = true;
            if (item.type == 7 || item.type == 8)   //池塘或发光池塘
                item.type = -2;
            else
                item.type = -1;
            let goodsCell: any = this.ndMapHelp.getChildByName('ndGoods' + (item.idx).toString());
            if (goodsCell != null) {
                let cellClass = goodsCell.getComponent(global.CommonClass.GuJiGoodsItem);
                cellClass.setItem(item);
            }
        }
        let self = this;
        let ndPlayer = this.ndMapHelp.getChildByName('ndPlayer');
        let mainPlayer:any = ndPlayer.getChildByName('mainPlayer').getComponent(global.CommonClass.MoveObject);
        mainPlayer.node.active = true;
        mainPlayer.node.active = true;
        mainPlayer.play('daiji', true);
        let endCall = function () {
            setTimeout(() => {
                self.reflashHelp(self.index);
            }, 2000);
        }
        if (this.index == 2) {

            {
                let gains = [
                    { itemID: 500030029, itemNum: 1, type: 0 },
                    { itemID: 500030034, itemNum: 1, type: 0 },
                    { itemID: 500030042, itemNum: 1, type: 0 }
                ];
                let clickAnim = global.Manager.UIManager.getResident('clickAnim');
                clickAnim.showReflash(true);
                this.DabaoisShow1 = true;
                global.Manager.UIManager.open('DlgTreasureDrop', null, function (panel) {
                    panel.show(gains);
                    setTimeout(() => {
                        global.Manager.UIManager.close('DlgTreasureDrop');
                        clickAnim.showReflash(false);
                        self.checkAndMakeDirectHelpPath(endCall); 
                    }, 2000);
                });
            }

        } else {
            global.CommonClass.UITip.showTipTxt('探险无发现', global.Enum.TipType.TIP_BAD);

            self.checkAndMakeDirectHelpPath(endCall);
        }
    };
    checkAndMakeDirectHelpPath(callback) {
       
        let proxy = global.Proxys.ProxyGuJi;
        let list = proxy.getHelpMapData();
        if(this.DabaoisShow1 == false){
            let pathColorType = list[this.index].pathColorType;
            let obj: any = {};
            obj = this.lineMapHelp;
            obj.pathColorType = pathColorType;
    
            let ndPath = this.node.getChildByName('ndPath');
    
            let self = this;
    
            let flyFont = function () {
                let uiGuJi = global.Manager.UIManager.get('UIGuJi');
                if (uiGuJi) {
                    if (!self.DabaoisShow1) {
                        let ndPlayer = self.ndMapHelp.getChildByName('ndPlayer');
                        let mainPlayer:any = ndPlayer.getChildByName('mainPlayer').getComponent(global.CommonClass.MoveObject);
                       
                        let playerPos = mainPlayer.node.convertToWorldSpaceAR(cc.v2(0, 0));
                        let startPos = uiGuJi.node.convertToNodeSpaceAR(playerPos);
    
                        // let nearFarFlag = global.Proxys.ProxyGuJi.getNearFarFlag();
                        uiGuJi.flyNearFar(pathColorType, startPos, callback);
                    } else {
                        uiGuJi.flyNearisShow();
                    }
                };
            }
            {
                let startClass = this.getGoodsClassByIndexHelp(obj.startID);
                startClass.showSelect(true);
                let endClass = this.getGoodsClassByIndexHelp(obj.endID);
                endClass.showSelect(true);
            }
            this.makeDirectPath(obj, ndPath, 1, 1, flyFont);
        }else{
            this.lineMapHelp = null;
            if (callback)
                callback();
        }
        
       

        return true;
    };
    getGoodsClassByIndexHelp(index) {
        let cellClass = null;
        let cell: any = this.ndMapHelp.getChildByName('ndGoods' + (index).toString());
        if (cell != null)
            cellClass = cell.getComponent(global.CommonClass.GuJiGoodsItem);
        return cellClass;
    };
    btnHelp(){
        this.helpNode.active = false;  
    };
    createCell(index) {
        let proxy = global.Proxys.ProxyGuJi;
        let mapData = proxy.getMapData();
        let zorder = (1000 - index);
     

        let row = Math.floor((index) / mapData.colNum);
        let type = Math.floor((index) % mapData.colNum);
        let data = mapData.data;
        let item = data[index];
        
        let cellSize = this.mapGoodsItem.getContentSize();
        let position = cc.v2(0, 0);
        if (this.mapGoodsItem != null && item) {
            //goods item
            let newGood: any = global.Proxys.ProxyGuJi.get();
            this.ndMapGoods.addChild(newGood);
            newGood.setPosition(position);
            let nameGoods = 'ndGoods' + index.toString();
            newGood.name = (nameGoods);
            newGood.tagEx = (index);

            newGood.zIndex = (zorder);
            newGood.active = true;
            position.x = cellSize.width / 2 + cellSize.width * type;
            position.y = cellSize.height / 2 + cellSize.height * row ;
            newGood.setPosition(position);
            if(newGood.getChildByName('lblGoods'))
            newGood.getChildByName('lblGoods').getComponent(cc.Label).string = 'x '+item.x+' y '+item.y;
            let goodsClass = newGood.getComponent(global.CommonClass.GuJiGoodsItem)
            goodsClass.setItem(item);
            goodsClass.setIsAnimation(false);
        }
    };
    //加载地貌
    createCells() {
        let proxy = global.Proxys.ProxyGuJi;

        let mapData = proxy.getMapData();
        let itemNum = mapData.rowNum * mapData.colNum;

        this.mapGoodsItemPos = this.mapGoodsItem.getChildByName('ndItem').getPosition();

        this.mapGoodsItem.active = false;
        this.bombItem.active = false;

           
        let loadCount = 0;
        global.Instance.Log.debug('GuJiMapNew createCells mapData 地图数据', mapData);
       
        for (let index = 0; index < itemNum; ++index) {
            
            this.createCell(index);
            ++loadCount;
            if (loadCount >= itemNum) {
                setTimeout(() => {
                    this.onLoadCellFinish(); 
                }, 200);  
            }
        }
    };

    onLoadCellFinish() {
        this.initPlayer();
        let panel = global.Manager.UIManager.getPersistUI('UIProgress');
        if (panel != null) {
            panel.playBalloonAction();
        }
        global.Module.GameData.setDropInstance(this.mainPlayer.node.getChildByName('start'));
        cc.director.getScheduler().schedule(this.selfUpdate, this, 0.1, cc.macro.REPEAT_FOREVER, 0, false);
    };

    isObjectInCell(objNode, cell) {
        if (cell != null) {
            let worldPoint = objNode.convertToWorldSpaceAR(cc.v2(0, 0));
            if (global.CommonClass.Geometry.checkSlantingSpIsInPoint(worldPoint, cell, 1, 1)) {
                return true;
            }
        }
        return false;
    };

    getPickItem(worldPoint) {
        let proxy = global.Proxys.ProxyGuJi;
        let mapData = proxy.getMapData();
        let itemNum = mapData.rowNum * mapData.colNum;
        for (let i = 0; i < itemNum; ++i) {
            let item = global.Proxys.ProxyGuJi.getItem(i);
            let cellClass = null;
            if (item) {
                let cell: any = this.ndMapGoods.getChildByName('ndGoods' + i.toString());
                if (cell != null)
                    cellClass = cell.getComponent(global.CommonClass.GuJiGoodsItem);

            }
            if (cellClass != null) {
                if (cellClass.isPicked(worldPoint)) {
                    return cellClass.node;
                }
            }
        }
        return null;
    };

    pickItem(idx) {
        let item = global.Proxys.ProxyGuJi.getItem(idx);
        item.isOpen = true;
        if (item.type == 7 || item.type == 8)   //池塘或发光池塘
            item.type = -2;
        else
            item.type = -1;
        let goodsCell: any = this.ndMapGoods.getChildByName('ndGoods' + (idx).toString());
        if (goodsCell != null) {
            let cellClass = goodsCell.getComponent(global.CommonClass.GuJiGoodsItem);
            cellClass.setItem(item);
        }
    };

    getGoodsByIndex(index): any {
        let itemGood: any = this.ndMapGoods.getChildByName('ndGoods' + index.toString());
        return itemGood.getComponent(global.CommonClass.GuJiGoodsItem);
    };

    openItem(idx, isRunAction) {
        this.createCell(idx);
        let goodsCell: any = this.ndMapGoods.getChildByName('ndGoods' + (idx).toString());
        if (goodsCell != null) {
            let cellClass = goodsCell.getComponent(global.CommonClass.GuJiGoodsItem);
            cellClass.openItem(isRunAction);
        }
    };
    getCell(idx) {
        return this.ndMapGoods.getChildByName('ndGoods' + (idx).toString());
    };

    getCellByPathCell(cell) {
        let proxy = global.Proxys.ProxyGuJi;
        let mapData = proxy.getMapData();
        let idx = cell.y * mapData.colNum + cell.x;
        return this.ndMapGoods.getChildByName('ndGoods' + (idx).toString());
    };

    getGoodsClassByIndex(index) {
        let cellClass = null;
        let cell: any = this.ndMapGoods.getChildByName('ndGoods' + (index).toString());
        if (cell != null)
            cellClass = cell.getComponent(global.CommonClass.GuJiGoodsItem);
        return cellClass;
    };

    reflashCellItem(index) {
        let cellClass = this.getGoodsByIndex(index);
        let item = global.Proxys.ProxyGuJi.getItem(index);

        if (cellClass != null && item != null)
            cellClass.setItem(item);
    };
    //人物走动动画     <<<人物>>>
    runCellAction(cell) {
        let goodsItem = cell.getChildByName('ndItem');
        goodsItem.stopAllActions();
        goodsItem.setPosition(this.mapGoodsItemPos);
        let goodsAct1 = cc.moveTo(0.2, cc.v2(this.mapGoodsItemPos.x, this.mapGoodsItemPos.y - 30));
        let goodsBack1 = cc.moveTo(0.2, cc.v2(this.mapGoodsItemPos.x, this.mapGoodsItemPos.y));
        let goodsAct2 = cc.moveTo(0.1, cc.v2(this.mapGoodsItemPos.x, this.mapGoodsItemPos.y - 5));
        let goodsBack2 = cc.moveTo(0.1, cc.v2(this.mapGoodsItemPos.x, this.mapGoodsItemPos.y));
        let seq1 = cc.sequence(goodsAct1, goodsBack1, goodsAct2, goodsBack2);
        goodsItem.runAction(seq1);
        let idx = cell.tagEx;
        let ndItem = null;
        ndItem = this.ndMapGoods.getChildByName('ndGoods' + idx.toString());
        if (ndItem != null) {
            let position = ndItem.getPosition();
            let cellAct1 = cc.moveTo(0.2, cc.v2(position.x, position.y - 30));
            let cellBack1 = cc.moveTo(0.2, cc.v2(position.x, position.y));
            let cellAct2 = cc.moveTo(0.1, cc.v2(position.x, position.y - 5));
            let cellBack2 = cc.moveTo(0.1, cc.v2(position.x, position.y));
            let seq2 = cc.sequence(cellAct1, cellBack1, cellAct2, cellBack2);
            ndItem.stopAllActions();
            ndItem.runAction(seq2);
        }else {
            global.Instance.Log.debug('', 'xxxsw');
        }
    };

    getStandIdx() {
        if (this.standCell != null) {
            let index = this.standCell.tagEx;
            return index;
        }
        return null;
    };
    //人物走动位置
    updateStandCell(dt) {
        //人物走动位置
        let point = this.mainPlayer.node.getPosition();
        if (point) {
            let cell = {
                x: Math.round((point.x - 75) / 130),
                y: Math.round((point.y - 75) / 130),
            }
            let targetCell = this.getCellByPathCell(cell)
            if (targetCell) {
                this.ndPlayer.zIndex = targetCell.zIndex + 2;
            }
        }
      
    };
    selfUpdate(dt) {
        this.updateStandCell(dt);
    };
    checkAndMakeDirectPath(callback,actionChange,actionValue) {
        let uiGuJi = global.Manager.UIManager.get('UIGuJi');
        if (uiGuJi && actionChange != 0) {
            uiGuJi.reflashMagic(-actionChange, actionValue);
        };
        global.Module.TaskData.setIsAgree(true);
        if(this.DabaoisShow == false){
            let pathColorType = this.getCurPathColor();
            let lastIdx = this.lineMap.length - 1;
            let obj: any = {};
            obj = this.lineMap[lastIdx];
            obj.pathColorType = pathColorType;
    
            let ndPath = this.node.getChildByName('ndPath');
    
            let self = this;
    
            let flyFont = function () {
                let uiGuJi = global.Manager.UIManager.get('UIGuJi');
                if (uiGuJi) {
                    if (!self.DabaoisShow) {
                        let playerPos = self.mainPlayer.node.convertToWorldSpaceAR(cc.v2(0, 0));
                        let startPos = uiGuJi.node.convertToNodeSpaceAR(playerPos);
    
                        let nearFarFlag = global.Proxys.ProxyGuJi.getNearFarFlag();
                        uiGuJi.flyNearFar(nearFarFlag, startPos, callback);
                    } else {
                        uiGuJi.flyNearisShow();
                    }
                };
            }
            {
                let startClass = this.getGoodsClassByIndex(obj.startID);
                startClass.showSelect(true);
                let endClass = this.getGoodsClassByIndex(obj.endID);
                endClass.showSelect(true);
            }
            this.makeDirectPath(obj, ndPath, 1, 1, flyFont);
        }
        
        if (callback)
            callback();

        return true;
    };
    moveScreen(obj) {
        let windowSize = cc.winSize;//推荐  原因  短
        let widthSize = windowSize.width;
        let heightSize = windowSize.height;
        let endCellid = global.Proxys.ProxyGuJi.getCanidx(obj.endCell);
        let startCellid = global.Proxys.ProxyGuJi.getCanidx(obj.startCell);
        let endCell = this.getGoodsByIndex(endCellid);
        let startCell = this.getGoodsByIndex(startCellid);
        let endPos = endCell.node.convertToWorldSpaceAR(cc.v2(0, 0));
        let startPos = startCell.node.convertToWorldSpaceAR(cc.v2(0, 0));
        if (endPos.x > widthSize || endPos.x < 0 || startPos.x > widthSize || startPos.x < 0 || endPos.y > heightSize || endPos.y < 0 || startPos.y > heightSize || startPos.y < 0) {
            let dragLayer = global.CommonClass.DragLayer.getDragLayer('GuJiMapNew');
            if (dragLayer != null) {
                dragLayer.scaleLayer(1);
                endPos = endCell.node.convertToWorldSpaceAR(cc.v2(0, 0));
                let distanceW = 0;
                let distanceH = 0;
                if (endPos.x < 0) {
                    distanceW = Math.abs(endPos.x) + 100;
                } else if (endPos.x > 1134) {
                    distanceW = 1284 - endPos.x;
                }
                if (endPos.y < 0) {
                    distanceH = Math.abs(endPos.y) + 100;
                } else if (endPos.y > 750) {
                    distanceH = 700 - endPos.y;
                }
                dragLayer.delayMove(distanceW, distanceH, 0.5, function (event) {
                    startPos = startCell.node.convertToWorldSpaceAR(cc.v2(0, 0));
                    distanceW = 0;
                    distanceH = 0;
                    if (startPos.x < 0) {
                        distanceW = Math.abs(startPos.x) + 100;
                    } else if (startPos.x > 1134) {
                        distanceW = 1284 - startPos.x;
                    }
                    if (startPos.y < 0) {
                        distanceH = Math.abs(startPos.y) + 100;
                    } else if (startPos.y > 750) {
                        distanceH = 700 - startPos.y;
                    }
                    dragLayer.delayMove(distanceW, distanceH, 0.5);
                });
            }
        }
    };

    digEnd() {
        if (this.digMsg == null){
            this.playDigAction(this.cellItem);
            return;
        }
        let self = this;
        this.mainPlayer.node.active = true;
        this.mainPlayer.play('daiji', true);
        if (this.digMsg.targetIdx != null)
            this.pickItem(this.digMsg.targetIdx);

        let robId = this.digMsg.robId;
        let actionChange = self.digMsg.actionChange;
        let actionValue = self.digMsg.actionValue;
        
        global.Instance.Log.debug("宝藏位置", this.digMsg)
        if (robId > 1) {
            let data = global.Manager.DBManager.findData('CollectionEvent', 'ID', robId);
            this.lockOp(true);
            let endCall = function () {
                self.lockOp(false);
            }
            if (data != null) {
                if (data.type == 3) { //事件
                    global.CommonClass.UITip.showTipTxt(data.name, global.Enum.TipType.TIP_BAD);
                    self.checkAndMakeDirectPath(endCall,actionChange,actionValue);
                }else if (data.type == 11 || data.type == 12 || data.type == 13 || data.type == 14 || data.type == 15 || data.type == 16) {   //陷阱
                    // let isFullScreen = false;//global.Proxys.ProxyGuJi.getHurtCount(robId) <= 0;
                    global.Proxys.ProxyGuJi.addHurtCount(robId);
                    this.totalData.trapNum++;//统计踩中陷阱次数
                    global.Manager.UIManager.open('UIGuJiEffect', null, function (panel) {
                        global.CommonClass.Functions.setNodePosToTarget(panel.node, self.mainPlayer.node, cc.v2(0, 50));
                       
                        self.ndSpine2.opacity = 255;
                        panel.play(robId, function (isShow) {
                            if(isShow){
                                self.checkAndMakeDirectPath(endCall,actionChange,actionValue);
                                self.mainPlayer.node.active = true;
                                {
                                    self.ndSpine.active = true;
                                    self.ndSpine1.active = false;
                                    self.ndSpine2.active = false;
                                    self.ndSpine2.opacity = 0;
                                    self.ndSpine.getComponent('sp.Skeleton').animation = 'daiji';
                                }
                            }else{
                                self.checkAndMakeDirectPath(endCall,actionChange,actionValue);
                                self.ndSpine.active = false;
                                self.ndSpine1.active = false;
                                self.ndSpine2.active = true;
                                self.ndSpine2.getComponent('sp.Skeleton').animation = 'animation';
                            } 
                        });
                    });
                    global.Instance.AudioEngine.stopSound('walk');
                    global.Instance.AudioEngine.replaySound('gujihurt', false, null);
                }
                else if (data.type == 1||data.type == 2) { //无发现
                    let callback = function () {
                        self.ndpeng.active = false;
                        self.ndSpine.active = true;
                        self.ndSpine.getComponent('sp.Skeleton').animation = 'daiji';

                    }
                    self.ndSpine.active = false;
                    self.ndSpine2.active = false;
                    self.ndSpine1.active = false;
                    self.ndpeng.active = true;
                    let animation = self.ndpeng.getComponent('sp.Skeleton');
                    animation.animation = 'animation';
                    animation.setCompleteListener(() => {
                        callback();
                    });
                    self.checkAndMakeDirectPath(endCall,actionChange,actionValue);
                }
                else if (data.type >= 5) {

                    let treasure = this.digMsg.treasure;
                    if (treasure == 0) {
                        let showItemDrop = function () {
                            global.Manager.UIManager.open('DlgGuJiDrop', null, function (panel) {
                                panel.setItem(data.ID, treasure);
                                panel.setCloseCB(function () {
                                    global.Manager.UIManager.close('UIGuJiGetShow');
                                    self.checkAndMakeDirectPath(endCall,actionChange,actionValue);
                                   
                                });
                            });
                        };

                        showItemDrop();
                    } else {
                        let gains = [];
                        let getItems = this.digMsg.itemId;
                        for (let i = 0; i <= getItems.length; ++i) {
                            let itemID = getItems[i];
                            if (itemID != null) {
                                let ganisItem = { itemID: itemID, itemNum: 1, type: 0 };
                                gains.push(ganisItem);
                            }
                        }
                        this.DabaoisShow = true;
                        let data = global.Module.TaskData.getHasAcceptTaskData();
                        if (data) {
                            let contentData = global.Proxys.ProxyGuJi.getContentData();

                            if (data.state == 1 && (data.taskId == 10003)&&contentData.ID == 2) {
                                let date = JSON.parse(cc.sys.localStorage.getItem('10003'));
                                if (date == null)
                                    date = [];
                                if (date.indexOf(5) == -1)
                                    date.push(5);
                                if (date.indexOf(4) != -1 ) {
                                    global.Instance.MsgPools.send('robCompleteGuide', {}, null);
                                }
                                cc.sys.localStorage.setItem('10003', JSON.stringify(date));
                            }
                        }
                        global.Manager.UIManager.open('DlgTreasureDrop', null, function (panel) {
                            panel.show(gains);
                            panel.setCloseCB(function () {
                                self.checkAndMakeDirectPath(endCall,actionChange,actionValue);
                            })
                        });
                    }
                }
            }
        } else {
            global.CommonClass.UITip.showTipTxt('探险无发现', global.Enum.TipType.TIP_BAD);
            let endCall = function () {
                self.lockOp(false);
            }
            self.checkAndMakeDirectPath(endCall,actionChange,actionValue);
        }
        this.digMsg = null;
    };

    playDigAction(item) {
        this.mainPlayer.node.active = true;
        if (item.type == 7 || item.type == 8) {
            this.mainPlayer.play1('sawang', false, this.digEnd.bind(this));
        } else {
            this.ndSpine.active = false;
            this.ndSpine1.active = true;
            this.ndSpine2.active = false;
            if (item.type == 4) { //水产
                this.mainPlayer.play1('yuwang', false, this.digEnd.bind(this));
            } else if (item.type == 1) { //树
                this.mainPlayer.play1('kanshu', false, this.digEnd.bind(this));
            } else if (item.type == 2) {//草
                this.mainPlayer.play1('kanshu', false, this.digEnd.bind(this));
            } else if (item.type == 3) {//石头
                this.ndSpine.active = false;
                this.ndSpine1.active = true;
                this.mainPlayer.play('wakuang-ce', false, this.digEnd.bind(this));
            } else if (item.type == 5) {//废墟
                this.mainPlayer.play1('fangdajing-xiao', false, this.digEnd.bind(this));
            }
        }

    };
    /**
     * 显示工具
     * @param {*} path 
     * @param {*} targetIdx 
     * @returns 
     */
    execute(path, targetIdx) {
        //选中格动画
        let self = this;
        let showDown = function () {
            self.curSelCell.showSelect(true);
            self.targetIdx = -1;
            self.targetIdx = targetIdx;
            let cellPos = self.curSelCell.node.getPosition();
           
            self.ndPlayer.zIndex = 9999;
            
            self.mainPlayer.node.setPosition(cellPos);
           
            self.mainPlayer.play('daiji', true);
            self.ndSpine.x =  self.ndSpine1.x;
            let scale = Math.abs(self.ndSpine.scaleX);
            if (self.ndSpine.x < 0) {
                self.ndSpine.scaleX = -scale;
            } else {
                self.ndSpine.scaleX = scale;
            }
            self.toolNodeClick();
        }
 
        this.ndSpine.x = 0;
        this.mainPlayer.play('zoulu', true);
        path= [global.Proxys.ProxyGuJi.indexToRowCol(targetIdx)];
        global.Instance.AudioEngine.replaySound('walk', true, 4);
        this.mainPlayer.findPaths(path, function () {
            showDown();   
            global.Instance.AudioEngine.stopSound('walk');
        });
        return;
    };
    toolNodeClick() {
        this.toolNodeBtn.active = false;
        if (this.targetIdx == -1)
            return;
        let targetIdx = this.targetIdx;
        let goodsClass = this.getGoodsClassByIndex(targetIdx);
        goodsClass.showSelect(false);
        this.curSelCell = null;
        let isPicked = global.Proxys.ProxyGuJi.getIsPicked(targetIdx);
        let canPick = global.Proxys.ProxyGuJi.getCanPick(targetIdx);
        global.Instance.Log.debug("isPicked", isPicked);
        global.Instance.Log.debug("canPick", canPick);
        this.cellItem = null;
        if (!isPicked && canPick) {
            this.lockOp(true);
            let position = global.Proxys.ProxyGuJi.indexToServerPos(targetIdx);
            let data = {
                skillId: 1,
                targetX: position.x,
                targetY: position.y,
                robFlag: true
            };
            this.cellItem = global.Proxys.ProxyGuJi.getItem(targetIdx);
            this.curDigType = this.cellItem.type;
            global.Module.GameData.openLockSocketOp(false);
            global.Module.TaskData.setIsAgree(false);
            this.playDigAction(this.cellItem);
            //宝藏寻宝
            let self = this;
            global.Instance.MsgPools.send('robUseSkill', data, function (msg) {
                if (msg.errorID == 0) {
                   // 63表示格子是空，是树林
                    self.storagelineMap();//记录行走路线
                    self.totalData.totalNum++;//统计挖宝次数次数
                    // if (self.totalData.totalNum == 3) {//远近回顾的箭头三步后出
                    //     let uiGuJi = global.Manager.UIManager.get('UIGuJi');
                    //     if (uiGuJi)
                    //         uiGuJi.threeNear();
                    // }
                 
 
                    global.Instance.Log.debug('宝藏寻宝数据', msg);
                    self.cellItem.stage = 1;
                    self.digMsg = msg;
                    self.digMsg.targetIdx = targetIdx;
                    let itemIdArr = msg.itemId;
                    for (let i = 0; i < itemIdArr.length; i++) {
                        let itemID = itemIdArr[i];
                        let itemData = self.totalData.itemArr[itemID];
                        if (itemData) {
                            if (itemID == 2) {
                                self.totalData.itemArr[itemID].contNum += 1000;
                            } else {
                                self.totalData.itemArr[itemID].contNum += 1;
                            }
                        } else {
                            let data = { ID: itemID, contNum: 1 };
                            if (itemID == 2) {
                                data.ID = 1;
                                data.contNum = 1000;
                            }
                            self.totalData.itemArr[itemID] = data;
                        }
                    }
                    global.Module.MainPlayerData.setMagic(msg.actionValue);
                }
            });
        }
        global.Proxys.ProxyGuJi.openItem(targetIdx);
        global.Proxys.ProxyGuJi.openArround(targetIdx);
    };
    /**
     * 设置远近
     */
    getCurPathColor() {
        let nearFarFlag = global.Proxys.ProxyGuJi.getNearFarFlag();
        /// 1:远了, 0:没变, -1:近了 
        this.pathColorType = nearFarFlag;
        return nearFarFlag;
    };
    //记录行走路线
    storagelineMap() {
        let curIdx = this.routeMap[0].curIdx;
        let targetIdx = this.routeMap[this.routeMap.length - 1].targetIdx;
        let endCell = this.getGoodsByIndex(targetIdx);
        let startCell = this.getGoodsByIndex(curIdx);
        let startPos = startCell.node.getPosition();
        let endPos = endCell.node.getPosition();
        let obj: any = {};
        obj.startPos = startPos;//起点坐标
        obj.endPos = endPos;//终点坐标
        obj.startID = curIdx;//起点id
        obj.endID = targetIdx;//终点id
        let cellStart = global.Proxys.ProxyGuJi.indexToRowCol(curIdx);//出发点
        let cellEnd = global.Proxys.ProxyGuJi.indexToRowCol(targetIdx);//终点
        obj.startCell = cellStart;//起点XY点
        obj.endCell = cellEnd;//终点XY点
        this.lineMap.push(obj);
        this.routeMap = [];
    };
    //记录行走id
    routelineMap(targetIdx) {
        let curIdx = 0;
        if (this.lineMap.length == 0)
            curIdx = this.getStandIdx();
        else
            curIdx = this.lineMap[this.lineMap.length - 1].endID;
        let obj: any = {};
        obj.curIdx = curIdx;
        obj.targetIdx = targetIdx;
        this.routeMap.push(obj);
    };
    /**
     * 探险
     * @param {*} targetIdx 终点
     */
    gotoTarget(targetIdx) {
        if (this.lineMap.length != 0) {
            let lastIdx = this.lineMap.length - 1;
            let obj: any = {};
            obj = this.lineMap[lastIdx];
            let startClass = this.getGoodsClassByIndex(obj.startID);
            startClass.showSelect(false);
            let endClass = this.getGoodsClassByIndex(obj.endID);
            endClass.showSelect(false);
        }
       
        let curIdx = this.getStandIdx();//起点
        let ndPath = this.node.getChildByName('ndPath');
        ndPath.removeAllChildren();
        this.routelineMap(targetIdx);//记录行走id
        if (curIdx != null) {
            if (this.curSelCell)
                this.curSelCell.showSelect(false);
            let isMagicEnough = global.Proxys.ProxyGuJi.isMagicEnough(targetIdx);
            if (isMagicEnough) {
                let dragLayer = global.CommonClass.DragLayer.getDragLayer('GuJiMapNew');
                if (dragLayer != null) {
                    let scale = dragLayer.getItemScale();
                    if (scale < 0.6) {
                        dragLayer.scaleLayer(0.6);
                    }
                    let curCell = this.ndMapGoods.getChildByName('ndGoods' + targetIdx.toString());
                    if (curCell != null) {
                        let endPos = curCell.convertToWorldSpaceAR(cc.v2(0, 0));
                        let distanceW = 100 - endPos.x;
                        let distanceH = 300 - endPos.y;
                        dragLayer.delayMove(distanceW, distanceH, 0.5);
                    }
                   
                }
                let path = global.Proxys.ProxyGuJi.searchdPath(curIdx, targetIdx);//路线
                let goodsClass = this.getGoodsClassByIndex(targetIdx);
                this.curSelCell = goodsClass;
                this.curCellItem =  global.Proxys.ProxyGuJi.indexToRowCol(targetIdx);
                this.execute(path, targetIdx);
            } else {
                global.CommonClass.UITip.showTipTxt('气力不足', global.Enum.TipType.TIP_BAD);
            }
        }
    };

    isCellInScreen(index) {
        let ndGoodItem = null;
        ndGoodItem = this.ndMapGoods.getChildByName('ndGoods' + (index).toString());
        if (ndGoodItem != null) {
            let worldPos = ndGoodItem.convertToWorldSpaceAR(cc.v2(0, 0));
            let root = global.CommonClass.Functions.getRoot();
            let rootSize = root.getContentSize();
            let rootPos = root.getPosition();
            let anchor = root.getAnchorPoint();
            let minX = rootPos.x - rootSize.width * anchor.x;
            let maxX = rootPos.x + rootSize.width * anchor.x;
            let minY = rootPos.y - rootSize.height * anchor.y;
            let maxY = rootPos.y + rootSize.height * anchor.y;
            let isIn = (worldPos.x >= minX && worldPos.x <= maxX && worldPos.y >= minY && worldPos.y <= maxY);
            return isIn;
        }
        return false;
    };
     
    adjustEdge(cell, callBack) {
        let root = global.CommonClass.Functions.getRoot();
        let size = root.getContentSize();

        let edgeSpaceLW = 100;
        let edgeSpaceRW = 100;
        let edgeSpaceDH = 100;
        let edgeSpaceUH = 100;

        let distanceW = 0;
        let distanceH = 0;

        let moveNum = 400;

        let position = cell.node.getPosition();
        let worldPos = cell.node.convertToWorldSpaceAR(cc.v2(0, 0));
        if (worldPos.x < edgeSpaceLW)
            worldPos.x = moveNum;
        else if (worldPos.x > size.width - edgeSpaceRW)
            worldPos.x = size.width - moveNum;

        if (worldPos.y < edgeSpaceDH)
            worldPos.y = moveNum;
        else if (worldPos.y > size.height - edgeSpaceUH)
            worldPos.y = size.height - moveNum;

        let newPos = this.ndMapGoods.convertToNodeSpaceAR(worldPos);
        distanceW = newPos.x - position.x;
        distanceH = newPos.y - position.y;

        if (Math.abs(distanceH) > 1 || Math.abs(distanceW) > 1) {
            let dragLayer = global.CommonClass.DragLayer.getDragLayer('GuJiMapNew');
            if (dragLayer)
                dragLayer.delayMove(distanceW, distanceH, 1);
            return true;
        }
        return false;
    };

    lockOp(isLock) {
        this.lockMove = isLock;
    };

    makePathLines() {
        let ndPaths = this.node.getChildByName('ndPaths');
        let isMake = ndPaths.children.length == 0;
        this.isMode = isMake;
        if (isMake) {
            if (this.lineMap.length == 0){
                this.isMode = false;
                return false;
            }
               
            for (let key in this.lineMap) {
                let obj = this.lineMap[key];
                this.makeDirectPath(obj, ndPaths, 0.5, -1, null);
            }
        }else{
            ndPaths.removeAllChildren();
        }
        return isMake;
    };
    makeDirectPath(pathObj, parent, scale, number, callback) {
        let startPos = pathObj.startPos;
        let endPos = pathObj.endPos;
        if (!scale)
            scale = 1;

        let pathItem = this.node.getChildByName('pathItemD');

        let line = endPos.sub(startPos);
        //获得这个向量的长度
        let lineLength = line.mag();
        //设置虚线中每条线段的长度
        let length = 30;
        //根据每条线段的长度获得一个增量向量
        let increment = line.normalize().mul(length);
        //确定现在是画线还是留空的bool
        let drawingLine = true;
        //临时变量
        let pos = startPos.clone();
        let pathColorType = this.pathColorType;//远近
        if (pathObj.pathColorType != null)
            pathColorType = pathObj.pathColorType;
        let makeItems = [];
        for (; lineLength > length; lineLength -= length) {
            let newItem = cc.instantiate(pathItem);
            newItem.active = true;

            makeItems.push(newItem);
            //画线
            if (drawingLine) {
                let pathL = newItem.getChildByName('pathL');
                let pathNew = newItem.getChildByName('pathNew');
                pathL.active = true;
                pathNew.active = false;
                if (pathColorType == 1) {
                    pathL.getComponent(cc.Sprite).spriteFrame = this.pathLAtlasArr[0];
                } else if (pathColorType == -1) {
                    pathL.getComponent(cc.Sprite).spriteFrame = this.pathLAtlasArr[1];
                } else {
                    pathL.getComponent(cc.Sprite).spriteFrame = this.pathLAtlasArr[2];
                }
                newItem.setPosition(pos);
                parent.addChild(newItem, 77);
                pos.addSelf(increment);
            }
            //留空
            else {
                pos.addSelf(increment);
            }
            //取反
            drawingLine = true;//!drawingLine;
        }

        //最后一段
        if (drawingLine) {
            let newItem = cc.instantiate(pathItem);
            newItem.active = true;
            newItem.setPosition(pos);
            let pathL = newItem.getChildByName('pathL');
            let pathNew = newItem.getChildByName('pathNew');
            pathL.active = false;
            pathNew.active = true;
           
            if (pathColorType == 1) {
                pathNew.getComponent(cc.Sprite).spriteFrame = this.pathNewAtlasArr[0];
            } else if (pathColorType == -1) {
                pathNew.getComponent(cc.Sprite).spriteFrame = this.pathNewAtlasArr[1];
            } else {
                pathNew.getComponent(cc.Sprite).spriteFrame = this.pathNewAtlasArr[2];
            }
            parent.addChild(newItem, 77);
            makeItems.push(newItem);
        }
        if (makeItems.length > 0) {
            let angle = this.calculateAngle(makeItems[0].position, makeItems[makeItems.length - 1].position);
            for (let i = 0; i < makeItems.length; i++) {
                makeItems[i].angle = -angle;
            }
        }
        this.playPathAction(makeItems, number, callback);
    };
    calculateAngle(first, second) {
        let len_y = second.y - first.y;
        let len_x = second.x - first.x;
        let tan_yx = Math.abs(len_y / len_x);
        let temp = Math.atan(tan_yx) * 180 / Math.PI;
        let angle = 0;
        if (len_y > 0 && len_x < 0) {
            angle = temp - 90;
        }
        else if (len_y > 0 && len_x > 0) {
            angle = -temp + 90;
        }
        else if (len_y < 0 && len_x < 0) {
            angle = -temp - 90;
        }
        else if (len_y < 0 && len_x > 0) {
            angle = temp + 90;
        }
        else if (len_y == 0 && len_x != 0) {
            angle = len_x < 0 ? -90 : 90;
        }
        else if (len_x == 0 && len_y != 0) {
            angle = len_y < 0 ? 180 : 0;
        }
        return angle;
    };
    playPathAction(pathItems, number, callback) {
        let time = 0;
        let total = pathItems.length;
        let count = 0;

        for (let key in pathItems) {
            let pathItem = pathItems[key];
            pathItem.opacity = 0;
            if(total <= 10){
                time += 0.1;
            }else if (total <= 30) {
                time += 0.05;
            } else {
                time += 0.03;
            }
            let delayTime = cc.delayTime(time);
            let endFun = function () {
                pathItem.opacity = 255;
                count++;
                if (count >= total) {
                    if (callback)
                        callback();
                }
            }
            let endCall = cc.callFunc(endFun);
            let seq = cc.sequence(delayTime, endCall);
            pathItem.stopAllActions();
            pathItem.runAction(seq);
        }
    };
    //点击位置逻辑
    onDragEvent(event) {
        if (event.type == cc.Node.EventType.TOUCH_START) {
            let ndPath = this.node.getChildByName('ndPath').children;
            for (let i = 0; i < ndPath.length; i++)
                if (ndPath[i])
                    ndPath[i].opacity = 255;
            if (this.lockMove) {
                return false;
            }
            this.clickStartPos = event.getLocation();
        }
        else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            
        }
        else if (event.type == cc.Node.EventType.TOUCH_END) {
            if (this.lockMove||this.isMode == true) {
                return false;
            } else {
               
                let point = event.getLocation();
                let cell = this.getPickItem(point);
                if (cell != null) {
                    let targetIdx = cell.tagEx;
                    let itemClass = cell.getComponent(global.CommonClass.GuJiGoodsItem);
                    let itemType = itemClass.getItemType();
                  
                    global.Instance.Log.debug("土地类型 状态 ",itemType);
                    if (global.Proxys.ProxyGuJi.getIsObstacle(targetIdx)) {
                        global.CommonClass.UITip.showTipTxt('不能移动', global.Enum.TipType.TIP_BAD);
                    } else if (itemType==1||itemType==2||itemType==3||itemType==4|| itemType == 5) {
                        {

                            this.btnHelp();
                            this.toolSprite.spriteFrame = this.toolAtlasArr[itemType - 1];
                            if (itemType == 5)
                                this.toolSprite.node.scale = 0.2;
                            else
                                this.toolSprite.node.scale = 1;
                            this.toolNodeBtn.active = true;//刷新出工具
                            this.toolNodeBtn.zIndex = 9999;
                            let goodsClass = this.getGoodsClassByIndex(targetIdx);
                            let cellPos = goodsClass.node.getPosition();
                            this.toolNodeBtn.setPosition(cellPos);
                            this.ndSpine2.active = false;//任务隐藏
                        }
                        this.gotoTarget(targetIdx);
                        
                    } else {
                        //-1 99 不可探险
                    }
                }
            }
        }
    };
    update(dt) { };

}
