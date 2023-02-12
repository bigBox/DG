import FactoryBase from "../factorys/FactoryBase";//
const { ccclass, property } = cc._decorator;
@ccclass
export default class Honeycomb extends FactoryBase {
    @property({
        type: cc.Node,
        displayName: "引导节点",
        tooltip: "提示的引导节点"
    })
    helpNode: cc.Node = null;
    isPlaying: boolean;
    isFirend: boolean;
   
    onEnable() {
        this.isPlaying = false;
        this.isFirend = false;
        var data = global.Module.TaskData.getHasAcceptTaskData();
        if (!data)
            return;
        if (data.taskId == 10028 && data.state == 1)
            if (this.helpNode)
                this.helpNode.active = true;

    };
    setLeftTime(leftTime, totalTime) {
        if (!this.isFirend) {
            let spHavest = this.node.getChildByName('spHavest');
            let barTime = this.node.getChildByName('barTime');

            spHavest.active = leftTime <= 0;
            barTime.active = leftTime > 0;

            if (barTime.active) {
                let progress = 0.0001;
                if (leftTime != 0 && totalTime != 0)
                    progress = leftTime / totalTime;

                barTime.getComponent(cc.ProgressBar).progress = progress;

                let lblTime = barTime.getChildByName('lblTime');
                lblTime.getComponent(cc.Label).string = '剩余 ' + global.CommonClass.Functions.formatSeconds(leftTime);
            }

            if (spHavest.active) {
                if (!this.isPlaying) {
                    this.playItemJump(0.6);
                    this.isPlaying = true;
                }
            } else {
                let ndItem = this.node.getChildByName('spHavest').getChildByName('spHoney');
                ndItem.stopAllActions();

                this.isPlaying = false;
            }
        }

    };

    playItemJump(timeSpace) {
        let ndItem = this.node.getChildByName('spHavest').getChildByName('spHoney');
        let position = ndItem.getPosition();
        position.y = 0;

        ndItem.stopAllActions();
        ndItem.setPosition(position);

        let goodsAct1 = cc.moveTo(0.3, cc.v2(position.x, position.y + 30));
        let goodsBack1 = cc.moveTo(0.3, cc.v2(position.x, position.y));
        let goodsAct2 = cc.moveTo(0.09, cc.v2(position.x, position.y + 5));
        let goodsBack2 = cc.moveTo(0.09, cc.v2(position.x, position.y));
        let delayEnd = cc.delayTime(timeSpace);

        let seq = cc.sequence(goodsAct1, goodsBack1, goodsAct2, goodsBack2, delayEnd);
        let repeat = cc.repeatForever(seq);

        ndItem.runAction(repeat);
    };

    setIsFriend(isFirend) {
        if (isFirend) {
            let spHavest = this.node.getChildByName('spHavest');
            spHavest.active = false;
        }

        this.isFirend = isFirend;
    };

    btnHarvest(event, arg) {
        let spHavest = this.node.getChildByName('spHavest');
        spHavest.active = false;
        if (this.helpNode)
            this.helpNode.active = false;
        global.Instance.MsgPools.send('parkHoney', {}, function (msg) {

        });
    };
}
