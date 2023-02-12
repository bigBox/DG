

const { ccclass, property } = cc._decorator;

@ccclass
export default class ActionPigeon extends cc.Component {

    onLoad() { }

    start() {

    }

    onBeginFly() {
        let skeleton = this.node.getComponent(sp.Skeleton);

        skeleton.loop = true;
        skeleton.paused = false;
        skeleton.animation = "idle to fly";
    };

    onFly() {
        let skeleton = this.node.getComponent(sp.Skeleton);

        skeleton.loop = true;
        skeleton.paused = false;
        skeleton.animation = "fly";
    };

    onBeginLoad() {
        let skeleton = this.node.getComponent(sp.Skeleton);

        skeleton.loop = false;
        skeleton.paused = false;
        skeleton.animation = "land";

    };

    onBeginWalk() {
        let skeleton = this.node.getComponent(sp.Skeleton);

        skeleton.loop = true;
        skeleton.paused = false;
        skeleton.animation = "walk";
    };
}
