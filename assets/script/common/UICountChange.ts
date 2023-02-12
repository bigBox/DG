const { ccclass, property } = cc._decorator;
@ccclass
export default class UICountChange extends cc.Component {
    static className: string;
    edtNumber: any;
    spAdd: any;
    spMinus: any;
    addFlag: number;
    step: number;
    @property({displayName: "max", tooltip: "max" })
    max: number;
    @property({displayName: "min", tooltip: "min" })
    min: number;
    @property({displayName: "default", tooltip: "default" })
    default: number;
    constructor() {
        super();
        this.edtNumber = null;
        this.spAdd = null;
        this.spMinus = null;
        this.addFlag = 0;
        this.step = 0;
        this.max = 9999;
        this.min = 0;
        this.default = 0;
    };

    // use this for initialization
    onLoad() {

        this.spAdd = this.node.getChildByName('spAdd');
        this.spMinus = this.node.getChildByName('spMinus');
        this.edtNumber = this.node.getChildByName('edtNumber');

        this.setNumber(this.default);
    };
    inputBox(event) {
        if (Number(event.string) > this.max) {
            event.string = this.max
            this.setNumber(this.max);
        } else if (Number(event.string) < this.min) {
            event.string = this.min
            this.setNumber(this.min);
        }
    };
    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);

        this.schedule(this.onAddNumber, 0.1, cc.macro.REPEAT_FOREVER);
    };

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);

        this.unschedule(this.onAddNumber);
    };

    touchEvent(event) {
        event.stopPropagation();

        let touchPoint = event.getLocation();;
        if (event.type == cc.Node.EventType.TOUCH_START) {
            let boxAdd = this.spAdd.getBoundingBoxToWorld();
            let boxMinus = this.spMinus.getBoundingBoxToWorld();
            if (boxAdd.contains(touchPoint)) {
                this.addFlag = 1;
            }
            else if (boxMinus.contains(touchPoint)) {
                this.addFlag = -1;
            }
        }
        else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            let boxAdd = this.spAdd.getBoundingBoxToWorld();
            let boxMinus = this.spMinus.getBoundingBoxToWorld();
            if (!boxAdd.contains(touchPoint) && !boxMinus.contains(touchPoint)) {
                this.addFlag = 0;
            }
        }
        else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
            this.addFlag = 0;
        }
    };
    setReadOnly(isReadOnly) {
        this.edtNumber.enabled = !isReadOnly;
    };

    setMax(max) {
        this.max = max;
        let curNumber = this.getCurNumber();
        if (curNumber > max)
            this.setNumber(max);
    };

    setMin(min) {
        this.min = min;
        let curNumber = this.getCurNumber();
        if (curNumber < min)
            this.setNumber(min);
    };

    onAddNumber(dt) {
        this.step += dt;

        if (this.step > 0.01) {
            if (this.addFlag > 0)
                this.addFlag += 1;
            else if (this.addFlag < 0)
                this.addFlag -= 1;

            this.step = 0;
        }

        if (this.addFlag != 0) {
            let numberComp = this.edtNumber.getComponent(cc.EditBox);
            let number = parseInt(numberComp.string);
            number += this.addFlag;

            if (number < this.min)
                number = this.min;
            else if (number > this.max)
                number = this.max;

            numberComp.string = number.toString();

            let event = new cc.Event.EventCustom('onNumberChange', true);
            event.setUserData(this);
            this.node.dispatchEvent(event);
        }
    };

    getCurNumber() {
        let numberComp = this.edtNumber.getComponent(cc.EditBox);
        let number = parseInt(numberComp.string);

        return number;
    };

    setNumber(number) {
        // number = Math.ceil(number);
        let numberComp = this.edtNumber.getComponent(cc.EditBox);
        numberComp.string = number.toString();
        let TEXT_LABEL = this.edtNumber.getChildByName('TEXT_LABEL');
        TEXT_LABEL.color = cc.color(255, 255, 255, 255);
        if (this.node.name == 'numChange') {
            let startPrice = global.Module.TradeData.getStartPrice();
         
            if (Number(startPrice) > number)
                TEXT_LABEL.color = cc.color(31, 255, 72, 255);
            else  if (Number(startPrice) < number)
                TEXT_LABEL.color = cc.color(177, 46, 46, 255);
        }
        
        let event = new cc.Event.EventCustom('onNumberChange', true);
        event.setUserData(this);
        this.node.dispatchEvent(event);
    };

    onTextChange() {
        let numberComp = this.edtNumber.getComponent(cc.EditBox);
        let number = parseInt(numberComp.string);

        if (number < this.min) {
            number = this.min;
            numberComp.string = number.toString();
        }
        else if (number > this.max) {
            number = this.max;
            numberComp.string = number.toString();
        }

        let event = new cc.Event.EventCustom('onNumberChange', true);
        event.setUserData(this);
        this.node.dispatchEvent(event);
    };
}
