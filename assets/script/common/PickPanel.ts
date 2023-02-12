

const {ccclass, property} = cc._decorator;

@ccclass
export default class PickPanel extends cc.Component {
    @property({type: cc.Node,displayName: "pickNode",tooltip: ""})
    pickNode: cc.Node = null;
    yPickRate: number;
    xPickRate: number;
    constructor() {
        super();
        //this.coins = new Array;
        this.xPickRate = 0;
        this.yPickRate = 0;
    };
    // use this for initialization
    onLoad () {

    };

    isPicked(touchPoint) {
        if (this.xPickRate==0 || this.yPickRate==0)
        {
            let boundingBox = this.pickNode.getBoundingBoxToWorld();
            return boundingBox.contains(touchPoint);
        }
        else
        {
            return global.CommonClass.Geometry.checkSlantingSpIsInPoint(touchPoint, this.pickNode, this.xPickRate, this.yPickRate);
        }
    };
}
