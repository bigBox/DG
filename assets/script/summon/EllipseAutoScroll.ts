
const { ccclass, property } = cc._decorator;
@ccclass
export default class EllipseAutoScroll extends cc.Component {

    @property({ type: cc.Node, displayName: "maskNode", tooltip: "旋转物品" })
    maskNode: cc.Node[] = [];
    @property({ type: cc.Integer, displayName: "longLine", tooltip: "长轴长" })
    longLine: number = 100;
    @property({ type: cc.Integer, displayName: "shortLine", tooltip: "短轴长" })
    shortLine: number = 60;
    @property({ type: cc.Integer, displayName: "speed", tooltip: "速度" })
    speed: number;
    dt: boolean;
    angle: number;//角度
    center: cc.Vec2;//圆心
    showLevelArr: number[];//召唤山等级列表
    showLevel: number;//召唤山等级
    touchBegin: any;
    panel: any;
   


    constructor() {
        super();
        this.speed = 3;
        this.dt = false;
        this.center = cc.v2(0,0)
        this.showLevelArr =[ 243, 171, 99,27];
        this.showLevel = -1;
        this.panel = null;
      
    };
    
    // LIFE-CYCLE CALLBACKS;

    onLoad () {
        this.angle = 0;
        this.panel = global.Manager.UIManager.get('UISummon');
        if (this.panel != null) {
            this.panel.setPanel(this);
        }
        
    }
   
    start() {
        
    }
    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
    };

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
    };

    touchEvent(event) {
        if (this.dt == true)
            return;
        var taskdata = global.Module.TaskData.getHasAcceptTaskData();
        if (taskdata && taskdata.taskId == 10006 && taskdata.state == 1)
            return;
            
        if (event.type == cc.Node.EventType.TOUCH_START) {
            this.touchBegin = event.getLocation();
        }
        else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
        }
        else if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
            let touchEnd = event.getLocation();
            if (touchEnd != null) {
                let xMove = touchEnd.x - this.touchBegin.x;
                let speed = this.speed;
                let showLevel = this.showLevel;

                if (xMove < 0) {
                    speed = -3;
                    showLevel += 1;
                }else{
                    speed = 3;
                    showLevel -= 1;
                }
                if (showLevel > this.showLevelArr.length)
                    showLevel = 1;
                 if (showLevel == 0)
                    showLevel = 4;
                if (Math.abs(xMove) > 50)
                    this.show(speed, showLevel);
            }
        }
    };

    initAngle(showLevel) {
        if(this.showLevel == showLevel)
        return;
        if(showLevel<this.showLevel)
        this.speed = 3;
        else
        this.speed = -3;
        this.showLevel = showLevel;
        for (var i = 0; i < this.maskNode.length; i++) {
            var child:any = this.maskNode[i];
            var angle = (27 - 360 / this.maskNode.length * (i) + 360) % 360
            if (child){
                child._angle = angle;
            }
        }
       
        this.dt = true;
    }
    update(dt) {
        if (this.dt == true) {
            this.panel.mountSummon(this.showLevel, false)
            this.angle = (this.angle + this.speed) % 360

            for (var i = 0; i < this.maskNode.length; i++) {

                var child: any = this.maskNode[i]
                if (child) {
                    let angle = (child._angle + this.angle + 360) % 360
                    var a = angle * Math.PI / 180
                    var x = Math.round(this.longLine * Math.cos(a) + this.center.x);
                    var y = Math.round(this.shortLine * Math.sin(a) + this.center.y);
                    child.x = x;
                    child.y = y;
                    child.zIndex = (120 -y)
                    let scale = 0
                   
                   
                    if((y+40)<30){
                        scale = 1 - (y+40)*0.0167;
                    }else{
                        scale = 1 - (y+40-30)*0.00476-0.5;
                    }
                     
                    child.scale = scale;
                }
            }
            let angle = this.angle
            if (angle < 0) {
                angle += 360
            }

            if (this.showLevelArr[this.showLevel-1]==(Math.abs(angle) % 360)) {
                this.panel.mountSummon(this.showLevel, true)
                this.dt = false;
            }
        }
    }
    show(speed,showLevel){
        this.dt = true;
        this.speed = speed;
        this.showLevel = showLevel;
    }
}
