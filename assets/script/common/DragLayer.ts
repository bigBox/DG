

const {ccclass, property} = cc._decorator;

@ccclass
export default class DragLayer extends cc.Component {
    dragState: boolean;
    ndDragItem: any;
    insDragItem: any;
    isLockMove: boolean;
    delayEndCall: any;
    isInDelayMove: boolean;
    isInDelayScale: boolean;
    touchBegin: any;
    flag: number;
    static  dragLayers: Map<any, any> = new Map();
    @property({ type: cc.Prefab, displayName: "dragItem", tooltip: "大地图场景" })
    dragItem: cc.Prefab=null;
    
    dragItemCompent: string= '';

    minScale: number;
    maxScale: number;
    
    delayCallScale: (dt: any) => void;
    delayCall: (dt: any) => void;
    diScale: boolean;//是否可以缩放
    scaleiShow: boolean;
    isCore: boolean;
    postion: cc.Vec2;
    isHarvest: boolean;

    static addDragLayer(name, dragLayer) {
        this.dragLayers[name] = dragLayer;
    };
 
    static deleteDragLayer(name) {
        this.dragLayers.delete(name);
    };

    static  getDragLayer(name) {
        return this.dragLayers[name];
    };
    constructor () {
        super();
        this.dragState = false;
        this.scaleiShow = false;//是否正在缩放
        this.ndDragItem = null;
        this.insDragItem = null;
        this.isLockMove = false;
        this.delayEndCall = null;
        this.isInDelayMove = false;
        this.isInDelayScale = false;
        this.touchBegin = null;
        this.flag = 1;
        this.diScale = true; 
        this.isCore  = true;
        this.postion = new cc.Vec2(0,0);
        this.isHarvest = true;
        // DragLayer.dragLayers = new Map();
    };

    onEnable () {
        if (this.dragItem != null)
            this.addInstance();
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.on(cc.Node.EventType.MOUSE_WHEEL, this.touchEvent, this);

        
    };

    onDisable () {
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.off(cc.Node.EventType.MOUSE_WHEEL, this.touchEvent, this);

        DragLayer.deleteDragLayer(this.insDragItem.name);
    };
    getDrag(){
        return this.dragState;
    }
    getIsHarvest(){
        return this.isHarvest;
    }

    addInstance() {
        let visibleSize = global.CommonClass.Functions.getRoot().getContentSize();
        this.node.setContentSize(visibleSize);
        this.ndDragItem = this.node.getChildByName("ndDragItem");
        if (this.dragItem != null) {
            this.insDragItem = cc.instantiate(this.dragItem);

            let contentSize = this.insDragItem.getContentSize();
            contentSize.width *= this.insDragItem.scaleX;
            contentSize.height *= this.insDragItem.scaleY;

            this.ndDragItem.setContentSize(contentSize);
            this.ndDragItem.setPosition(cc.v2(0, 0));

            DragLayer.addDragLayer(this.insDragItem.name, this);
            this.ndDragItem.addChild(this.insDragItem);
        }
        let itemSize = this.ndDragItem.getContentSize();
        this.minScale = Math.max(visibleSize.width / itemSize.width, visibleSize.height / itemSize.height);
        this.maxScale = 2;
    };
    /**
     * 设置地图大小
     * @param {*大小} contentSize 
     */
    setndDragContentSize(contentSize) {
        this.ndDragItem.setContentSize(contentSize);
    };
    onsetMinScale(contentSize){
        let visibleSize = global.CommonClass.Functions.getRoot().getContentSize();
        this.ndDragItem.setContentSize(contentSize);
        let itemSize = this.ndDragItem.getContentSize();
        this.minScale = Math.max(visibleSize.width / itemSize.width, visibleSize.height / itemSize.height);
    };
    getScaleiShow(){
      return this.scaleiShow;
    }

    //最小缩放
    setMinScale (scale){
        this.minScale = scale;
    };
    //最大缩放
    setMaxScale(scale){
        this.maxScale = scale;
    };
    //是否可以缩放
    sedisScale(isShow: boolean) {
        this.diScale = isShow;
    };

    lockMove(isLock) {
        this.isLockMove = isLock;
    };

    moveItemLayer(xMove, yMove) {
        let rootSize = this.node.getContentSize();
        let itemSize = this.ndDragItem.getContentSize();
        itemSize.width *= this.ndDragItem.scaleX;
        itemSize.height *= this.ndDragItem.scaleY;

        if (itemSize.width * itemSize.height < rootSize.width * rootSize.height) return;

        let maxX = itemSize.width / 2 - rootSize.width / 2;
        let minX = -maxX;
        let maxY = itemSize.height / 2 - rootSize.height / 2;
        let minY = -maxY;

        let curPos = this.ndDragItem.getPosition();
        let newPos = curPos;
        newPos.x += xMove;
        newPos.y += yMove;

        if (newPos.x > maxX) newPos.x = maxX;
        else if (newPos.x < minX) newPos.x = minX;
        if (newPos.y > maxY) newPos.y = maxY;
        else if (newPos.y < minY) newPos.y = minY;

        this.ndDragItem.setPosition(newPos);
    };

    loadDragItem(filePath) {
        let self = this;

        global.CommonClass.Functions.setCreate(filePath, function (prefab) {
            if (prefab != null) {
                self.dragItem = prefab;
                self.addInstance();
            }
        });
    };

    setDragItemPosition(position) {
        let pos = cc.v2(-position.x, -position.y);
        this.ndDragItem.setPosition(pos);
        this.moveItemLayer(0, 0);           //边缘检测
    };

    getDragItemPosition() {
        return this.ndDragItem.getPosition();
    };

    delayScale(vscale, stopSpace, callback) {
        if (this.isInDelayScale)
            this.unschedule(this.delayCallScale);

        if (stopSpace == null)
            stopSpace = 0.1;

        let self = this;
        let orginScale = vscale;

        let speed = 0.005;
        this.delayCallScale = function (dt) {
            let dtScale = orginScale * speed;

            orginScale *= 1 - dtScale;
            let scale = self.getItemScale() + dtScale;
            self.setLayerScale(scale);
            // self.moveItemLayer(xMove, yMove);
            if (Math.abs(orginScale) < stopSpace) {
                if (callback)
                    callback();

                self.isInDelayScale = false;
                self.unschedule(self.delayCallScale);
            }
        }

        this.isInDelayScale = true;
        this.schedule(this.delayCallScale, 0.01, cc.macro.REPEAT_FOREVER, 0);
    };

    delayMove(vx, vy, stopSpace, callback) {
        if (this.isInDelayMove)
            this.unschedule(this.delayCall);

        if (stopSpace == null)
            stopSpace = 1;

        let self = this;
        let orginX = vx;
        let orginY = vy;

        let speed = 0.05;
        this.delayCall = function (dt) {
            let xMove = orginX * speed;
            let yMove = orginY * speed;

            orginX *= 1 - speed;
            orginY *= 1 - speed;

            self.moveItemLayer(xMove, yMove);

            if (Math.abs(orginX) < stopSpace && Math.abs(orginY) < stopSpace) {
                if (callback)
                    callback();

                self.isInDelayMove = false;
                self.unschedule(self.delayCall);
            }
        }

        this.isInDelayMove = true;
        this.schedule(this.delayCall, 0.01, cc.macro.REPEAT_FOREVER, 0);
    };

    touchEvent(event, hasOp) {
        let name = this.dragItemCompent;
        if (name.length <= 0&&this.insDragItem)
            name = this.insDragItem.name;

        let dragItemCompent = this.insDragItem.getComponent(name);
        if (event.type == cc.Node.EventType.TOUCH_END || event.type == cc.Node.EventType.TOUCH_CANCEL) {
            this.isCore = true;
            if (!this.isLockMove&&this.scaleiShow == false) {
                let touchEnd = event.getLocation();
                if (touchEnd != null) {
                    let xMove = touchEnd.x - this.touchBegin.x;
                    let yMove = touchEnd.y - this.touchBegin.y;

                    if (Math.abs(xMove) > 0 || Math.abs(yMove) > 0)
                        this.delayMove(xMove * 0.6, yMove * 0.6,null,null);
                }
            }
        }
        else if (event.type == cc.Node.EventType.TOUCH_START) {
            this.dragState = false;
            this.scaleiShow = false;
           
            this.touchBegin = event.getLocation();
            if (this.delayCall != null)
                this.unschedule(this.delayCall);
        }
        else if (event.type == cc.Node.EventType.TOUCH_MOVE) {
            if (!this.isLockMove) {
                let touches = event.getTouches();
                if (touches.length >= 2) {
                    this.scaleiShow = true;
                    this.dragState = false;
                    this.mulTouchScaleLayer(event);
                }else {
                    let touchPoint = event.getLocation();
                    let distance = touchPoint.sub(this.touchBegin).mag();
                    if (distance > 10) {
                        this.dragState = true;
                    }
                    let point = event.getLocation();
                    let prevPos = event.touch.getPreviousLocation();
                    let xMove = point.x - prevPos.x;
                    let yMove = point.y - prevPos.y;
                    this.moveItemLayer(xMove, yMove);
                }
            }
        }
        else if (event.type == cc.Node.EventType.MOUSE_WHEEL) {
            this.scaleiShow = true;
            if(this.isCore == true){
                this.postion = new cc.Vec2(0,0);
                this.isCore = false;
            }
            
            if (event._scrollY < 0) {
                this.scaleItemLayer(0.9);
            }
            else {
                this.scaleItemLayer(1.1);
            }
        }
        if (dragItemCompent != null && dragItemCompent.onDragEvent != null && hasOp != true) {
            dragItemCompent.onDragEvent(event);
        }
    };
    getPostion(pos): void{
        this.postion = this.node.convertToNodeSpaceAR(pos);
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
            // let delta =delta1.sub(delta2);
            let scale = 1;
            if (Math.abs(distance.x) > Math.abs(distance.y))
                scale = (distance.x + delta.x) / distance.x;
            else
                scale = (distance.y + delta.y) / distance.y;
            if (this.isCore == true) {
                this.postion = new cc.Vec2((touchPoint1.x + touchPoint2.x) / 2, (touchPoint1.y + touchPoint2.y) / 2);
                this.isCore = false;
            }
            this.scaleItemLayer(scale);
        }
    };

    scaleItemLayer(scale) {
      
            let scaleX = this.ndDragItem.scaleX * scale;
            let scaleY = this.ndDragItem.scaleY * scale;

            if (scaleX > this.maxScale || scaleY > this.maxScale)
                scaleX = scaleY = this.maxScale;

            if (scaleX < this.minScale || scaleY < this.minScale)
                scaleX = scaleY = this.minScale;
            //双指中心放大时坐标跟随
            if(this.diScale==true ||(this.diScale==false&&scaleX<0.8&&scaleX>0.3)){
            let pos = new cc.Vec2(this.ndDragItem.x / this.ndDragItem.scale * scaleX, this.ndDragItem.y / this.ndDragItem.scale * scaleY)
            pos.x += (this.postion.x / this.ndDragItem.scaleX * (this.ndDragItem.scaleX - scaleX));
            pos.y += (this.postion.y / this.ndDragItem.scaleY * (this.ndDragItem.scaleY - scaleY));
            this.ndDragItem.setPosition(pos);

            //放大
            this.ndDragItem.scaleX = scaleX;
            this.ndDragItem.scaleY = scaleY;
            let isHarvest = (this.ndDragItem.scale >= 0.6);
            if (this.isHarvest != isHarvest) {
                this.isHarvest = isHarvest;
                let name = this.dragItemCompent;
                if (name.length <= 0&&this.insDragItem)
                    name = this.insDragItem.name;
                // let dragItemCompent = this.insDragItem.getComponent(name);
                // if (dragItemCompent != null && dragItemCompent.opacityHarvest != null) {
                //     dragItemCompent.opacityHarvest(this.isHarvest);
                // }
            }
            
           
                
           
            this.moveItemLayer(0, 0);        //边缘检测
        }
    };
    scaleLayer(scale) {
        let scaleX = 1 * scale;
        let scaleY = 1 * scale;

        if (scaleX > this.maxScale || scaleY > this.maxScale)
            scaleX = scaleY = this.maxScale;

        if (scaleX < this.minScale || scaleY < this.minScale)
            scaleX = scaleY = this.minScale;
        this.ndDragItem.scaleX = scaleX;
        this.ndDragItem.scaleY = scaleY;
        this.isHarvest = (this.ndDragItem.scale >= 0.6);

        this.moveItemLayer(0, 0);        //边缘检测
    };

    setLayerScale(scale) {
        let scaleX = scale;
        let scaleY = scale;

        if (scaleX > this.maxScale || scaleY > this.maxScale)
            scaleX = scaleY = this.maxScale;

        if (scaleX < this.minScale || scaleY < this.minScale)
            scaleX = scaleY = this.minScale;

        this.ndDragItem.scaleX = scaleX;
        this.ndDragItem.scaleY = scaleY;

        this.moveItemLayer(0, 0);       //边缘检测
    };
    getItemScale() {
        return this.ndDragItem.scale;
    };

    getMinScale() {
        return this.minScale;
    };

    getMaxScale() {
        return this.maxScale;
    };
}
