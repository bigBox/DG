

const { ccclass, property } = cc._decorator;
import Messages from "../socket/Messages";
@ccclass
export default class MsgPools {
    private msgPools: any;
    private callBacks: Map<any, any>;
    private sendOverCallBacks: Map<any, any>;
    private firstCalls: Map<any, any>;
    private protocols: Map<any, any>;
    private timeMap: {};
    private caches: ArrayBuffer;

    constructor() {
        
        let Message = new Messages();
        this.msgPools =Message.getMessages();
        this.callBacks = new Map();
        this.sendOverCallBacks = new Map();
        this.firstCalls = new Map();
        this.protocols = new Map();
        this.timeMap = {};
        this.caches = new ArrayBuffer(0);
    }

    public register(msgName: string | number, callback: any) {
        let msg = this.getMsgByName(msgName);
        if (msg != null) {
            this.callBacks[msgName] = callback;
            if (this.protocols[msgName] == null) {
                let builder = require(msg.pbFile);
                let protocol = builder.build(msg.package);
                this.protocols[msgName] = protocol;
            }
        }
    };

    public getMsgByName(msgName: string | number) {
        for (let i = 0; i < this.msgPools.length; ++i) {
            if (this.msgPools[i].name == msgName)
                return this.msgPools[i];
        }
        return null;
    };

    public getMsgByReceiveID(id: any) {
        for (let i = 0; i < this.msgPools.length; ++i) {
            if (this.msgPools[i].receiveID == id)
                return this.msgPools[i];
        }
        return null;
    };

    public send(msgName: string, data: any, callback: any, firstCall: any) {
        if (!global.Instance.Socket.isConnected()) {
            global.Instance.Log.debug('send message ' + msgName , ' failed not connect...');
            return false;
        }

        if (callback != null) {
            if (this.sendOverCallBacks[msgName] == null) {
                this.sendOverCallBacks[msgName] = new Array();
            }
            this.sendOverCallBacks[msgName].unshift(callback);

            global.Module.GameData.lockSocketBackOp(msgName, true);
        }

        if (firstCall != null)
            this.firstCalls[msgName] = firstCall;


        let msg = this.getMsgByName(msgName);
        let protocol = this.protocols[msgName];

        let sendType = msg.sendType;
        if (protocol != null && protocol[sendType] != null) {
            let msgObj = new protocol[sendType](data);

            let msgData = msgObj.encode().toBuffer();

            let leng = 2 + 4 + msgData.byteLength;
            let buffer = new ArrayBuffer(leng);

            var dataView = new DataView(buffer);
            dataView.setUint16(0, msg.sendID, true);
            dataView.setUint32(2, msgData.byteLength, true);

            let dmv = new DataView(msgData);
            for (let i = 6; i < leng; ++i) {
                dataView.setUint8(i, dmv.getUint8(i - 6));
            }

            global.Instance.Log.warn('[req] 0x' + msg.sendID.toString(16)+ '  msgName ' +msgName+'  sendType ' + sendType, data);
            global.Instance.Socket.send(buffer);
        } else {
            global.Instance.Log.warn('error send unkown message '+sendType.toString()+'msgName'+ msgName, data);
        }
    };

    public dealMessage(msgID: { toString: (arg0: number) => string; }, msgData: { byteLength: { toString: () => string; }; }) {
        let receiveMsg = this.getMsgByReceiveID(msgID);

        global.Instance.Log.debug('deal message id....0x' + msgID.toString(16) , " length: " + msgData.byteLength.toString());
        if (receiveMsg != null) {

            let msgName = receiveMsg.name;
            let receiveType = receiveMsg.receiveType;

            global.Module.GameData.lockSocketBackOp(msgName, false);

            let protocol = this.protocols[msgName];
            let msg = protocol[receiveType].decode(msgData);

           global.Instance.Log.debug('[recv] 0x' + msgID.toString(16),'  msgData  ' + msgData.byteLength+'  msgName  ' + msgName);
           global.Instance.Log.debug( receiveType, msg);
            if (this.firstCalls[msgName] != null) {
                this.firstCalls[msgName](msg);
                this.firstCalls[msgName] = null;
            }

            if (this.callBacks[msgName] != null) {
                this.callBacks[msgName](msg);
            }

            for (let key in this.sendOverCallBacks) {
                if (key == msgName) {
                    if (this.sendOverCallBacks[msgName] != null) {
                        let overCallBack = this.sendOverCallBacks[msgName].shift();

                        if (overCallBack != null)
                            overCallBack(msg);
                    }
                    break;
                }
            }

            if (msg.errorID) {
                let value = global.Manager.DBManager.findData('ServerError', 'ID', msg.errorID);
                   
                if (value != null && value.isShow)
                    global.CommonClass.UITip.showTipTxt(value.text, global.Enum.TipType.TIP_BAD);
            }
        } else {
            // console.warn('error receive message unkown id......0x' + msgID.toString(16));
        }
    };

    public receive(data: ArrayBufferLike) {
        let oldLeng = this.caches.byteLength;

        // var timeData1 = new Date();
        //var time1 = timeData1.getTime();

        if (oldLeng > 0) {
            let curLeng = data.byteLength;
            let newData = new ArrayBuffer(curLeng + oldLeng);

            let newView = new DataView(newData);
            let oldView = new DataView(this.caches);
            let curView = new DataView(data);

            for (let i = 0; i < oldLeng; ++i)
                newView.setUint8(i, oldView.getUint8(i));

            for (let j = 0; j < curLeng; ++j)
                newView.setUint8(j + oldLeng, curView.getUint8(j));

            this.caches = newData;
        }
        else {
            this.caches = data;
        }

        while (this.caches.byteLength > 0) {
            let cachesView = new DataView(this.caches);

            let id = cachesView.getUint16(0, true);
            let leng = cachesView.getUint32(2, true);
            if (this.caches.byteLength - 6 >= leng) {
                let msgData = this.caches.slice(6, 6 + leng);
                this.dealMessage(id, msgData);

                /* var timeData2 = new Date();
                 var time2 = timeData2.getTime();
                 cc.Instance.Log.debug('parse message time '+(time2-time1).toString());*/

                this.caches = this.caches.slice(6 + leng);
            }
            else {
                break;
            }
        };
    };
};

