//户外逻辑处理暂无

const {ccclass, property} = cc._decorator;
@ccclass
export default class ProxyWorldMap {
    map: any;
    mapID: number;
    constructor () {
        this.map = null;
        this.mapID = -1;

    };
    setMapID(mapID) {
        this.mapID = mapID;
    }
    getMapID() {
        return this.mapID;
    };
    setMap (map: any) {
        this.map = map;
    };

    getMap () {
        return this.map;
    };
}
