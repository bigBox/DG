
const { ccclass, property } = cc._decorator;

@ccclass
export default class GuideMask extends cc.Component {
    @property(cc.Boolean )
    maskTouch: Boolean = true;
    onEnable() {
        this.enableTouch(this.maskTouch);
    }

    enableTouch(isEnable) {
        // this.clickMask.active = isEnable;

        let guideMask = this.node.getChildByName('guideMask');
        let guideMasks = guideMask.children;

        let ndMasks: any = this.node.getChildByName('ndMask')
        ndMasks = ndMasks.children;

        if (isEnable) {
            for (let key in guideMasks) {
                let ndMask = guideMasks[key];
                ndMask.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
                ndMask.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
                ndMask.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
                ndMask.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
            }


            for (let idx in ndMasks) {
                let ndGuide = ndMasks[idx];
                ndGuide.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
                ndGuide.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
                ndGuide.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
                ndGuide.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
            }
        }
        else {
            for (let key in guideMasks) {
                let ndMask = guideMasks[key];
                ndMask.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
                ndMask.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
                ndMask.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
                ndMask.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
            }


            for (let idx in ndMasks) {
                let ndGuide = ndMasks[idx];
                ndGuide.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
                ndGuide.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
                ndGuide.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
                ndGuide.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
            }
        }
    }

    touchEvent() {

    }

    centerToNode(node) {
        global.CommonClass.Functions.setNodePosToTarget(this.node, node, null);
    }


    // update (dt) {}
}
