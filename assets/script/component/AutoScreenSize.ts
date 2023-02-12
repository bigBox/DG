

const { ccclass, property } = cc._decorator;

@ccclass
export default class AutoScreenSize extends cc.Component {
    @property({ type: cc.Node, displayName: "nodeParent", tooltip: "nodeParent" })
    nodeParent: cc.Node = null;
    @property({  displayName: "numLeft", tooltip: "numLeft" })
    numLeft: number;
    @property({  displayName: "numRight", tooltip: "numRight" })
    numRight: number;
    @property({  displayName: "numTop", tooltip: "numTop" })
    numTop: number;
    @property({  displayName: "numBottom", tooltip: "numBottom" })
    numBottom: number;
    constructor() {
        super();
        this.numLeft = 0;
        this.numRight = 0;
        this.numTop = 0;
        this.numBottom = 0;
    };
    onLoad() {
        if (this.nodeParent == null) {
            let canvas = cc.find("Canvas");
            // if (canvas) {
            this.node.height = canvas.height - this.numTop - this.numBottom;
            this.node.width = canvas.width - this.numLeft - this.numRight;
            // }
        } else {
            this.node.width = this.nodeParent.width - this.numLeft - this.numRight;
            this.node.height = this.nodeParent.height - this.numTop - this.numBottom;
        }
    }

    start() {

    }

    // update (dt) {}
}
