import clickAnim from "../assets/script/anim/clickAnim";

declare module Database { // 这个hellolib就是zz.js中导出的Object

    declare class World{ // 这个 World 就是 zz.js 中导出的名字，并且在xx.js中是个Object就可以了

           sayHello():void; // 这个sayHello方法，就是 js 中真正有的方法，名字对得上就可以了

    }

} 
declare namespace global {
    class Enum {
        static TaskState: any;
        static FarmType: any;
        static TipType: any;
        static PanelZOrder: any;
        static FarmTypeOp: any;
        static DlgTipType: any;
        static TradeType: any;
        static CoinType: any;
        static ETaskType: any;
        static Direct: any;
        static ParkBagType: any;
        static FriendMode: any;
        static PageType: any;
        static RankType: any;
        static GuJiMonster: any;
        static ChatChannel: any;
        static handBookPath: any;
    }

    
}
declare namespace global.CommonClass {
    declare class FindPath { };
    declare class UIBase { };
    declare class ProxyBase { };

    declare class SceneBase { };
    declare class ObstacleBase {
        static className: { prototype: Component; };
};
    declare class TownMapBase { };
    declare class TownFactoryBase {
        static className: string;
    };
    declare class DragLayer {
        static getDragLayer(arg0: string): any {
            throw new Error("Method not implemented.");
        }
    };
    declare class Honeycomb { };
    declare class UIPaoPaoTip {
        static create(arg: any) {
            throw new Error("Method not implemented.");
        }
    };
    declare class CellBase { };
    declare class ItemIcon {
        static create(ID: number, itemNum: any, arg2: null, ndItems: cc.Node, arg4: cc.Vec2, arg5: (item: any) => void) {
            throw new Error("Method not implemented.");
        }
        static className: string;
    };
    declare class ItemNeed { };
    declare class PickItem {
        static create(itemID: any, ndPickItems: cc.Node, position: cc.Vec2, arg3: (ItemIcon: any) => void) {
            throw new Error("Method not implemented.");
        }
};
    declare class Prismatic {
        static className: string;
    };
    declare class PopPackageItem { };
    declare class PopIndentifyItem { };
    declare class PreciousItem {
        static className: string;
    };
    declare class GuJiGoodsItem { };
    declare class GuJiCellItem { };
    declare class GuJiCellMask { };
    declare class FactoryItem { };
    declare class MineCell { };
    declare class UICommonBar { };
    declare class UICommonCoin { };
    declare class PickPanel { };
    declare class FrogJump {
        static className: string;
    };
    declare class MoveObject {
        static className: string;
    };
    declare class UICountChange {
        static className: string;
    };
    declare class TradeNoteItem {
        static create(i: number, length: any, item: any, ndItems: cc.Node, arg4: cc.Vec2, arg5: any) {
            throw new Error("Method not implemented.");
        }
};
    declare class UnionMemberItem { };
    declare class UnionApplyItem { };
    declare class UnionRankItem { };
    declare class UnionTaskItem { };
    declare class FriendItem {
        static create(item: any, ndItems: cc.Node, arg2: cc.Vec2, arg3: (newItem: any) => void) {
            throw new Error("Method not implemented.");
        }
};
    declare class RankItem { };
    declare class RankndItem { };
    declare class PreciousRankItem { };
    declare class MakeGoodsItem {
        static create(item: any, key: any, ndItems: cc.Node, arg3: cc.Vec2, arg4: (nodeClass: any) => void) {
            throw new Error("Method not implemented.");
        }
    }
    declare class ComposeItem { };
    declare class UIFarmBag { };
    declare class FarmBagItem {
        static create(item: any, j: number, ndItems: any, arg3: cc.Vec2, arg4: (bagItem: any) => void) {
            throw new Error("Method not implemented.");
        }
    };
    declare class IndentifyItem { };
    declare class IndentifyBagItem { };
    declare class IndentifyHistoryItem { };
    declare class HandBookItem {
        static className: string;
    };
    declare class HandBookLookItem { };
    declare class CollectionItem { };
    declare class MsgBase { };
    declare class DigGolderPlayer { };
    declare class DigGolderMainPlayer { };
    declare class CoinDrop {
        static create(type: any, number: any) {
            throw new Error("Method not implemented.");
        }
    };
    declare class FarmItem { };
    declare class GuideHelp {
        static create(node: cc.Node, arg1: cc.Vec2, arg2: string, arg3: (panel: any) => void) {
            throw new Error("Method not implemented.");
        }
};
    declare class UIGuideMask { };
    declare class DigHelp {
        static create(ndItem: any, arg1: cc.Vec2) {
            throw new Error("Method not implemented.");
        }
};
    declare class FactoryItemNew { };
    declare class TradeItem { };
    
    declare class UIDragBag { };
    declare class UIFishBag { };
    declare class UIPreciousBag { };
    declare class UISpecimenBag { };
    declare class SpecimenItem {
        static className: string;
    };
    declare class PaintItem { };
    declare class ShopItem { };
    declare class FarmParkCell {
        static create(item: any, ndFarmCells: any, position: cc.Vec2, arg3: (cell: any) => void) {
            throw new Error("Method not implemented.");
        }
};
    declare class FarmFish { };
    declare class FarmParkItem {
        static create(item: any, ndFarmItems: any, position: cc.Vec2, arg3: (cell: any) => void) {
            throw new Error("Method not implemented.");
        }
};
    declare class FarmParkAniItem {
        static create(animal: any, ndAnims: any, position: any, arg3: any) {
            throw new Error("Method not implemented.");
        }
};
    declare class ParkAnimal { };
    declare class UIHelp { };
    declare class HelpItem { };
    declare class UIFactoryTalk { };
    declare class GuideSpeek { };
    declare class ChatCell { };
    declare class UnionFightItem { };
    declare class GuJiListItem { };
    declare class ChipItem { };
    declare class TownListItem { };
    declare class TownCellItem {
        static className: string;
    };
    declare class NpcListItem { };
    declare class UIFirstTalk { };
    declare class UIData { };



    declare class UITip {
        static showText(arg0: string, arg1: string) {
            throw new Error("Method not implemented.");
        }
        static showError(arg0: string) {
            throw new Error("Method not implemented.");
        }
        static create(type: any, arg: any, parent: any) {
            throw new Error("Method not implemented.");
        }
        static showTipTxt(text: any, TIP_BAD: any) {
            throw new Error("Method not implemented.");
        }
    };
    declare class UserData {
    };
    declare class Functions {
        static getSceneName():string {
            throw new Error("Method not implemented.");
        }
        static setCreate(filePath: any, arg1: (prefab: any) => void) {
            throw new Error("Method not implemented.");
        }
        static setTextureNew(spUpItem: cc.Node, iconFile: string, arg2: (spTexture: any) => void) {
            throw new Error("Method not implemented.");
        }
        static randomNum(arg0: number, arg1: number, arg2: number):number {
            throw new Error("Method not implemented.");
        }
        static getToscale(spItem: cc.Node, arg1: number, arg2: number): number {
            throw new Error("Method not implemented.");
        }
        static getOpenItems(level: any):any {
            throw new Error("Method not implemented.");
        }
        static nodePositionToRoot(ndAnim: any) {
            throw new Error("Method not implemented.");
        }
        static getChildTagEx(ndItems: cc.Node, ID: any):any {
            throw new Error("Method not implemented.");
        }
        static nodePositionToTarget(nodeItem: any, parent: cc.Node):any {
            throw new Error("Method not implemented.");
        }
        static getFactoryClassType(factoryTempID: any) {
            throw new Error("Method not implemented.");
        }
        static runChangeAction(node: cc.Node) {
            throw new Error("Method not implemented.");
        }
        static formatMoonCardTime(moonCardLeft: any):any {
            throw new Error("Method not implemented.");
        }
        static changeScene(arg0: string) {
            throw new Error("Method not implemented.");
        }
        static composeNumbers(items: void, arg1: string) {
            throw new Error("Method not implemented.");
        }
        static splitNumbers(exData: any, arg1: string): any {
            throw new Error("Method not implemented.");
        }
        static logServerError(msg: any) {
            throw new Error("Method not implemented.");
        }
        static setNodePosToTarget(node: any, ndTarget: any, offset: any) {
            throw new Error("Method not implemented.");
        }
        static filterItemData(items: any, condition: any): any {
            throw new Error("Method not implemented.");
        }
        static setNodePosToTar(arg0: cc.Node, arg1: cc.Node): any {
            throw new Error("Method not implemented.");
        }
        static formatSeconds3(leftTime: number): any {
            throw new Error("Method not implemented.");
        }
        static loadScene(sceneName: string, callBack: any) {
            throw new Error("Method not implemented.");
        }
        static formatSeconds2(cd: any): string {
            throw new Error("Method not implemented.");
        }
        static getItemPicPathNew(orderId: number): string {
            throw new Error("Method not implemented.");
        }
        static setItemTexture(spItem: any, itemID: any, callback: any) {
            throw new Error("Method not implemented.");
        }
        static formatMoney(hasNum: any): string {
            throw new Error("Method not implemented.");
        }
        static formatSeconds(leftTime: any): any {
            throw new Error("Method not implemented.");
        }
        static grayTexture(spFactory: cc.Sprite, bGray: any) {
            throw new Error("Method not implemented.");
        }
        static setTexture(ndSpItem: cc.Node, iconFile: string, callBack: any) {
            throw new Error("Method not implemented.");
        }
        static getRoot(): any {
            throw new Error("Method not implemented.");
        }
        static getLeftTime(targetTime: any): number {
            throw new Error("Method not implemented.");
        }
        static sort(items: any[], arg1: (
            lhs: any,
            rhs: any) => boolean) {
            throw new Error("Method not implemented.");
        }
        static getTargetTime(leftSeconds: any): number {
            throw new Error("Method not implemented.");
        }
        static getLeftTimeExact(targetTime: any): number {
            throw new Error("Method not implemented.");
        }

    };
    declare class ItemDrop {
        static createMultiDrop(gains: any, dropND: any, arg2: null, arg3: any) {
            throw new Error("Method not implemented.");
        }
        static createOneDrop(itemID: any, itemNum: any, parent: any, position: any, dropEnd: any) {
            throw new Error("Method not implemented.");
        }
        static create(itemID: any, parent: any, arg2: (newItem: any) => void) {
            throw new Error("Method not implemented.");
        }
        static createAndDrop2(itemID: any, itemNum: any, curPos: cc.Vec2, parent: any, arg4: null, arg5: boolean, dropEnd: () => void) {
            throw new Error("Method not implemented.");
        }

    };
    declare class FactoryBase {
        [x: string]: any;

    };
    declare class MaterialUtils {
        static MAT: any;
        static useMaterial(spSprite: any, GRAY: any, arg2: null) {
            throw new Error("Method not implemented.");
        }

    };
    declare class UIDialog {
        static create(arg0: string, arg1: string, arg2: (isYes: any) => void) {
            throw new Error("Method not implemented.");
        }
    };
    declare class Geometry {
        static isLineCorss(arg0: any, arg1: any, arg2: any, arg3: any): boolean {
            throw new Error("Method not implemented.");
        }
        static isPointInTriangle(arg0: cc.Vec2, arg1: cc.Vec2, arg2: cc.Vec2, arg3: cc.Vec2): boolean {
            throw new Error("Method not implemented.");
        }
        static checkSlantingSpIsInPoint(worldPoint: cc.Vec2, ndSp: cc.Node, ratioW: any, ratioH: any): boolean {
            throw new Error("Method not implemented.");
        }
        static checkSlantingSpIsCross(ndSp1: { getContentSize: () => any; anchorX: any; anchorY: any; convertToWorldSpaceAR: (arg0: cc.Vec2) => any; }, ratioW1: number, ratioH1: number, ndSp2: { getContentSize: () => any; anchorX: any; anchorY: any; convertToWorldSpaceAR: (arg0: cc.Vec2) => any; }, ratioW2: number, ratioH2: number): boolean {
            throw new Error("Method not implemented.");
        }

    };
}
declare namespace global.Module {
    declare class FishPoolData {
        static clear() {
            throw new Error("Method not implemented.");
        }
        static getFish(fishTimeID: any) {
            throw new Error("Method not implemented.");
        }
        static getFishs():any {
            throw new Error("Method not implemented.");
        }
        static setFishPool(arg0: this) {
            throw new Error("Method not implemented.");
        }
        constructor(parameters) {
            
        }
    }
    declare class TownMapData {
        static randomTown(arg0: number, arg1: number, arg2: number):any {
            throw new Error("Method not implemented.");
        }
        static getID():any {
            throw new Error("Method not implemented.");
        }
        static loadScene(arg0: number) {
            throw new Error("Method not implemented.");
        }
        static getIsInEditorMode(arg0: boolean): any {
            throw new Error("Method not implemented.");
        }
        static indexToRowCol(idx: any) {
            throw new Error("Method not implemented.");
        }
        static searchdPath(curIdx: number, targetIdx: any):any {
            throw new Error("Method not implemented.");
        }
        static getCanPass(index: any): any {
            throw new Error("Method not implemented.");
        }
        static getPathData(): any {
            throw new Error("Method not implemented.");
        }
        constructor(parameters) {

        }
    }
    declare class GameData {
        static requestBaseData() {
            throw new Error("Method not implemented.");
        }
        static checkPlayTime() {
            throw new Error("Method not implemented.");
        }
        static getDropInstance(): any {
            throw new Error("Method not implemented.");
        }
        static getage():any {
            throw new Error("Method not implemented.");
        }
        static setMaskSound(arg0: boolean,arg1: boolean) {
            throw new Error("Method not implemented.");
        }
        static getMaskSound():boolean {
            throw new Error("Method not implemented.");
        }
        static setIsShowFactoryName(isShow: boolean) {
            throw new Error("Method not implemented.");
        }
        static getMoonCardLeft(): any {
            throw new Error("Method not implemented.");
        }
        static getCanRewardCard(): any {
            throw new Error("Method not implemented.");
        }
        static getCanRewardMoonCard(): any {
            throw new Error("Method not implemented.");
        }
        static getIsShowFactoryName(): any {
            throw new Error("Method not implemented.");
        }
        static startLogicUpdate() {
            throw new Error("Method not implemented.");
        }
        static getDropTargetPos(coinType: any) {
            throw new Error("Method not implemented.");
        }
        static getNeedShowDropDec(itemID: any): boolean {
            throw new Error("Method not implemented.");
        }
        static getDropStartPos(): any {
            throw new Error("Method not implemented.");
        }
        static showTaskHelp() {
            throw new Error("Method not implemented.");
        }
        static getisNeedUpdate(): any {
            throw new Error("Method not implemented.");
        }
        static getIsNeedCert(): any {
            throw new Error("Method not implemented.");
        }
        static getClientData(arg0: string): any {
            throw new Error("Method not implemented.");
        }
        static loadLocalDropData() {
            throw new Error("Method not implemented.");
        }
        static getIsAdult(): boolean {
            throw new Error("Method not implemented.");
        }
        static getversion() {
            throw new Error("Method not implemented.");
        }
        static setClientData(clientData: any) {
            throw new Error("Method not implemented.");
        }
        static setisNeedUpdate(isNeedUpdate: any) {
            throw new Error("Method not implemented.");
        }
        static setIsNeedCert(isNeedCert: any) {
            throw new Error("Method not implemented.");
        }
        static setFirstLogin(firstLogin: any) {
            throw new Error("Method not implemented.");
        }
        static setAccountInfo(account: any, password: any, platformType: any) {
            throw new Error("Method not implemented.");
        }
        static setuserInfo(userInfo: any) {
            throw new Error("Method not implemented.");
        }
        static setIsAdult(arg0: boolean) {
            throw new Error("Method not implemented.");
        }
        static setage(age: number) {
            throw new Error("Method not implemented.");
        }
        static openLockSocketOp(arg0: boolean) {
            throw new Error("Method not implemented.");
        }
        static addDropCount(ItemId: any, changeCount: any) {
            throw new Error("Method not implemented.");
        }
        static getPlatform() {
            throw new Error("Method not implemented.");
        }
        static getPassword() {
            throw new Error("Method not implemented.");
        }
        static getAccount() {
            throw new Error("Method not implemented.");
        }
        static lockSocketBackOp(msgName: string, arg1: boolean) {
            throw new Error("Method not implemented.");
        }
        static setDropInstance(ndItem: any) {
            throw new Error("Method not implemented.");
        }
        static isInOtherHome(): boolean {
            throw new Error("Method not implemented.");
        }
    };
    declare class FriendChooseData {
        static getFriend(ID: any):any {
            throw new Error("Method not implemented.");
        }
        static getSelectFriend() {
            throw new Error("Method not implemented.");
        }
        static getFriendIndex(ID: any):any {
            throw new Error("Method not implemented.");
        }
        static synchronFriendData(friends: any) {
            throw new Error("Method not implemented.");
        }
        static listSort(sortType: any) {
            throw new Error("Method not implemented.");
        }
        static getFriendData() {
            throw new Error("Method not implemented.");
        }
        static getSelectID() {
            throw new Error("Method not implemented.");
        }
        static setSelectID(roleId: number) {
            throw new Error("Method not implemented.");
        }
    };

    declare class PlayerMapData {
        static getObstacle(ID: any):any {
            throw new Error("Method not implemented.");
        }
        static getFactory(ID: any):any {
            throw new Error("Method not implemented.");
        }
        static getMapData():any {
            throw new Error("Method not implemented.");
        }
        static clear() {
            throw new Error("Method not implemented.");
        }
        static setRoleInfo(roleInfo: any) {
            throw new Error("Method not implemented.");
        }
        static setFarmData(farmData: { plantData: <U>(callbackfn: (value: any, index: number, array: any[]) => U, thisArg?: any) => U[]; }) {
            throw new Error("Method not implemented.");
        }
        static selfUpdate(dt: any) {
            throw new Error("Method not implemented.");
        }
        static getRoleInfo():any {
            throw new Error("Method not implemented.");
        }
        static setMapData(map: { [x: string]: { value: any; }; }) {
            throw new Error("Method not implemented.");
        }
        static setObstaclesData(map: <U>(callbackfn: (value: any, index: number, array: any[]) => U, thisArg?: any) => U[]) {
            throw new Error("Method not implemented.");
        }
    };
    declare class MainPlayerData {
        static setguildID(id: any) {
            throw new Error("Method not implemented.");
        }
        static getguildID():any {
            throw new Error("Method not implemented.");
        }
        static getCurRoleID() {
            throw new Error("Method not implemented.");
        }
        static getSignature(): string {
            throw new Error("Method not implemented.");
        }
        static setNeedSaveChange: any;
        static lockDrop(arg0: boolean) {
            throw new Error("Method not implemented.");
        }
        static getRoleName():any {
            throw new Error("Method not implemented.");
        }
        static getFiveElem(): any {
            throw new Error("Method not implemented.");
        }
        static popSaveChange() {
            throw new Error("Method not implemented.");
        }
        static getName(roleName: any): string {
            throw new Error("Method not implemented.");
        }
        static getMaxPower(): any {
            throw new Error("Method not implemented.");
        }
        static getPower(): any {
            throw new Error("Method not implemented.");
        }
        static getMaxMagic(): any {
            throw new Error("Method not implemented.");
        }
        static getCoin(): any {
            throw new Error("Method not implemented.");
        }
        static getDianomd(): any {
            throw new Error("Method not implemented.");
        }
        static setMagic(actionValue: any) {
            throw new Error("Method not implemented.");
        }
        static getMagic(): any {
            throw new Error("Method not implemented.");
        }
        static getGuideState(): any {
            throw new Error("Method not implemented.");
        }
        static getguideID(): any {
            throw new Error("Method not implemented.");
        }
        static getOldData(arg0: string): any {
            throw new Error("Method not implemented.");
        }
        static onPlayerAttrNtf(roleBaseData: any) {
            throw new Error("Method not implemented.");
        }
        static setguideState(guideState: any) {
            throw new Error("Method not implemented.");
        }
        static setFiveElem(fiveEle: any) {
            throw new Error("Method not implemented.");
        }
        static setSignature(signature: any) {
            throw new Error("Method not implemented.");
        }
        static setRoleName(roleName: any) {
            throw new Error("Method not implemented.");
        }
        static setRoleID(arg0: any) {
            throw new Error("Method not implemented.");
        }
        static getDataByKey(arg0: string): any {
            throw new Error("Method not implemented.");
        }
        static getRoleID(): any {
            throw new Error("Method not implemented.");
        }
        static getLevel():any {
            throw new Error("Method not implemented.");
        }
        static setguideID(idx: any) {
            throw new Error("Method not implemented.");
        }
    };
    declare class PackageData {
        static setOnItemList(itemID: any) {
            throw new Error("Method not implemented.");
        }
        static getItem(itemID: number): any {
            throw new Error("Method not implemented.");
        }
        static getPackageTypeNum(): any {
            throw new Error("Method not implemented.");
        }
        static getItemCount(itemID: any): any {
            throw new Error("Method not implemented.");
        }
    };
    declare class MakeGoodsData {
        static getFactoryID():any {
            throw new Error("Method not implemented.");
        }
        static setFactoryID(factoryID: any) {
            throw new Error("Method not implemented.");
        }
        static getMakeItem(factoryID: number, lastIdx: number):any {
            throw new Error("Method not implemented.");
        }
        static setPanel(arg0: any) {
            throw new Error("Method not implemented.");
        }
        static getMaxMakeSlot(factoryID: number) {
            throw new Error("Method not implemented.");
        }
        static getData(factoryID: number) {
            throw new Error("Method not implemented.");
        }
        static getMakeItemNum(factoryID: number):any {
            throw new Error("Method not implemented.");
        }
        static getPickItems(factoryID: any):any {
            throw new Error("Method not implemented.");
        }
        static pickAllItem(factoryID: any) {
            throw new Error("Method not implemented.");
        }
        static addFactory(ID: any) {
            throw new Error("Method not implemented.");
        }
        static selfUpdate(dt: any) {
            throw new Error("Method not implemented.");
        }
    };
    declare class MainMapData {
        static setPosition(templateID: any, position: any) {
            throw new Error("Method not implemented.");
        }
        static getObstacle(ID: any):any {
            throw new Error("Method not implemented.");
        }
        static getFactorys():any {
            throw new Error("Method not implemented.");
        }
        static setFristLoad(arg0: boolean) {
            throw new Error("Method not implemented.");
        }
        static getFristLoad():any {
            throw new Error("Method not implemented.");
        }
        static setMap(arg0: this) {
            throw new Error("Method not implemented.");
        }
        static getFactory(ID: any):any {
            throw new Error("Method not implemented.");
        }
    };
    declare class RankData {
        static getSelfRank():any {
            throw new Error("Method not implemented.");
        }
        static getData(arg0: any, roleID: any):any {
            throw new Error("Method not implemented.");
        }
        static getRank(rankType: any): any {
            throw new Error("Method not implemented.");
        }
};
    declare class FriendData {
        static getRoleInfosData() {
            throw new Error("Method not implemented.");
        }
        static getAppliesData():any {
            throw new Error("Method not implemented.");
        }
        static listSort(sortType: any) {
            throw new Error("Method not implemented.");
        }
        static isSelf(roleId: any):boolean {
            throw new Error("Method not implemented.");
        }
        static getFriend(roleID: any):any {
            throw new Error("Method not implemented.");
        }
        static getFriendData(): any {
            throw new Error("Method not implemented.");
        }
    };
    declare class PreciousRoomData {
        static getCurPage() {
            throw new Error("Method not implemented.");
        }
        static getCurRoleID() {
            throw new Error("Method not implemented.");
        }
        static showTableSupport(roleID: any, arg1: number) {
            throw new Error("Method not implemented.");
        }
        static getFortuneData():any {
            throw new Error("Method not implemented.");
        }
        static qualityDec: any;
        static getItem(arg0: number, fishIdx: any, arg2: number) {
            throw new Error("Method not implemented.");
        }
        static getPageItems(arg0: number, hallNum: number):any {
            throw new Error("Method not implemented.");
        }
        static getTotalData(arg0: number): { tradeData: any[]; verData: any[]; sureData: any[]; } {
            throw new Error("Method not implemented.");
        }
        static gotoRoom: any;
        static getCurType(): any {
            throw new Error("Method not implemented.");
        }
        static getFreeIndex(arg0: any): number {
            throw new Error("Method not implemented.");
        }
        static formatFortune(recyclePrice: any): any {
            throw new Error("Method not implemented.");
        }
    };
    declare class IdentifyData {
        static getHasUnIdentify():any {
            throw new Error("Method not implemented.");
        }
        static getUnIdentify():any {
            throw new Error("Method not implemented.");
        }
        static getUnIdentifyNum():any {
            throw new Error("Method not implemented.");
        }
        static getUnIdentifyItem(showIdx: any):any {
            throw new Error("Method not implemented.");
        }
        static getCurRoleID():any {
            throw new Error("Method not implemented.");
        }
        static setCurRoleID(roleId: any) {
            throw new Error("Method not implemented.");
        }
        static getHistory():any {
            throw new Error("Method not implemented.");
        }
        static getBagItems() {
            throw new Error("Method not implemented.");
        }
        static setBootindex(arg0: number) {
            throw new Error("Method not implemented.");
        }
        static getCanAutoIdentify():boolean {
            throw new Error("Method not implemented.");
        }
        static getIdentifyItemByID(index: any) {
            throw new Error("Method not implemented.");
        }
        static getTotalItem(arg0: number):any {
            throw new Error("Method not implemented.");
        }
        static getIdentify():any {
            throw new Error("Method not implemented.");
        }
        static getMaxItem(arg0: number) {
            throw new Error("Method not implemented.");
        }
        static getIdentifyItem(showIdx: any):any {
            throw new Error("Method not implemented.");
        }
        static getIdentifyNum():any {
            throw new Error("Method not implemented.");
        }
        static gotoRoom(isCurSelf: boolean, targetID: any, isChangeSel: any) {
            throw new Error("Method not implemented.");
        }
        static isLast(arg0: number): any {
            throw new Error("Method not implemented.");
        }
        static setPanel(arg0: any) {
            throw new Error("Method not implemented.");
        }
        static getBootindex():number {
            throw new Error("Method not implemented.");
        }
        static selfUpdate(dt: any) {
            throw new Error("Method not implemented.");
        }
    };
    declare class FarmData {
        static selfUpdate(dt: any) {
            throw new Error("Method not implemented.");
        }
        static harvestPlant(successIdx: any) {
            throw new Error("Method not implemented.");
        }
        static tempHarvest(type: any, idx: any) {
            throw new Error("Method not implemented.");
        }
        static getCanHarvest(idx: any): boolean {
            throw new Error("Method not implemented.");
        }
        static getPlant(idx: any): any {
            throw new Error("Method not implemented.");
        }
    };
    declare class FarmParkData {
        static getAllAnimalNum():number {
            throw new Error("Method not implemented.");
        }
        static getZooAnimal(index: any): any {
            throw new Error("Method not implemented.");
        }
        static getAllZooAnimal():any {
            throw new Error("Method not implemented.");
        }
        static setFarmParkID(EnType: any) {
            throw new Error("Method not implemented.");
        }
        static getFarmParkID(): any {
            throw new Error("Method not implemented.");
        }
        static loadLocal() {
            throw new Error("Method not implemented.");
        }
        static setMap(arg0: any) {
            throw new Error("Method not implemented.");
        }
        static getFishsNum():any {
            throw new Error("Method not implemented.");
        }
        static getCellsNum():any {
            throw new Error("Method not implemented.");
        }
        static getFactorys():any {
            throw new Error("Method not implemented.");
        }
        static getFactory(ID: any):any {
            throw new Error("Method not implemented.");
        }
        static makeNeighborArray(arg0: any, arg1: boolean): any[] {
            throw new Error("Method not implemented.");
        }
        static setGreenValue(neighborIndex: any, arg1: boolean):any {
            throw new Error("Method not implemented.");
        }
        static getPlantCell(index: any): any {
            throw new Error("Method not implemented.");
        }
        static getCanHarvest(index: any, FARM_FISH: any):any {
            throw new Error("Method not implemented.");
        }
        static getFishCell(index: any): any {
            throw new Error("Method not implemented.");
        }
        static getIsUnCommonAnimal(index: any):boolean {
            throw new Error("Method not implemented.");
        }
        static getItemByType(index: any, type: any) {
            throw new Error("Method not implemented.");
        }
        static harvest(ID: any, FARM_FISH: any) {
            throw new Error("Method not implemented.");
        }
        static getIsDrawPrize():any {
            throw new Error("Method not implemented.");
        }
        static getAllAnimal():any {
            throw new Error("Method not implemented.");
        }
        static findFirstHarvest(type: any):any {
            throw new Error("Method not implemented.");
        }
        static costShovelItem(arg0: number) {
            throw new Error("Method not implemented.");
        }
        static getAnimal(index: any):any {
            throw new Error("Method not implemented.");
        }
        static clear() {
            throw new Error("Method not implemented.");
        }
        static getBeeTotalTime() {
            throw new Error("Method not implemented.");
        }
        static getBeeLeftTime() {
            throw new Error("Method not implemented.");
        }
        static getUseEcology(): any {
            throw new Error("Method not implemented.");
        }
        static posArrData(data: void, item: any): any {
            throw new Error("Method not implemented.");
        }
        static farmData(plantID: any): any {
            throw new Error("Method not implemented.");
        }
        static cleartempOpQueue() {
            throw new Error("Method not implemented.");
        }
        static pushOperatorIdx(index: any, FARMOP_FINSH: any): any {
            throw new Error("Method not implemented.");
        }
        static getMap(): any {
            throw new Error("Method not implemented.");
        }
        static getCanGrowInfo(ID: any, selectCell: any) {
            throw new Error("Method not implemented.");
        }
        static selfUpdate(dt: any) {
            throw new Error("Method not implemented.");
        }
        static getColNum(): any {
            throw new Error("Method not implemented.");
        }
        static checkNum(itemID: any): any {
            throw new Error("Method not implemented.");
        }
        static checkMoney(itemID: any, FARM_PLANT: any): any {
            throw new Error("Method not implemented.");
        }
        static checkLevel(itemID: any, FARM_PLANT: any): any {
            throw new Error("Method not implemented.");
        }
        static checkGVEnough(index: any, itemID: any): any {
            throw new Error("Method not implemented.");
        }
    };
    declare class TradeData {
        static sort(sortType: number, arg1: (items: any) => void): any[] {
            throw new Error("Method not implemented.");
        }
        static calKLine() {
            throw new Error("Method not implemented.");
        }
        static getHistoryData():any {
            throw new Error("Method not implemented.");
        }
        static getTradeNotes():any {
            throw new Error("Method not implemented.");
        }
        static removeTradeNote(id: any) {
            throw new Error("Method not implemented.");
        }
        static getTradeNote(id: any):any {
            throw new Error("Method not implemented.");
        }
        static getWantData():any {
            throw new Error("Method not implemented.");
        }
        static setWantData(data: {}) {
            throw new Error("Method not implemented.");
        }
        static getCurTradeData(TRADE_SELL: any):any {
            throw new Error("Method not implemented.");
        }
        static getTradeItemID(): number {
            throw new Error("Method not implemented.");
        }
        static setTradeItemID(ID: any) {
            throw new Error("Method not implemented.");
        }
      
        static setItemQulity(curQuality: number) {
            throw new Error("Method not implemented.");
        }
};
    declare class UnionData {
        static memberValue(item: any, key: string):any {
            throw new Error("Method not implemented.");
        }
        static getShearch(arg0: number):any {
            throw new Error("Method not implemented.");
        }
        static getOnlineNum():any {
            throw new Error("Method not implemented.");
        }
        static sortMembers(sortType: number) {
            throw new Error("Method not implemented.");
        }
        static getMemberByID(roleID: any):any {
            throw new Error("Method not implemented.");
        }
        static getMembers():any {
            throw new Error("Method not implemented.");
        }
        static getApplys() {
            throw new Error("Method not implemented.");
        }
        static getUnion(unionID: any):any {
            throw new Error("Method not implemented.");
        }
        static getAllUnion():any {
            throw new Error("Method not implemented.");
        }
        static getRankList(): any {
            throw new Error("Method not implemented.");
        }
        static setSelfUnion(arg0: null) {
            throw new Error("Method not implemented.");
        }
        static getSelfUnion(): any {
            throw new Error("Method not implemented.");
        }
        static getUnionActiveDec(activeLevel: any): any {
            throw new Error("Method not implemented.");
        }
        static getMySelf(): any {
            throw new Error("Method not implemented.");
        }
        static getTitleDec(guildPost: any): any {
            throw new Error("Method not implemented.");
        }
        static selfUpdate(dt: any) {
            throw new Error("Method not implemented.");
        }
    };
    declare class TaskData {
        static setAddata() {
            throw new Error("Method not implemented.");
        }
        static taskFactoryTips(node: cc.Node) {
            throw new Error("Method not implemented.");
        }
        static setIsAgree(arg0: boolean) {
            throw new Error("Method not implemented.");
        }
        
        static taskRont(taskId: any):boolean {
            throw new Error("Method not implemented.");
        }
        static setIsTaskId(arg0: boolean) {
            throw new Error("Method not implemented.");
        }
        static getIsTaskId():boolean {
            throw new Error("Method not implemented.");
        }
        static getCurUnionTask() {
            throw new Error("Method not implemented.");
        }
        static setHasAcceptTaskData(arg0: null) {
            throw new Error("Method not implemented.");
        }
        static onTaskAcceptRsp(msg: any) {
            throw new Error("Method not implemented.");
        }
        static getAddata():any {
            throw new Error("Method not implemented.");
        }
        static getAllTasks() {
            throw new Error("Method not implemented.");
        }
        static getTasksByType(eMonth: any):any {
            throw new Error("Method not implemented.");
        }
        static getAcceptTask(): any {
            throw new Error("Method not implemented.");
        }
        static taskguard(arg0: number): any {
            throw new Error("Method not implemented.");
        }
        static getHasAcceptTaskData(): any {
            throw new Error("Method not implemented.");
        }
        static setHasAcceptTask(acceptTask: any) {
            throw new Error("Method not implemented.");
        }
        static growUpTaskID: any;
        static gettaskphase(arg0: number): any {
            throw new Error("Method not implemented.");
        }
        static uiFirstTalkShow: boolean;
    };
    declare class UnionTaskData {
        static getQuestLst(): any {
            throw new Error("Method not implemented.");
        }
        static getCurUnionTask():any {
            throw new Error("Method not implemented.");
        }
        static gethandLst() {
            throw new Error("Method not implemented.");
        }
};
    declare class GuildBattleData {
        static getCD(arg0: boolean):any {
            throw new Error("Method not implemented.");
        }
        static getScore(arg0: boolean):any {
            throw new Error("Method not implemented.");
        }
        static clear() {
            throw new Error("Method not implemented.");
        }
        static setPanel(arg0: any) {
            throw new Error("Method not implemented.");
        }
        static setFightState(arg0: number) {
            throw new Error("Method not implemented.");
        }
        static getFightState():any {
            throw new Error("Method not implemented.");
        }
        static setCD(isSelf: boolean, value: any) {
            throw new Error("Method not implemented.");
        }
        static reflashBuild(build: any) {
            throw new Error("Method not implemented.");
        }
        static selfUpdate(dt: any) {
            throw new Error("Method not implemented.");
        }
    };
    declare class CatchGoodsNetData {
        static getFlyItems() {
            throw new Error("Method not implemented.");
        }
        static clearNeeds() {
            throw new Error("Method not implemented.");
        }
        static getScore(arg0: boolean):any {
            throw new Error("Method not implemented.");
        }
        static getMakeID():any {
            throw new Error("Method not implemented.");
        }
        static getMakeItem(matrialID: any):any {
            throw new Error("Method not implemented.");
        }
        static getNextMake(arg0: number) {
            throw new Error("Method not implemented.");
        }
        static removeFlyItem(ID: any) {
            throw new Error("Method not implemented.");
        }
        static getCurCountAndNum():any {
            throw new Error("Method not implemented.");
        }
        static popDropItem():any {
            throw new Error("Method not implemented.");
        }
        static getIsNeedItem(templateID: any):any {
            throw new Error("Method not implemented.");
        }
        static getFightBuild() {
            throw new Error("Method not implemented.");
        }
        static start(self: this) {
            throw new Error("Method not implemented.");
        }
        static setFightBuild(buildID: any) {
            throw new Error("Method not implemented.");
        }
    };
    declare class HandBookData {
        static getSuitDataType(): any {
            throw new Error("Method not implemented.");
        }
        static getSuitDataTypePage(sortType: number): any[] {
            throw new Error("Method not implemented.");
        }
        static getDataByType(index: number, secondID: any, sortType: number): any {
            throw new Error("Method not implemented.");
        }
        static getDataByTypeAndPage(index: number, secondID: number, sortType: number, arg3: number):any {
            throw new Error("Method not implemented.");
        }
    
        static getbookArr(): { itemType: number; index: number; name: string; titArr: { name: string; page: number; }[]; }[] {
            throw new Error("Method not implemented.");
        }
    
      
        static getItem(bookID: any) {
            throw new Error("Method not implemented.");
        }
    };
    declare class CollectData {
        static getMinCount(key: string|number):any {
            throw new Error("Method not implemented.");
        }
        static getDataID(id: any):any {
            throw new Error("Method not implemented.");
        }
       
        static getData():any {
            throw new Error("Method not implemented.");
        }
};
    declare class ShopData {
        static getDataByType(type: number): any[] {
            throw new Error("Method not implemented.");
        }
};
    declare class SummonData {
        static getInvestCount():any {
            throw new Error("Method not implemented.");
        }
        static getPlainCount():any {
            throw new Error("Method not implemented.");
        }
        static getMailData():any {
            throw new Error("Method not implemented.");
        }
        static setMailData() {
            throw new Error("Method not implemented.");
        }
        static getMail():Array {
            throw new Error("Method not implemented.");
        }
        static mailsClear() {
            throw new Error("Method not implemented.");
        }
        static setupLevel(arg0: boolean) {
            throw new Error("Method not implemented.");
        }
        static getupLevel():boolean {
            throw new Error("Method not implemented.");
        }
        static iShowBackDemo(summonID: any):boolean {
            throw new Error("Method not implemented.");
        }
       
        static getself(): any {
            throw new Error("Method not implemented.");
        }
        static getDemonCurrent():any {
            throw new Error("Method not implemented.");
        }
        static getNewDemon():any {
            throw new Error("Method not implemented.");
        }
        static getCurElement():number {
            throw new Error("Method not implemented.");
        }
        static getDefSummonID(): number {
            throw new Error("Method not implemented.");
        }
        static getMails():any {
            throw new Error("Method not implemented.");
        }
        static getMailNum() {
            throw new Error("Method not implemented.");
        }
        static getCurLevel():any {
            throw new Error("Method not implemented.");
        }
        static getPersonLevel():number {
            throw new Error("Method not implemented.");
        }
        static getMailCount():any {
            throw new Error("Method not implemented.");
        }
        static getIsGoOut():any {
            throw new Error("Method not implemented.");
        }
        static getHasUnReadMail():any {
            throw new Error("Method not implemented.");
        }
        static getMailByID(mailID: void):any {
            throw new Error("Method not implemented.");
        }
        static getinvestmentMail():any {
            throw new Error("Method not implemented.");
        }
        static selfUpdate(dt: any) {
            throw new Error("Method not implemented.");
        }
    };
    declare class CatchGoodsData {
        static getFlyItems() {
            throw new Error("Method not implemented.");
        }
        static clearNeeds() {
            throw new Error("Method not implemented.");
        }
        static getScore():any {
            throw new Error("Method not implemented.");
        }
        static getMakeItem(matrialID: any):any {
            throw new Error("Method not implemented.");
        }
        static getNextMake(arg0: number) {
            throw new Error("Method not implemented.");
        }
        static removeFlyItem(ID: any) {
            throw new Error("Method not implemented.");
        }
        static getCurCountAndNum():any {
            throw new Error("Method not implemented.");
        }
        static popDropItem():any {
            throw new Error("Method not implemented.");
        }
        static start(self: this) {
            throw new Error("Method not implemented.");
        }
        static getMakeID():any {
            throw new Error("Method not implemented.");
        }
        static getIsNeedItem(templateID: any):boolean {
            throw new Error("Method not implemented.");
        }
};
    declare class ChatData {
        static setPanel(arg0: this) {
            throw new Error("Method not implemented.");
        }
};
    declare class TownNpcData {
        static getNpcs(mapID: any):any {
            throw new Error("Method not implemented.");
        }
};
    declare class GuideTaskData {
        static getIsFinishAll(): boolean {
            throw new Error("Method not implemented.");
        }
        static updateByGuide(curGuide: any) {
            throw new Error("Method not implemented.");
        }
    };
}
declare namespace global.Proxys {
    declare class ProxyNewFactory {
        static setFactoryData() {
            throw new Error("Method not implemented.");
        }
        static getNeedShow(): any[] {
            throw new Error("Method not implemented.");
        }
        static removeFactory(factoryID: any) {
            throw new Error("Method not implemented.");
        }
        constructor(parameters) {

        }
    }
    declare class ProxyUnion {
        static addUnion(id: any) {
            throw new Error("Method not implemented.");
        }
        static leaveUnion(arg0: (isSuccess: any) => void) {
            throw new Error("Method not implemented.");
        }
        static reflashAllOpen() {
            throw new Error("Method not implemented.");
        }
        static reflashAll() {
            throw new Error("Method not implemented.");
        }
        static reflashRank() {
            throw new Error("Method not implemented.");
        }
        constructor(parameters) {

        }
    };
    declare class ProxyDigGold {
        static getMapData() {
            throw new Error("Method not implemented.");
        }
        static getDigData():any {
            throw new Error("Method not implemented.");
        }
        static makeNeighborItems(itemIdx: any) {
            throw new Error("Method not implemented.");
        }
        static makeNeighborArray(itemIdx: any):any {
            throw new Error("Method not implemented.");
        }
        static getEnterFlag() {
            throw new Error("Method not implemented.");
        }
        static sceneData: any;
        static setMap(arg0: this) {
            throw new Error("Method not implemented.");
        }
        static getRowNum():number {
            throw new Error("Method not implemented.");
        }
        static digedType: any;
        static getMapMaxIdx():any {
            throw new Error("Method not implemented.");
        }
        static getInitRoles():any {
            throw new Error("Method not implemented.");
        }
        static getFirstLoad():any {
            throw new Error("Method not implemented.");
        }
        static sTocPosition(position: any) {
            throw new Error("Method not implemented.");
        }
        static getSceneData():any {
            throw new Error("Method not implemented.");
        }
        static getCostItemLeft():any {
            throw new Error("Method not implemented.");
        }
        static getItemIdx(x: any, y: any) {
            throw new Error("Method not implemented.");
        }
        static searchdPath(curIdx: any, targetIdx: any): any[] {
            throw new Error("Method not implemented.");
        }
        static getFitDigStandIdx(itemIdx: any) {
            throw new Error("Method not implemented.");
        }
        static cTosPosition(itemPos: any): any {
            throw new Error("Method not implemented.");
        }
        static showDigReward(digIdx: any) {
            throw new Error("Method not implemented.");
        }
        static getMapItem(curDigIdx: any): any {
            throw new Error("Method not implemented.");
        }
        static getColNum(): any {
            throw new Error("Method not implemented.");
        }
    };
    declare class ProxyGuJi {
        static setIsAnimation(arg0: boolean) {
            throw new Error("Method not implemented.");
        }
        static getIsAnimation():boolean {
            throw new Error("Method not implemented.");
        }
        static releasePicture() {
            throw new Error("Method not implemented.");
        }
        static loadPicture(num:any) {
            throw new Error("Method not implemented.");
        }
        static setGuJI(arg0: boolean) {
            throw new Error("Method not implemented.");
        }
        static getGuJI():any {
            throw new Error("Method not implemented.");
        }
        static put(node: cc.Node) {
            throw new Error("Method not implemented.");
        }
        static get(): any {
            throw new Error("Method not implemented.");
        }
        static esta // 这个sayHello方法，就是 js 中真正有的方法，名字对得上就可以了
            () {
                throw new Error("Method not implemented.");
        }
        static PoolManager: any;
        static getIsObstacle(targetIdx: any):boolean {
            throw new Error("Method not implemented.");
        }
        static addHurtCount(robId: any) {
            throw new Error("Method not implemented.");
        }
        static indexToServerPos(targetIdx: number):any {
            throw new Error("Method not implemented.");
        }
        static getCanPick(targetIdx: number):any {
            throw new Error("Method not implemented.");
        }
        static getIsPicked(targetIdx: number):any {
            throw new Error("Method not implemented.");
        }
        static openItem(targetIdx: number) {
            throw new Error("Method not implemented.");
        }
        static getCanidx(endCell: any):any {
            throw new Error("Method not implemented.");
        }
        static getNearFarFlag():any {
            throw new Error("Method not implemented.");
        }
        static monsterCellWu: any;
        static monsterCellWen: any;
        static openArround(openIdx: any) {
            throw new Error("Method not implemented.");
        }
        static getMapData():any {
            throw new Error("Method not implemented.");
        }
        static getZeroPos():any {
            throw new Error("Method not implemented.");
        }
        static onLoadMap(arg0: this) {
            throw new Error("Method not implemented.");
        }
        static getContentData(): any {
            throw new Error("Method not implemented.");
        }
        static indexToRowCol(curIdx: any) {
            throw new Error("Method not implemented.");
        }
        static isMagicEnough(targetIdx: any):any {
            throw new Error("Method not implemented.");
        }
        static searchdPath(curIdx: any, targetIdx: any):any {
            throw new Error("Method not implemented.");
        }
        static getItem(index: any):any {
            throw new Error("Method not implemented.");
        }
        static setMapData(mapData: any) {
            throw new Error("Method not implemented.");
        }
        static getIsWarter(item: any): any {
            throw new Error("Method not implemented.");
        }
    };
    declare class ProxyFactoryGuide {
        static getNeedGuide(templateID: any):any {
            throw new Error("Method not implemented.");
        }
        static executeGuide(name: string) {
            throw new Error("Method not implemented.");
        }
        static getNeedShowGuide(ID: any):any {
            throw new Error("Method not implemented.");
        }
        static setCurFactoryID(factoryID: any) {
            throw new Error("Method not implemented.");
        }
        static getCurGuideFactory():any {
            throw new Error("Method not implemented.");
        }
        static getNeedShow(ID: any): any {
            throw new Error("Method not implemented.");
        }
        static onLevelUp(value: any) {
            throw new Error("Method not implemented.");
        }
    };

    declare class ProxyFarm {
        static setMode(arg0: number) {
            throw new Error("Method not implemented.");
        }
        static getMode(): number {
            throw new Error("Method not implemented.");
        }
        static getFarm(): any {
            throw new Error("Method not implemented.");
        }
    };
    declare class ProxyGuide {
        static goToGuide(arg0: string):boolean {
            throw new Error("Method not implemented.");
        }
        static centerCurrentScene():any {
            throw new Error("Method not implemented.");
        }
        static getIsFinish(arg0: string):any {
            throw new Error("Method not implemented.");
        }
        static setGuideOpen(arg0: string, arg1: boolean) {
            throw new Error("Method not implemented.");
        }
        static setGuideFinish(arg0: string, arg1: boolean) {
            throw new Error("Method not implemented.");
        }
        static setGuideArg(arg0: string, res: number) {
            throw new Error("Method not implemented.");
        }
        static getCurrentGuide(): any {
            throw new Error("Method not implemented.");
        }
        static stepNextGuide(arg0: string): any {
            throw new Error("Method not implemented.");
        }
        static setGuideExData(arg0: string, newDatas: void) {
            throw new Error("Method not implemented.");
        }
        static getGuide(arg0: string): any {
            throw new Error("Method not implemented.");
        }
        static getIsOpen(arg0: string): boolean {
            throw new Error("Method not implemented.");
        }
    };
    declare class ProxyWorldMap {
        static getMapID():any {
            throw new Error("Method not implemented.");
        }
        static setMapID(mapId: any) {
            throw new Error("Method not implemented.");
        }
        static setMap(arg0: this) {
            throw new Error("Method not implemented.");
        }
        static getMap(): any {
            throw new Error("Method not implemented.");
        }
    };
    declare class ProxyReLogin {
        static connect(arg0: string, callBack: (event: { type: string; }) => void) {
            throw new Error("Method not implemented.");
        }
        static reConnectToServer() {
            throw new Error("Method not implemented.");
        }
        static getIsReloginFailed(): boolean {
            throw new Error("Method not implemented.");
        }
    };
}
declare namespace global.Instance {
    declare class Socket {
        static connect(url: string, callBack: any) {
            throw new Error("Method not implemented.");
        }
        static send(buffer: ArrayBuffer) {
            throw new Error("Method not implemented.");
        }
        static isConnected(): boolean {
            throw new Error("Method not implemented.");
        }
    };
    declare class MsgPools {
        static receive(data: any) {
            throw new Error("Method not implemented.");
        }
        static register(arg0: string, arg1: any) {
            throw new Error("Method not implemented.");
        }
        static send(arg0: string, sendData: any, arg2: (msg: any) => void) {
            throw new Error("Method not implemented.");
        }
    };
    declare class Dynamics { };
    declare class AudioEngine {
        static stopSound(arg0: string) {
            throw new Error("Method not implemented.");
        }
        static replaySound(arg0: string, arg1: boolean, arg2: number) {
            throw new Error("Method not implemented.");
        }
        static stopMusic(backMusic: string) {
            throw new Error("Method not implemented.");
        }
        static playMusic(backMusic: any, arg1: boolean, volume: any) {
            throw new Error("Method not implemented.");
        }
        static stopAll() {
            throw new Error("Method not implemented.");
        }
        static playSound(name: string, isLoop: any, volume: any, callBack: (arg0: any) => void) {
            throw new Error("Method not implemented.");
        }
    };
    declare class Log {
        static warn(arg0: string, data: any) {
            throw new Error("Method not implemented.");
        }
        static debug(arg0: any, arg1: any) {
            throw new Error("Method not implemented.");
        }
    };
}
declare namespace global.Manager {
    declare class UIManager {
        static addResident(arg0: string, arg1: this) {
            throw new Error("Method not implemented.");
        }
        static getResident(arg0: string) {
            throw new Error("Method not implemented.");
        }
        static close1(arg0: string) {
            throw new Error("Method not implemented.");
        }
        static delete(arg0: this) {
            throw new Error("Method not implemented.");
        }
        static getPersistUI(panelName: string):any {
            throw new Error("Method not implemented.");
        }
        static pushMutiPanel(arg0: string, arg1: this) {
            throw new Error("Method not implemented.");
        }
        static popMutiPanel(arg0: string) {
            throw new Error("Method not implemented.");
        }
        static create(arg0: string, arg1: null, arg2: (panel: { setCloseCB: (arg0: any) => void; show: (arg0: any, arg1: any) => void; }) => void) {
            throw new Error("Method not implemented.");
        }
        static getMutiPanels(arg0: string): any {
            throw new Error("Method not implemented.");
        }
        static addPersistUI(arg0: string, arg1: (panel: { show: (arg0: boolean) => void; }) => void) {
            throw new Error("Method not implemented.");
        }
        static getMutiPanel(arg0: string): any {
            throw new Error("Method not implemented.");
        }
        static clear() {
            throw new Error("Method not implemented.");
        }
        static getChild(arg0: cc.Node, guideName: any): any {
            throw new Error("Method not implemented.");
        }
        static coortrans(nodeNode: any, ShowUI: any) {
            throw new Error("Method not implemented.");
        }
        static open(arg0: string, arg1: any, arg2: any) {
            throw new Error("Method not implemented.");
        }
        static close(arg0: string) {
            throw new Error("Method not implemented.");
        }
        static get(arg0: string): any {
            throw new Error("Method not implemented.");
        }
        static remove(arg0: string) {
            throw new Error("Method not implemented.");
        }
        static add(arg0: string, arg1: this) {
            throw new Error("Method not implemented.");
        }
    };
    declare class DBManager {
        static fixedDataArr(packData:any, arg1: string, packageType: number): any[] {
            throw new Error("Method not implemented.");
        }
        static findDataArr(arg0: string, arg1: string, packageType: any): any {
            throw new Error("Method not implemented.");
        }
        static findData(arg0: string, arg1: string, itemID: any):any {
            throw new Error("Method not implemented.");
        }
        static findDatas(arg0: string, arg1: string, helpKey: any):any {
            throw new Error("Method not implemented.");
        }
        static getItem(compose: any): any {
            throw new Error("Method not implemented.");
        }
        static getItemDataByType(itemType: any): any[] {
            throw new Error("Method not implemented.");
        }
        static getLine(arg0: string, idx: number):any {
            throw new Error("Method not implemented.");
        }
        static getRecordNum(arg0: string): any {
            throw new Error("Method not implemented.");
        }
        static getData(arg0: string): any {
            throw new Error("Method not implemented.");
        }
        static getItemNew(itemID: any): any {
            throw new Error("Method not implemented.");
        }
    };
    declare class UITipManager {
        static clear() {
            throw new Error("Method not implemented.");
        }
        static getIndex():number {
            throw new Error("Method not implemented.");
        }
        static clearTip() {
            throw new Error("Method not implemented.");
        }
        static addTip(TYPE_PAOPAO_TXT: any, params: { speed: any; color?: any; txt?: any; items?: any; text?: any; }) {
            throw new Error("Method not implemented.");
        }
       
        static clearTips() {
            throw new Error("Method not implemented.");
        }
        static updateCallback(dt: any) {
            throw new Error("Method not implemented.");
        }
    };
    declare class UIPaoPaoTipManager {
        static addTip(params: { txt: any; color: any; parent: any; position: any; }) {
            throw new Error("Method not implemented.");
        }
        static updateCallback(dt: any) {
            throw new Error("Method not implemented.");
        }
    };
    declare class UICoinDropManager {
        static addDrop(COIN_EXP: any, diff: number) {
            throw new Error("Method not implemented.");
        }
        static updateCallback(dt: any) {
            throw new Error("Method not implemented.");
        }
    };
    declare class UICoinManager {
        static addPanel(arg0: this) {
            throw new Error("Method not implemented.");
        }
        static clearCoins() {
            throw new Error("Method not implemented.");
        }
    };
    declare class DigGolderManager {
        static getPlayerNum():number {
            throw new Error("Method not implemented.");
        }
        static setMap(arg0: this) {
            throw new Error("Method not implemented.");
        }
        static setMainPlayer(mainRoleID: any, mainPlayer: cc.Node): any {
            throw new Error("Method not implemented.");
        }
        static clear() {
            throw new Error("Method not implemented.");
        }
        static clearOtherPlayer() {
            throw new Error("Method not implemented.");
        }
        static addPlayer(roleId: any): any {
            throw new Error("Method not implemented.");
        }
        static removePlayer(roleId: any) {
            throw new Error("Method not implemented.");
        }
        static getPlayer(roleId: any): any {
            throw new Error("Method not implemented.");
        }
        static getMainPlayer(): any {
            throw new Error("Method not implemented.");
        }
    };
    declare class UIDlgTipManager {
        static clearTips() {
            throw new Error("Method not implemented.");
        }
        static addTip(DLG_ITEMGET: any, arg1: any) {
            throw new Error("Method not implemented.");
        }
    };
    declare class Sdk {
        static setprepayId(prepayId: any) {
            throw new Error("Method not implemented.");
        }
        static sizeMath(): any {
            throw new Error("Method not implemented.");
        }
    };
}