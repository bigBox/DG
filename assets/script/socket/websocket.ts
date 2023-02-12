const { ccclass, property } = cc._decorator;
@ccclass
export default class websocket extends cc.Component {
    public socket: WebSocket;
    public _isConnected: boolean;//socket 是否连接成功

    constructor() {
        super();
        this.socket = null;
        this._isConnected = false;//Socket 是否连接成功
    };

    // use this for initialization
    onLoad() {
        return true;
    }
    connect(url, callBack) {
        let self = this;
        this.socket = new WebSocket(url);
        this.socket.binaryType = "arraybuffer";
        this.socket.onopen = function (evt) {
            self._isConnected = true;
            global.Instance.Log.debug("Connection open ...","连接成功");
            if (callBack)
                callBack(evt);
        };

        this.socket.onmessage = function (evt) {
            // cc.Instance.Log.debug("Received Message: " , evt);  
            global.Instance.MsgPools.receive(evt.data);
        };

        this.socket.onclose = function (evt) {
            self._isConnected = false;
            global.Instance.Log.debug("Connection closed...",'连接失败');
            if (callBack)
                callBack(evt);
        };
    };

    /**
     * 请求链接
     */
    send(buffer) {
        if (this.socket.readyState == 1)
            this.socket.send(buffer);
    };

    /**
     * 断开链接
     */
    close() {
        this.socket.close();
    };
    /**
     * 
     * @returns 获取 _isConnected  状态
     */
    isConnected() {
        return this._isConnected;
    };
}
