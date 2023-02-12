const { ccclass, property } = cc._decorator;

@ccclass
export default class AudioEngine extends cc.Component {
    audios: {};
     constructor() {
        super();
        this.audios = {};
     }
    onPlayEnd(name: string | number) {
        if (this.audios[name])
            delete this.audios[name];
    };

    playSound(name: string, isLoop: any, volume: any, callBack: (arg0: any) => void) {

        let loop = isLoop;

        let curVolume = volume;
        if (curVolume == null)
            curVolume = 1;

        let self = this;
        let selfCall = function () {
            if (callBack != null)
                callBack(name);

            self.onPlayEnd(name);
        }
         global.Instance.Log.debug("----播放音乐----", name)
        let url = 'sound/' + name;
        cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
            let audioID = cc.audioEngine.play(clip, loop, curVolume);
            cc.audioEngine.setFinishCallback(audioID, selfCall);
            self.audios[name] = audioID;
        });
    };

    stopSound(name: string | number) {
        let audioID = this.audios[name];
        
        if (audioID) {
            cc.audioEngine.stop(audioID)
            this.audios[name];
        }
    };

    replaySound(name: string, isLoop: any, volume: any, callBack: (arg0: any) => void) {
        this.stopSound(name);
        this.playSound(name, isLoop, volume, callBack);
    };

    playMusic(name: string, isLoop: any, volume: any) {
        let loop = isLoop;

        let curVolume = volume;
        if (curVolume == null)
            curVolume = 1;

        let self = this;
        let url = 'music/' + name;
        global.Instance.Log.debug("---------播放背景音乐------------" , name)
        cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
            let audioID = cc.audioEngine.play(clip, loop, curVolume);
            self.audios[name] = audioID;
        });
    };

    stopMusic(name: string | number) {
        let audioID = this.audios[name];

        if (audioID) {
            cc.audioEngine.stop(audioID)
            this.audios[name];
        }
    };

    stopAll() {
        this.audios = {};

        cc.audioEngine.stopAll();
    };
}
