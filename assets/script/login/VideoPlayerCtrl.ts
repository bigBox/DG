const { ccclass, property } = cc._decorator;

@ccclass
export default class VideoPlayerCtrl extends cc.Component {

    @property({ type: cc.VideoPlayer, displayName: "视频", tooltip: "视频" })
    videoplayer: cc.VideoPlayer = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.videoplayer.node.on('touchend', () => { 
            this.videoplayer.play(); 
        });
        
    }

    playVideo() {
    }

    start() {

    }
    onDisable() {
    }
    // update (dt) {}
}
