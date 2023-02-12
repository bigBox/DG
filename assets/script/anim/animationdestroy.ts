

const {ccclass, property} = cc._decorator;

@ccclass
export default class animationdestroy extends cc.Component {

    onLoad () {}

    start () {

    }

    playCloudcallback() {
        this.node.removeFromParent();
    };
    playActioncallback() {
        let GuJiMapNew = global.Instance.Dynamics['GuJiMap'];
        if (GuJiMapNew != null) {
            GuJiMapNew.playBalloonAction(true);
        }
    };
    ndOpenAction() {
        this.node.active = false;
        let UIFriendChoose = global.Manager.UIManager.get('UIFriendChoose');
        let uiFriend = global.Manager.UIManager.get('UIFriend');
        
        
        if (UIFriendChoose) {
            // UIFriendChoose.move(true);
        } else {
            global.Manager.UIManager.open('UIFriendChoose', null, function (panel) {
                panel.show();
                if (uiFriend)
                    panel.move(true);
            })
        }
    };
}
