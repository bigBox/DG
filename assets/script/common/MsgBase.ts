
const {ccclass, property} = cc._decorator;
@ccclass
export default class MsgBase extends cc.Component {
    file: string;
    packageName: string;
    msgName: string;
    msgObj: any;

    constructor() {
        super();
        this.file = '';
        this.packageName = '';
        this.msgName = '';
        //子类的构造函数必须对file, packageName, msgName赋值
        global.Instance.Log.debug('MsgBase ', this.msgName);
    };

    build() {
        let builder = require(this.file);
        let curPackage = builder.build(this.packageName);

        this.msgObj = new (curPackage)[this.msgName]();
        global.Instance.Log.debug('build ', this.msgName);
    };

    getmsgObj() {
        return this.msgObj;
    };

    setData(data) {
        this.msgObj = data;
    };

    get(key) {
        return this.msgObj[key];
    };

    set(key , vaule) {
        this.msgObj[key] =  vaule;
    };

    encode() {
       return this.msgObj.encode().toBuffer();
    };

    decode(buffer) {
        return this.msgObj.decode(buffer);
    };


    // update (dt) {}
}
