
const { ccclass, property } = cc._decorator;
@ccclass
export default class CoinDrop extends cc.Component {
    coinType: any;

    static create(coinType, number, callBack) {
        let filePath = "prefab/component/CoinDrop";
        cc.loader.loadRes(filePath, function (err, prefab) {
            if (err == null) {
                let newNode = cc.instantiate(prefab);
                let parent = global.CommonClass.Functions.getRoot();
                parent.addChild(newNode, cc.macro.MAX_ZINDEX);

                let coinDrop = newNode.getComponent(CoinDrop);
                coinDrop.setData(coinType, number);

                let position = global.Module.GameData.getDropStartPos();
                coinDrop.playDrop(position);

                if (callBack)
                    callBack(coinDrop);
            }
        });
    };
    static createByPos(coinType, number, startPos, targetPos) {
        let filePath = "prefab/component/CoinDrop";
        cc.loader.loadRes(filePath, function (err, prefab) {
            if (err == null) {
                let newNode = cc.instantiate(prefab);

                let parent = global.CommonClass.Functions.getRoot();
                parent.addChild(newNode, cc.macro.MAX_ZINDEX);

                let coinDrop = newNode.getComponent(CoinDrop);
                coinDrop.setData(coinType, number);
                coinDrop.fly(startPos, targetPos);
            }
        });
    };


    onLoad() {

    };

    start() {

    };

    onEnable() {

    };

    setData(coinType, number) {

        this.coinType = coinType;

        let itemName = 'spItem' + coinType.toString();
        let ndItems = this.node.getChildByName('ndItem').getChildByName('ndItems').children;
        for (let key in ndItems) {
            let spItem = ndItems[key];
            spItem.active = (spItem.name == itemName);
        }
        this.setNumber(number);
    };

    setNumber(number) {
        let lblNumber = this.node.getChildByName('ndItem').getChildByName('lblNumber').getComponent(cc.Label);
        lblNumber.string = '+'+number.toString();
    };

    playDrop(startPos) {
        let targetPos = global.Module.GameData.getDropTargetPos(this.coinType);

        // if (this.coinType==cc.Enum.CoinType.COIN_EXP)
        // {
        //let dropMode =cc.Module.GameData.getExpDropMode();
        // if (dropMode==1)    //直线飞
        this.flyUp(startPos);
        // else
        //  this.fly(startPos, targetPos);
        // }
        // else
        // {
        // this.fly(startPos, targetPos);
        // }
    };

    fly(start, end) {
        this.node.setPosition(start);

        let position = start;
        let endPosition = end;

        if (endPosition == null || position == null)
            return false;

        let midPosition = cc.v2((endPosition.x - position.x) / 3, (endPosition.y - position.y) / 3);
        if (endPosition.x < start.x)
            midPosition.x -= 10;
        else
            midPosition.x -= 30;

        let self = this;
        let callBack = function () {
            self.node.removeFromParent();
        };

        let scaleIn = cc.scaleTo(0.2, 0.1);
        let scaleOut = cc.scaleTo(0.4, 1);
        let seq1 = cc.sequence(scaleIn, scaleOut);

        let bezier = [position, midPosition, endPosition];
        let bezierTo = cc.bezierTo(2, bezier);

        let endFunction = cc.callFunc(callBack);
        let seq2 = cc.sequence(bezierTo, endFunction);
        let spawn = cc.spawn(seq1, seq2);

        this.node.runAction(spawn);

        return true;
    };

    flyUp(start) {
        this.node.setPosition(start);

        let endPosition = cc.v2(start.x, start.y + 150);
        let t = cc.tween;
        t(this.node)
        .to(0.4, { position: new cc.Vec3(start.x,  start.y + 50,0) })
        // 同时执行两个 cc.tween
        .parallel(
            t().to(0.9, { position: cc.v2(start.x,  start.y +150) }),
            t().to(0.9, { opacity: 40 })
        )
        .call(() => {
            this.node.removeFromParent();
        })
        .start()

        // let action = cc.moveTo(1.3, endPosition);
        // let fadeIn = cc.fadeIn(1.3);
        // let spawn = cc.spawn(action, fadeIn);

        // let self = this;
        // let callBack = function () {
        //     self.node.removeFromParent();
        // };
        // let endFunction = cc.callFunc(callBack);
        // let seq = cc.sequence(spawn, endFunction);
        // this.node.runAction(seq)
    };
    callBack(){
        this.node.removeFromParent();
    }
}
