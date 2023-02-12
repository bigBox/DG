import SceneBase from "./SceneBase";
const {ccclass, property} = cc._decorator;

@ccclass
export default class FarmScene extends SceneBase {
    @property({ type: cc.Node, displayName: "helpNode", tooltip: "任务引导遮罩层级" })
    helpNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "bottom", tooltip: "关掉遮罩我知道了按钮小麦任务" })
    bottom: cc.Node = null;
    @property({ type: cc.Node, displayName: "bottom1", tooltip: "关掉遮罩我知道了按钮绿化任务" })
    bottom1: cc.Node = null;
    @property({ type: cc.Node, displayName: "bottom2", tooltip: "关掉遮罩我知道了按钮鸡蛋任务" })
    bottom2: cc.Node = null;
    @property({ type: cc.Node, displayName: "bottom3", tooltip: "关掉遮罩我知道了按钮鱼塘任务" })
    bottom3: cc.Node = null;
    
    @property({ type: cc.Node, displayName: "helpCell2", tooltip: "仙人掌手指按下动画" })
    helpCell2: cc.Node = null;
    @property({ type: cc.Node, displayName: "boxTips", tooltip: "白框" })
    boxTips: cc.Node = null;
    @property({ type: cc.Label, displayName: "boxLabel", tooltip: "白框文字" })
    boxLabel: cc.Label = null;
    

    tipType:number;
    animationType: object;
    tips: string[];
    isShow: boolean;
    itemType: number;
    constructor() {
        super();
        this.tips = ['点击选择收获目标','摁住镰刀并拖入收获目标','拖动镰刀连续收获其他目标'] ;
        this.animationType = {
            10012:['1','2','3'] 
        }
        this.isShow = false;
        this.itemType = 0;
    };

    onLoad () {
        
    }
    
    start () {
        this.helpNode.active = false;
        var data = global.Module.TaskData.getHasAcceptTaskData();
        
        if(data){
            if(data.state == 1 && data.taskId == 10012){
                this.isShow = true;
                this.helpNode.active = true;
                this.tipType = -1;
                this.scheduleOnce(function(){ 
                    this.onClick();
                },2);
            }
            if (data.state == 1 && data.taskId == 10013) {
                this.helpNode.active = true;
            }
            if (data.state == 1 && data.taskId == 10018) {
                this.scheduleOnce(function(){ 
                let animalNum = global.Module.FarmParkData.getAllAnimalNum();
                if (animalNum == 1) {
                    let date = global.Module.FarmParkData.getAllAnimal();
                    let data = null;
                    for (let key in date)
                        data = date[key]
                    if(data&&data.canHarvset)
                    this.reflashHelp1();
                }
            },1.5);

            }
           
            if (data.state == 1 && data.taskId == 10021) {
                this.scheduleOnce(function(){ 
                let data = global.Module.FarmParkData.getAllFishsData();
                    let isShow = false;
                    for (let key in data) {
                        if (data[key] && data[key].canHarvset == true) {
                            isShow = true;
                        }
                    }
                    if (isShow) {
                        this.reflashHelp2();
                    }
            },1.5);

            }
        }
    };
    reflashHelp1(){
        this.helpNode.active = true;
        let map = global.Module.FarmParkData.getMap();
        map.reflashHelp(true);
        map.getAnimation('dan', 'dan');
        this.scheduleOnce(function () {
            map.getAnimation1(true);
        }, 0.5);
        this.scheduleOnce(function () {
            this.bottom1.active = true;
        }, 4);
    };
    reflashHelp2(){
        if( this.itemType==0){
            this.itemType =1
            this.helpNode.active = true;
            let map = global.Module.FarmParkData.getMap();
            map.reflashHelp(true);
            map.getAnimation2('yu', 'yu');
           
            this.scheduleOnce(function () {
                this.bottom3.active = true;
            }, 4);  
        }
        
    }
    reflashHelp(){
       
        var animation = this.helpCell2.getChildByName('shou2').getComponent(cc.Animation);
        var pic = this.helpCell2.getChildByName('pic');
        cc.tween(this.helpCell2)
            .delay(1)
            .call(() => {
                pic.active = false;
                this.helpCell2.active = true;
                var withX = global.Manager.Sdk.sizeMath();
                if(withX>0){
                    this.helpCell2.setPosition(-540, 220,0);
                }else{
                    this.helpCell2.setPosition(-520, 220,0);
                }
                animation.play('anxia2');
            })
            .delay(0.5)
            .call(() => {
                pic.active = true;
            })
            .to(1, { position: new cc.Vec3(-104, 88) })
            .call(() => {
                this.bottom1.active = true;
                let map = global.Module.FarmParkData.getMap();
                map.reflashdonghua();
                        pic.active = false;
                this.helpCell2.active = false;
            })
            .start()
    };
    onClick(){
        if (this.isShow == true) {
            this.isShow = false;
            this.tipType++;
            let map = global.Module.FarmParkData.getMap();
           
            if (this.tips[this.tipType]) {
                let time = 0;
                this.boxTips.active = true;
                    if(this.tipType == 2){
                        this.boxTips.setPosition(-250,57)
                    }else if(this.tipType == 1){
                        this.boxTips.setPosition(-300,107)
                    }else{
                        this.boxTips.setPosition(-440,170)
                    }
                    this.boxLabel.string = this.tips[this.tipType];
                map.reflashAnimation(false);
                map.getAnimation('mai', this.tipType + 1);
                this.scheduleOnce(function () {
                    map.getAnimation1(false);
                }, 0.5);
                if(this.tipType ==0){
                    time = 1;
                }
                if(this.tipType ==1){
                    time = 1.7;
                }
                if(this.tipType ==2){
                    time = 1;
                }
                this.scheduleOnce(function () {
                    this.isShow = true;
                    this.boxTips.active = false;
                    this.onClick();
                }, time*2+0.5);
            } else {
                map.reflashAnimation(true);
                this.boxTips.active = false;
                this.scheduleOnce(function () {
                    this.bottom.active = true;
                }, 2);
                this.scheduleOnce(function () {
                    map.reflashAnimation(false);
                    this.tipType = -1;
                    this.isShow = true;
                    this.onClick();
                }, 3.5);
            }
          
        }
    }
    onHelpClick(){
        this.unscheduleAllCallbacks()
        cc.Tween.stopAllByTarget(this.helpCell2);
        this.helpNode.active = false;
        this.bottom.active = false;
        this.bottom1.active = false;
        let map = global.Module.FarmParkData.getMap();
        map.reflashHelp(false)
        map.reflash();
    }
    // update (dt) {}
}
