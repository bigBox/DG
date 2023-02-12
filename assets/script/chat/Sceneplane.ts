const { ccclass, property } = cc._decorator;

@ccclass
export default class Sceneplane extends cc.Component {

    onLoad() {
        var withX = global.Manager.Sdk.sizeMath();
        this.node.getComponent(cc.Widget).left = withX;
        this.node.getComponent(cc.Widget).right = withX;
    }

    start() {

    }

    // update (dt) {}
}
