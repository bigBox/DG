

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIGuJi extends cc.Component {
    @property({ type: cc.Node, displayName: "tipNode", tooltip: "提示框" })
    tipNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "tipNodes", tooltip: "提示框" })
    tipNodes: cc.Node = null;
    @property({ type: cc.Label, displayName: "tiplabel", tooltip: "提示框文字" })
    tiplabel: cc.Label = null;
    @property({ type: cc.Node, displayName: "ndHelp2", tooltip: "提示" })
    ndHelp2: cc.Node = null;
    @property({ type: cc.Node, displayName: "taskTipNode", tooltip: "提示" })
    taskTipNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "helpNode", tooltip: "提示" })
    helpNode: cc.Node = null;
    
    @property({ type: cc.ProgressBar, displayName: "barMagic", tooltip: "探险体力进度条" })
    barMagic: cc.ProgressBar = null;
    @property({ type: cc.Label, displayName: "lblMagic", tooltip: "探险体力数量" })
    lblMagic: cc.Label = null;
    
    onLoad() {

    };
    onEnable(): void {

        global.Manager.UIManager.add('UIGuJi', this);
        let magic = global.Module.MainPlayerData.getMagic();
        this.lblMagic.string = magic.toString()+'/1000';
        this.barMagic.progress = 1;
    };

    onDisable(): void {
        global.Manager.UIManager.remove('UIGuJi');
    };
    start() {
       
    };
    reflashMagic(actionChange,actionValue){
        let self = this;
        this.playReduceNumber(self.barMagic.node, actionChange, function () {
            if (actionValue != null) {
                let barProgress = actionValue / 1000;
                if (barProgress <= 0)
                    barProgress == 0.001;
                self.lblMagic.string = actionValue.toString() + '/1000';
                self.barMagic.progress = barProgress;
            }
            else {
                self.barMagic.progress = 0.001;
                self.lblMagic.string = '0/0';
            }
        });
        
    };
    playReduceNumber(parent, number,callback) {
        let lblTempFly = parent.getChildByName('lblTempFly')
        let newItem = cc.instantiate(lblTempFly);
        newItem.active = true;

        if (number < 0)
            newItem.getComponent(cc.Label).string = number.toString();
        else
            newItem.getComponent(cc.Label).string = '+' + number.toString();

        parent.addChild(newItem);

        let endFun = function () {
            newItem.removeFromParent();
            callback();
        };
        let action1 = cc.moveBy(1.7, cc.v2(0, 42));
        let action2 = cc.fadeOut(1.7);
        let action3 = cc.callFunc(endFun);

        let spawn = cc.spawn(action1, action2);
        let seq = cc.sequence(spawn, action3);

        newItem.stopAllActions();
        newItem.runAction(seq);
    };
    reflashHelp(): void{

    };
    isndHelp(isShow) {
        this.ndHelp2.active = isShow;
    };
    getndHelp(){
       let contentData = global.Proxys.ProxyGuJi.getContentData();
        var data = global.Module.TaskData.getHasAcceptTaskData();
        if (data){
            if (data.state == 1 && (data.taskId == 10003)&&contentData.ID==2){
                let data = JSON.parse(cc.sys.localStorage.getItem('10003'));
                if (data == null)
                    data = []
                if (data.indexOf(0) == -1||(data.indexOf(1) == -1||data.indexOf(2) == -1)) {
                    this.isndHelp(true);
                }
            }    
        }
    };
    reflash(){
        this.taskTipNode.active = false;
        var data = global.Module.TaskData.getHasAcceptTaskData();
        if (data.state == 1 && (data.taskId == 10000)){
            this.taskTipNode.active = true;
        }
    }
    btnHelp(){
     let helpNode = this.node.getChildByName('helpNode');
     helpNode.active = false;
    };
    btnTipClose(){
        this.taskTipNode.active = false;
    };
   
    btnClose(): void {
        let gujiMap = global.Instance.Dynamics["GuJiMap"];
        if (gujiMap) {
            let data = gujiMap.getTotalData();
            global.Manager.UIManager.open('UIGujiFoot', null, function (panel) {
                panel.refalsh(data);
            });
        }
    };
    flyNearisShow(): void{
        let spFly = this.node.getChildByName('spFly');
        spFly.active = false;
    };
    flyNearFar(nearFarFlag, start, callBack): boolean {
        this.setNearFar(nearFarFlag);
        let spFly = this.node.getChildByName('spFly');
        spFly.stopAllActions();
        spFly.active = true;
        spFly.setPosition(start);
        if (start.y < 0) {
            this.tipNode.y = 150
        } else {
            this.tipNode.y = -150
        }
        let contentData = global.Proxys.ProxyGuJi.getContentData();
        var data = global.Module.TaskData.getHasAcceptTaskData();
        if (data)
            if (data.state == 1 && (data.taskId == 10003)&&contentData.ID==2)
                this.tipNode.active = true;




        let spNearFar = this.node.getChildByName('spNearFar');
        let end = spNearFar.getPosition();

        let position = start;
        let endPosition = end;
        cc.tween(spFly)
        .repeatForever(
            cc.tween()
            .delay(0.3)
            .to(1, { position: endPosition })
            .delay(1)
            .call(() => {
                this.tipNode.active = false;
            })
        )
        .start();
        if (endPosition == null || position == null)
            return false;
        let endFun = function () {
            if (callBack)
                callBack();
        };
        endFun();

        return true;
    };
    setNearFar(nearFarFlag): void {
        let spFly = this.node.getChildByName('spFly');
        let imagePath = 'images/pictrue/guji/';
        let name = '';
        if (nearFarFlag == 1) {
            global.CommonClass.Functions.setTexture(spFly, imagePath + 'far', null);
            name = 'talk far';
        }
        else if (nearFarFlag == 0) {
            global.CommonClass.Functions.setTexture(spFly, imagePath + 'noChange', null);
            name = 'talk equal';
        }
        else if (nearFarFlag == -1) {
            global.CommonClass.Functions.setTexture(spFly, imagePath + 'near', null);
            name = 'talk near';
        }
        let data = global.Manager.DBManager.findData('Sundry', 'name', name);
        this.tiplabel.string = data.talk
    };

    btnNearFar(): void {
        
      
        this.tipNodes.active = false;
       
        let gujiMap = global.Instance.Dynamics["GuJiMap"];
        if (gujiMap){
            let isMake = gujiMap.makePathLines();
            let num = JSON.parse(cc.sys.localStorage.getItem('isMake'));
            if (num == null)
                num = 0;
            if (num != 4) {
                this.tipNodes.active = isMake;
            }
               
            if (isMake == true) {
              
                if (num != 4) {
                    num++;
                    cc.sys.localStorage.setItem('isMake', JSON.stringify(num));
                }
               
            }
        }
            
    };

    // update (dt) {}
}
