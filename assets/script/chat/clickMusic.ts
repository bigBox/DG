
const {ccclass, property} = cc._decorator;

@ccclass
export default class clickMusic extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onMusicstate);
    };
    start () {
    }
    onMusicstate(){
        // let url = 'sound/click';
        // cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
        //     cc.audioEngine.play(clip, false, 0.5);
        // });
        global.Instance.AudioEngine.playSound('click', null, null, null);

    }
    onDisable(){
        this.node.off(cc.Node.EventType.TOUCH_START, this.onMusicstate); 
    }
    // update (dt) {}
}
