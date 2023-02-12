import FactoryBase from "../factorys/FactoryBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class Demon extends FactoryBase {
    spMailPositin: any;
    isPlayJump: boolean;
    isFriend: boolean;
    constructor() {
        super();
        this.spMailPositin = null;
        this.isPlayJump = false;

        this.isFriend = false;
    };

    onLoad() { }

    start() {

    };
    onEnable() {

    };

    showMail(isShow) {
        if (!this.isFriend) {
            let spMail = this.node.getChildByName('spMail');
            spMail.active = isShow;

            if (isShow) {
                if (!this.isPlayJump) {
                    this.isPlayJump = true;
                    this.playItemJump();
                }

                let lblNum = spMail.getChildByName('lblNum');
                let count = global.Module.SummonData.getMailCount();
                lblNum.getComponent(cc.Label).string = count.toString();
            }
            else {
                this.isPlayJump = false;
            }
        }

    };

    setIsFriend(isFriend) {
        this.isFriend = isFriend;

        let spMail = this.node.getChildByName('spMail');
        spMail.active = false;
    };

    playItemJump() {
        // let actionNum = this.node.getNumberOfRunningActions();

        // if (actionNum <= 0)
        // {
        let spMail = this.node.getChildByName('spMail');
        spMail.stopAllActions();

        if (this.spMailPositin == null)
            this.spMailPositin = spMail.getPosition();
        else
            spMail.setPosition(this.spMailPositin);

        let position = this.spMailPositin;

        let goodsAct1 = cc.moveTo(0.2, cc.v2(position.x, position.y + 25));
        let goodsBack1 = cc.moveTo(0.2, cc.v2(position.x, position.y));
        let goodsAct2 = cc.moveTo(0.1, cc.v2(position.x, position.y + 8));
        let goodsBack2 = cc.moveTo(0.1, cc.v2(position.x, position.y));
        let delayEnd = cc.delayTime(1);

        let seq = cc.sequence(goodsAct1, goodsBack1, goodsAct2, goodsBack2, delayEnd);
        let repeat = cc.repeatForever(seq);

        spMail.runAction(repeat);
        //  }

    };

    // update (dt) {}
}
