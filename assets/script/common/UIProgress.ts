import UIBase from "./UIBase";
const { ccclass, property } = cc._decorator;

@ccclass
export default class UIProgress extends UIBase {

    static filePath: "prefab/common/";
    @property({ type: cc.ProgressBar, displayName: "progressBar", tooltip: "进度条" })
    progressBar: cc.ProgressBar = null;
    @property({ type: cc.Label, displayName: "prolabel", tooltip: "文字" })
    prolabel: cc.Label = null;
    
    progress: number;
    targetProgress: number;
    perProgress: number;
    moveIndex: number;
    moveDirect: number;
    moveFlag: number;
    onFinish: any;
    lock: boolean;
    ndMovePoint: any;
    callback: any;

    constructor() {
        super();
        this.progress = 0;
        this.targetProgress = 0;
        this.perProgress = 0;
        this.moveIndex = 1;
        this.moveDirect = 1;

        this.moveFlag = 1;
        this.moveFlag = 1;
        this.onFinish = null;

        this.lock = false;

        this.ndMovePoint = null;
    };

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEvent, this);

        this.ndMovePoint = this.node.getChildByName('ndMove');
    };

    onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchEvent, this);
    };

    touchEvent(event) {
        if (event.type == cc.Node.EventType.TOUCH_START) {

        }
    };

    onLoad() {
        this.node.active = false;
       this.progressBar.progress = 0;
    };
    //显示隐藏 
    show(isShow) {
        global.Instance.Log.debug("切屏动画--------------:", isShow)
        this.lock = true;
        this.node.active = isShow;
        if(isShow){
            this.setFinishCall(null);
            this.progress = 0;
            this.progressBar.progress =0
            let loadingbg = this.node.getChildByName('loadingbg');

            let mapNode = this.node.getChildByName('mapNode');
            let makeNode = this.node.getChildByName('makeNode');
            mapNode.active = false;
            makeNode.active = false;
            loadingbg.active = true;
        }
       
    };


    showMode(isShow, mode,mapData) {
        global.Instance.Log.debug("切屏动画showMode--------------:", isShow)
        this.lock = isShow;
        this.node.active = isShow;
        if (isShow)
            if (mode != null)
                this.setMode(mode,mapData);
    };
    setMode(mode,mapData) {
        let loadingbg = this.node.getChildByName('loadingbg');
        let mapNode = this.node.getChildByName('mapNode');
        let makeNode = this.node.getChildByName('makeNode');
        global.Instance.Log.debug('弹框-----------', mode)
        loadingbg.active = false;
        makeNode.active = false;
        mapNode.active = false
      
      
        if (mode == 6&&mapData) {
            let map = mapNode.getChildByName('map');
            let btnGoNode = mapNode.getChildByName('btnGoNode');
            mapNode.active = true
            btnGoNode.active = true;
            map.active = true;
            map.opacity = 0;
            let iconFile = mapData.path + mapData.nameItemID;
            global.CommonClass.Functions.setTextureNew(map, iconFile, null);
            let anmineNode = mapNode.getChildByName('anmine');
            let chamaNode = anmineNode.getChildByName('chama');
            let wukuangNode = chamaNode.getChildByName('wukuang');
            let inputItemId = mapData.inputItemId;
            for (let i = 1; i < 7; i++) {
                let tmpNode1 = anmineNode.getChildByName('chama' + i);
                let tmpNode2 = wukuangNode.getChildByName('chama' + i);
                let picPath = mapData.path + inputItemId;
                let path =  global.CommonClass.Functions.getItemPicPathNew(inputItemId);
                global.CommonClass.Functions.setTextureNew(tmpNode1, path, null);
                global.CommonClass.Functions.setTextureNew(tmpNode2, picPath, null);
                inputItemId++;
            }
            cc.tween(map)
                .to(0, { scale: 0.5, opacity: 255 })
                .to(0.5, { scale: 1 }, { easing: 'easeOutExpo' })
                .start();


        }else if (mode == 1){
            makeNode.active = true;
        }

        
    };
    //探险过渡动画处理
    playBalloonAction(){
        let self = this;
        let flyOutEnd = function () {
            let GuJiMapNew = global.Instance.Dynamics['GuJiMap'];
            if (GuJiMapNew != null) {
                GuJiMapNew.playBalloonAction();
            }
            if (self.node)
                self.node.active = false;
        };
        let mapNode = this.node.getChildByName('mapNode');
        let btnGo = mapNode.getChildByName('btnGo');
        let map = mapNode.getChildByName('map');
        let dituNode = mapNode.getChildByName('anmine');
        let btnGoNode = mapNode.getChildByName('btnGoNode');
        mapNode.active = true   
        map.active = false;
        btnGoNode.active = false;
        dituNode.active = true;
        btnGo.active = true;
        var anim = btnGo.getComponent(cc.Animation);
        anim.play('luxian');// 指
      
        var animation = dituNode.getComponent(cc.Animation);
        animation.play('xian');// 指
        animation.on('finished',  function () {
            animation.off('finished');
            flyOutEnd();
        });
    };
    setFinishCall(callback) {
        this.callback = callback;
    };

    setProgress(progress, time) {
        if (this.progress < progress) {
            if (time <= 0) {
                this.targetProgress = progress;
                this.perProgress = (progress - this.progress);
            }else {
                this.perProgress = (progress - this.progress) / time;
                this.targetProgress = progress;
            }
        }

        if (this.progress == 0)
            this.progress = 0.0001;
    };

    update(dt) {
        if (!this.node.active)
            return;

        if (this.progress < this.targetProgress) {
            this.progress += this.perProgress * dt;
            this.prolabel.string = '加载中:'+Math.round(this.progress*100) +'%'

            this.progressBar.progress = this.progress;
             

            if (this.progress >= 1) {
                if (this.callback)
                    this.callback();
                this.show(false);
            }
        }
    };

}
