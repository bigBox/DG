//精灵召唤动画处理
const { ccclass, property } = cc._decorator;

@ccclass
export default class summonAnima extends cc.Component {

    @property({ type: cc.Node, displayName: "animNode", tooltip: "精灵召唤动画层" })
    animNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "wuxingSpine", tooltip: "五行石飞尾动画" })
    wuxingSpine: cc.Node = null;
    @property({ type: cc.Node, displayName: "floatNode", tooltip: "精灵山放大" })
    floatNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "floatSpine", tooltip: "精灵动画山" })
    floatSpine: cc.Node = null;
    @property({ type: cc.Node, displayName: "daijiNode", tooltip: "精灵待机动画背景" })
    daijiNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "demonBgNode", tooltip: "精灵动画背景" })
    demonBgNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "demontreeNode", tooltip: "精灵背景树" })
    demontreeNode: cc.Node = null;

    @property({ type: cc.Node, displayName: "demonLead", tooltip: "精灵主角成功用" })
    demonLeadNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "demonfail", tooltip: "精灵召唤失败" })
    demonfailNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "guduNode", tooltip: "过渡动画" })
    guduNode: cc.Node = null;
    data: any;
    msg: any;
    level: any;
    isShow: boolean;

    constructor() {
        super();
        this.msg = null;
        this.level = 0;
        this.isShow = false;
    };

    // onLoad () {}

    start() {

    }
    show(msg, level) {
        this.msg = msg;
        this.level = level;
        this.isShow = false;
        this.playRotateEffect(level, function () {
            this.isShow = true;;
            this.runSummonSuccess(msg,level)
        }.bind(this));
    }
    //精灵召唤动画
    playRotateEffect(level, callBack) {
        let self = this;
        this.animNode.active = true;
        this.wuxingSpine.active = true;
        this.floatSpine.active = true;
        let skeleton = this.wuxingSpine.getComponent(sp.Skeleton);
        skeleton.animation = 'wuxing';

        let skeleton1 = this.floatSpine.getComponent(sp.Skeleton);
        skeleton1.animation = level;

        let bgNode2 = this.animNode.getChildByName("bg2")
        bgNode2.active = true;
        bgNode2.opacity = 0;

        cc.tween(bgNode2)
            .delay(0.6)
            .call(() => {
                let animation = this.floatNode.getComponent(cc.Animation);
                animation.play("summonFloat");
            })
            .delay(1.1)
            .to(0, { opacity: 255 })
            .call(() => {
                bgNode2.getChildByName('aa1').active = (level==1);
                bgNode2.getChildByName('aa2').active = (level==2);
            })
            .delay(0.1)
            .call(() => {
                this.floatNode.active = false;
                this.wuxingSpine.active = false;
            })
            .delay(0.03)
            .call(() => {
                this.daijiNode.active = false;
                this.demonLeadNode.active = false;
                this.demonfailNode.active = false;
                this.demontreeNode.active = true;
                this.demonBgNode.active = true;
                this.demonBgNode.opacity = 0;
                this.demonBgNode.getComponent(sp.Skeleton).setSkin('dashu' + level);
                this.demonBgNode.getComponent(sp.Skeleton).animation = 'zhaohuanbeijing';
                this.demonBgNode.opacity = 255;

                this.demontreeNode.getComponent(sp.Skeleton).setSkin('dashu' + level);
                this.demontreeNode.getComponent(sp.Skeleton).animation = 'dashu';

            })
            .delay(1)
            .call(() => {
                if (callBack)
                    callBack()
            })
            .start();
        cc.tween(this.node)
            .delay(1.7)
            .call(() => {
                
                let name = '';
                if (level == 4)
                    name = 'hong';
                if (level == 2)
                    name = 'lan';
                if (level == 1)
                    name = 'lv';
                if (level == 3)
                    name = 'zi';
                this.demonBgNode.getComponent(sp.Skeleton).setSkin(name);
                this.guduNode.active = true;
                this.guduNode.getComponent(sp.Skeleton).setSkin(name);
                this.guduNode.getComponent(sp.Skeleton).animation = 'guodu3';
            })
            .start();

    };
    getAnimByName(){
        let data = this.data
        let animalName = '';
        if (data.summonID != 0) {
            if (data.element == 1)
                animalName = 'jin';
            if (data.element == 2)
                animalName = 'mu';
            if (data.element == 3)
                animalName = 'shui';
            if (data.element == 4)
                animalName = 'huo';
            if (data.element == 5)
                animalName = 'tu';
            animalName = animalName + data.level
        }
       

        return animalName;
    };
    // 召唤成功
    runSummonSuccess(msg, level) {
        global.Instance.Log.debug('召唤成功返回',msg)
        let self = this
        let isSuccess = (msg.summonID > 0);//是否召唤成功
        this.data = msg;
        let animalName = this.getAnimByName();
        this.demonLeadNode.active = isSuccess;
        this.demonfailNode.active = !isSuccess;
        let wantfun = function name() {
            self.demontreeNode.active = false
            self.demonBgNode.active = false;
            self.daijiNode.active = true;
            self.daijiNode.getComponent(sp.Skeleton).setSkin('dashu' + level);
            self.daijiNode.getComponent(sp.Skeleton).animation = 'daiji';
        }

        cc.tween(this.node)
            .delay(1)
            .call(() => {
                wantfun();
            })
            .start();
        if (isSuccess) {
            let skeleton = this.demonLeadNode.getComponent(sp.Skeleton);
            skeleton.setSkin(animalName);
            skeleton.animation = 'jingling-chu';
            skeleton.setCompleteListener((trackEntry, loopCount) => {
                skeleton.animation = 'jingling-daiji';
            });
        } else {
            let skeleton = this.demonfailNode.getComponent(sp.Skeleton);
            skeleton.setSkin('dashu' + level);
            skeleton.animation = 'luoye';
            skeleton.loop = true;
            skeleton.setCompleteListener((trackEntry, loopCount) => {
            });
        }

        if (isSuccess)
            global.Instance.AudioEngine.replaySound('success', false, null);
        else
            global.Instance.AudioEngine.replaySound('failed', false, null);
    };
    onClickClose() {
         if(this.isShow == true){
            global.Manager.UIManager.close('summonAnima');
            cc.Tween.stopAllByTarget(this.node);
            let UISummon = global.Manager.UIManager.get('UISummon');
            if (UISummon) {
                UISummon.onClickBtn();
            }
         }else{
            this.isShow = true;
          
            let bgNode2 = this.animNode.getChildByName("bg2");
            bgNode2.opacity = 255;
            this.daijiNode.active = false;
            this.demonLeadNode.active = false;
            this.demonfailNode.active = false;
            this.demonBgNode.active = true;
            this.demonBgNode.getComponent(sp.Skeleton).setSkin('dashu' + this.level);
            this.demonBgNode.getComponent(sp.Skeleton).animation = 'zhaohuanbeijing';
            this.demonBgNode.opacity = 255;

            cc.Tween.stopAllByTarget(bgNode2);
            cc.Tween.stopAllByTarget(this.node);
            this.runSummonSuccess(this.msg,this.level)
         }
      
        // this.demonLeadNode.active = false;
        // this.demonfailNode.active = false;
        // this.floatSpine.active = false;
        // this.animNode.active = false;
    }
    // update (dt) {}
}
