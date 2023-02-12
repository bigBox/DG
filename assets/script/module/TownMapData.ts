

const {ccclass, property} = cc._decorator;

@ccclass
export default class TownMapData extends cc.Component {
    curID: number;
    isInEditor: boolean;
    pathData: any;
    findPath: any;

    constructor() {
        super();
        this.curID = 1001;
        this.isInEditor = false;
   };

    // use this for initialization
    onLoad() {

    };
    randomTown(keyword, stage,result) {
        let cityNpcData = global.Manager.DBManager.getData('CityNpcTalk');
        let arr = [];
        let item = null;
        let maxNum = 0;
        for (let i = 0; i < cityNpcData.length; i++) {
            var cityNpc = cityNpcData[i];
            if (cityNpc[keyword] && cityNpc[keyword] != 0 && cityNpc.round == stage && (stage != 3 || (stage == 3 && cityNpc.result == result))) {
                cityNpc.minNum = maxNum;
                maxNum = maxNum + cityNpc[keyword];
                cityNpc.maxNum = maxNum;
                arr.push(cityNpc);
            }
        }
        let id = global.CommonClass.Functions.randomNum(0, maxNum, 0);
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].minNum <= id && arr[i].maxNum >= id) {
                item = arr[i];
                break;
            }
        }
        return item;
    };
    loadScene(mapID) {
        if (mapID > 0) {
            // if (mapID != 1001) {
            //     global.CommonClass.UITip.showTipTxt('暂未开放', global.Enum.TipType.TIP_BAD);
            //     return;
            // }
            this.setPathData(mapID);
            this.setID(mapID);
            global.CommonClass.Functions.changeScene('TownScene');
        }

   };

    setIsInEditorMode(isInEditor) {
        this.isInEditor = isInEditor;
   };

    getIsInEditorMode() {
        return this.isInEditor;
   };

    setID(ID) {
        this.curID = ID;
   };

    getID() {
        return this.curID;
   };

    getPathData() {
        return this.pathData;
   };

    indexToRowCol(idx) {
        let item = { x: 0, y: 0 };

        let colNum = this.pathData.colNum;
        item.x = Math.floor(idx / colNum);        //行数
        item.y = Math.floor(idx % colNum);        //列数

        return item;
   };

    setPathData(mapID) {
        this.pathData = { rowNum: 60, colNum: 60, data: new Array() };
        this.findPath = new global.CommonClass.FindPath;

        let passCondition = function (item) {
            return item.type == 0;        //0.不是障碍
        };

        this.findPath.setMap(this.pathData);
        this.findPath.setPassCondition(passCondition);

        let cityData = global.Manager.DBManager.findData('CityList', 'ID', mapID);
        this.loadObstacle(cityData.obstacles);
   };

    loadObstacle(strObstacle) {
        let obstacles = global.CommonClass.Functions.splitNumbers(strObstacle, '|');
        this.pathData.data = [];

        let isObstacle = function (idx) {
            for (let key in obstacles) {
                if (obstacles[key] == idx)
                    return false;
            }

            return true;
        };

        for (let i = 0; i < this.pathData.rowNum; ++i) {
            for (let j = 0; j < this.pathData.colNum; ++j) {
                let type = 0;
                let idx = i * this.pathData.colNum + j;
                if (isObstacle(idx))
                    type = 1;

                let item = { type: type };
                this.pathData.data.push(item);
            }
        }
   };

    searchdPath(beginIdx, targetIdx) {
        let beginItem = this.indexToRowCol(beginIdx);
        let endItem = this.indexToRowCol(targetIdx);

        return this.findPath.search(beginItem.x, beginItem.y, endItem.x, endItem.y);
   };

    setCanPass(index, isCanPass) {
        let item = this.pathData.data[index];
        if (item != null)
            item.type = isCanPass ? 0 : 1;
   };

    getCanPass(index) {
        let item = this.pathData.data[index];
        if (item != null)
            return item.type == 0;

        return false;
   };

    setPickItemCanPass(worldPoint, canPass) {
        let TownMap = global.Instance.Dynamics["TownMap"];
        let pickItem = TownMap.getPickItem(worldPoint);

        if (pickItem != null) {
            let spMask = pickItem.getChildByName('spMask');
            spMask.active = !canPass;

            let idx = pickItem.tagEx;
            this.setCanPass(idx, canPass);
        }
   };

    getPassIndexStr() {
        let strPass = '';
        for (let i = 0; i < this.pathData.data.length; ++i) {
            let canPass = this.pathData.data[i].type == 0;
            if (canPass) {
                strPass += i.toString() + '|';
            }
        }
        strPass = strPass.substring(0, strPass.length - 1);

        return strPass;
   };

    saveToLocal() {
        let data = {};
        data[this.curID] = this.getPassIndexStr();

        cc.sys.localStorage.setItem('cityMapData', JSON.stringify(data));
   };

    loadLocal() {
        let localData = cc.sys.localStorage.getItem('cityMapData');
        if (localData) {
            let data = JSON.parse(localData);
            if (data != null) {
                let strPass = data[this.curID];
                this.loadObstacle(strPass);
            }
            else {
                this.loadObstacle('');
            }
            let TownMap = global.Instance.Dynamics["TownMap"];
            TownMap.reflashCells();
        }
   };

    readFromFile() {
        let cityData = global.Manager.DBManager.findData('CityList', 'ID', this.curID);
        this.loadObstacle(cityData.obstacles);

        let TownMap = global.Instance.Dynamics["TownMap"];
        TownMap.reflashCells();
   };

    clearPass() {
        this.loadObstacle('');

        let TownMap = global.Instance.Dynamics["TownMap"];
        TownMap.reflashCells();
   };

    // update (dt) {}
}
