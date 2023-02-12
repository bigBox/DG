const {ccclass, property} = cc._decorator;
@ccclass
export default class TownMapBase extends cc.Component {
    className:string = 'TownMapBase';
    mapSize: any;
    mainPlayer: any;
    isMoveMap: boolean;
    clickStartPos: any;
    ndMapCells: any;
    pathData: any;
    cellSize: cc.Size;
    mapCellsItem: cc.Node;
    ndPlayer: any;
    standCell: any;
    linst:string;
    doubleSubTime=400;//ms
    longSubTime=600;
 
    startClick=false;
    clickTime=0;
    startClickTime=0;
    endClickTime=0;
    constructor() {
        super();
        this.mapSize = null;

        this.mainPlayer = null;
        this.isMoveMap = false;
        this.clickStartPos = null;

        this.ndMapCells = null;
        this.linst=''
    };

    // use this for initialization
    onLoad() {
    };

    onEnable() {
        this.mapSize = this.node.getContentSize();
        this.pathData = global.Module.TownMapData.getPathData();
        this.cellSize = cc.size(this.mapSize.width / this.pathData.colNum, this.mapSize.height / this.pathData.rowNum);

        this.ndMapCells = this.node.getChildByName('ndMapCells');
      

        let self = this;
        let delayCreateCell = function () {
            self.createCells();
            self.initPlayer();
        };

        this.scheduleOnce(delayCreateCell, 0.02);

        global.Instance.Dynamics["TownMap"] = this;
        cc.director.getScheduler().schedule(this.selfUpdate, this, 0.1, cc.macro.REPEAT_FOREVER, 0, false);
    };

    onDisable() {
        cc.director.getScheduler().unschedule(this.selfUpdate, this);
        global.Instance.Dynamics["TownMap"] = null;
    };

    initPlayer() {
        this.ndPlayer = this.node.getChildByName('ndPlayer');

        this.mainPlayer = this.ndPlayer.getChildByName('mainPlayer').getComponent(global.CommonClass.MoveObject);
        this.mainPlayer.setMapOwner(this);

        let mapID = global.Module.TownMapData.getID();
        let cell = { x: 28, y: 21 };
        if (mapID == 1002)
            cell = { x: 49, y: 32 };


      
        let curCell = this.getCellByPathCell(cell);
        if (curCell != null) {
            let targetIdx = curCell.tagEx;

            this.standCell = curCell;
            let cellPos = curCell.getPosition();
            this.mainPlayer.node.setPosition(cellPos);
            this.ndPlayer.zIndex = targetIdx * 10 + 4;
        }
    };

    getClickFactory(touchPoint) {
        let ndEnters = this.node.getChildByName("ndEnters").children;
        for (let k in ndEnters) {
            let curND:any = ndEnters[k];
            let factory = curND.getComponent(global.CommonClass.TownFactoryBase);

            if (factory && factory.isPicked(touchPoint)) {
                return factory;
            }
        }
        return null;
    };

    createCell(index) {
        let mapData = this.pathData;

        let row = Math.floor((index) / mapData.colNum);
        let type = Math.floor((index) % mapData.colNum);

        let data = mapData.data;
        let item = data[index];

        let cellSize = this.mapCellsItem.getContentSize();

        cellSize.width *= this.mapCellsItem.scale;
        cellSize.height *= this.mapCellsItem.scale;

        let position = cc.v2(0, 0);

        if (this.mapCellsItem != null) {
            //cell item
            let newCell:any = cc.instantiate(this.mapCellsItem);
            this.ndMapCells.addChild(newCell);

            let nameCell = 'ndCells' + index.toString();
            newCell.name = nameCell;
            newCell.tagEx = index;

            newCell.active = true;

            let spMask = newCell.getChildByName('spMask');
            if (spMask != null) {
                let canPass = global.Module.TownMapData.getCanPass(index);
                spMask.active = !canPass;
            }

            let lblIdx = newCell.getChildByName('lblIndex');
            if (lblIdx != null)
                lblIdx.getComponent(cc.Label).string = index.toString();

            position.x = cellSize.width / 2 * type - cellSize.width / 2 * row;
            position.y = -cellSize.height / 2 * row - cellSize.height / 2 * type + 350;
            newCell.setPosition(position);
            

            let cellClass = newCell.getComponent(global.CommonClass.TownCellItem);
            if (cellClass != null)
                cellClass.setItem(item);
        }

    };

    createCells() {
        this.mapCellsItem = this.node.getChildByName('mapCellsItem1');


        let mapData = this.pathData;
        let itemNum = mapData.rowNum * mapData.colNum;

        this.ndMapCells.removeAllChildren();

        let loadCount = 0;
        for (let index = 0; index < itemNum; ++index) {
            let canPass = global.Module.TownMapData.getCanPass(index);
            if (canPass)
                this.createCell(index);

            ++loadCount;
            if (loadCount >= itemNum) {
            }
        }
    };

    reflashCells() {
        let ndCells = this.ndMapCells.getChildren();
        for (let key in ndCells) {
            let ndCell = ndCells[key];
            let idx = ndCell.tagEx;
            let canPass = global.Module.TownMapData.getCanPass(idx);

            let spMask = ndCell.getChildByName('spMask');
            spMask.active = !canPass;
        }
    };

    showCells(isShow) {
        this.ndMapCells.active = isShow;

        if (isShow)
            this.createCells();
    };

    getPickItem(worldPoint) {
        let mapData = this.pathData;
        let itemNum = mapData.rowNum * mapData.colNum;
        for (let i = 0; i < itemNum; ++i) {
            let cell = this.ndMapCells.getChildByName('ndCells' + i.toString());
            if (cell != null) {
                let cellClass = cell.getComponent(global.CommonClass.TownCellItem);

                if (cellClass != null) {
                    if (cellClass.isPicked(worldPoint)) {
                        return cellClass.node;
                    }
                }
            }
        }

        return null;
    };
    getCellByIndex(index) {
        let itemCell = this.ndMapCells.getChildByName('ndCells' + index.toString());
        return itemCell.getComponent(global.CommonClass.TownCellItem);
    };
    mapPositionToRowCol(position) {
        let item = { row: 0, type: 0 };
        let worldPoint = this.node.convertToWorldSpaceAR(position);
        let cell = this.getPickItem(worldPoint);
        if (cell != null) {
            let idx = cell.tagEx;
            return global.Module.TownMapData.indexToRowCol(idx);
        }

        return item;
    };

    getCellByPathCell(cell) {
        let mapData = this.pathData;
        let idx = cell.x * mapData.colNum + cell.y;

        return this.ndMapCells.getChildByName('ndCells' + (idx).toString());
    };

    getGoodsClassByIndex(index) {
        let cellClass = null;

        let cell = this.ndMapCells.getChildByName('ndCells' + (index).toString());
        if (cell != null)
            cellClass = cell.getComponent(global.CommonClass.TownCellItem);

        return cellClass;
    };

    getStandIdx() {
        if (this.standCell != null) {
            let index = this.standCell.tagEx;
            return index;
        }
        return null;
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

    updateStandCell(dt) {
        let curCellItem = this.mainPlayer.getCurCellItem();
        if (curCellItem != null) {
            let targetCell = this.getCellByPathCell(curCellItem);

            if (this.standCell != targetCell) {
                if (this.isObjectInCell(this.mainPlayer.node, targetCell)) {
                    let newIdx = targetCell.tagEx;


                    let zorder = newIdx * 10 + 4;
                    this.ndPlayer.zIndex = (zorder);

                    this.standCell = targetCell;
                }
            }
        }
    };

    gotoTarget(targetIdx,state, callback) {
        this.mainPlayer.play('zoulu', true);

        let curIdx = 0;
        let worldPoint = this.mainPlayer.node.convertToWorldSpaceAR(cc.v2(0, 0));
        let standNode = this.getPickItem(worldPoint);
        if (standNode != null)
            curIdx = standNode.tagEx;
        let path = global.Module.TownMapData.searchdPath(curIdx, targetIdx);
        let self = this;
        if (state == 2&&path.length>0){
            this.mainPlayer.fixedPath(path, function () {
                self.mainPlayer.play('daiji', true);
    
                if (callback)
                    callback();
            });
        }
        else{
            this.mainPlayer.findPath(path, function () {
                self.mainPlayer.play('daiji', true);
    
                if (callback)
                    callback();
            });
        }
       
       
    };

    onClickFactory(factory,state, touchPoint) {

    };

    onDragEvent(event) {
        let touchPoint = event.getLocation();
        let factory = this.getClickFactory(touchPoint);
       
        if (event.type == cc.Node.EventType.TOUCH_START) {
            this.clickStartPos = touchPoint;
            this.isMoveMap = false;
            this.startClick=true;
            this.startClickTime=new Date().getTime();
        }
        else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            let distance = touchPoint.sub(this.clickStartPos).mag();
            if (distance > 5)
                this.isMoveMap = true;
        }
        else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
            
            this.endClickTime=new Date().getTime();
            if(this.endClickTime-this.startClickTime>this.longSubTime){
                //长按事件
                this.stateClick(factory,touchPoint,0);
                this.startClick=false;
            }else if(this.endClickTime-this.startClickTime<this.doubleSubTime){
                //点击事件
                this.clickTime++;
                setTimeout(()=>{
                    if(this.clickTime==1){
                        //单击
                        this.stateClick(factory,touchPoint,1)
                    }else if(this.clickTime==2){
                        //双击
                        this.stateClick(factory,touchPoint,2)
                    }
                   
                    this.clickTime=0;
                },this.doubleSubTime)
            }



           
        }

        if (factory != null) {
            factory.onMouseEvent(event);
        }
    };
    /**
     * 
     * @param factory 
     * @param touchPoint 
     * @param state 0 长按 1 单击 2 双击
     */
    stateClick(factory,touchPoint,state){
        if (!this.isMoveMap) {
            if (factory != null) {
                this.onClickFactory(factory,state, touchPoint);
            }
            else {
                let cell = this.getPickItem(touchPoint);

                if (cell != null) {
                    let targetIdx = cell.tagEx;
                    this.gotoTarget(targetIdx,state,null);
                }
            }
        }
    };

    selfUpdate(dt) {
        //this.updateStandCell(dt);
    }
}

