//大本营数据类
const {ccclass, property} = cc._decorator;
@ccclass
export default class MainMapData {
    factorys: any;
    factoryNum: number;
    isFristLoad: boolean;
    obstacles: {};
    map: any;

    constructor () {
        this.factorys = null;
        this.factoryNum = 0;
        this.isFristLoad = true;//是否是初始化静茹大本营场景

        this.obstacles = {};
    };

    getFristLoad () {
        return this.isFristLoad;
    };

    setFristLoad (fristLoad: boolean) {
        this.isFristLoad = fristLoad;
    };

    setMap (map: any) {
        this.map = map;
        if (!global.Instance.Socket.isConnected()) {
            this.loadLocal();
        }

    };

    getFactorys () {
        return this.factorys;
    };

    getFactoryNum () {
        return this.factoryNum;
    };

    centerMap () {
        if (this.map != null)
            this.map.centerMap();
    };

    saveToLocal () {
        let ndFactory = this.map.getFactoryNode();
        let factorys = ndFactory.getChildren();

        this.factoryNum = this.factoryNum;
        let newFactorys = {};

        for (let k in factorys) {
            let factory = factorys[k];
            let ID = factory.tagEx;
            let item = newFactorys[ID] = {
                scaleX:factory.getChildByName('spFactory').scaleX || 1,
                templateID:this.factorys[ID].templateID,
                position:factory.getPosition()
            };
            // cc.Instance.Log.debug('factory name : '+factory.name + ' x:%d y:%d ', item.position.x, item.position.y);
        }
        this.factorys = newFactorys;
        let mapData = { factorys: newFactorys, factoryNum: this.factoryNum };
        cc.sys.localStorage.setItem('mapData', JSON.stringify(mapData));
    };

    getMakeGoodsType (factoryID: any) {
        let data = global.Manager.DBManager.findData('Factory', 'ID', factoryID);
        if (data.type == 'makeGoods') {
            if (data.userData == 1) //炼炉
                return 'MakeMine';
            else if (data.userData == 2)   //面油
                return 'MakeOil';
            else if (data.userData == 3)   //制作上海菜
                return 'MakeMeal';
            else if (data.userData == 4)   //金属装备
                return 'MakeEquip';
            else if (data.userData == 5)   //制作乳品
                return 'MakeSdairy';
            else if (data.userData == 6)   //制作酱菜
                return 'MakeSauce';
            else if (data.userData == 7)   //制糖
                return 'MakeSugar';
            else if (data.userData == 8)   //纺纱厂
                return 'MakeSpin';
            else if (data.userData == 9)   //制作湘菜
                return 'MakeOil';
        }

        return null;
    };

    getFactory (ID: string | number) {
        return this.factorys[ID];
    };

    getObstacle (ID: any) {
        for (let key in this.obstacles) {
            let item = this.obstacles[key];
            if (item.ID == ID)
                return item;
        }

        return null;
    };

    setPosition (ID: string | number, position: { x: any; y: number; }) {
        let factory = this.getFactory(ID);
        if (factory != null) {
            factory.position = cc.v2(position);
        }
        else {
            let item = { templateID: ID, scaleX: 1, position: cc.v2(position.x, position.y) };
            this.factorys[ID] = item;
        }
    };

    loadLocal () {
        //let data = JSON.parse(cc.sys.localStorage.getItem('mapData'));

        let factorys = global.Manager.DBManager.getData('Factory');
        this.factoryNum = 0;
        this.factorys = {};

        for (let key in factorys) {
            let factory = factorys[key];
            if (factory.scene == 'MainScene') {
                let item = { templateID: factory.ID, scaleX: 1, position: cc.v2(factory.x, factory.y) };
                this.factorys[factory.ID] = item;
                ++this.factoryNum;
            }
        }
    };

    onObstaclesListRsp (msg: { error: any; req: { roleId: { toNumber: () => any; }; }; land: any[]; }) {
        if (!msg.error) {
            let isInOtherRoom = global.Module.GameData.isInOtherHome();
            let roleId = msg.req.roleId.toNumber();
            let mainRoleID = global.Module.MainPlayerData.getRoleID();
            global.Instance.Log.debug('onObstaclesListRsp ' ,msg);
            global.Instance.Log.debug('roleId ' , roleId.toString());
            global.Instance.Log.debug('mainRoleId ' , mainRoleID.toString());
            if (!isInOtherRoom) {
                let data = msg.land.map;
                for (let key in data) {
                    let item = { ID: key, isOpen: 1 };
                    this.obstacles[key] = item;
                }
            }
            else {
                global.Module.PlayerMapData.setObstaclesData(msg.land.map);
            }
        }
    };

    onObstaclesOpenupRsp (msg: { errorID: any; req: { index: any; }; }) {
        if (!msg.errorID) {
            let ID = msg.req.index;

            if (this.obstacles[ID] == null)
                this.obstacles[ID] = { ID: ID };

            this.obstacles[ID].isOpen = true;
        }
    };

    onScenePosRsp (msg: { errorID: any; req: { roleId: any; }; pos: { map: { [x: string]: { value: any; }; }; }; }) {
        global.Instance.Log.debug('onScenePosRsp',msg)
        if (!msg.errorID) {
            let mainRoleID = global.Module.MainPlayerData.getRoleID();
            if (msg.req.roleId == mainRoleID) {
                let factorys = {};
                let count = 0;

                for (let key in msg.pos.map) {
                    let position = msg.pos.map[key].value;

                    let tempID = parseInt(key);

                    let data = global.Manager.DBManager.findData('Factory', 'ID', tempID);
                    if (data && data.scene != 'MainScene') {
                        position.x = data.x;
                        position.y = data.y;
                    }

                    let item = { templateID: tempID, scaleX: 1, position: cc.v2(position.x, position.y) };
                    factorys[tempID] = item;

                    ++count;
                }

                if (factorys != null) {
                    this.factorys = factorys;
                    this.factoryNum = count;
                }
            }
            else {
                global.Module.PlayerMapData.setMapData(msg.pos.map);
            }
        }
    };

    onScenePosUpdateRsp (msg: any) {

    };
}
