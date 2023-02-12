import DigGolderData from "../module/DigGolderData";

const { ccclass, property } = cc._decorator;
@ccclass
export default class DigGolder extends cc.Component {
    [x: string]: any;
    data: any;
    mapOwner: any;


    constructor() {
        super();
        this.data = new DigGolderData();
        this.mapOwner = null;
        // this.spine  = null;

    };

    getData() {
        return this.data;
    };

    setMapOwner(map) {
        this.mapOwner = map;
    };

    getMapOwner() {
        return this.mapOwner;
    };

    setName(name) {
        if (this.node != null) {
            let lblName = this.node.getChildByName('lblName');
            lblName.getComponent(cc.Label).string = name;
        }
        else {
            global.Instance.Log.debug('节点不存在', '')
        }

        this.getData().setName(name);
    };

    setPosition(position) {
        if (this.node != null)
            this.node.setPosition(position);
        else {
            global.Instance.Log.debug('节点不存在', '')
        }
    };

    getPosition() {
        return this.node.getPosition();
    };

    getDirect() {
        return this.getData().getDirect();
    };

    setDirect(direct) {
        let oldDirect = this.getDirect();

        if (oldDirect != direct) {
            this.getData().setDirect(direct);
            if (direct == global.Enum.Direct.LEFT) {
                this.setSpineDirect(direct);
            }
            else if (direct == global.Enum.Direct.RIGHT) {
                this.setSpineDirect(direct);
            }
        }
    };

    getDigDirect(itemIdx, standIdx) {
        let colNum = global.Proxys.ProxyDigGold.getColNum();

        if (standIdx - itemIdx == -1) {
            return global.Enum.Direct.RIGHT;
        }
        else if (standIdx - itemIdx == 1) {
            return global.Enum.Direct.LEFT;
        }
        else if (standIdx - itemIdx == -colNum) {
            return global.Enum.Direct.DOWN;
        }
        else if (standIdx - itemIdx == colNum) {
            return global.Enum.Direct.UP;
        }
    };

    arrived() {
        this.idle();
    };

    isDigStageFull() {
        let curDigIdx = this.getData().getCurDigIdx();
        let item = global.Proxys.ProxyDigGold.getMapItem(curDigIdx);
        if (item != null)
            return item.stage >= (item.totalStage);

        return false;
    };

    idle() {
        this.startAnimation('');
        // let skeleton = this.node.getChildByName('spine').getComponent(sp.Skeleton);

        // skeleton.animation = 'zhanshi';
        // skeleton.loop = true;
        // skeleton.paused = false;
    };

    startAnimation(animName) {
        global.Instance.Log.debug('动作',animName)
        let skeleton = this.node.getChildByName('spine').getComponent(sp.Skeleton);
        if (skeleton.animation != animName)
            skeleton.animation = animName;
        if (skeleton.paused)
            skeleton.paused = false;

        skeleton.loop = true;
    };

    walkToTarget(targetPos, callback) {
        global.Instance.AudioEngine.stopSound('dig');
        global.Instance.AudioEngine.replaySound('walk', true, 5);

        this.startAnimation('zoulu');
        this.setWalkDirect(targetPos);

        let position = this.getPosition();
        let distance = targetPos.sub(position).mag();
        let speed = this.getData().getSpeed();
        let timeCost = distance / speed;
        let moveAction = cc.moveTo(timeCost, targetPos);

        let selfEnd = function () {
            if (callback)
                callback();
            global.Instance.AudioEngine.stopSound('walk');
        };

        let endFunction = cc.callFunc(selfEnd);
        let action = cc.sequence(moveAction, endFunction);
        this.node.stopAllActions();
        this.node.runAction(action);
    };

    findPath(path, digDirect, callback) {
        let self = this;

        global.Instance.AudioEngine.stopSound('dig');
        global.Instance.AudioEngine.replaySound('walk', true, 5);

        let nextMove = function () {
            let item = path.shift();

            let player = self.node;
            player.stopAllActions();

            if (item != null) {
                let curPos = player.getPosition();
                let targetIdx = global.Proxys.ProxyDigGold.getItemIdx(item.x, item.y);

                let mapOwner = self.getMapOwner();
                let targetPos = mapOwner.caculateItemPosition(targetIdx);
                // targetPos.x -= 43;
                let cellSize = mapOwner.getCellSize();

                if (path.length <= 0) {
                    let posOffset = cc.v2(0, 0);
                    let Direct = global.Enum.Direct;

                    if (digDirect == Direct.LEFT) {
                        posOffset.x = -cellSize.width / 4.2;
                        // posOffset.y = -cellSize.height/2+5;
                    }
                    else if (digDirect == Direct.RIGHT) {
                        posOffset.x = cellSize.width / 4.2;
                        //posOffset.y = -cellSize.height/2+5;
                    }
                    else if (digDirect == Direct.UP) {
                        posOffset.y = cellSize.height / 4;
                    }
                    else if (digDirect == Direct.DOWN) {
                        // posOffset.x = -cellSize.width/4.2;
                    }

                    targetPos.x += posOffset.x;
                    targetPos.y += posOffset.y;
                }

                let distance = targetPos.sub(curPos).mag();
                let speed = self.getData().getSpeed();
                let timeCost = distance / speed;
                let moveAction = cc.moveTo(timeCost, targetPos);

                let endFunction = cc.callFunc(nextMove);
                let action = cc.sequence(moveAction, endFunction);

                self.setWalkDirect(targetPos);

                player.runAction(action);
            }
            else {
                self.arrived();

                global.Instance.AudioEngine.stopSound('walk');

                if (callback)
                    callback();
            }
        }

        nextMove();
    };

    findToTarget(targetIdx, digDirect, callback) {
        let mapOwner = this.getMapOwner();

        //let targetPos   = mapOwner.caculateItemPosition(targetIdx);
        let curPos = this.node.getPosition();
        let curIdx = mapOwner.caculateIdx(curPos);

        let curPath = new Array();

        if (targetIdx != curIdx)
            curPath = global.Proxys.ProxyDigGold.searchdPath(curIdx, targetIdx);
        else {
            let pathCell = mapOwner.indexToRowCol(targetIdx);
            curPath.push(pathCell);
        }

        if (curPath != null && curPath.length > 0) {
            this.startAnimation('zoulu');
            this.findPath(curPath, digDirect, callback);

            return true;
        }

        return false;
    };

    walkToDig(targetIdx) {
        let digND = this.getMapOwner().getItemNode(targetIdx);

        let itemIdx = digND.tagEx;
        let standIdx = global.Proxys.ProxyDigGold.getFitDigStandIdx(itemIdx);
        let digDirect = this.getDigDirect(itemIdx, standIdx);

        let self = this;

        let sendDig = function () {
            //向服务器发送挖矿请求
           
            let mapOwner = self.getMapOwner();
            let itemPos = mapOwner.caculateItemPosition(itemIdx);
            itemPos = global.Proxys.ProxyDigGold.cTosPosition(itemPos);
            let skillData = {
                skillId: 16, targetRoleId: 0, type: 1, srcRoleDirection: { x: digDirect, y: 0, z: 0 }, skillCount: 1,
                targetPos: { x: itemPos.x, y: itemPos.y, z: 0 }
            }; //type:1开始使用技能 type:2取消使用技能

           
            self.dig(itemIdx);
            global.Instance.MsgPools.send('sceneUseSkill', skillData, null);
        };

        return this.findToTarget(standIdx, digDirect, sendDig);
    };

    dig(itemIdx) {
        let curDigIdx = this.data.getCurDigIdx();

        if (curDigIdx != itemIdx) {
            let position = this.node.getPosition();
            let curStandIdx = this.getMapOwner().caculateIdx(position);
            let direct = this.getDigDirect(itemIdx, curStandIdx);

            let spine = this.node.getChildByName('spine');
            let skeleton = spine.getComponent(sp.Skeleton);

            skeleton.loop = true;
            skeleton.paused = false;

            if (direct == global.Enum.Direct.LEFT || direct == global.Enum.Direct.RIGHT) {
                skeleton.animation = 'wakuang-ce';
                this.setSpineDirect(direct);
            }
            else if (direct == global.Enum.Direct.DOWN) {
                skeleton.animation = 'wakuang-xia';
            }
            else if (direct == global.Enum.Direct.UP) {
                skeleton.animation = 'wakuang-shang';
            }

            this.getData().setCurDigIdx(itemIdx);
            this.getData().setDirect(direct);
        }
        global.Instance.AudioEngine.replaySound('dig', false, 5);
    };

    finishDig(isDigOver) {
        let player = this.node;

        let skeleton = player.getChildByName('spine').getComponent(sp.Skeleton);
        skeleton.paused = true;

        if (isDigOver) {
            let direct = this.getData().getDirect();
            this.walkForward(direct);
        }

        let digIdx = this.getData().getCurDigIdx();
        if (digIdx > 0)
            global.Proxys.ProxyDigGold.showDigReward(digIdx);

        this.getData().setCurDigIdx(-1);

        global.Instance.AudioEngine.stopSound('dig');
    };

    setSpineDirect(direct) {
        let Direct = global.Enum.Direct;

        let spine = this.node.getChildByName('spine');
        let scaleX = spine.scaleX;
        let scaleY = spine.scaleY;

        if (direct == Direct.LEFT)//'left'
        {
            if (scaleX < 0)
                scaleX = -scaleX;

            spine.setScale(scaleX, scaleY);
        }
        else if (direct == Direct.RIGHT)//'right'
        {
            if (scaleX > 0)
                scaleX = -scaleX;

            spine.setScale(scaleX, scaleY);
        }
    };

    setWalkDirect(targetPos) {
        let Direct = global.Enum.Direct;

        let curPosition = this.node.getPosition();
        if (curPosition.x - targetPos.x > 0.0001) {
            this.setSpineDirect(Direct.LEFT);
            this.getData().setDirect(Direct.LEFT);
        }
        else if (curPosition.x - targetPos.x < -0.0001) {
            this.setSpineDirect(Direct.RIGHT);
            this.getData().setDirect(Direct.RIGHT);
        }
        else {
            if (curPosition.y - targetPos.y < -0.0001) {
                this.getData().setDirect(Direct.UP);
            }
            else if (curPosition.y - targetPos.y > 0.0001) {
                this.getData().setDirect(Direct.DOWN);
            }
        }
    };

    walkForward(digDirect) {
        let player = this.node;
        player.stopAllActions();

        this.startAnimation('zoulu');

        let curPos = player.getPosition();
        let targetPos: any = cc.v2(curPos.x, curPos.y);
        let cellSize = this.mapOwner.getCellSize();

        let Direct = global.Enum.Direct;

        if (digDirect == Direct.LEFT) {
            targetPos.x -= cellSize.width;
        }
        else if (digDirect == Direct.RIGHT) {
            targetPos.x += cellSize.width;
        }
        else if (digDirect == Direct.UP) {
            targetPos.y += cellSize.height;
        }
        else if (digDirect == Direct.DOWN) {
            targetPos.y -= cellSize.height;
        }

        let self = this;
        let moveEnd = function () {
            self.idle();
        }

        let distance = targetPos.sub(curPos).mag();
        let speed = this.getData().getSpeed();
        let timeCost = distance / speed;
        let moveAction = cc.moveTo(timeCost, targetPos);

        let endFunction = cc.callFunc(moveEnd);
        let action = cc.sequence(moveAction, endFunction);

        this.setWalkDirect(targetPos);
        player.runAction(action);
    };

}
