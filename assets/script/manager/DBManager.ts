
import Database from "./Database";
//数据库
const { ccclass, property } = cc._decorator;


@ccclass
export default class DBManager extends cc.Component {

    getRecordNum(tableName: any) {
        let data = this.getData(tableName);
        if (data != null)
            return data.length;

        return 0;
    };

    getData(tableName: string): any {
            let dataModel = require(tableName);
            return dataModel;
    };

    findData(tableName: string, key: string, vaule: any) {
        if (tableName == "Tasks") {
            let i = 1;
            i = 10;
        }
        let data = this.getData(tableName);
        if (data == null) return null;

        for (let idx in data) {
            let dv = data[idx];
            for (let k in dv) {
                if (k == key && dv[k] == vaule)
                    return data[idx];
            }
        }
        return null;
    };
    findDataArr(tableName: string, key: string, vaule: any) {
        if (tableName == "Tasks") {
            let i = 1;
            i = 10;
        }
        let arr = [];
        let data = this.getData(tableName);
        if (data == null) return null;

        for (let idx in data) {
            let dv = data[idx];
            for (let k in dv) {
                if (k == key && dv[k] == vaule)
                    arr.push(dv);
            }
        }
        return arr;
    };
    fixedDataArr(data, key: string, vaule: any) {
        let arr = [];
        if (data == null) return null;
        for (let idx in data) {
            let dv = data[idx];
            for (let k in dv) {
                if (k == key && dv[k] == vaule)
                    arr.push(dv);
            }
        }
        return arr;
    };

    findDatas(tableName: any, key: string, vaule: any) {
        let array = [];

        let data = this.getData(tableName);
        if (data == null) return null;

        for (let idx in data) {
            let dv = data[idx];
            for (let k in dv) {
                if (k == key && dv[k] == vaule)
                    array.push(dv);
            }
        }
        return array;
    };

    getLine(tableName: any, lineIdx: string) {
        let data = this.getData(tableName);
        if (data == null) return null;

        for (let idx in data) {
            if (lineIdx == idx)
                return data[idx];
        }
        return null;
    };

    getItemNew(itemID: number) {
        if (itemID < 1000) {
            return this.findData('VirtualItems', 'ID', itemID);
        }
        else {
            return this.findData('Items', 'ID', itemID);
        }
    };

    getItemDataByType(packageType: number) {
        let itemDatas = this.getData('Items');
        if (packageType < 0)
            return itemDatas;
        else {
            let resItems = new Array();
            for (let key in itemDatas) {
                if (itemDatas[key].warehouseType == packageType) {
                    resItems.push(itemDatas[key]);
                }
            }
            return resItems;
        }
    };
}
