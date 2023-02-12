const {ccclass, property} = cc._decorator;

@ccclass
export default class Log extends cc.Component {

    /**
     * state(开启关闭打印)
     */
     state:boolean = true;
     /**
      * 调试
      * @param {描述信息} desc 
      * @param {打印参数 类型: 单个参数/数组/json对象} param 
      */
    debug(desc, param) {
        if (this.state)
            return;
        desc = desc != undefined ? desc : '';
        param = param != undefined ? param : '';
        console.log(desc, param);
    };
 
 
     /**
      * 警告
      * @param {描述信息} desc 
      * @param {打印参数 类型: 单个参数/数组/json对象} param 
      */
     warn(desc, param) {
         if (this.state)
             return;
         desc = desc != undefined ? desc : '';
         param = param != undefined ? param : '';
         cc.warn(desc, param);
     };
 
 
     /**
      * 错误
      * @param {描述信息} desc 
      * @param {打印参数 类型: 单个参数/数组/json对象} param 
      */
     err(desc, param) {
         if (!this.state)
             return;
         desc = desc != undefined ? desc : '';
         param = param != undefined ? param : '';
         cc.error(desc, param);
     }
}

