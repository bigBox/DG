

const { ccclass, property } = cc._decorator;

@ccclass
export default class ProxyFactoryGuide extends cc.Component {
    data: any[];
    curFactoryID: any;

    constructor() {
        super();
        this.data = new Array();

        this.curFactoryID = null;

        let factorys = global.Manager.DBManager.getData('Factory');
        for (let key in factorys) {
            let factory = factorys[key];
            let item = { factoryID: factory.ID, guide: false };
            this.data.push(item);
        }
    };

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {};

    start() {

    };

    setData(severData) {
        for (let key in severData) {
            let data = severData[key];
            let factoryID = data.key;
            let item = this.getGuideItem(factoryID);
            if (item != null)
                item.guide = (data.value != 0);
        }
    };

    getGuideItem(factoryID) {
        for (let key in this.data) {
            let item = this.data[key];
            if (item.factoryID == factoryID) {
                return item;
            }
        }

        return null;
    };
    
    getFactoryByCurScene(factoryID) {
        let scene = cc.director.getScene();

        let data = global.Manager.DBManager.findData('Factory', 'ID', factoryID);
        if (data.scene == scene.name) {
            if (scene.name == "MainScene") {
                let factory = global.Instance.Dynamics["MainMap"].getFactoryClassByTempID(factoryID);
                return factory;
            }
        }

        return null;
    };

    centerCurrentScene() {
        let level = global.Module.MainPlayerData.getDataByKey('Level');
        let needGuides = this.getNeedGuidesByLevel(level);
        let scene = cc.director.getScene();
        let sceneName = scene.name;

        for (let key in needGuides) {
            let value = needGuides[key];
            let factory = global.Manager.DBManager.findData('Factory', 'ID', value);
            if (factory != null && factory.needCenter) {
                if (sceneName == factory.scene) {
                    let dragLayer = null;

                    if (scene.name == "WorldMapScene") {
                        dragLayer = global.CommonClass.DragLayer.getDragLayer('WorldMap');
                    }
                    else if (scene.name == "MainScene") {
                        dragLayer = global.CommonClass.DragLayer.getDragLayer('MainMap');
                    }
                    else if (scene.name == "FarmParkScene") {
                        dragLayer = global.CommonClass.DragLayer.getDragLayer('FarmParkMap');
                    }

                    if (dragLayer != null) {
                        // dragLayer.scaleItemLayer(1);
                        let scale = dragLayer.getItemScale();
                        let position = cc.v2(factory.x * scale, factory.y * scale);
                        dragLayer.setDragItemPosition(position);
                        return true;
                    }
                }
            }
        }

        return false;
    };

    showFactoryNewHelpByLevel(level) {
        let needGuids = this.getNeedGuidesByLevel(level);

        for (let key in needGuids) {
            let value = needGuids[key];
            let factory = this.getFactoryByCurScene(value);
            if (factory != null) {
                let scene = cc.director.getScene();
                let sceneName = scene.name;

                if (sceneName == 'WorldMapScene')       //大地图引导要缩放
                {
                    factory.createHelp(function (item) {
                        item.setIconOffset(cc.v2(-30, 50));
                        item.setIconScale(0.4);
                    });
                }
                else {
                    factory.createHelp();
                }
            }
        }
    };

    showFactoryNormalByLevel(level) {
        let needActives = this.getNeedActiveByLevel(level);

        for (let key in needActives) {
            let value = needActives[key];
            let factory = this.getFactoryByCurScene(value);
            if (factory != null)
                factory.setGray(false);
        }
    };

    showFactoryByLevel(level) {
        let shows = this.getNeedShowsByLevel(level);

        for (let key in shows) {
            let value = shows[key];
            let factory = this.getFactoryByCurScene(value);
            if (factory != null)
                factory.node.active = true;
        }
    };

    setCurFactoryID(ID) {
        this.curFactoryID = ID;
    };

    getNeedGuide(factoryID) {
        let value = this.getGuideItem(factoryID);

        let factoryData = global.Manager.DBManager.findData('Factory', 'ID', factoryID);
        if (factoryData != null) {
            let level = global.Module.MainPlayerData.getLevel();
            if (factoryData.guideLevel > 0 && factoryData.guideLevel <= level && !value.guide)
                return true;
        }

        return false;
    };

    setGuided(factoryID) {
        for (let key in this.data) {
            let value = this.data[key];

            if (value.factoryID == factoryID) {
                let data = { type: 1, key: key, buildingK: factoryID, buildingV: 1 };
                let factory = this.getFactoryByCurScene(factoryID);
                if (factory != null)
                    factory.removeHelp();

                return true;
            }
        }

        return false;
    };

    getNeedGuidesByLevel(level) {
        let guides = new Array();

        for (let key in this.data) {
            let value = this.data[key];
            let factoryData = global.Manager.DBManager.findData('Factory', 'ID', value.factoryID);
            if (factoryData != null) {
                if (factoryData.guideLevel > 0 && factoryData.guideLevel <= level && !value.guide)
                    guides.push(value.factoryID);
            }
        }

        return guides;
    };

    getNeedActiveByLevel(level) {
        let factorys = new Array();
        let oldLevel = global.Module.MainPlayerData.getOldData('Level');

        for (let key in this.data) {
            let value = this.data[key];
            let factoryData = global.Manager.DBManager.findData('Factory', 'ID', value.factoryID);
            if (factoryData != null) {
                if (factoryData.levelRequire <= level && factoryData.levelRequire > oldLevel)
                    factorys.push(value.factoryID);
            }
        }

        return factorys;
    };


    getNeedShow(factoryID) {
        for (let key in this.data) {
            let value = this.data[key];

            let factoryData = global.Manager.DBManager.findData('Factory', 'ID', factoryID);
            if (factoryData != null) {
                if (value.factoryID == factoryID) {
                    // let level = cc.Module.MainPlayerData.getLevel();
                    //if (factoryData.showLevel>=0 && factoryData.showLevel<=level)
                    return true;
                }
            }
        }

        return false;
    };

    getNeedShowsByLevel(level) {
        let oldLevel = global.Module.MainPlayerData.getOldData('Level');

        let shows = new Array();
        for (let key in this.data) {
            let value = this.data[key];
            let factoryID = value.factoryID;

            let factoryData = global.Manager.DBManager.findData('Factory', 'ID', factoryID);
            if (factoryData != null) {
                if (factoryData.showLevel <= level && factoryData.showLevel > oldLevel)
                    shows.push(factoryID);
            }
        }

        return shows;
    };

    getCurGuideFactory() {
        let curGuide = global.Proxys.ProxyGuide.getCurrentGuide();
        if (curGuide != null) {
            let guideData = global.Manager.DBManager.findData('NewGuide', 'ID', curGuide.ID);
            return guideData.centerBuild;
        }

        return 0;
    };

    getNeedShowGuide(factoryID) {
        let guideFactoryID = this.getCurGuideFactory();
        return (guideFactoryID == factoryID)
    };

    getFactoryByID(factoryID) {
        for (let key in this.data) {
            let value = this.data[key];
            if (value.factoryID == factoryID)
                return value;
        }

        return null;
    };

    executeGuide() {
        let factory = this.getFactoryByID(this.curFactoryID);
        if (factory != null) {
            let ID = factory.factoryID;

            if (this.getNeedGuide(ID))
                this.setGuided(ID);
        }

        this.curFactoryID = null;
    };

    onLevelUp(level) {
        // let level = cc.Module.MainPlayerData.addLevel();

        //let level = cc.Module.MainPlayerData.getDataByKey('Level');

        this.showFactoryByLevel(level);
        this.showFactoryNormalByLevel(level);
        // this.showFactoryNewHelpByLevel(level);
        // this.centerCurrentScene();
    };
}
