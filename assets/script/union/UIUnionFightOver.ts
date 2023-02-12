import UIBase from "../common/UIBase";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UIUnionFightOver extends UIBase {
    callBack: any;
    curUnionLevel: any;
    newUnionLevel: any;

    constructor() {
        super();
        this.callBack = null;
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    };

    onLoad()
    {
       
    };

    onEnable()
    {
        // this.node.on(cc.Node.EventType.TOUCH_MOVE,   this.touchEvent, this);	
        // this.node.on(cc.Node.EventType.TOUCH_END,    this.touchEvent, this);	
        // this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEvent, this);	
        // this.node.on(cc.Node.EventType.TOUCH_START,  this.touchEvent, this);
        
     
    }

    onDisable() {
        // this.node.off(cc.Node.EventType.TOUCH_MOVE,     this.touchEvent, this);	
        // this.node.off(cc.Node.EventType.TOUCH_END,      this.touchEvent, this);	
        // this.node.off(cc.Node.EventType.TOUCH_CANCEL,   this.touchEvent, this);	
        // this.node.off(cc.Node.EventType.TOUCH_START,    this.touchEvent, this);	
    }

    show(data) {
        let selfData = global.Module.UnionData.getSelfUnion();
        if (selfData && selfData.id > 0)
        {
            let ndExp   = this.node.getChildByName('ndExp');
            let lblExp  = ndExp.getChildByName('lblExp').getComponent(cc.Label);
            let barExp  = ndExp.getChildByName('barExp').getComponent(cc.ProgressBar);

            let lblScoreFly = this.node.getChildByName('lblScoreFly').getComponent(cc.Label);
            lblScoreFly.string = data.exp.toString();
            lblScoreFly.node.active = data.exp>0;

            let expData = global.Manager.DBManager.findData('GuildLevel', 'Level', (selfData.level+1));
            if (expData != null)
            {
                lblExp.string   = selfData.experience.toString()+'/'+expData.UpLevelTotalExp.toString();
                barExp.progress = selfData.experience/expData.UpLevelTotalExp;
            }
            else
            {
                lblExp.string = '0/0';
                barExp.progress = 0.001;
            }
        }
        let lblScoreSelf    = this.node.getChildByName('lblScoreSelf').getComponent(cc.Label);
        lblScoreSelf.string = selfData.name+':'+data.score.toString();

        let lblScoreOther    = this.node.getChildByName('lblScoreOther').getComponent(cc.Label);
        lblScoreOther.string = '测试商会:'+data.matchScore.toString();

        let spSuccess = this.node.getChildByName('spSuccess');
        let spFailed  = this.node.getChildByName('spFailed');
        spSuccess.active = (data.winGuildID==selfData.id);
        spFailed.active  = (data.winGuildID!=selfData.id);
    
        this.curUnionLevel = selfData.level;
        this.newUnionLevel = data.level;
    }

    btnClose()  {
        global.Manager.UIManager.close('UIUnionFightOver');

        if ( this.curUnionLevel<this.newUnionLevel)
        {
            let self = this;
            global.Manager.UIManager.open('UIUnionLevelUp', null, function(panel)
            {
                panel.show(self.newUnionLevel);
            })
        }
    }
}
