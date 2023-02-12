

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIHandBook06 extends cc.Component {
    @property({ type: cc.Node, displayName: "nodePageRight", tooltip: "背景框" })
    nodePageRight: cc.Node = null;
    @property({ type: cc.Node, displayName: "spItem", tooltip: "图片" })
    spItem: cc.Node = null;
    @property({ type: cc.Label, displayName: "nameLabel", tooltip: "宝物名字" })
    nameLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: "lblContent", tooltip: "宝物详情介绍" })
    lblContent: cc.Label = null;
    @property({ type: cc.Label, displayName: "lbltype", tooltip: "宝物类型" })
    lbltype: cc.Label = null;
    @property({ type: cc.Node, displayName: "openBtn", tooltip: "打开" })
    openBtn: cc.Node = null;
    @property({ type: cc.Node, displayName: "stopBtn", tooltip: "关闭" })
    stopBtn: cc.Node = null;
    @property({ type: cc.Node, displayName: "btnPutDown", tooltip: "展架卸下按钮" })
    btnPutNode: cc.Node = null;

    itemId: any;
    callback: any;
    touchBegin: any;
    maxScale: number;
    minScale: number;
    spItempos: cc.Vec2;
    isShowMove:boolean;


    constructor() {
        super();
        this.minScale = 0.2;
        this.maxScale = 2;
        this.itemId = 0;
        this.callback = null;
        this.isShowMove = false;
    };

    onLoad() { }

    start() {

    }
    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.on(cc.Node.EventType.MOUSE_WHEEL, this.touchEvent, this);
    };

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.off(cc.Node.EventType.MOUSE_WHEEL, this.touchEvent, this);
    };
    touchEvent(event, arg) {
        if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
                let touchEnd = event.getLocation();
                if (touchEnd != null) {
                    // this.spItem.x = touchEnd.x
                    // this.spItem.x = touchEnd.x

                }
        }
        else if (event.type == cc.Node.EventType.TOUCH_START) {
            this.isShowMove = false;
            this.touchBegin = event.getLocation();
            this.spItempos = this.spItem.getPosition()
        }
        else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            let touches = event.getTouches();
            if (touches.length >= 2) {
                this.isShowMove = true;
                this.mulTouchScaleLayer(event);
            } else {
                if( this.isShowMove ==  false){
                    let point = event.getLocation();
                    let xMove = point.x - this.touchBegin.x + this.spItempos.x;
                    let yMove = point.y - this.touchBegin.y + this.spItempos.y;
                    this.spItem.x = xMove;
                    this.spItem.y = yMove;
                }
            }
        }
        else if (event.type == cc.Node.EventType.MOUSE_WHEEL) {
            if (event._scrollY < 0) {
                this.scaleItemLayer(0.9);
            }
            else {
                this.scaleItemLayer(1.1);
            }
        }
        
    };
    mulTouchScaleLayer(event) {
        var touches = event.getTouches();

        if (touches.length >= 2) {
            let touch1 = touches[0];
            let touch2 = touches[1];
            let delta1 = touch1.getDelta();
            let delta2 = touch2.getDelta();
            let touchPoint1 = this.node.convertToNodeSpaceAR(touch1.getLocation());
            let touchPoint2 = this.node.convertToNodeSpaceAR(touch2.getLocation());
            
            //缩放
            let distance = cc.v2(touchPoint1.x - touchPoint2.x, touchPoint1.y - touchPoint2.y);
            let delta = cc.v2(delta1.x - delta2.x, delta1.y - delta2.y);
            delta = cc.v2(delta.x * 0.3, delta.y * 0.3);

            let scale = 1;
            if (Math.abs(distance.x) > Math.abs(distance.y))
                scale = (distance.x + delta.x) / distance.x;
            else
                scale = (distance.y + delta.y) / distance.y;

            this.scaleItemLayer(scale);
        }
    };
    scaleItemLayer(scale) {
            let scaleX = this.spItem.scaleX * scale;
            let scaleY = this.spItem.scaleY * scale;
    
            if (scaleX > this.maxScale || scaleY > this.maxScale)
                scaleX = scaleY = this.maxScale;
    
            if (scaleX < this.minScale || scaleY < this.minScale)
                scaleX = scaleY = this.minScale;
            this.spItem.scaleX = scaleX;
            this.spItem.scaleY = scaleY;
    
       
    };
    show(itemId) {
        this.itemId = itemId;
        this.showPut(false);
        this.fillPage();

    };
    // 填充页面
    fillPage() {
        let cfgData = global.Manager.DBManager.findData('Items', 'ID', this.itemId);
        let name = cfgData.perfect;
        if (name == 0)
            name = this.itemId;
        else
            cfgData = global.Manager.DBManager.findData('Items', 'ID', cfgData.perfect)
        if (this.callback != null) {
            name = this.itemId;
        }
        let path = 'images/pictrue/precious/' + name;
        global.CommonClass.Functions.setTexture(this.spItem, path, function () {
            this.spItem.scale = global.CommonClass.Functions.getToscale(this.spItem, 700, 700);
        }.bind(this));
        this.nameLabel.string = cfgData.name;
        this.lblContent.string = cfgData.resume2;
        let type = '';
        if (cfgData.warehouseType == 1)
            type = '植物';
        if (cfgData.warehouseType == 2)
            type = '动物';
        if (cfgData.warehouseType == 3)
            type = '食品';
        if (cfgData.warehouseType == 4)
            type = '工业';
        if (cfgData.warehouseType == 5)
            type = '收集品';
        this.lbltype.string = '品类: ' + type;
    };
    onpenClick() {
        // this.nodePageRight.width = 800;
        cc.tween(this.nodePageRight)
        .to(0.3,{ width:800 })
        .start()
        this.openBtn.active = false;
        this.stopBtn.active = true;
    };
    stopClick() {
        // this.nodePageRight.width = 450;
        cc.tween(this.nodePageRight)
        .to(0.3,{ width:450 })
        .start()
        this.openBtn.active = true;
        this.stopBtn.active = false;
    };
    changePage(dir) {
        return;

    };
    showPut(isShow) {
        this.btnPutNode.active = isShow;
    };
    showPutDown(callback) {
        this.callback = callback;
    };
    btnPutDown() {
        if (this.callback)
            this.callback(true);
        global.Manager.UIManager.close('UIHandBook06');
    };
    btnClose(event, arg) {
        if (this.callback)
            this.callback(false);
        global.Manager.UIManager.close('UIHandBook06');
    }
    // update (dt) {}
}
