
const { ccclass, property } = cc._decorator;

@ccclass
export default class TownFactoryBase extends cc.Component {
    static className: string = 'Prismatic';
 
    spFactory: any;
    clickStartPos: any;
    scaleX: number;
    scaleY: number;
    state: number;
    canMove: boolean;
    btnMove: any;
    @property({ displayName: "xPickRate", tooltip: "xPickRate" })
    xPickRate: number;
    @property({ displayName: "yPickRate", tooltip: "yPickRate" })
    yPickRate: number;
    @property({ displayName: "factoryID", tooltip: "factoryID" })
    factoryID: number;

    constructor() {
        super();
        this.spFactory = null;
        this.clickStartPos = null;

        this.scaleX = 1;
        this.scaleY = 1;
        this.xPickRate = 0;
        this.yPickRate = 0;

        this.factoryID = 0;
    };




    // use this for initialization
    onLoad() {

        this.spFactory = this.node.getChildByName('spFactory');

        this.scaleX = this.spFactory.scaleX;
        this.scaleY = this.spFactory.scaleY;
    };

    onEnable() {

    };

    onDisable() {

    };

    setID(factoryID: number) {
        this.factoryID = factoryID;
    };

    getID() {
        return this.factoryID;
    };

    isPicked(touchPoint: cc.Vec2) {
        if (this.xPickRate == 0 || this.yPickRate == 0) {
            let boundingBox = this.node.getBoundingBoxToWorld();
            return boundingBox.contains(touchPoint);
        } else {
            let spPick = this.node.getChildByName('spPick');
            let ndExPick = this.node.getChildByName('ndExPick');

            if (ndExPick == null && spPick == null) {
                let boundingBox = this.node.getBoundingBoxToWorld();
                return boundingBox.contains(touchPoint);
            } else {
                if (spPick != null) {
                    if (global.CommonClass.Geometry.checkSlantingSpIsInPoint(touchPoint, spPick, this.xPickRate, this.yPickRate)) {
                        return true;
                    }
                }

                if (ndExPick != null) {
                    let ndExPicks = ndExPick.children;
                    for (let key in ndExPicks) {
                        let ndPick = ndExPicks[key];
                        let boundingBox = ndPick.getBoundingBoxToWorld();
                        if (boundingBox.contains(touchPoint))
                            return true;
                    }
                }
            }
        }
    };

    getFactoryWorldBox() {
        return this.node.getChildByName('spFactory').getBoundingBoxToWorld();
    };

    playScaleAction() {
        let spFactory = this.node.getChildByName('spFactory');
        spFactory.stopAllActions();
        spFactory.scaleY = this.scaleY;
        spFactory.scaleX = this.scaleX;

        let scaleX = this.scaleX;
        let scaleY = this.scaleY;
        let targetX = scaleX;
        let targetY = scaleY;
        if (targetX < 0)
            targetX -= 0.2;
        else
            targetX += 0.2;
        if (targetY < 0)
            targetY -= 0.2;
        else
            targetY += 0.2;

        let scaleTo = cc.scaleTo(0.2, targetX, targetY);
        let scaleBack = cc.scaleTo(0.2, scaleX, scaleY);
        let seq = cc.sequence(scaleTo, scaleBack);
        spFactory.runAction(seq);
    };

    onMouseEvent(event: { type: string; getLocation: () => any; }) {
        let self = this;

        if (event.type == cc.Node.EventType.TOUCH_START) {
            let touchPoint = event.getLocation();
            this.clickStartPos = touchPoint;

            if (this.state == 0 && this.canMove) {
                if (this.btnMove != null) {
                    let funMoveFade = function () {
                        self.btnMove.active = true;
                        self.state = 1;
                        self.runSelectAction();
                    }

                    this.node.stopAllActions();
                    let delay = cc.delayTime(1);
                    let endFun = cc.callFunc(funMoveFade);
                    let seq = cc.sequence(delay, endFun);
                    this.node.runAction(seq);
                }
            }

            this.playScaleAction();
            global.Instance.AudioEngine.playSound('click', null, null,null);

        } else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            let touchPoint = event.getLocation();
            if (this.clickStartPos != null) {
                let distance = touchPoint.sub(this.clickStartPos).mag();
                if (distance > 10) {
                    if (this.state == 0) {//0.无状态 1.显示移动 2.选中状态
                        this.node.stopAllActions();
                    }
                }
            }
        } else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
            this.node.stopAllActions();
            this.clickStartPos = null;
        }

        return this;
    };
    runSelectAction() {
        let self = this;
        // let delay = cc.delayTime(1);
        let onDelayEnd = function () {
            self.state = 2;

            if (self.btnMove != null)
                self.btnMove.active = false;


            self.node.stopAllActions();
            self.runFadeAction();

            let evt = new cc.Event.EventCustom('onFactorySelect', true);
            evt.setUserData(self.node);
            self.node.dispatchEvent(evt);
        }

        this.node.stopAllActions();
        let endFun = cc.callFunc(onDelayEnd);
        //let seq = cc.sequence(delay, endFun);
        this.node.runAction(endFun);
    };
    runFadeAction() {
        let fadeIn = cc.fadeIn(0.4);
        let fadeOut = cc.fadeOut(0.4);
        let seq = cc.sequence(fadeIn, fadeOut);
        let action = cc.repeatForever(seq);

        let ndCross = this.node.getChildByName('ndCross');
        ndCross.active = true;
        ndCross.runAction(action);
    };
    onClick(touchPoint: any) {

    };
}
