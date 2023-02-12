let Man =window["Man"];
const {ccclass, property} = cc._decorator;

@ccclass
export default class ObstacleBase extends cc.Component {


    @property({  displayName: "ID", tooltip: "区分符" })
    ID: number = 0;

    // use this for initialization
    onLoad() {
        cc.systemEvent.on('10001', this.setData, this);
        this.setData();
    };
    setData() {
        let scene = cc.director.getScene();
        if (scene.name == 'PlayerScene' || !this.node)
            return;
        let ndHelp = this.node.getChildByName('helpNode');
        let taskdata = global.Module.TaskData.getHasAcceptTaskData();
        if (taskdata && taskdata.taskId == '10026' && taskdata.state == 1) {
            if (ndHelp != null) {
                ndHelp.active = true;
                this.node.zIndex = 999;
            }
        }
        else {
            if (ndHelp){
                ndHelp.active = false;
                this.node.zIndex = 1;
            }
                
        }

    };

    onEnable() {

    };

    onDisable() {
    };

    getID() {
        return this.ID;
    };

    isPicked(touchPoint) {
        let ndPicks:any = this.node.getChildByName('ndPick').children;
        for (let key in ndPicks) {
            let pickItem = ndPicks[key].getComponent(global.CommonClass.Prismatic);
            if (pickItem != null && pickItem.isPicked(touchPoint)) {
                return true;
            }
        }

        return false;
    };

    isCross(ndFactory) {
        if (ndFactory != null) {
            let factory = ndFactory.getComponent(global.CommonClass.FactoryBase);

            let ndPicks = this.node.getChildByName('ndPick').children;
            for (let key in ndPicks) {
                let curspPick = ndPicks[key].getComponent('Prismatic');
                let isCross = global.CommonClass.Geometry.checkSlantingSpIsCross(ndFactory, factory.xPickRate, factory.yPickRate, curspPick.node, curspPick.xPickRate, curspPick.yPickRate);

                if (isCross)
                    return true;
            }
        }

        return false;
    };

    setSelect(isSel) {
        let animation = this.node.getComponent(cc.Animation);
        animation.stop();

        if (isSel) {
            let animState = animation.play("fadeInOut");
            animState.wrapMode = cc.WrapMode.Loop;
        }

        global.Instance.Log.debug('setSelect ' , isSel.toString());
    };

    btnClick() {

    };
}
