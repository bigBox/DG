
const { ccclass, property } = cc._decorator;

@ccclass
export default class UIRacing extends cc.Component {
    @property({ type: cc.Node, displayName: "bgNode", tooltip: "背景" })
    bgNode: cc.Node = null;
    @property({ type: sp.Skeleton, displayName: "horseNode", tooltip: "马" })
    horseNodeArr: sp.Skeleton[] = [];
    @property({ type: cc.Node, displayName: "pourNode", tooltip: "下注框隐藏" })
    pourNode: cc.Node = null;
    @property({ type: cc.Node, displayName: "skipNode", tooltip: "跳过动画" })
    skipNode: cc.Node = null;
    begin: boolean;
    animAtion: string[];
    data: any;
    houseID: any;
    params: any;

    constructor() {
        super();
        this.begin = false;//是否开始游戏
        this.data = null;
        this.houseID = -1;
        //run 跑---wait 静止不动---wait2 动前脚---wait3 动前后脚 ---wait4 脚头都动
        this.animAtion = ['run', 'wait', 'wait2', 'wait3', 'wait4'];
    };
    start() {
    };
    show(params) {
        this.params = params;
        for (let i = 0; i < this.horseNodeArr.length; i++) {
            this.playAnimation(this.horseNodeArr[i]);
        }
        this.skipNode.active = false;
    };
    playAnimation(skeleton) {
        let self = this;
        let id = 1;
        if (this.begin == false)
            id = global.CommonClass.Functions.randomNum(1, 4, 0);
        skeleton.animation = this.animAtion[id];
        skeleton.loop = false;
        if (id == 1)
            skeleton.timeScale = 0.01;
        else
            skeleton.timeScale = 1;
        skeleton.setCompleteListener((element, loopCount) => {
            if (self.begin == false)
                self.playAnimation(skeleton)
        });
    };
    onWinlose() {
        let params = this.params;
        params.msg = this.data;
        params.stage = 3;
        if (this.data.winOrLose == 0)
            params.result = 0;
        else
            params.result = 1;
        global.Manager.UIManager.open('UITownNpcTalk', null, function (panel) {
            if (panel == null)
                return;
            panel.show(params,false, null);
            global.Manager.UIManager.close('UIRacing');
        });
    };
    onskipclick(){
        this.skipNode.active = false;
        for (let i = 1; i < 6; i++)
            this.node.getChildByName('horse' + i).active = false;
            let params = this.params;
            params.msg = this.data;
            params.stage = 3;
            if (this.data.winOrLose == 0)
                params.result = 0;
            else
                params.result = 1;
         
        global.Manager.UIManager.open('UITownNpcTalk', null, function (panel) {
            if (panel == null)
                return;
            panel.show(params,false, null);
            global.Manager.UIManager.close('UIRacing');
        });
    };
    gameOver(event, arg) {
        this.pourNode.active = false;
        this.skipNode.active = true;
        let self = this;
        this.houseID = parseInt(arg);
        this.node.getChildByName('horse'+this.houseID).getChildByName('onpour').active = true;
        let data = { houseID:  this.houseID, itemId: 2, itemCount: 1000 };
        global.Instance.MsgPools.send('npcRaceHorses', data, function (msg) {
            global.Instance.Log.debug('npcRaceHorses', msg)
            if (msg.errorID != 0) {
                self.pourNode.active = true;
                return;
            }
            self.data = msg;
            self.onBegin(msg);



        }.bind(this));
    };
    onBegin(msg) {
        let self = this;
        let bgNode = this.bgNode.getComponent(cc.Animation)
        bgNode.play('move_bg');
        let first = this.houseID;
        if (msg.winOrLose == 0) {
            first -= 1;
            if (first == 0)
                first = global.CommonClass.Functions.randomNum(2, 5, 0);
        }
        let key = 0;
        for (let i = 0; i < this.horseNodeArr.length; i++) {
            let skeleton = this.horseNodeArr[i]
            skeleton.animation = this.animAtion[0];
            skeleton.loop = true;
            skeleton.timeScale = 1.6;
            skeleton.setCompleteListener((element, loopCount) => {
                // if (self.begin == true)
                skeleton.animation = 'run';
            });
            let time = 3;
            let id = global.CommonClass.Functions.randomNum(2, 5, 0);
            if (i == first - 1) {
                time = 3;
            } else {
                time = time + id * 0.2;
            }
                
          
            cc.tween(skeleton.node)
                .to(time, { position: cc.v3(400, skeleton.node.y) })
                .to(2, { position: cc.v3(1247, skeleton.node.y) })
                .call(() => {
                    key++;
                    if (key == 5) {
                        self.onWinlose()
                    }
                })
                .start();
        }
    };
   

}
