import FindPath from "../common/FindPath";

//探险逻辑处理
const {ccclass, property} = cc._decorator;

@ccclass
export default class ProxyGuJi {
    owner: any;
    mapData: { rowNum: number; colNum: number; data: any[]; };
    findPath: any;
    curStandIdx: number;
    treasureIdx: number;
    nearFarFlag: number;
    monsterCellWen: cc.Vec2;
    monsterCellWu: cc.Vec2;
    guideIdxs: any[];
    guideLightIdx: number;
    monsterTask: boolean;
    hurtCounts: {};
    zeroPos: { x: number; y: number; idx: number; };
    contentData: any;
    /**(1)需要建立对象池的预制体 */
    public prefab: any;
    public poolMap: cc.NodePool;
    poolMapNum: number;
    GuisShow: boolean;
    assets: cc.Asset[];
    isAnimation: boolean;
    constructor () {
        this.owner = null;

        this.mapData = { rowNum: 16, colNum: 22, data: new Array() };
        this.findPath = new FindPath;
        this.assets = [];
        this.curStandIdx = 0;
        this.treasureIdx = -1;
        this.nearFarFlag = 0;

        this.monsterCellWen = cc.v2(0, 0);
        this.monsterCellWu = cc.v2(0, 0);

        let idxNum = this.mapData.rowNum * this.mapData.colNum;
        for (let idx = 0; idx < idxNum; ++idx) {
            let type = 11;
            let item = { idx: idx, type: type, stage: 0, isOpen: false };
            this.mapData.data[idx] = item;
        }
        this.guideIdxs = [this.curStandIdx + 48];
        this.guideLightIdx = -1;
        this.monsterTask = false;

        this.hurtCounts = {};
        this.zeroPos = { x: 0, y: 0 ,idx:0 }
        this.contentData = null; 
        this.poolMap = new cc.NodePool();
        this.poolMapNum =300;
        this.GuisShow = false;
        this.isAnimation = false;//场景东西由小放大
    };
    //创建对象池
    public esta() {
        if (this.poolMap.size() == 0) {
            let self = this
            cc.resources.load("prefab/component/GuJiGoodsItem", function (err, prefab) {
                self.prefab = prefab;
                for (let k = 0; k < 300; k++) {
                    var newNode: any = cc.instantiate(prefab);
                    self.poolMap.put(newNode)
                }
            });
        }
    }
    /**从对象池取出 */
    public get(): cc.Node {

        let getNode = null;
        if (this.poolMap.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            // get()获取对象
            getNode = this.poolMap.get();

        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            this.poolMapNum++;
            getNode = cc.instantiate(this.prefab);
        }
        // getNode.getComponent('Enemy').init(); //接下来就可以调用 getNode 身上的脚本进行初始
        return getNode;
    }

    /**放回对象池 */
    public put(putNode: cc.Node) {
        putNode.active = false;
        this.poolMap.put(putNode);
        if (this.poolMap.size() == this.poolMapNum) {
            this.setGuJI(false);
            let GuJiMap = global.Instance.Dynamics['GuJiMap'];
            if (GuJiMap) {
                global.CommonClass.Functions.loadScene("WorldMapScene", null);
            }
        }
    };
    loadPicture(id){
        // return;
      
        let self = this;
        cc.resources.loadDir("images/pictrue/guJiMap", cc.SpriteFrame, function (err, assets) {
            // ...
            self.assets = assets;
        });
        let datas = global.Manager.DBManager.getData('RobCfg');
        for (let i = 0; i < datas.length; i++) {
            if (i == id || i == id + 1 || i == id - 1)
                for (let k = 0; k < 6; k++) {
                    let itemID = datas[i].inputItemId + k;
                    let picPath = global.CommonClass.Functions.getItemPicPathNew(itemID);
                    cc.loader.loadRes(picPath, cc.SpriteFrame, function (err, spriteFrame) {
                        if (err == null) {
                            self.assets.push(spriteFrame);
                        } else {

                        }
                    });
                }
        }
       
    };
    releasePicture(){
        for (let i = 0; i < this.assets.length; i++) {
            cc.assetManager.releaseAsset(this.assets[i]); //图片资源释放
            
        }
        // cc.assetManager.releaseAll();
    }
   
    getGuJI() {
        return this.GuisShow;
    };
    setGuJI(isShow) {
        this.GuisShow = isShow;
    };
    // use this for initialization
    onLoadMap (map: any) {
        let passCondition = function (item: { type: number; }) {
            return item && item.type != 99;
        };
        this.setOwnerMap(map);
        this.findPath.setMap(this.mapData);
        this.findPath.setPassCondition(passCondition);
        this.hurtCounts = {};
    };
    /**
     * 修改初始坐标
     * @param {*} item 
     */
    setZeroPos (item: { x: number; y: number; },idx: number) {
        this.zeroPos.x = item.x;
        this.zeroPos.y = item.y;
        this.zeroPos.idx = idx;
    };
    /**
     * 获得初始坐标
     */
    getZeroPos () {
        return this.zeroPos;
    };
    getAdSide() {
        let pos = this.zeroPos;
        let id = pos.x  + pos.y* this.mapData.colNum;
        
        for (let i = 1; i < 10; i++) {
            let data = null;
            {
                let value = {x:pos.x,y:pos.y+i};
                let idx = value.x  + value.y* this.mapData.colNum;
                data = this.getItem(idx);
                if (data&&data.type != 0) {
                    id = idx;
                    break;
                }
            }
           
            {
                let value = {x:pos.x,y:pos.y-i};
                let idx = value.x  + value.y* this.mapData.colNum;
                data = this.getItem(idx);
                if (data&&data.type != 0) {
                    id = idx;
                    break;
                }
                   
            }
            {
                let value = {x:pos.x+ i,y:pos.y};
                let idx = value.x  + value.y* this.mapData.colNum;
                data = this.getItem(idx);
                if (data&&data.type != 0) {
                    id = idx;
                    break;
                }
            }
           
            {
                let value = {x:pos.x -i,y:pos.y};
                let idx = value.x  + value.y* this.mapData.colNum;
                data = this.getItem(idx);
                if (data&&data.type != 0) {
                    id = idx;
                    break;
                }
                   
            }
            
        }
        return id;
    };
    setOwnerMap (owner: any) {
        this.owner = owner;
    };

    getOwnerMap () {
        return this.owner;
    };

    getMapData () {
        return this.mapData;
    };
    getHelpMapData () {
        let list =[
            {cellTypeLandforms:"",idx:157,isOpen:true,stage:0,type:-1,pathColorType:1},
            {cellTypeLandforms:"",idx:130,isOpen:true,stage:0,type:1,pathColorType:-1},
            {cellTypeLandforms:"",idx:181,isOpen:true,stage:0,type:2,pathColorType:0},
            {cellTypeLandforms:"",idx:240,isOpen:true,stage:0,type:3,pathColorType:0}

        ]
        return list;
    };
    getIsPicked (idx: any) {
        let item = this.getItem(idx);
        if (item != null) {
            return (item.stage > 0);
        }
        return false;
    };
    /**
     * 通过value数据获取id
     * @param value = { x: 0, y: 0 };
     * @returns 
     */
    getCanidx(value: { x: number; y: number; }) {
        let idx = value.x * this.mapData.rowNum + value.y;
        return idx;
    };
    /**
     * 通过id拿到数据
     * @param {*} idx 
     * @returns 
     */
    getItem (idx: string | number) {
        return this.mapData.data[idx];
    };
    getCanPick (idx: any) {
        let item = this.getItem(idx);
        if (item != null) {
                return ((item.type >= 1 && item.type <= 7) || (item.type >= 11 && item.type <= 12));
        }
        return false;
    };
    /**
     * 是否允许探险
     * @param {*} idx 
     * @returns 
     */
    getIsObstacle (idx: any) {
        let item = this.getItem(idx);
        if (item != null) {
                return item.type == 99;
        }
        return false;
    };

    getIsOpen (idx: any) {
        let item = this.getItem(idx);
        if (item != null) {
            return item.isOpen;
        }
        return false;
    };

    getTreasureIdx () {
        return this.treasureIdx;
    };

    setItem (idx: string | number, data: any)     //idx从0开始
    {
        this.mapData.data[idx] = data;
    };

    setItemType (idx: string | number, type: any) {
        if (this.mapData.data[idx] != null)
            this.mapData.data[idx].type = type;
    };

    setItemOpen (idx: string | number, isOpen: boolean) {
        if (this.mapData.data[idx] != null) {
            this.mapData.data[idx].isOpen = isOpen;
           global.Instance.Log.debug('open idx ' + idx.toString() , ' type ' + this.mapData.data[idx].type.toString());
        }

    };

    getStandIdx () {
        return this.curStandIdx;
    };
    /**
     * 判断体力是否可以探险
     * @param itemIdx  探险地点ID
     * @returns 
     */
    isMagicEnough (itemIdx: number) {
        let item = this.getItem(itemIdx);

        if (item == null)
            return true;

        let magic = global.Module.MainPlayerData.getMagic();
        let data = global.Manager.DBManager.findData('RobFunc', 'ID', item.type);

        if (data != null) {
            let workUse = data.cost;
            return (magic > workUse);
        }

        return true;
    };
    //通过ID取点
    indexToRowCol (idx: number) {
        let item = {x:0,y:0};
        //修改到指定idx的数值
        let colNum = this.mapData.colNum;
        item.x = Math.floor(idx % colNum);        //列数
        item.y = Math.floor(idx / colNum);        //行数
       

        return item;
    };
    //取上一步起始点
    indexEndToRowCol (lineMap: string | any[]) {
        let item = { x: 0, y: 0 };
        global.Instance.Log.debug("取上一步起始点",lineMap)
        if (lineMap.length != 0)
            item = lineMap[lineMap.length - 1].endCell;
        return item;
    };
    indexToServerPos (idx: any) {
        let item = this.indexToRowCol(idx);
        let cellSize = 120;

        let position = cc.v2(0, 0);


        position.x = parseInt((item.x * cellSize).toString())+ cellSize / 2;
        position.y = parseInt((item.y * cellSize).toString()) + cellSize / 2;

        return position;
    };

    openItem (idx: any) {
        let item = this.getItem(idx);

        if (!item.isOpen) {
            let isRunAction = !item.isOpen/*&&(item.type==8 || item.type==10)*/;
            this.setItemOpen(idx, true);

            this.owner.openItem(idx, isRunAction);
        }
    };

    openArround (openIdx: any) {
        let arround = this.makeNeighborArray(openIdx, true);
        for (let key in arround) {
            let idx = arround[key];
            let item = this.getItem(idx);

            if (item && !item.isOpen) {
                this.openItem(idx);
            }
        }
    };

    closeArround (closeIdx: any, curIdx: any) {
        let arround = this.makeNeighborArray(closeIdx, true);
        for (let key in arround) {
            let idx = arround[key];

            if (idx != curIdx) {
                let item = this.getItem(idx);
                item.isOpen = false;

                this.owner.closeItem(idx);
            }
        }
    };

    searchdPath (beginIdx: any, targetIdx: any) {
        let beginItem = this.indexToRowCol(beginIdx);
        let endItem = this.indexToRowCol(targetIdx);
        return this.findPath.search(beginItem.x, beginItem.y, endItem.x, endItem.y);
    };

    randEvent () {
        let recordNum = global.Manager.DBManager.getRecordNum("GuJiEvent");
        let idx = Math.ceil(Math.random()*(recordNum - 1)) + 1;
        let record = global.Manager.DBManager.getLine("GuJiEvent", idx);

        return record;
    };
    makeNeighborArray (openIdx: number, isIncline: boolean) {
        let colNum = this.mapData.colNum;
        let rowNum = this.mapData.rowNum;

        let neighborArray = new Array();

        let maxIdx = (rowNum - 1) * colNum + colNum - 1;
        let rowIdx = Math.floor(openIdx / colNum);
        let colIdx = openIdx % colNum;
        //up
        let upIdx = openIdx - colNum;
        if (upIdx >= 0)
            neighborArray.push(upIdx);

        //down 
        let downIdx = openIdx + colNum;
        if (downIdx <= maxIdx)
            neighborArray.push(downIdx);

        //left
        let leftIdx = openIdx - 1;
        if (colIdx > 0)
            neighborArray.push(leftIdx);

        //right
        let rightIdx = openIdx + 1;
        if (colIdx < colNum - 1)
            neighborArray.push(rightIdx);

        if (isIncline) {
            //left up
            let leftUpIdx = openIdx - colNum - 1;
            if (colIdx > 0 && upIdx >= 0)
                neighborArray.push(leftUpIdx);

            //right up
            let rightUpIdx = openIdx - colNum + 1;
            if (upIdx >= 0 && colIdx < colNum - 1)
                neighborArray.push(rightUpIdx);

            //left down
            let leftDownIdx = openIdx + colNum - 1;
            if (colIdx > 0 && downIdx <= maxIdx)
                neighborArray.push(leftDownIdx);

            //right down
            let rightDownIdx = openIdx + colNum + 1;
            if (downIdx <= maxIdx && colIdx < colNum - 1)
                neighborArray.push(rightDownIdx);
        }

        return neighborArray;
    };
 
    setIsAnimation(isShow) {
        this.isAnimation = isShow;
    };
    getIsAnimation() {
        return this.isAnimation;
    };
    setMapData (mapData: { col: number; row: number; }) {
        this.setIsAnimation(false);
        this.contentData = mapData;
        this.mapData.rowNum = mapData.row;
        this.mapData.colNum = mapData.col;
    };
    getContentData () {
        return this.contentData;
    };
    getIsWarter (item: { type: number; cellTypeLandforms: string | string[]; }) {
        return false;
      
    };

    getPassMonsterTask () {
        return this.monsterTask;
    };

    getGuideLightIdx (guideName: any) {
        let guideData = global.Manager.DBManager.findData('NewGuide', 'guideKey', guideName);
        if (guideData != null) {
            return guideData.arg;
        }

        return -1;
        //return this.guideLightIdx;
    };

    getNearFarFlag () {
        return this.nearFarFlag;
    };

    getHurtCount (robId: string | number) {
        if (this.hurtCounts[robId])
            return this.hurtCounts[robId];
        else
            return 0;
    };

    addHurtCount (robId: string | number) {
        if (this.hurtCounts[robId] == null)
            this.hurtCounts[robId] = 1;
        else
            ++this.hurtCounts[robId];
    };

    onRobMapRsp (msg: { errorID: { toString: () => string; }; actionValue: any; monsterTask: boolean; }) {
        if (msg.errorID) {
            global.Instance.Log.debug('onRobMapRsp:' , msg.errorID.toString());
        }
        global.Module.MainPlayerData.setMagic(msg.actionValue);
        this.monsterTask = msg.monsterTask;
    };
    onRobMapNtf (msg: { type: any; cells: string | any[]; }) {
        global.Instance.Log.debug('ProxyGuJi onRobMapNtf msg -- 探险数据',msg);
        this.zeroPos = { x: 0, y: 0 ,idx:0 }

        let type = msg.type;
        if (type == 0) {
            let length = msg.cells.length;
            this.mapData.data = new Array(length);
        }
        for (let i = 0; i < msg.cells.length; ++i) {
            let value = msg.cells[i];
            let idx = value.y * this.mapData.colNum + value.x;
            let item = { 
                idx: idx, 
                stage: value.stage, 
                type: value.type, 
                cellTypeLandforms: value.cellTypeLandforms, 
                isOpen: false,
                x:value.x,
                y:value.y
            };

            if (type == 0)
                item.isOpen = false;
            else {
                item.isOpen = this.mapData.data[idx].isOpen;
            }

            item.isOpen = true;

            if (value.type == -1) { //设置初始坐标
                this.setZeroPos(value,idx);
            }

            this.mapData.data[idx] = item;
        }

        if (type == 0) {
            global.CommonClass.Functions.loadScene("GuJiScene",null);
        }
    };

    onRobUseSkillRsp (msg: { result: number; }) {
        global.Instance.Log.debug('onRobUseSkillRsp',msg)
        this.nearFarFlag = msg.result;
    };

    onRobDistanceRsp (msg: { result: number; }) {
        this.nearFarFlag = msg.result;
    };

    onRobNewTreasureNtf (msg: { x: number; y: number; }) {
        let idx = msg.x * this.mapData.rowNum + msg.y;

        this.treasureIdx = idx;
    };

    onRobMonsterCollisionRsp (msg: any) {
        global.Instance.Log.debug("怪物碰撞",msg)
    };

    onRobBombMonsterRsp (msg: any) {
        global.Instance.Log.debug("消灭毒虫",msg)
    };

    onRobLookItemRsp (msg: any) {
        global.Instance.Log.debug("挖去地貌表皮，漏出宝物，",msg)
    };
    onRobCompleteGuideRsp (msg: any) {
        global.Instance.Log.debug("远近任务特殊接口处理",msg)
        
    };
}
