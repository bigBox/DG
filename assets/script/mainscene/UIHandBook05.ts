import UIBase from "../common/UIBase";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UIHandBook05 extends UIBase {
    @property({ type: cc.Node, displayName: "touchNode", tooltip: "touchNode" })
    touchNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "btnLeft", tooltip: "btnLeft" })
    btnLeft: cc.Node = null;
    @property({ type: cc.Node, displayName: "btnRight", tooltip: "btnRight" })
    btnRight: cc.Node = null;
    @property({ type: cc.Node, displayName: "spIcon", tooltip: "spIcon" })
    spIcon: cc.Node = null;
    itemType: number;
    curIdx: number;
    targetIcon: any;
    items: any;
    touchStart: cc.Vec2;
    isMove: boolean;
    isInChagne: any;
    secondID: any;
    bookArr: { itemType: number; index: number; name: string; titArr: { name: string; page: number; }[]; }[];
    data: any;
    sortType: number;


    constructor() {
        super();
        this.itemType = 0;
        this.curIdx = 0;
        this.targetIcon = null;
        this.items = [];
        this.touchStart = cc.v2(0, 0);
        this.isMove = false;
        this.secondID = 0;//当前类型小分类
        this.sortType = 0;//排序默认0 珍稀度1
    };

    onLoad() {
        this.spIcon.active = false;
    };

    onEnable() {
        this.touchNode.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.touchNode.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
    };

    onDisable() {
        this.touchNode.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.touchNode.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.touchNode.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.touchNode.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
    };

    setItemTexture(book, target) {
        let data = global.Manager.DBManager.findData('Items', 'ID', book.bookId);
        let name = data.perfect;
        if (name == 0)
            name = book.bookId;
        let iconFile = 'images/pictrue/precious/' + name;
        global.CommonClass.Functions.setTexture(target, iconFile, function (image) {
            target.active = true;
            target.scale = global.CommonClass.Functions.getToscale(target, 500, 500);
        }.bind(this));

    };

    show(book, itemType, secondID, sortType) {
        this.sortType = sortType;
        this.itemType = itemType;
        this.secondID = secondID;
        this.bookArr = global.Module.HandBookData.getbookArr();
        let index = this.bookArr[this.itemType].index;
        if (index == 7)
            this.items = global.Module.HandBookData.getSuitDataType();
        else
            this.items = global.Module.HandBookData.getDataByType(index, secondID, this.sortType);
        this.curIdx = 0;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].bookId == book.bookId) {
                this.curIdx = i;
                break;
            }
        }
        this.data = global.Manager.DBManager.findData('Items', 'ID', book.bookId);
        this.targetIcon = cc.instantiate(this.spIcon);
        this.targetIcon.x = this.spIcon.x;
        this.targetIcon.y = this.spIcon.y;
        this.touchNode.addChild(this.targetIcon);

        this.targetIcon.active = true;
        let lblTitle = this.targetIcon.getChildByName("lblTitle");
        lblTitle.getComponent(cc.Label).string = this.data.name;

        this.setItemTexture(book, this.targetIcon);

        let btnDetail = lblTitle.getChildByName("btnDetail");
        btnDetail.on('click', function () {
            global.Manager.UIManager.open('UIHandBook06', null, function (panel) {
                if (panel != null) {
                    let item = this.items[this.curIdx];
                    panel.show(item, this.itemType, this.secondID,this.sortType);
                }
            }.bind(this));
        }.bind(this));

        this.refreshArrow();
    };

    onClickLeft() {
        this.gotoPre();
    };

    onClickRight() {
        this.gotoNext();
    };

    refreshArrow() {
        let curIdx = this.curIdx;
        let maxIdx = this.items.length;

        if (curIdx <= 0) {
            this.btnRight.active = false;
        } else {
            this.btnRight.active = true;
        }

        if (curIdx + 1 >= maxIdx) {
            this.btnLeft.active = false;
        } else {
            this.btnLeft.active = true;
        }
    };

    gotoPre() {
        if (this.isMove == true) {
            return;
        }

        let tmpIdx = this.curIdx;
        tmpIdx++;
        if (tmpIdx >= this.items.length) {
            return;
        }

        this.curIdx = tmpIdx;
        this.isMove = true;

        {
            let tmpIcon = this.targetIcon;
            let moveBy = cc.moveBy(1.0, new cc.Vec2(-1000, 0));
            let fadeOut = cc.fadeOut(1.0);
            let spawn = cc.spawn(moveBy, fadeOut);
            let removeSelf = cc.removeSelf();
            tmpIcon.runAction(cc.sequence(spawn, removeSelf));
        }

        {
            let book = this.items[this.curIdx];
            this.targetIcon = cc.instantiate(this.spIcon);
            this.targetIcon.x = this.spIcon.x + 1000;
            this.targetIcon.y = this.spIcon.y;
            this.touchNode.addChild(this.targetIcon);

            this.targetIcon.active = true;
            let lblTitle = this.targetIcon.getChildByName("lblTitle");
            let data = global.Manager.DBManager.findData('Items', 'ID', book.bookId);
            lblTitle.getComponent(cc.Label).string = data.name;
            this.setItemTexture(book, this.targetIcon);

            let btnDetail = lblTitle.getChildByName("btnDetail");
            btnDetail.on('click', function () {
                global.Manager.UIManager.open('UIHandBook06', null, function (panel) {
                    if (panel != null) {
                        let item = this.items[this.curIdx];
                        panel.show(item, this.itemType, this.secondID,this.sortType);
                    }
                }.bind(this));
            }.bind(this));

            let moveTo = cc.moveTo(1.0, new cc.Vec2(this.spIcon.x, this.spIcon.y));
            let fadeIn = cc.fadeIn(1.0);
            let spawn = cc.spawn(moveTo, fadeIn);
            let callback = cc.callFunc(function () {
                this.isMove = false;
            }.bind(this));
            this.targetIcon.runAction(cc.sequence(spawn, callback));
        }

        this.refreshArrow();
    };

    gotoNext() {
        if (this.isMove == true) {
            return;
        }

        let tmpIdx = this.curIdx;
        tmpIdx--;
        if (tmpIdx < 0) {
            return;
        }

        this.curIdx = tmpIdx;
        this.isMove = true;

        {
            let tmpIcon = this.targetIcon;
            let moveBy = cc.moveBy(1.0, new cc.Vec2(1000, 0));
            let fadeOut = cc.fadeOut(1.0);
            let spawn = cc.spawn(moveBy, fadeOut);
            let removeSelf = cc.removeSelf();
            tmpIcon.runAction(cc.sequence(spawn, removeSelf));
        }

        {
            let book = this.items[this.curIdx];
            this.targetIcon = cc.instantiate(this.spIcon);
            this.targetIcon.x = this.spIcon.x - 1000;
            this.targetIcon.y = this.spIcon.y;
            this.spIcon.parent.addChild(this.targetIcon);

            this.targetIcon.active = true;
            let lblTitle = this.targetIcon.getChildByName("lblTitle");
            let data = global.Manager.DBManager.findData('Items', 'ID', book.bookId);
            lblTitle.getComponent(cc.Label).string = data.name;

            this.setItemTexture(book, this.targetIcon);

            let btnDetail = lblTitle.getChildByName("btnDetail");
            btnDetail.on('click', function () {
                global.Manager.UIManager.open('UIHandBook06', null, function (panel) {
                    if (panel != null) {
                        let item = this.items[this.curIdx];
                        panel.show(item, this.itemType, this.secondID);
                    }
                }.bind(this));
            }.bind(this));

            let moveTo = cc.moveTo(1.0, new cc.Vec2(this.spIcon.x, this.spIcon.y));
            let fadeIn = cc.fadeIn(1.0);
            let spawn = cc.spawn(moveTo, fadeIn);
            let callback = cc.callFunc(function () {
                this.isMove = false;
            }.bind(this));
            this.targetIcon.runAction(cc.sequence(spawn, callback));
        }

        this.refreshArrow();
    };

    // 原型
    onClickPrototype() {
        global.Manager.UIManager.open('UIHandBook03', null, function (panel) {
            if (panel != null) {
                let book = this.items[this.curIdx];
                panel.show(book, this.itemType, this.secondID,this.sortType);
                this.btnClose();
            }
        }.bind(this));
    };

    touchEvent(event) {
        let touchPoint = event.getLocation();

        if (event.type == cc.Node.EventType.TOUCH_START) {
            this.touchStart = touchPoint;
        } else if (event.type == cc.Node.EventType.TOUCH_MOVE) { 

        } else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
            if (!this.isInChagne) {
                let xMove = Math.abs(touchPoint.x - this.touchStart.x);
                if (xMove > 20) {
                    if (this.touchStart.x > touchPoint.x) {
                        this.gotoPre();
                    } else {
                        this.gotoNext();
                    }
                }
            }
        }
    };

    btnClose(event, arg) {
        global.Manager.UIManager.close('UIHandBook05');
    }

    // update (dt) {}
}
