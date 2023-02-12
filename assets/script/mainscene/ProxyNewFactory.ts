

const { ccclass, property } = cc._decorator;

@ccclass
export default class ProxyNewFactory extends cc.Component {
    factorys: any;

    onLoad() { }

    start() {

    }
    getFactorys() {
        return this.factorys;
    };

    getNeedShow() {
        let data = new Array();
        let level = global.Module.MainPlayerData.getLevel();
        for (let key in this.factorys) {
            let value = this.factorys[key];

            if (value.levelRequire <= level && value.showLevel < 0)
                data.push(value);
        }

        let cache = new Array();
        let minNextLevel = 9999999;
        for (let key in this.factorys) {
            let value = this.factorys[key];
            if (value.levelRequire > level && value.showLevel < 0) {
                if (minNextLevel > value.levelRequire) {
                    minNextLevel = value.levelRequire;
                    cache = [];
                    cache.push(value);
                }
                else {
                    if (minNextLevel == value.levelRequire) {
                        cache.push(value);
                    }
                }
            }
        }

        for (let key in cache) {
            data.push(cache[key]);
        }

        return data;
    };

    setFactoryData() {
        this.factorys = new Array();

        let data = global.Manager.DBManager.getData("Factory");
        for (let key in data) {
            let ID = data[key].ID;
            let factory = global.Module.MainMapData.getFactory(ID);
            let factoryData = global.Manager.DBManager.findData("Factory", 'ID', ID);

            let needShow = global.Proxys.ProxyFactoryGuide.getNeedShow(ID);

            if (!needShow || (factory == null && factoryData.scene == 'MainScene')) {
                let value = data[key];
                this.factorys.push(value);
            }
        }
    };

    removeFactory(templateID) {
        for (let idx in this.factorys) {
            let factory = this.factorys[idx];
            if (factory.ID == templateID) {
                let itemIdx = parseInt(idx);
                this.factorys.splice(itemIdx, 1);
                return true;
            }
        }

        return false;
    };

}
