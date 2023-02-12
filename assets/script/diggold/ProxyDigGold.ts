import FindPath from "../common/FindPath";
//挖矿逻辑处理
const {ccclass, property} = cc._decorator;
@ccclass
export default class ProxyDigGold {
    mapData: any[];
    maxIdx: number;
    startIdx: number;
    rewardCount: number;
    enterFlag: number;
    map: any;
    smallmap: any;
    cellSize: cc.Size;
    rowNum: number;
    colNum: number;
    guideIdxs: number[];
    findPath: any;
    sceneData: { id: number; name: string; };
    initRoles: any[];
    digedType: number;
    isFirstLoad: boolean;
    digData: any;
    resetCountDown: any;
    constructor()
    {
        this.mapData = new Array();         //{idx:-1, type:-1, mine:-1, isDig:false, perTimeDig:0, mineLeft:0};
        this.maxIdx = 0;
        this.startIdx = 27;

        this.rewardCount = 0;
        this.enterFlag = 0;

        this.map = null;
        this.smallmap = null;

        this.cellSize = cc.size(120, 120);
        this.rowNum = 28;
        this.colNum = 28;

        this.guideIdxs = [106];
        this.findPath = new FindPath;

        this.sceneData  = {id:0, name:"xxxx"};
        this.initRoles      = new Array();              //{id:0, name:"role", position:cc.v2(0,0), direct:0};

        this.digedType  = -1;

        this.isFirstLoad = false;
    }

    initData() {
        let self = this;
        let passCondition = function(item: { type: number; })
        {
            return (item==null||item.type==self.digedType);
           //return true;
        };
        this.findPath.setPassCondition(passCondition);

        let data = {
            data:this.mapData,
            rowNum:this.getRowNum(),
            colNum:this.getColNum(),
        };
        this.findPath.setMap(data);
    };

    searchdPath(beginIdx: number, targetIdx: number) {
        let beginX  = Math.floor(beginIdx/this.colNum);
        let beginY  = Math.floor(beginIdx%this.colNum);
        let endX    = Math.floor(targetIdx/this.colNum);
        let endY    = Math.floor(targetIdx%this.colNum);

        return this.findPath.search(beginX, beginY, endX, endY);
    };

    getMapData() {
        return this.mapData;
    };

    setMap(map: any) {
        this.map = map;
    };

    setSmallMap(map: any) {
        this.smallmap = map;
    };

    getMap() {
        return this.map;
    };

    getSamllMap() {
        return this.smallmap;
    };
    getCellSize() {
        return this.cellSize;
    };

    getRowNum() {
        return this.rowNum;
    };

    getColNum() {
        return this.colNum;
    }

    setDigData(data: any) {
        this.digData = data;
    };

    getItemIdx(row: number, type: number) {
        return row*this.colNum+type;
    };

    getMapMaxIdx() {
        return this.mapData.length;
    };

    setItemStage(index: any, stage: any) {
        let item = this.getMapItem(index);
        
        if (item != null)
            item.stage = stage;
    };

    getItemStage(index: any) {
        let item = this.getMapItem(index);
        return item.stage;
    };

    getMapItem(itemIdx: number) {
        let colNum = this.colNum;
        let maxIdx = (this.rowNum-1)*colNum+colNum-1;
        if (itemIdx>=0 && itemIdx<=maxIdx)
        {
            //let data = cc.Manager.DBManager.findData("DigGoldItem", 'ID', this.mapData[itemIdx].type)
            //return data;
           return this.mapData[itemIdx];
        }

        return null;
    };

    getNeedGuideIdx() {
        let guide1 = global.Proxys.ProxyGuide.getGuide('DigGoldIron');
        if (guide1.isOpen)
        {
            let data1 = global.Manager.DBManager.findData('NewGuide', 'guideKey', 'DigGoldIron');
            return data1.arg;
        }

        /*let guide2 = cc.Proxys.ProxyGuide.getGuide('DigGoldEgg');
        if (guide2.isOpen)
        {
            let data2 = cc.Manager.DBManager.findData('NewGuide', 'guideKey', 'DigGoldEgg');
            return data2.arg;
        }*/

        return -1;
    };

    getFirstLoad() {
        // this.isFirstLoad = true;
        return this.isFirstLoad;
    };

  

    setEnterFlag(flag: number) {
        this.enterFlag = flag;
    };
    
    getEnterFlag() {
        return this.enterFlag;
    };


    setMapItemByCell(sceneCell: { x: any; y: any; type: any; isShow: any; stage: number; }) {
        /*
        Empty = 0;      // 未知
        Unknown = 1;    // 挖光
        PT = 2;         // 金矿
        Gold = 3;       // 银矿
        Coal = 4;       // 煤
        Steel = 5;      // 铁
        Treasure = 6; // 宝箱
        RedSoil = 7;    // 红土
        Stone = 8;      // 石头
        */

        let x = sceneCell.x;
        let y = sceneCell.y;

        let cellType = sceneCell.type;

        let idx = y*this.colNum+x;
        let picIdx = this.idxToPicIdx(idx);
        let item = {idx:idx, picIdx:picIdx, type:cellType,isShow:sceneCell.isShow, isDig:false, digPerTime:0, stage:0, totalStage:0,x:x,y:y};

        if (cellType!=0)
        {
            // cc.Instance.Log.debug("cell idx:%d, cellType:%d", idx, cellType);
        }

        let itemData    = global.Manager.DBManager.findData('DigGold', 'type', cellType);
        if (itemData != null)
        {
            item.digPerTime = itemData.digPerTime;
            item.totalStage = itemData.digNum;
            item.stage  = sceneCell.stage;
        }
       
        if (this.map != null)
        {
            let mapItem = this.mapData[idx];
            if (mapItem!=null && item.stage!=mapItem.stage)
                this.map.setStage(idx, item.stage);
        }
        this.mapData[idx] = item;
    };

    idxToPicIdx(idx: number) {
        let picColNum = 6;
        let picRowNum = 3;

        let colIdx = idx%this.colNum;
        let picCol = colIdx%picColNum;

        let rowIdx = Math.floor(idx/this.colNum)%picRowNum;

        let picIdx = rowIdx*picColNum+picCol+1;
        if (picIdx==0)
        {
            global.Instance.Log.debug('idxToPicIdx','xxxxx');
        }

        return picIdx;
    };

    getIsNotDiged(itemIdx: number) {
        let colNum = this.colNum;
        let maxIdx = (this.rowNum-1)*colNum+colNum-1;
        if (itemIdx>=0 && itemIdx<=maxIdx)
        {
            return ( this.mapData[itemIdx]==null || this.mapData[itemIdx].type==0 );
        }
        
        return false;
    };

    getCanDig(itemIdx: number) {
        if (this.startIdx==itemIdx)
            return true;

        let neighbors = this.makeNeighborArray(itemIdx, false);
        for (let i=0; i<neighbors.length; ++i)
        {
            if (this.mapData[neighbors[i]].type > 0)
            {
                return true;
            }
        }

        return false;
    };

    getDistance(standIdx: number, targetIdx: number) {
        let standX = Math.ceil(standIdx/this.colNum);
        let standY = Math.ceil(standIdx%this.colNum);

        let targetX = Math.ceil(targetIdx/this.colNum);
        let targetY = Math.ceil(targetIdx%this.colNum);

        let distance = Math.abs(standX-targetX)+Math.abs(standY-targetY);

        return distance;
    };

    getFitDigStandIdx(itemIdx: any) {
        let mainPlayer = global.Manager.DigGolderManager.getMainPlayer();

        let position = mainPlayer.node.getPosition();
        let curStandIdx = mainPlayer.getMapOwner().caculateIdx(position);

        let neighbors = this.makeNeighborArray(itemIdx, false);

        let mimDistance = 999999;
        let idx         = -1;
        for (let i=0; i<neighbors.length; ++i)
        {
            if (this.mapData[neighbors[i]].type ==this.digedType)
            {
                let distance = this.getDistance(curStandIdx,neighbors[i]);
                if (distance<mimDistance)
                {
                    mimDistance = distance;
                    idx = neighbors[i];
                }
            }
        }

        return idx;
    };

    getInitRoles() {
        return this.initRoles;
    };

    getSceneData() {
        return this.sceneData;
    };

    makeNeighborArray(itemIdx: number, isIncline: boolean) {
        let neighborArray = new Array();
        let colNum = this.colNum;
        let maxIdx = (this.rowNum-1)*colNum+colNum-1;
        let colIdx = itemIdx%colNum;
        //up
        let upIdx = itemIdx-colNum;
        if (upIdx>=0)
            neighborArray.push(upIdx);

        //down 
        let downIdx = itemIdx+colNum;
        if (downIdx<=maxIdx)
            neighborArray.push(downIdx);

        //left
        let leftIdx = itemIdx-1;
        if (colIdx>0)
            neighborArray.push(leftIdx);

        //right
        let rightIdx = itemIdx+1;
        if (colIdx<colNum-1) 
            neighborArray.push(rightIdx);

        if (isIncline)
        {
            //left up
            let leftUpIdx = itemIdx-colNum-1;
            if (colIdx>0 && upIdx>=0)
                neighborArray.push(leftUpIdx);

            //right up
            let rightUpIdx = itemIdx-colNum+1;
            if (upIdx>=0 && colIdx<colNum-1)
                neighborArray.push(rightUpIdx);

            //left down
            let leftDownIdx = itemIdx+colNum-1;
            if (colIdx>0 && downIdx<=maxIdx)
                neighborArray.push(leftDownIdx);

            //right down
            let rightDownIdx = itemIdx+colNum+1;
            if (downIdx<=maxIdx && colIdx<colNum-1)
                neighborArray.push(rightDownIdx);
        }
    
        return neighborArray;
    };

    makeNeighborItems(itemIdx: number) {
        let items = { up: 0, down: 0, left: 0, right: 0 };

        let colNum = this.colNum;
        let maxIdx = (this.rowNum-1)*colNum+colNum-1;
        let colIdx = itemIdx%colNum;
        //up
        let upIdx = itemIdx-colNum;
        if (upIdx>=0)
            items.up = this.mapData[upIdx];

        //down 
        let downIdx = itemIdx+colNum;
        if (downIdx<=maxIdx)
            items.down = this.mapData[downIdx];

        //left
        let leftIdx = itemIdx-1;
        if (colIdx>0)
            items.left = this.mapData[leftIdx];

        //right
        let rightIdx = itemIdx+1;
        if (colIdx<colNum-1) 
            items.right = this.mapData[rightIdx];
        return items;
    };

    removeItem(itemIdx: string | number) {
        let item = this.mapData[itemIdx];
       
        this.findPath.setMapCell(item.idx, item);
        this.map.remvoveMapCellItem(item.idx);

       // item.mine = -1;
        item.type = 0;

        this.map.reflashMapSoil(item); 
    };

    reflashItems(indexs: { [x: string]: any; }) {
        for (let key in indexs)
        {
            let idx = indexs[key];
            let newItem = this.mapData[idx];
            this.map.reflashMapCellItem(idx, newItem);
            this.findPath.setMapCell(idx, newItem);
        }
        //this.reflashMapHV(indexs);
    };

    showDigReward(digIdx: string | number) {
        if (this.rewardCount > 0) {
            let item = this.mapData[digIdx];
            if (item!=null && item.type>1) {
                let data =  global.Manager.DBManager.findData('DigGold', 'type', item.type);
                if (data!=null ) {   

                    if (data.itemGet>0) {
                        let itemData = global.Manager.DBManager.findData('Items', 'ID', data.itemGet);
                        if (itemData.warehouseType==5) {
                            let allItems = [];
                            let  item = {itemID:data.itemGet, itemNum:1, type:0};
                            allItems.push(item);
        
                            if(allItems.length > 0) {
                                global.Manager.UIManager.open('DlgCollectDrop', null, function(panel: { show: (arg0: any[]) => void; }) {
                                    panel.show(allItems);
                                });
                            }
                        } else {
                            global.CommonClass.ItemDrop.createOneDrop(data.itemGet, this.rewardCount,null,null,null);//挖矿提示
                        }
                     }
                }
            }
    
            this.rewardCount = 0;
        } 
    };

    getCostItemLeft() {
        let data = global.Manager.DBManager.findData('Sundry', 'name', 'mineUseSkillCostItemID');
        if (data != null) {
            let itemID = parseInt(data.value);

            let exCount = 0;
            let changeData = global.Manager.DBManager.findData('Item2Count', 'ID', itemID);
            if (changeData != null)
            {
                let fatherID   = changeData.itemID;
                let fatherNeed = changeData.itemCount;
                let count      = changeData.count;

                let fatherItemNum = global.Module.PackageData.getItemCount(fatherID);
                exCount = Math.floor(fatherItemNum/fatherNeed)*count;
            }

            let curNum = global.Module.PackageData.getItemCount(itemID);
            let total = exCount+curNum;

            return total;
        }
    };

    getResetCountDown() {
        return this.resetCountDown;
    }

    sTocPosition(position: cc.Vec2) {
        if (position.x == null) position.x = 0;
        if (position.y == null) position.y = 0;

        let newPos = cc.v2(position.x, position.y);

        if (this.map != null)
        {
            let totalSize = this.map.getTotalSize();
            newPos.x -= (totalSize.width/2);
            newPos.y = (totalSize.height/2-newPos.y);
        }

        return newPos;
    };
    cTosPosition(position: { x: number; y: number; }) {
        
        let newPos: cc.Vec2;
        newPos = cc.v2(position.x,position.y)
        if (this.map != null)
        {
            let totalSize = this.map.getTotalSize();
            newPos.x += (totalSize.width / 2);
            newPos.y = totalSize.height / 2 - newPos.y;

            newPos.x = parseInt(newPos.x.toString());
            newPos.y = parseInt(newPos.y.toString());
        }

        return newPos;
    };

    onListSceneRsp(msg: any) {
        global.Instance.Log.debug('onListSceneRsp',msg)
    };

    onJoinSceneRsp(msg: any) {
        global.Instance.Log.debug('onJoinSceneRsp',msg)
        if (!msg.errorID)
        {
            this.sceneData.id   = msg.detailInfo.briefInfo.id;
            this.sceneData.name = msg.detailInfo.briefInfo.name;
            this.resetCountDown = msg.resetCountDown;

            this.initRoles      = [];
            for (let key in msg.detailInfo.attenders)
            {
                let attender = msg.detailInfo.attenders[key];
                let obj = {id:0, name:'', position:cc.v2(0,0), direct:0};
                obj.id = attender.roleBaseInfo.roleId;
                obj.name = attender.roleBaseInfo.roleName;
                obj.direct = attender.direction.x||1;
                obj.position = cc.v2(attender.position.x, attender.position.y);
               //obj.position = cc.v2(60, 60);
                this.isFirstLoad = msg.firstFlag;
                
                this.initRoles.push(obj);
            }

            this.setEnterFlag(msg.req.pos);

        }
        else if(msg.errorID==339)
        {
            // global.Manager.UIManager.close('UIDigRoomEnter');

            let data = {};
            global.Instance.MsgPools.send('leaveDigRoom', data,null);
        }
    };

    onLeaveSceneRsp(msg: { errorID: any; }) {
        global.Instance.Log.debug('清空挖矿数据',msg)
        if (!msg.errorID) {
            this.mapData  = [];
            global.Manager.DigGolderManager.clearOtherPlayer();
        }
        this.setEnterFlag(-1);
    };

    onJoinSceneNtf(msg: { joinRoleInfo: { roleBaseInfo: { roleId: { toString: () => string; toNumber: () => any; }; roleName: any; }; position: any; direction: { x: number; }; }; }) {
        global.Instance.Log.debug('onJoinSceneNtf %d' , msg.joinRoleInfo.roleBaseInfo.roleId.toString());
        if (this.map != null)
        {
            let roleId      = msg.joinRoleInfo.roleBaseInfo.roleId.toNumber();
            let name        = msg.joinRoleInfo.roleBaseInfo.roleName;
            let position    = this.sTocPosition(msg.joinRoleInfo.position);
            //let position    = this.sTocPosition(cc.v2(60,60));
            let direct      = msg.joinRoleInfo.direction.x||1;
    
            let player =  global.Manager.DigGolderManager.addPlayer(roleId);
            if (player != null)
            {
                player.setPosition(cc.v2(position.x, position.y));
                player.setName(name);
                player.setDirect(direct);
            }
        }
       
    };

    onLeaveSceneNtf(msg: { roleId: { toNumber: () => any; }; }) {
        let roleId = msg.roleId.toNumber();
     
        global.Instance.Log.debug('onLeaveSceneNtf %d' , roleId.toString());
        if (this.map != null)
        {
            global.Manager.DigGolderManager.removePlayer(roleId);
        }
    };

    onSceneMovementRsp(msg: any) {

    };

    onSceneMovementNtf(msg: { roleId: { toNumber: () => any; }; direction: { x: number; }; pos: any; moveType: number; }) {
        let mainRoleID  = global.Module.MainPlayerData.getRoleID();
        let roleId      = msg.roleId.toNumber();
        if (roleId != mainRoleID)
        {
            let player =  global.Manager.DigGolderManager.getPlayer(roleId);
            if (player != null)
            {
                let direct   = msg.direction.x||1;
                let position = this.sTocPosition(msg.pos);

                if (msg.moveType == 3)      //同步移动
                {
                    player.setDirect(direct);
                    player.walkToTarget(position);
                }
                else if(msg.moveType==2)    //结束移动
                {
                    player.setPosition(position);
                    player.setDirect(direct);
                    player.idle();
                }
            }
        }
    };

    onSceneMapNtf(msg: { type: number; cells: string | any[]; }) {
        global.Instance.Log.debug('onSceneMapNtf',msg);
        if (msg.type==0 || msg.type==null) {
            for (let i=0; i<msg.cells.length; ++i)
            {
                let cell = msg.cells[i];
                this.setMapItemByCell(cell);

                if (cell.type != 0)
                {
                    //' cell x ' + cell.x.toString() + ' cell y '+cell.y.toString() 
                    // cc.Instance.Log.debug('cell type '+ cell.type.toString());
                }
            }

            this.initData();
            global.CommonClass.Functions.loadScene("DigGoldScene",null);
        }
        else if(msg.type == 1)
        {
            let indexs = {};
            for (let i=0; i<msg.cells.length; ++i)
            {
               // let cell = cc.CommonClass.Functions.fillNullData(msg.cells[i]);
                let cell = msg.cells[i];
                
                let x = cell.x;
                let y = cell.y;
        
                let itemIdx = y*this.colNum+x;

                global.Instance.Log.debug('index change....',itemIdx.toString());

                if (cell.type==this.digedType)       //有个格子挖完了
                {
                    let mainPlayer = global.Manager.DigGolderManager.getMainPlayer();
                    let curDigIdx = mainPlayer.getData().getCurDigIdx();
                    if (itemIdx == curDigIdx)
                    {
                        global.Proxys.ProxyDigGold.showDigReward(itemIdx);
                        mainPlayer.sendStopDig();
                    }

                    let neighbors = this.makeNeighborArray(itemIdx,false);
                    for (let key in neighbors)
                    {
                        let value = neighbors[key];
                        indexs[value.toString()] = value;
                    }
                    indexs[itemIdx.toString()] = itemIdx;
                }
                else 
                {
                    let item = this.mapData[itemIdx];

                    if (item.type!=cell.type)
                    {
                        indexs[itemIdx.toString()] = itemIdx;

                        let neighbors = this.makeNeighborArray(itemIdx,false);
                        for (let key in neighbors)
                        {
                            let value = neighbors[key];
                            indexs[value.toString()] = value;
                        }
                    }
                }

                this.setMapItemByCell(cell);
                
            }
            this.reflashItems(indexs);
        }
    };

    onSceneUseSkillRsp(msg: { errorID: number; req: { skillId: number; type: number; }; }) {
        global.Instance.Log.debug('挖矿请求',msg);
        if (msg.errorID==0) {
            if (msg.req.skillId==16 && msg.req.type==2) {
                this.rewardCount++;
            }
        } else {
            if (msg.req.type==1 && msg.req.skillId==16)
            {
                let mainRoleID  = global.Module.MainPlayerData.getRoleID();
                let player = global.Manager.DigGolderManager.getPlayer(mainRoleID);
                player.finishDig(false);
                player.idle();
            }
            global.Instance.Log.debug('onSceneUseSkillRsp','error dig');
        }
    };

    onSceneUseSkillNtf(msg: { skillId: number; srcRoleId: { toNumber: () => any; }; scrRolePos: { x: any; y: number; }; targetPos: { x: any; y: number; }; type: any; }) {
        global.Instance.Log.debug('挖矿返回推送 onSceneUseSkillNtf',msg);
         
        if (msg.skillId==16)
        {
            let roleId = msg.srcRoleId.toNumber();
            let player =  global.Manager.DigGolderManager.getPlayer(roleId);
            if (player != null)
            {
                let position = cc.v2(msg.scrRolePos.x, msg.scrRolePos.y);
                position     = this.sTocPosition(position);
                player.setPosition(position);

                let itemPosition = cc.v2(msg.targetPos.x, msg.targetPos.y);
                itemPosition   = this.sTocPosition(itemPosition);

                let itemIdx = player.getMapOwner().caculateIdx(itemPosition);
            
                let type = msg.type;
                if (type == 1)          //开始挖矿
                {
                    player.dig(itemIdx);
                }
                else if(type==2)        //请求结算
                {
                    let mainRoleID  = global.Module.MainPlayerData.getRoleID();
                    let player = global.Manager.DigGolderManager.getPlayer(roleId);
                    if (player.isDigStageFull())
                        player.finishDig(true);
                    
                    if (roleId==mainRoleID)
                    { 
                        player.getData().clearDigTime();

                        if (player.isStaminaEnough(itemIdx))
                        {
                            player.updateDig(true);
                        }
                        else
                        {
                            global.Manager.UIManager.open('DlgAddPower', null, function(panel: { show: () => void; })
                            {
                                panel.show();
                            });
                            player.finishDig(false);
                        }
                    }
                }
            }
        }
      
    };

    onCheckSceneRsp(msg: { errorID: any; sceneDetailInfo: any; cells: any[]; }) {      //断线重连
        global.Instance.Log.debug('断线重连',msg)
        if (!msg.errorID)
        {
            let sceneDetailInfo = msg.sceneDetailInfo;
            let cells           = msg.cells;

            this.mapData = [];
            this.map.clearItems();

            for (let i=0; i<cells.length; ++i)
            {
                let cell = msg.cells[i];
                this.setMapItemByCell(cell);
            }
            this.map.updateMapItem();

            global.Manager.DigGolderManager.clearOtherPlayer();
            let attenders = sceneDetailInfo.attenders;
            for (let key in attenders)
            {
                let role = attenders[key];

                let roleId      = role.roleBaseInfo.roleId.toNumber();
                let name        = role.roleBaseInfo.roleName;
                let position    = this.sTocPosition(role.position);
                //let position    = this.sTocPosition(cc.v2(60,60));
                let direct      = role.direction.x||1;
        
                let player =  global.Manager.DigGolderManager.addPlayer(roleId);
                if (player != null)
                {
                    player.setPosition(cc.v2(position.x, position.y));
                    player.setName(name);
                    player.setDirect(direct);
                }
            }
        }
        else
        {
           // UITip.showTipTxt('重连失败', cc.Enum.TipType.TIP_BAD);
           global.Instance.Log.debug('onCheckSceneRsp','重连失败');
        }
    }
}

