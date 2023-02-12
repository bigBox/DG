const { ccclass, property } = cc._decorator;
@ccclass
export default class MoveObject extends cc.Component {
    static className: string = "MoveObject";
    mapOwner: any;
    curAnimation: any;
    targetOffset: cc.Vec2;
    isMoveing: boolean;
    ndSpine: any;
    speed: number;
    curCellItem: any;
    path: any;
    ndSpine1: cc.Node;
    isShow: boolean;

    constructor() {
        super();
        this.mapOwner = null;

        this.curAnimation = null;
        this.targetOffset = cc.v2(0, 0);

        this.isMoveing = false;
        this.ndSpine = null;
        this.ndSpine1 = null;
        this.speed = 200;

        this.curCellItem = null;
    };
    // use this for initialization
    onLoad() {

        this.ndSpine = this.node.getChildByName('ndSpine');
        this.ndSpine1 = this.node.getChildByName('ndSpine1');
    };

    onEnable() {

    };

    onDisable() {

    };

    setMapOwner(mapOwner: any) {
        this.mapOwner = mapOwner;
    };

    getMapOwner() {
        return this.mapOwner;
    };

    play(animName, isLoop, completeCall) {
        if (animName == null)
            return false;
            this.ndSpine.active = true;
            if(this.ndSpine1)
            this.ndSpine1.active = false;
        if (this.curAnimation != animName) {
            this.curAnimation = animName;
            
            let skeleton = this.ndSpine.getComponent(sp.Skeleton);
            skeleton.animation = animName;
            skeleton.loop = isLoop != null && isLoop;
            if(animName == 'zoulu'){
                skeleton.timeScale = 10;
            }else{
                skeleton.timeScale = 1;
            }
            skeleton.paused = false;
            skeleton.setCompleteListener(completeCall);
        }
        else {
            let skeleton = this.ndSpine.getComponent(sp.Skeleton);
            if (skeleton.paused)
                skeleton.paused = false;
        }
    };
    play1(animName, isLoop, completeCall) {
        if (animName == null)
            return false;
        this.ndSpine.active = false;
        if (this.ndSpine1) {
            this.ndSpine1.active = true;
            let scale = Math.abs(this.ndSpine1.scaleX);
            let ndSpineX = this.ndSpine1.x
            if (ndSpineX > 0) {
                this.ndSpine1.scaleX = scale
            } else {
                this.ndSpine1.scaleX = -scale
            }
        }
           

        if (this.curAnimation != animName) {
            this.curAnimation = animName;
            let skeleton = this.ndSpine1.getComponent(sp.Skeleton);
            skeleton.animation = animName;
            skeleton.loop = isLoop != null && isLoop;
            skeleton.paused = false;
            skeleton.setCompleteListener(completeCall);
        }
        else {
            let skeleton = this.ndSpine1.getComponent(sp.Skeleton);
            if (skeleton.paused)
                skeleton.paused = false;
        }
    };
    setLoop(isLoop) {
        let animation = this.ndSpine.getComponent(cc.Animation);
        if (animation != null) {
            animation.skeleton.loop = isLoop;
        }
    };

    stopCurrent() {
        if (this.curAnimation != null) {
            let skeleton = this.ndSpine.getComponent(sp.Skeleton);
            skeleton.paused = true;
        }
    };

    setFlip(targetPos) {
        let position = this.node.getPosition();
        let moveVec = cc.v2(targetPos.x - position.x, targetPos.y - position.y);
        let scale = this.ndSpine.scaleX;
        let ndSpineX = 0;
        if (this.ndSpine1)
            ndSpineX = Math.abs(this.ndSpine1.x);
        if (moveVec.x < 0) {
            if (scale < 0)
                scale = -scale;
            this.ndSpine.scaleX = scale;
            if (this.ndSpine1)
                this.ndSpine1.x = -ndSpineX;
        } else {
            if (scale > 0)
                scale = -scale;
            this.ndSpine.scaleX = scale;
            if (this.ndSpine1)
                this.ndSpine1.x = ndSpineX;
        }
    };
    getIsMoveing() {
        return this.isMoveing;
    };

    setTargetOffset(offset) {
        this.targetOffset = offset;
    };

    setSpineOffset(offset) {
        let ndSpine = this.node.getChildByName('ndSpine');
        ndSpine.setPosition(offset);
    };

    setSpeed(speed) {
        this.speed = speed;
    };

    moveTo(targetPos, callback) {
        let self = this;
        this.node.stopAllActions();
        this.setFlip(targetPos);
        let position = this.node.getPosition();
        let distance = targetPos.sub(position).mag();
        let timeCost = distance / this.speed;
        this.isMoveing = true;
        let moveEnd = function () {
            self.isMoveing = false;

            if (callback)
                callback();;
        }

        let moveAction = cc.moveTo(timeCost, targetPos);
        let endFunction = cc.callFunc(moveEnd);
        let seq = cc.sequence(moveAction, endFunction);

        this.node.runAction(seq);
    };

    getCurCellItem() {
        return this.curCellItem;
    };

    findPath(path, callback) {
        this.isShow = true;
        let self = this;
        this.path = path.concat();
        this.setSpeed(600);
        
        let nextMove = function () {
            if(self.isShow){
                self.curCellItem = self.path.shift();
                self.node.stopAllActions();
    
                self.isMoveing = true;
    
                let mapOwner = self.getMapOwner();
                if (self.curCellItem != null) {
                    let cell = mapOwner.getCellByPathCell(self.curCellItem);
    
                    if (cell != null) {
                        let targetPos = cell.getPosition();
                        if (self.path.length <= 0) {
                            targetPos.x += self.targetOffset.x;
                            targetPos.y += self.targetOffset.y;
                        }
                        self.moveTo(targetPos, nextMove);
                    }
                } else {
                    self.isMoveing = false;
    
                    self.curCellItem = null;
                    if (callback)
                        callback();
                }
            }
            
        }
        nextMove();
    };
    findPaths(path, callback) {
        let self = this;
        this.path = path.concat();
        this.setSpeed(600);
        let pathisShow = true;
        let nextMove = function () {
            self.curCellItem = self.path[path.length - 1];
            self.node.stopAllActions();

            self.isMoveing = true;

            let mapOwner = self.getMapOwner();
            if (self.curCellItem != null&&pathisShow==true) {
                let proxy = global.Proxys.ProxyGuJi;

                let mapData = proxy.getMapData();
                let index = self.curCellItem.y * mapData.colNum + self.curCellItem.x;
                let targetPos = cc.v2(0, 0)
                let row = Math.floor((index) / mapData.colNum);
                let type = Math.floor((index) % mapData.colNum);
                targetPos.x = 130 / 2 + 130 * type;
                targetPos.y = 130 / 2 + 130 * row;
                if (self.path.length <= 0) {
                    targetPos.x += self.targetOffset.x;
                    targetPos.y += self.targetOffset.y;
                }
                pathisShow = false;
                self.moveTo(targetPos, nextMove);
            } else {
                self.isMoveing = false;

                self.curCellItem = null;
                if (callback)
                    callback();
            }
        }
        nextMove();
    };
    fixedPath(path, callback) {
        this.isShow = false;
        let self = this;
        this.path = path.concat();
        this.setSpeed(600);
        let pathisShow = true;
        let mapOwner = self.getMapOwner();
        self.curCellItem = self.path[path.length - 1];
        if (self.curCellItem != null&&pathisShow==true) {
            let cell = mapOwner.getCellByPathCell(self.curCellItem);
            if (cell != null) {
                let targetPos = cell.getPosition();
                if (self.path.length <= 0) {
                    targetPos.x += self.targetOffset.x;
                    targetPos.y += self.targetOffset.y;
                }
                pathisShow = false;
                let moveEnd = function () {
                    self.isMoveing = false;

                    self.curCellItem = null;
                    if (callback)
                        callback();
                }
                let moveAction = cc.moveTo(0, targetPos);
                let endFunction = cc.callFunc(moveEnd);
                let seq = cc.sequence(moveAction, endFunction);
                this.node.runAction(seq);
            }
        }
    }
}
