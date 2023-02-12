
const {ccclass, property} = cc._decorator;

@ccclass
export default class UIPaoPaoTip extends cc.Component {

  
        static showText(txt: any, color: any, parent: any, position: any)
        {
            let params = {txt:txt, color:color, parent:parent, position:position};
            global.Manager.UIPaoPaoTipManager.addTip(params);
        };

        static create( params: any){
           let tip =  new UIPaoPaoTip();
           tip.show(params);

        };
    

  

    /*
        1--->params:{txt:'xxx',color:'ff00ff', parent:node, position.cc.v2()}
    */
    show(params:{txt:string,color:string, parent:cc.Node, position:cc.Vec2}) {
        global.Instance.Log.debug('show',params);
        var self = this;
        let filePath =  "prefab/common/UIPaoPaoTip";
        cc.loader.loadRes(filePath, function (err, prefab) 
        {
            if (err==null)
            {
                let parent = params.parent;
                let position = params.position;

                let newNode = cc.instantiate(prefab);
                if (parent == null)
                    parent = global.CommonClass.Functions.getRoot();
                if (position==null)
                    position = cc.v2(0,0);

                parent.addChild(newNode, cc.macro.MAX_ZINDEX);
                newNode.setPosition(position);

                let ndTip = newNode.getChildByName('ndTxtTip');
                let animation = ndTip.getComponent(cc.Animation);
                if (animation != null)
                {
                    animation.play('lblPaoPao');
                    animation.on('finished', self.paopaoEnd, self);
                }

                self.reflash(params, ndTip);
            }
        });
    };

    reflash(params: any, ndTip: { getChildByName: (arg0: string) => { (): any; new(): any; getComponent: { (arg0: typeof cc.RichText): any; new(): any; }; }; }) {
        global.Instance.Log.debug('params',params);
        let rhTxt = ndTip.getChildByName("rhTxt").getComponent(cc.RichText);
        rhTxt.string = '<color=#'+params.color+'>'+params.txt+'</color>';
    };

    paopaoEnd() {
        if (this.node != null) {
            let anim = this.node.getComponent(cc.Animation);
            anim.stop('lblPaoPao');
    
            this.node.removeFromParent();
        }
    }

}
