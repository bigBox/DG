

const {ccclass, property} = cc._decorator;

@ccclass
export default class GuJiNode extends cc.Component {

    onLoad () {
        let rand = Math.floor(Math.random() * 2);
        let flow = this.node.children;
        let path = 'images/plist/tomB/common/flow';
        if (rand == 0) {
            path = 'images/plist/tomB/common/stone';
        }
        for (let i = 0; i < flow.length; i++) {
            let flowNode = flow[i];
            flowNode.active = false;
        }
         {
            let ID =  Math.floor(Math.random() * 2);
            let randID = Math.floor(Math.random() * 7) + 1;
            let flowNode = flow[ID];
            let image = path + randID;
            flowNode.active = true;
            global.CommonClass.Functions.setTexture(flowNode, image, null);
        }
     }

    start () {

    }

    // update (dt) {}
}
