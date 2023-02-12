import DigGolder from "./DigGolder";
const { ccclass, property } = cc._decorator;

@ccclass
export default class DigGolderMainPlayer extends DigGolder {

    start() {

    };

    startFindPath(path) {
        DigGolder.prototype.startFindPath.apply(this, arguments);

        let position = this.getPosition();
        let direct = this.getDirect();
        let speed = this.getData().getSpeed();

        let serverPos = global.Proxys.ProxyDigGold.cTosPosition(position);

        let data = { moveType: 1, pos: { x: serverPos.x, y: serverPos.y, z: 1 }, speed: speed, direction: { x: direct, y: 0, z: 0 } };
        global.Instance.MsgPools.send('sceneMovement', data,null);

    };

    arrived() {
        DigGolder.prototype.arrived.apply(this, arguments);

        let position = this.getPosition();
        let direct = this.getDirect();
        let speed = this.getData().getSpeed();

        let serverPos = global.Proxys.ProxyDigGold.cTosPosition(position);
        let data = { moveType: 2, pos: { x: serverPos.x, y: serverPos.y, z: 1 }, speed: speed, direction: { x: direct, y: 0, z: 0 } };
        global.Instance.MsgPools.send('sceneMovement', data,null);
    };

    onFindNextPath(targetPos) {
        let direct = this.getDirect();
        let speed = this.getData().getSpeed();

        let serverPos = global.Proxys.ProxyDigGold.cTosPosition(targetPos);
        let data = { moveType: 3, pos: { x: serverPos.x, y: serverPos.y, z: 1 }, speed: speed, direction: { x: direct, y: 0, z: 0 } };
        global.Instance.MsgPools.send('sceneMovement', data,null);
    };

    isStaminaEnough(itemIdx) {
        let item = global.Proxys.ProxyDigGold.getMapItem(itemIdx);
        let type = item.type;

        let stamina = global.Module.MainPlayerData.getDataByKey("Stamina");
        let data = global.Manager.DBManager.findData('DigGold', 'type', type);

        if (data != null) {
            return (stamina >= data.cost);
        }

        return false;
    };

    dig(itemIdx) {
        DigGolder.prototype.dig.apply(this, arguments);

        this.updateDig(true);
    };



    sendStopDig(callback) {
        // DigGolder.prototype.stopDig.apply(this,arguments);
        let curDigIdx = this.getData().getCurDigIdx();

        if (curDigIdx >= 0) {
            let curStandIdx = this.getData().getCurStandIdx();
            let direct = this.getDigDirect(curDigIdx, curStandIdx);

            let mapOwner = this.getMapOwner();
            let itemPos = mapOwner.caculateItemPosition(curDigIdx);
            itemPos = global.Proxys.ProxyDigGold.cTosPosition(itemPos);
            let skillData = {
                skillId: 16, targetRoleId: 0, type: 2, srcRoleDirection: { x: direct, y: 0, z: 0 }, skillCount: 1,
                targetPos: { x: itemPos.x, y: itemPos.y, z: 0 }
            };
            global.Instance.MsgPools.send('sceneUseSkill', skillData, callback);
            this.updateDig(false);

            return true;
        }

        global.Instance.AudioEngine.stopSound('dig');

        return false;
    };

    updateDig(isUpdate) {
        if (!isUpdate) {
            cc.director.getScheduler().unschedule(this.updateDigState, this);
        }
        else {
            cc.director.getScheduler().schedule(this.updateDigState, this, 0.01, cc.macro.REPEAT_FOREVER, 0, false);
        }
    };

    finishDig(isDigOver) {
        DigGolder.prototype.finishDig.apply(this, arguments);

        this.getData().clearDigTime();

    };

    updateDigState(dt) {
        // let item = {idx:-1, type:-1, mine:-1, isDig:false, perTimeDig:0, mineLeft:0};
        let curDigItem = this.getData().getCurDigItem();
        if (curDigItem != null) {
            let timeLeft = this.getData().digMine(dt * 1000);
            if (timeLeft <= 0) {
                this.sendStopDig(null);
            }
        }
    };

    // update (dt) {}
}
