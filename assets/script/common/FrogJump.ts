

const {ccclass, property} = cc._decorator;

@ccclass
export default class FrogJump extends cc.Component {
    static className: string = "FrogJump";
    direct: any[];
    onJumpEnd: any;
    @property({ displayName: "jumpDistance", tooltip: "jumpDistance" })
    jumpDistance: number = 160;
    @property({ displayName: "jumpTime", tooltip: "jumpTime" })
    jumpTime: number = 0.25;

    constructor() {
        super();
        this.direct = new Array();

        this.direct.push("LU");
        this.direct.push("LD");
        this.direct.push("RU");
        this.direct.push("RD");
        this.direct.push("H");
        //  this.direct.push("V");

        this.onJumpEnd = null;
        // this.jumpDistance= 160;
        // this.jumpTime= 0.25;
    };

    // use this for initialization
    onLoad() {
    };

    jumpH(onJumpEnd: any) {
        this.onJumpEnd = onJumpEnd;
        if (onJumpEnd==null)
            this.onJumpEnd = this.jumpEnd;

        let flag = Math.ceil(Math.random()*2);
        let randDistance = Math.ceil(Math.random()*30)+this.jumpDistance; 
        if (flag==0)
            randDistance = -randDistance;

        let position = this.node.getPosition();
        let endPosition = cc.v2(position.x+randDistance, position.y);

        let midPosition = cc.v2((endPosition.x-position.x)/12*5+position.x, position.y+50);
        //this.ndMid.setPosition(midPosition);
       // this.ndEnd.setPosition(endPosition);

        let bezier = [position,  midPosition, endPosition];
        let bezierTo = cc.bezierTo(this.jumpTime, bezier);
        let jumFunction = cc.callFunc(this.onJumpEnd);
        let seq = cc.sequence(bezierTo, jumFunction);
        
        this.node.runAction(seq);
    };

    jumpV(onJumpEnd: any) {
        this.onJumpEnd = onJumpEnd;
        if (onJumpEnd==null)
            this.onJumpEnd = this.jumpEnd;

        let flag = Math.ceil(Math.random()*2);
        let randDistance = Math.ceil(Math.random()*30)+this.jumpDistance; 
        if (flag==0)
            randDistance = -randDistance;

        let position = this.node.getPosition();
        let endPosition = cc.v2(position.x, position.y+randDistance);

        let midPosition = cc.v2(position.x-50, (endPosition.y-position.y)/12*5+position.y,);

        let bezier = [position,  midPosition, endPosition];
        let bezierTo = cc.bezierTo(this.jumpTime, bezier);
        let jumFunction = cc.callFunc(this.onJumpEnd);
        let seq = cc.sequence(bezierTo, jumFunction);
        
        this.node.runAction(seq);
    };

    jumpLeans(direct: string) {
        let rate = 1.41;
        let randDistance = Math.ceil(Math.random()*30)+this.jumpDistance; 
        let position = this.node.getPosition();
        let endPosition = position;
        let midPosition = position;

        let flag = Math.ceil(Math.random()*2);
      //  let direct = "RU";

        let UY = position.y+randDistance/rate;
        let DY = position.y-randDistance/rate;
        let LX = position.x-randDistance/rate;
        let RX = position.x+randDistance/rate;

        let MUY = position.y+80;
        let MRX = position.x+(RX-position.x)/6;
        let MDY = position.y-10;
        let MLX = position.x-(position.x-LX)/4;

        if (direct=="LU")
        {
            endPosition = cc.v2(LX, UY);
            midPosition.x = position.x-(position.x-LX)/4;
            midPosition.y = position.y+90;
        }
        else if(direct=="LD")
        {
            endPosition = cc.v2(LX, DY);
            midPosition.x = position.x-(position.x-LX)/3*2;
            midPosition.y = position.y-40;
        }
        else if(direct=="RU")
        {
            endPosition = cc.v2(RX, UY);
            midPosition = cc.v2(MRX, MUY);
            midPosition.x = position.x+(RX-position.x)/4;
            midPosition.y = position.y+90;
        }
        else if(direct=="RD")
        {
            endPosition = cc.v2(RX, DY);
            midPosition.x = position.x+(RX-position.x)/3*2;
            midPosition.y = position.y-40;
        }
       
        //let endPosition = cc.v2(position.x+randDistance/rate, position.y+randDistance/rate);
       // let midPosition = cc.v2((endPosition.x-position.x)/12*2+position.x, position.y+80);

        let bezier = [position,  midPosition, endPosition];
        let bezierTo = cc.bezierTo(this.jumpTime, bezier);
        let jumFunction = cc.callFunc(this.onJumpEnd, this);
        let seq = cc.sequence(bezierTo, jumFunction);

        this.node.runAction(seq);
    };

    randJump(onJumpEnd: any) {
        this.onJumpEnd = onJumpEnd;
        if (onJumpEnd==null)
            this.onJumpEnd = this.jumpEnd;

        let len = this.direct.length;

        let idx = Math.ceil(Math.random()*len);

        let strDirect = this.direct[idx];
        if (strDirect=="H")
            this.jumpH(null);
        else if(strDirect=="V")
            this.jumpV(null);
        else
        {
            this.jumpLeans(strDirect);
        }
    };

    jumpEnd() {

    };

    // update (dt) {}
}
