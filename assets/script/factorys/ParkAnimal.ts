import FactoryBase from "./FactoryBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ParkAnimal extends FactoryBase {

    onLoad() { };
    start() {

    };

    onEnable() {

    };

    openBar(autoClose) {
        let spDoor = this.node.getChildByName('spDoor');
        let animation = spDoor.getComponent(cc.Animation);
        animation.stop();

        animation.play('openBar');

        if (autoClose) {
            let closeEnd = function () {
                animation.play('idleBar');
            };

            let delayEnd = function () {
                animation.play('closeBar');
                animation.on('finished', closeEnd);
            };

            let delayAction = cc.delayTime(2);
            let endFunction = cc.callFunc(delayEnd)
            let seq = cc.sequence(delayAction, endFunction);
            this.node.runAction(seq);
        }
    };

    idle() {

    };
    // update (dt) {}
}
