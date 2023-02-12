const { ccclass, property } = cc._decorator;
@ccclass
export default class LoginScene extends cc.Component {
    @property({ type: cc.Node, displayName: "云动画", tooltip: "第一次进入云动画" })
    ndCloudNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "热气球", tooltip: "第一次进入云动画" })
    btnGoNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "地图层", tooltip: "地图层" })
    DragLayer: cc.Node = null;
    @property({ type: cc.Node, displayName: "UILogin", tooltip: "登录层" })
    UILogin: cc.Node = null;
    @property({ type: cc.Node, displayName: "animation", tooltip: "云动画层" })
    animation: cc.Node = null;
    onLoad() {

     
    }
    onEnable() {
        global.Manager.UIManager.add('LoginScene', this);
        let animaNum = JSON.parse(cc.sys.localStorage.getItem('animaNum'));
        this.DragLayer.active = !(animaNum == 3);
        this.animation.active = !(animaNum == 3);
        if (animaNum == 3) {
            let panel = global.Manager.UIManager.getPersistUI('UIProgress');
            if (panel != null)
                panel.setProgress(1, 1);
        }
        let clickAnim = global.Manager.UIManager.getResident('clickAnim');
        if (clickAnim)
            clickAnim.reflashEntry(false);
        // let musicData = global.Manager.DBManager.findData('SceneMusic', 'name', 'LoginScene');
        // if (musicData != null)
        //     global.Instance.AudioEngine.playMusic(musicData.backMusic, true, musicData.volume);
    }

    playCloudAction(callback) {
        this.ndCloudNode.active = true;
        this.btnGoNode.active = true;
        let animation = this.ndCloudNode.getComponent(cc.Animation);
        let animation1 = this.btnGoNode.getComponent(cc.Animation);
        animation1.play('luxian2')
        this.scheduleOnce(function () {
            animation.play('cloud');
            if (callback)
                animation.on('finished', callback);
        }, 1.5);//下一帧立即执行，此处需要在下一帧执行
    };
 
    onDisable() {
        global.Manager.UIManager.remove('LoginScene');
        global.Module.GameData.setDropInstance(null);
        global.Manager.UIManager.clear();
    }
}

