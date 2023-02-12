const {ccclass, property} = cc._decorator;

@ccclass
export default class UIRobbery extends cc.Component {
    @property({ type: sp.Skeleton, displayName: "skeleton", tooltip: "动画" })
    skeleton: sp.Skeleton = null;
    animationName: string;
    callback: any;
    params: any;
    msg: any;
    timeIndex: NodeJS.Timeout;
    
    constructor(){
        super();
        this.callback = null;
        this.params = null;
        this.animationName = 'hui';
        this.msg = null;
        this.timeIndex = null;
    };

    // onLoad () {}

    start() {
        let self = this;
        this.playAnimation('hui');
        let num = 0
        this.skeleton.setCompleteListener((element, loopCount) => {
            num++;
            if (self.msg == null || num < 2) {
                // self.playAnimation('hui');
                return;
            }
            self.timeIndex = setTimeout(self.btnClose.bind(self), 3000);
            if (self.msg.isSuccess == 1)
                self.playAnimation('win');
            else
                self.playAnimation('lose');
        });
    }
    show(params,msg, callback) {
        this.params = params;
        this.msg = msg;
        this.callback = callback;  
      
    };
    playAnimation(name) {
        if (this.animationName != 'hui')
            return;
        this.animationName = name;
        this.skeleton.animation = name;
        this.skeleton.loop = true;
    };
    btnClose() {
        if (this.timeIndex)
            clearTimeout(this.timeIndex);
        if (this.callback)
            this.callback(this.params, this.msg.isSuccess == 1);
        global.Manager.UIManager.close('UIRobbery');
    };
    btnSkip() {
        if (this.msg == null)
            return;
        if (this.animationName == 'hui') {
            if (this.msg.isSuccess == 1) {
                this.playAnimation('win');
            } else {
                this.playAnimation('lose');
            }
        } else {
            this.btnClose();
        }
    }
    // update (dt) {}
}
