

const {ccclass, property} = cc._decorator;

@ccclass
export default class UICommonBar extends cc.Component {
    closeCallBack: any;

    constructor() {
        super();
        this.closeCallBack = null;
    };

    btnClose(event, arg) {
        if (event.type=="touchend")
        {
            this.node.dispatchEvent(new cc.Event.EventCustom('closeCommonBar', true));   

            if (this.node.parent)
                this.node.parent.removeFromParent();
        }
    };
}
