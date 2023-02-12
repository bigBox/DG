

const {ccclass, property} = cc._decorator;

@ccclass
export default class DigGoldMap extends cc.Component {
    @property({ type: cc.Node, displayName: "helpNode", tooltip: "提示箭头" })
    helpNode: any[] = [];
    dragState: boolean;
    mapSize: cc.Size;
    ndItem: any;
    ndSoil: any;
    ndDrag: any;
    hvZorder: number;
    hvMap: Map<any, any>;
    hvSpMap: Map<any, any>;
    spLight: any;
    cellSize: any;
    ndShowTip: any;
    pickNode: any;
    curPath: any[];
    direct: any;
    ndPlayers: any;
    isMoveMap: boolean;
    clickStartPos: any;
    isInGoFriend: boolean;
    isInAutoMove: boolean;
    baseSpeed: any;
    showTip: boolean;
    ndCenter: cc.Node;

    constructor() {
        super();
        this.dragState = false;
        this.mapSize = cc.size(0, 0);
        this.ndItem = null;
        this.ndSoil = null;
        this.ndDrag = null;
        this.hvZorder = 100;
        this.hvMap = new Map();
        this.hvSpMap = new Map();
        this.spLight = null;
        this.cellSize = null;
        this.ndShowTip = null;
        this.pickNode = null;
        this.curPath = [];
        this.direct = null;
        this.ndPlayers = null;

        this.isMoveMap = false;
        this.clickStartPos = null;

        this.isInGoFriend = false;
        this.isInAutoMove = false;

    };
    reflashHelp() {
        this.helpNode[0].active = false;
        this.helpNode[1].active = false;
        var taskdata = global.Module.TaskData.getHasAcceptTaskData();
        if (taskdata && taskdata.taskId == 10004 && taskdata.state == 1) {
            let item1 = global.Proxys.ProxyDigGold.getMapItem(80);
            let item2 = global.Proxys.ProxyDigGold.getMapItem(108);
            if(item1&&item1.type== 104001){
                this.helpNode[0].active = true;
            }
            if(item2&&item2.type== 102001){
                this.helpNode[1].active = true;
            }
        }


    }
    getMimecell(index)
    {
       // let idx = global.Proxys.ProxyDigGold.getNeedGuideIdx();
        let name =  'mimecell'+index.toString();
        let ndItem = this.ndItem.getChildByName(name);
        return ndItem;
        
    };
    onLoad() {

        this.ndItem = this.node.getChildByName("ndItems");
        this.ndSoil = this.node.getChildByName("ndSoil");
        this.ndCenter = this.node.getChildByName('ndCenter');
        this.mapSize = this.ndItem.getContentSize();
        this.spLight = this.node.getChildByName('spLight');
        this.ndShowTip = this.node.getChildByName('ndShowTip');
        this.ndPlayers = this.node.getChildByName('ndPlayers');
        
        this.cellSize       = this.node.getChildByName('ndTemplate').getContentSize();

        let proxy = global.Proxys.ProxyDigGold;
        proxy.setMap(this);

        let roomID = proxy.sceneData.id;
        let ndGoFriend = this.node.getChildByName('ndGoFriend');
        for (let i=1; i<=3; ++i)
        {
            let ndFriendL = ndGoFriend.getChildByName('ndFriendL'+i.toString());
            if (ndFriendL != null)
                this.setFriendInfo(roomID, ndFriendL);

            let ndFriendR = ndGoFriend.getChildByName('ndFriendR'+i.toString());
            if (ndFriendR != null)
                this.setFriendInfo(roomID, ndFriendR);
        }

        global.Manager.DigGolderManager.setMap(this);
        let ndMainPlayer = this.node.getChildByName('ndMainPlayer').getChildByName('start');
        global.Module.GameData.setDropInstance(ndMainPlayer);
      
        global.Proxys.ProxyFactoryGuide.executeGuide(this.node.name);
        this.scheduleOnce(function () {
            this.reflashHelp();
        }, 0.5);
    };

    onEnable() {
        this.reflashMapBack();
      
        this.initRoles();
        
        let dragLayer =  global.CommonClass.DragLayer.getDragLayer('DigGoldMap');
        dragLayer.scaleItemLayer(0.65);
        let enterFlag = global.Proxys.ProxyDigGold.getEnterFlag();

        let mapPos = this.caculateEnterMapPos(enterFlag);
        dragLayer.moveItemLayer(mapPos.x, mapPos.y);

        this.autoMoveToEnter(enterFlag);
        
        let self = this;
        this.node.on('onFriendItemClick', function (event) {
            self.onFriendItemClick(event);
          });

          global.Module.MainPlayerData.lockDrop(true);

        let isFirstLoad = global.Proxys.ProxyDigGold.getFirstLoad();
        if (isFirstLoad)
            this.autoMoveToStart();
        this.scheduleOnce(function () {
            this.updateMapItem();
            let panel = global.Manager.UIManager.getPersistUI('UIProgress');
            if (panel != null)
                panel.setProgress(1, 0.2);
        }, 0.5);
    };

    onDisable() {
       let proxy = global.Proxys.ProxyDigGold;
       proxy.setMap(null);

       this.node.off('onFriendItemClick');

        global.Manager.UIDlgTipManager.clearTips();

      global.Module.MainPlayerData.lockDrop(false);
    };

    caculateEnterMapPos(enterFlag) {
        let baseOffset = 1800;

        if (enterFlag==0)
            return cc.v2(-baseOffset, -baseOffset);
        let diff = Math.floor((enterFlag-109001)/2);

        let ndTemplate = this.node.getChildByName('ndTemplate');
        let size = ndTemplate.getContentSize().height;

        let yOffset = size*11*diff+500;

        let yPos = -baseOffset+yOffset;

        let xPos = -baseOffset;
        let directFlag = (enterFlag-109001)%2;
        if (directFlag == 1)    
            xPos = baseOffset;

        return cc.v2(xPos, yPos);
    };

    autoMoveToStart()
    {
        let self = this;

        let targetIdx = 135;
        let firstIdx  = 25;

        let firstPos     = this.caculateItemPosition(firstIdx);

        let ndMainPlayer = this.node.getChildByName('ndMainPlayer');
        ndMainPlayer.stopAllActions();
        let curPos = ndMainPlayer.getPosition();

        let mainPlayer = global.Manager.DigGolderManager.getMainPlayer();
        mainPlayer.startAnimation('zoulu');

        let action1 = cc.moveTo(0.7, cc.v2(firstPos.x,curPos.y));
        let action2 = cc.moveTo(0.3, cc.v2(firstPos.x, firstPos.y));
        let endFun = function()
        {
            self.isInAutoMove = false;
            mainPlayer.findToTarget(targetIdx, 0 , function()
            {
                self.isInAutoMove = false;
            })
        };
        let callFunc = cc.callFunc(endFun);
        let seq = cc.sequence(action1, action2, callFunc);
        ndMainPlayer.runAction(seq);
        this.isInAutoMove = true;
    };

    autoMoveToEnter(enterFlag)
    {
        let needWalk = false;

        let ndMainPlayer = this.node.getChildByName('ndMainPlayer');
        ndMainPlayer.stopAllActions();

        let curPos = ndMainPlayer.getPosition();
        let distance = 220;
        let targtPos = cc.v2(curPos.x, curPos.y);

        let mainPlayer = global.Manager.DigGolderManager.getMainPlayer();

        if (enterFlag==109002 || enterFlag==109004 || enterFlag==109006)       //好友家右边入口进入
        {
            curPos.x -= distance;
            needWalk = true;

            mainPlayer.setDirect(global.Enum.Direct.RIGHT);
        }
        else if(enterFlag==109001 || enterFlag==109003 || enterFlag==109005)    //好友家左边入口进入
        {
            needWalk = true;
            curPos.x += distance;

            mainPlayer.setDirect(global.Enum.Direct.LEFT);
        }
        if (needWalk)
        {
            ndMainPlayer.setPosition(curPos);
            mainPlayer.startAnimation('zoulu');

            global.Instance.AudioEngine.playSound('gotonext', true ,2,null);

            let action1 = cc.moveTo(1.4, cc.v2(targtPos.x,targtPos.y));
            let endFun = function()
            {
                global.Instance.AudioEngine.stopSound('gotonext');
                mainPlayer.idle();
            };
            let callFunc = cc.callFunc(endFun);
            let seq = cc.sequence(action1, callFunc);
            ndMainPlayer.stopAllActions();
            ndMainPlayer.runAction(seq);
        }
       
    };

    setFriendInfo(currentID, ndFriend) {
        let isType = 1;
        let friendItem1 = ndFriend.getChildByName('friendItem1');
        let friendItem2 = ndFriend.getChildByName('friendItem2');
        let friendItem = null;
        if(friendItem1!=null){
            isType = 1;
            friendItem = friendItem1;
        }else{
            isType = 2;
            friendItem = friendItem2;
        }


        friendItem.active = false;

        let friends = global.Module.FriendData.getFriendData();
        for (let idx=0; idx<friends.length; ++idx) {
            let data = friends[idx];
            
            if (currentID == data.roleInfo.roleId) {
                if (isType == 1) {
                    friendItem.active = (idx != 0);
                    if (idx >= 1) {
                        let preData = friends[idx - 1];
                        let itemClass1 = friendItem.getComponent(global.CommonClass.FriendItem);
                        itemClass1.setData(preData);
                    }
                } else {
                    friendItem.active = (idx != friends.length - 1);
                    if (idx < friends.length - 1) {
                        let nextData = friends[idx + 1];
                        let itemClass2 = friendItem.getComponent(global.CommonClass.FriendItem);
                        itemClass2.setData(nextData);
                    }
                }
            }
        }
    };

    initRoles()
    {
        let roles =  global.Proxys.ProxyDigGold.getInitRoles();
        let mainPlayer      = this.node.getChildByName('ndMainPlayer');
        let mainRoleID      =  global.Module.MainPlayerData.getRoleID();

        for (let key in roles)
        {
            let obj = roles[key];
            let player = null;
            if (obj.id == mainRoleID)
            {
                player = global.Manager.DigGolderManager.setMainPlayer(mainRoleID, mainPlayer);

                this.baseSpeed = player.getData().getSpeed();
            }
            else
            {
                player =  global.Manager.DigGolderManager.addPlayer(obj.id);
            }

            let position = global.Proxys.ProxyDigGold.sTocPosition(obj.position);
            if (player != null)
            {
                let isFirstLoad = global.Proxys.ProxyDigGold.getFirstLoad();
                if (!isFirstLoad || obj.id!=mainRoleID)
                    player.setPosition(position);

                player.setName(obj.name);
                player.setDirect(obj.direct);
            }
        }
    };

    updateMapItem() {
        global.Instance.Log.debug('加载有提示的地块','updateMapItem...');
        let proxy = global.Proxys.ProxyDigGold;
        let maxIdx = proxy.getMapMaxIdx();
        for (let idx=0; idx<maxIdx; ++idx)
        {
            let item = proxy.getMapItem(idx);
                this.reflashMapCellItem(idx, item);
                this.setStage(idx, item.stage);
        }
    };

    selfUpdate(dt)
    {
       
    };

    onDragEvent(event)
    {
        if (event.type==cc.Node.EventType.TOUCH_START)
        {
            this.clickStartPos = event.getLocation();
            this.isMoveMap = false;

            this.showTip = false;

            let point = event.getLocation();
            let pickNode = null;
            for (let key in this.ndItem._children)
            {
                let curND = this.ndItem._children[key];
                let boxNode = curND.getChildByName('spMine');
                let boundingBox = boxNode.getBoundingBoxToWorld();
                if (boundingBox.contains(cc.v2(point.x,point.y)))
                {
                    pickNode = curND;
                    break;
                }
            }

            if (pickNode != null)
            {
                let self = this;
                let delay = cc.delayTime(1);
                let onDelayEnd = function()
                {
                    self.showTip = true;
    
                    let item = global.Proxys.ProxyDigGold.getMapItem(pickNode.tagEx);
                    if (item && item.type>0)
                    {
                        if (!self.isMoveMap)
                        {
                            global.Manager.UIManager.open('DlgDigItem', null, function(panel)
                            {
                                panel.show(item);
                            })
                        }
                    }
                }
                  
                let endFun = cc.callFunc(onDelayEnd);
                let seq = cc.sequence(delay, endFun);
                this.ndShowTip.stopAllActions();
                this.ndShowTip.runAction(seq);
            }
        }
        else if (event.type==cc.Node.EventType.TOUCH_MOVE)
        {
            let point = event.getLocation();
            
            let distance = point.sub(this.clickStartPos).mag();
            if (distance > 5)
            {
                this.isMoveMap = true;
            }
        }
        else if (event.type==cc.Node.EventType.TOUCH_END)
        {
            if (this.isInAutoMove)
            {
                //global.CommonClass.UITip.showTipTxt('移动锁定中,请等待', global.Enum.TipType.TIP_BAD);
                return;
            }
           
            let point = event.getLocation();;
            if (!this.showTip && !this.isMoveMap)
            {
                this.ndShowTip.stopAllActions();

                //向服务器请求奖励
               // this.showDigReward(true);
                let mainPlayer = global.Manager.DigGolderManager.getMainPlayer();

                let curPickNode = this.getClickItem(point.x, point.y);
                if (curPickNode != null)
                {
                    if (this.isInGoFriend)
                    {
                        this.isInGoFriend = false;
                        mainPlayer.getData().setSpeed(this.baseSpeed);
                    }
                    else
                    {
                        let targetIdx = curPickNode.tagEx;
                        let item = global.Proxys.ProxyDigGold.getMapItem(targetIdx);
                        global.Instance.Log.debug('数据',item)
                        if(item&&item.type== 104001){
                            this.helpNode[0].active = false;
                        }
                        if(item&&item.type== 102001){
                            this.helpNode[1].active = false;
                        }
                        if (item&&item.type==global.Proxys.ProxyDigGold.digedType)
                        {
                            mainPlayer.finishDig(false);
                            mainPlayer.findToTarget(targetIdx);
                        }
                        else if(item&&item.type > 0)
                        {
                            if (mainPlayer.isStaminaEnough(targetIdx))
                            {
                                if (targetIdx != mainPlayer.getData().getCurDigIdx())
                                {
                                    mainPlayer.finishDig(false);
                                    
                                    if (!mainPlayer.walkToDig(targetIdx))
                                        mainPlayer.idle();
                                }
                            }
                            else
                            {
                                global.Manager.UIManager.open('DlgAddPower', null, function(panel)
                                {
                                    panel.show();
                                });
                               //global.CommonClass.UITip.showTipTxt('缺少采集证', global.Enum.TipType.TIP_BAD);
                            }
                        }
                        else 
                        {
                            global.CommonClass.UITip.showTipTxt('只能挖通道相邻格', global.Enum.TipType.TIP_BAD);
                        }
                    }
                }
                else
                {
                    global.CommonClass.UITip.showTipTxt('只能挖通道相邻格', global.Enum.TipType.TIP_BAD);
                }
            }
        }
    };

    getPlayerInstance()
    {
        return this.node.getChildByName('digGolderPlayer');
    };

    getMainPlayer()
    {
        return this.node.getChildByName('ndMainPlayer');
    };

    getMapSize()
    {
        return this.mapSize;
    };

    getCellSize()
    {
        return this.cellSize;
    };

    getTotalSize()
    {
        return this.ndItem.getContentSize();
    };

    caculateItemPosition(itemIdx)
    {
        let proxy = global.Proxys.ProxyDigGold;
        let cellSize = this.cellSize;

        let totalSize = this.getTotalSize();
        let rowIdx =  Math.floor(itemIdx/proxy.getColNum());
        let colIdx = itemIdx%proxy.getColNum();
        let itemPosition = cc.v2(-totalSize.width/2+cellSize.width/2, totalSize.height/2-cellSize.height/2);
        itemPosition.x += colIdx*cellSize.width;
        itemPosition.y -= rowIdx*cellSize.height;

        return itemPosition;
    };

    caculateIdx(position)
    {
        let size = this.ndItem.getContentSize();
        let ndOffset = this.ndItem.getPosition();

        let xOffset = size.width/2+position.x-ndOffset.x;
        let yOffset = size.height/2-position.y-ndOffset.y;

        let itemRow = Math.floor(yOffset/this.cellSize.height);
        let itemCol = Math.floor(xOffset/this.cellSize.width);

        let colNum =  global.Proxys.ProxyDigGold.getColNum();
        let idx = itemRow*colNum+itemCol;
        return idx;
    };

    indexToRowCol(idx)
    {
        let item = {x:0, y:0};

        let colNum =  global.Proxys.ProxyDigGold.getColNum();
        item.x = Math.floor(idx/colNum);
        item.y = Math.floor(idx%colNum);

        return item;
    };

    getItemNode(idx)
    {
        for (let key in this.ndItem._children)
        {
            let curND = this.ndItem._children[key];
           
            let itemIdx = curND.tagEx;
            if (idx == itemIdx)
                return curND;
        }

        return null;
    };

    getClickItem(touchX, touchY)
    {
        for (let key in this.ndItem._children)
        {
            let curND = this.ndItem._children[key];
            let boxNode = curND.getChildByName('spMine');
            let boundingBox = boxNode.getBoundingBoxToWorld();
            if (boundingBox.contains(cc.v2(touchX,touchY)))
            {
                //let itemIdx = curND.tagEx;
                return curND;
            }
        }

        return null;
    };

    setStage(idx, stage)
    {
        let ndItem = this.getItemNode(idx);
        if (ndItem != null)
        {
             //let item = {idx:idx, type:cellType, mine:-1, isDig:false, digPerTime:0, stage:0, totalStage:0};
            let percent = 1;
            let mapItem = global.Proxys.ProxyDigGold.getMapItem(idx);
            if (mapItem != null)
            {
                percent = 1-stage*1.0/mapItem.totalStage;
            }

            let spCraze = ndItem.getChildByName('spCraze');
            spCraze.active = (percent<0.8 && percent>0.00001);
            if (spCraze.active)
            {
                if (percent<0.25)
                {
                    let iconFile = 'images/pictrue/diggold/craze3';
                    global.CommonClass.Functions.setTexture(spCraze,iconFile,null);
                }
                else if(percent<0.5)
                {
                    let iconFile = 'images/pictrue/diggold/craze2';
                    global.CommonClass.Functions.setTexture(spCraze,iconFile,null);
                }
                else if(percent<0.8)
                {
                    let iconFile = 'images/pictrue/diggold/craze1';
                    global.CommonClass.Functions.setTexture(spCraze,iconFile,null);
                }
            }
        }
    };

    reflashMapSoil(item)
    {
        var self = this;
        var loadFinish = function(frame, item)
        {
            let index = item.idx;
            let cellSize = self.cellSize;

            let name = "soil"+index.toString();
            let sprite = null;
            let node = self.ndSoil.getChildByName(name);
            if (node==null)
            {
                node = new cc.Node(name);
                sprite = node.addComponent(cc.Sprite);
                node.setContentSize(cellSize.width, cellSize.height);
            }
            else
            {
                sprite = node.getComponent(cc.Sprite);
            }
            
            sprite.spriteFrame = frame;   
            node.parent = self.ndSoil;
            node.tagEx = index;
 
            let totalSize = self.ndSoil.getContentSize();

            let rowNum = global.Proxys.ProxyDigGold.getRowNum();
            let colNum = global.Proxys.ProxyDigGold.getColNum();

            let rowIdx =  Math.floor(index/colNum);
            let colIdx = index%rowNum;
            let pos = cc.v2(-totalSize.width/2+cellSize.width/2, totalSize.height/2-cellSize.height/2);
            pos.x += colIdx*cellSize.width;
            pos.y -= rowIdx*cellSize.height;
            node.setPosition(pos);
        }

        var data =global.Manager.DBManager.getLine('DigGold', item.type);
        if (data != null)
        {
            cc.loader.loadRes(data.path, cc.SpriteAtlas, function (err, atlas) {
             if (err==null)
                {
                    var frame = atlas.getSpriteFrame(data.picName);
                    loadFinish(frame, item);
                }
            });
        }
      
    };

    reflashMapBack()
    {
        let bkTemplate = this.node.getChildByName('spBgTemplate');
        bkTemplate.active = false;
        
        let itemSize = bkTemplate.getContentSize();
        let startPos = bkTemplate.getPosition();

        let type = 7;
        let row = 5;

        let ndBackMap = this.node.getChildByName('ndBackMap');
        ndBackMap.removeAllChildren();

        let position = startPos;
        
        for (let i=0; i<row; ++i)
        {
            position.x = bkTemplate.x;

            for (let j=0; j<type; ++j)
            {
                let newItem  = cc.instantiate(bkTemplate);
                ndBackMap.addChild(newItem);
                newItem.active = true;

                newItem.setPosition(position);

                position.x += itemSize.width;
            }

            position.y -= itemSize.height;
        }
    };

    reflashMapCellItem(index, item)
    {
        let itemPosition = this.caculateItemPosition(index);
        let hasItem = false;
        let children = this.ndItem.getChildren();
        for (let i=0; i<children.length; ++i)
        {
            let node = children[i];
            let tagEx = node.tagEx;
            if (tagEx == item.idx)
            {
                hasItem = true;
                let mine = node.getComponent(global.CommonClass.MineCell);
                mine.reflashItem(item);
                global.Instance.Log.debug("add map cell has item Idx%d", item.idx);
                break;
            }
        }

        let newNode = null;
        if (!hasItem) {
            if (item.type != 0) {
                let ndTemplate = this.node.getChildByName('ndTemplate');
                ndTemplate.active = false;
                
                newNode = cc.instantiate(ndTemplate);
                if (this.ndItem != null)
                    this.ndItem.addChild(newNode, 999);
        
                newNode.name = 'mimecell'+item.idx.toString();
                newNode.setPosition(itemPosition.x, itemPosition.y);
                newNode.tagEx = item.idx;
                let mineCell = newNode.getComponent(global.CommonClass.MineCell);
                mineCell.reflashItem(item);
                newNode.active = true;
            }
        }
    };

  

    createGuideHelp(index)
    {
        let name =  'mimecell'+index.toString();
        let ndItem = this.ndItem.getChildByName(name);
        if (ndItem!=null && ndItem.getChildByName('DigHelp')==null)
        {
            global.CommonClass.DigHelp.create(ndItem, cc.v2(50, 50));
            ndItem.zIndex=(1000);
        }
    };

    remvoveMapCellItem(itemIdx)
    {
        let name = "mimecell"+itemIdx.toString();
        let node = this.ndItem.getChildByName(name);
        if (node != null)
            node.removeFromParent();

    };

   
    reflashMask()
    {
        let digData = global.Proxys.ProxyDigGold.getDigData();
        let neighbors =  global.Proxys.ProxyDigGold.makeNeighborArray(digData.curDigIdx);
        let items = this.ndItem.getChildren();
        for (let key in items)
        {
            let curND = items[key];
            let tagEx = curND.tagEx;

            let isNeghbor = false;
            for (let i in neighbors)
            {
                if (tagEx==neighbors[i])
                {
                    isNeghbor = true;
                    break;
                }
            }
            
            let isShowMask = (!isNeghbor && tagEx!=digData.curDigIdx);
            curND.getChildByName('mask').active = isShowMask;
        }
    };


    clearItems()
    {
        this.ndItem.removeAllChildren();
        this.ndSoil.removeAllChildren();
        this.ndCenter.removeAllChildren();
    };

    reflashLightAndMask(digIdx)
    {
        let name = "soil"+digIdx.toString();
        let curND = this.ndSoil.getChildByName(name);
        this.spLight.setPosition(curND.getPosition());
        this.reflashMask();
    };

    adjustNewPosView(position, cellSize)
    {
        let visibleSize = global.CommonClass.Functions.getRoot().getContentSize();
        let worldPosition = this.ndItem.convertToWorldSpaceAR(position);
        let minX = worldPosition.x-cellSize.width/2;
        let maxX = worldPosition.x+cellSize.width/2;
        let minY = worldPosition.y-cellSize.height/2;
        let maxY = worldPosition.y+cellSize.height/2;

        let xMove = 0;
        let yMove = 0;
        if (minX<0)
            xMove = minX;
        else if(maxX>visibleSize.width)
            xMove = maxX-visibleSize.width;
        else if(minY < 0)
            yMove = minY;
        else if(maxY>visibleSize.height)
            yMove = maxY-visibleSize.height;
        
        let dragLayer =  global.CommonClass.DragLayer.getDragLayer('DigGoldMap');
        dragLayer.moveItemLayer(-xMove, -yMove);
    };

    onFriendItemClick(event)
    {
        if (this.isInGoFriend)
            return false;

        let node = event.getUserData();

        let btn      = node.getChildByName('btnClick').getComponent(cc.Button);
        let arg      = btn.clickEvents[0].customEventData;
        let args     = arg.split('|');

        let tagEx      = parseInt(args[0]);
        let targetIdx = parseInt(args[1]);

        let ID   = node.tagEx;
        let data = {id:ID, password:"", pos:tagEx};
        if (ID<=0||ID==undefined)
        {
            this.isInGoFriend = false;
            global.CommonClass.UITip.showTipTxt('没有下一家好友了', global.Enum.TipType.TIP_BAD);
            return false;
        }
        else
            this.isInGoFriend = true;
           
        
        let self  = this;
        let mainPlayer = global.Manager.DigGolderManager.getMainPlayer();

        let sendToEnterDig = function()
        {
            global.Instance.MsgPools.send('leaveDigRoom', {}, function(leaveMsg)
            {
                self.isInGoFriend = false;
                if (!leaveMsg.errorID) {
                    global.Instance.MsgPools.send('enterDigRoom', data, function(msg) {
                       // global.Instance.Log.debug('xxxxxx');
                    });
                }
               
            });
        };

        let walkForWard = function()
        {
            let ndTarget    = node.parent;
            let worldPos    = ndTarget.convertToWorldSpaceAR(cc.v2(0,0));
            let targetPos   = self.node.convertToNodeSpaceAR(worldPos);

            let speed = self.baseSpeed*0.25;
            mainPlayer.getData().setSpeed(speed);

            global.Instance.AudioEngine.playSound('gotonext', true , 2,null);
            mainPlayer.walkToTarget(targetPos, sendToEnterDig);
        };

        mainPlayer.finishDig(false);
        let curPos = mainPlayer.getPosition();
        let curIdx = this.caculateIdx(curPos);

        if (targetIdx != curIdx)
        {
            if (!mainPlayer.findToTarget(targetIdx, 0, walkForWard)) {
                global.CommonClass.UITip.showTipTxt('跳转失败, 没有挖出通道', global.Enum.TipType.TIP_BAD);
                this.isInGoFriend = false;
            }
        }
        else
        {
            walkForWard();
        }
    };

    // update (dt) {}
}
