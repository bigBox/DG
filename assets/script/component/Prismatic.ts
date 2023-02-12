
let Man =window["Man"];
const {ccclass, property} = cc._decorator;

@ccclass
export default class Prismatic extends cc.Component {
       
        static className:string = 'Prismatic';
        @property({displayName: "xPickRate", tooltip: "xPickRate" })
        xPickRate:number = 0;
        @property({displayName: "yPickRate", tooltip: "yPickRate" })
        yPickRate:number = 0;

    // use this for initialization
    onLoad () {

    };

    isPicked(touchPoint) {
        // (this.xPickRate == 0 || this.yPickRate == 0) {
        let boundingBox = this.node.getBoundingBoxToWorld();
        return boundingBox.contains(touchPoint);
    };

    // update (dt) {}
}
