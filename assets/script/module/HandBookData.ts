//图鉴数据类
const {ccclass, property} = cc._decorator;
@ccclass
export default class HandBookData {
    data: {};
    books: any;
    totalRatio: number;
    items: any;//套装图鉴数据

    constructor () {
        this.data = {};
        this.books = {};
        this.totalRatio = 0;
    };
    getbookArr(){
        let bookArr = [
            { 'itemType': 0, 'index': 5, 'name': '宝物', 'titArr': [{ 'name': '全部', 'page': 0 }, { 'name': '陶瓷', 'page': 21 }, { 'name': '玉石', 'page': 22 }, { 'name': '金木', 'page': 23 }, { 'name': '其他', 'page': 24 }] },
            { 'itemType': 1, 'index': 1, 'name': '花草', 'titArr': [{ 'name': '全部', 'page': 0 }] },
            { 'itemType': 2, 'index': 2, 'name': '动物', 'titArr': [{ 'name': '全部', 'page': 0 }] },
            { 'itemType': 3, 'index': -1, 'name': '画', 'titArr': [{ 'name': '全部', 'page': 0 }] },
            { 'itemType': 4, 'index': 7, 'name': '套装', 'titArr': [{ 'name': '全部', 'page': 0 }] }
        ]
        return bookArr;
    };
    //type 类型 secondID 分小类  sortType 排序方式
    getDataByType (type: number,secondID,sortType) {
        let items = [];//普通
        let arr = [];//珍惜
        for (let i = 0; i < this.books.length; i++) {
            let cfgItem = this.books[i];
            if (type == 1) {
                // 花草
                if (cfgItem.type == 1) {
                    if (secondID == 0) {//全部
                        if (sortType == 0) {
                            items.push(cfgItem);
                        } else {
                            let data = global.Manager.DBManager.findData('Items', 'ID', cfgItem.bookId);
                            if (data.isRare != 1)
                                arr.push(cfgItem)
                            else
                                items.push(cfgItem);
                        }
                    }
                }
            } else if (type == 2) {
                // 动物
                if (cfgItem.type == 2) {
                    if (secondID == 0) {//全部
                        if (sortType == 0) {
                            items.push(cfgItem);
                        } else {
                            let data = global.Manager.DBManager.findData('Items', 'ID', cfgItem.bookId);
                            if (data.isRare != 1)
                                arr.push(cfgItem)
                            else
                                items.push(cfgItem);
                        }
                    }
                }
            } else if (type == -1) {
                // 画
            } else if (type == 5) {
                // 宝物
                if (cfgItem.type == 5) {
                    let data = global.Manager.DBManager.findData('Items', 'ID', cfgItem.bookId); 
                    if (secondID == 0) {//全部
                        if (sortType == 0) {
                            items.push(cfgItem);
                        } else {
                            if (data.isRare != 1)
                                arr.push(cfgItem)
                            else
                                items.push(cfgItem);
                        }
                    }else{
                        //21陶瓷 22玉石 23金木  24杂
                    if (secondID == data.subType) {
                        if (sortType == 0) {
                            items.push(cfgItem);
                        } else {
                            if (data.isRare != 1)
                                arr.push(cfgItem)
                            else
                                items.push(cfgItem);
                        }
                    }
                }
            }
            } else if (type == 7) {
                // 套装
                if (cfgItem.type == 7) {
                    if (secondID == 0) {//全部
                        items.push(cfgItem);
                    }
                }
            }
        }
        return arr.concat(items);
    };
    getSuitDataType(){
        let arr = [];
        for (let i = 0; i < this.items.length; i++) {
            let items = this.items[i]
            for (let k = 0; k < items.length; k++)
                if (items[k])
                    arr.push(items[k])
        }
        return arr;
      };
    getSuitDataTypePage(sortType){
        let arr = [];
        for (let i = 0; i < this.books.length; i++) {
            let bookData = this.books[i];
            if (bookData.antiqueId != 0) {
                let index = bookData.antiqueId-1001
                if (arr[index] == undefined)
                    arr[index] = [];
                if (sortType == 0) {
                    arr[index].push(bookData);
                } else {
                    let data = global.Manager.DBManager.findData('Items', 'ID', bookData.bookId);
                    if (data.isRare == 1)
                        arr[index].push(this.books[i])
                    else
                        arr[index].unshift(this.books[i])
                }
            }
            bookData = null;
        }
        let id = 0;
       this.items = [];
        for (let i = 0; i < arr.length; i++) {
            let arrData = arr[i];
            for (let k = 0; k < arrData.length; k++) {
                if (this.items[id] == undefined)
                this.items[id] = [];
                var element = arrData[k];
                this.items[id].push(element);
                // if (this.items[id].length == 9) {
                //     id++;
                // }
            }
            id++;
        }
        return this.items;
    };
    getDataByTypeAndPage(type: any, secondID,sortType, page: any) {
        let items = this.getDataByType(type, secondID,sortType);
        let tmpItems = [];
        let start = (page - 1) * 9;//起点
        let end = start + 9;//终点
        if (end > items.length) {
            end = items.length;
        }

        tmpItems = items.slice(start, end);
        return tmpItems;
    };

    getItemState (itemId: any) {

    };

    getData () {
        return this.data;
    };

    getBookData (type: string | number) {
        if (this.books[type]) {
            return this.books[type];
        }
        return null;
    };

    getBookItems (type: string | number) {
        if (this.books[type]) {
            return this.books[type].items;
        }
        return null;
    };

    getItem (type: string | number, ID: string | number) {
        if (this.books[type])
            return this.books[type].items[ID];
    };

    getState (type: any, ID: any) {
        let data = this.getItem(type, ID);
        if (data != null)
            return data.state;

        return -1;
    };

    getTotalRatio () {
        return this.totalRatio;
    };

    onBookAllTypetRsp (msg: { errorID: number; typeMap: any[]; totalRatio: number; }) {
        if (msg.errorID == 0) {
            for (let key in msg.typeMap.map) {
                let item = msg.typeMap.map[key];

                this.data[key] = item.value;
            }
            this.totalRatio = msg.totalRatio;
        }
    };
    onBookInfoRsp (msg: { errorID: number; infos: any; }) {
        global.Instance.Log.debug('图鉴',msg)
        if (msg.errorID == 0) {
            this.books = msg.infos;
        }
    };

    onBookRewardRsp (msg: { errorID: number; }) {
        if (msg.errorID == 0) {

        }
    };

    onBookUpdateNtf (msg: { errorID: number; book: { itemId: any; }; }) {
        if (msg.errorID == 0) {

            for (let i = 0; i < this.books.length; i++) {
                let tmp = this.books[i];
                if (tmp.itemId == msg.book.itemId) {
                    this.books[i] = msg.book;
                    break;
                }
            }
        }
    };

}
