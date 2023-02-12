const {ccclass, property} = cc._decorator;
@ccclass
export default class GameScene extends cc.Component {
    @property({ type: cc.VideoPlayer, displayName: "videoPlayer", tooltip: "视频" })
    videoPlayer: cc.VideoPlayer = null;
    @property({ type: cc.Node, displayName: "background", tooltip: "背景" })
    background: cc.Node = null;
    @property({ type: cc.Node, displayName: "bottom1", tooltip: "跳过" })
    bottom1: cc.Node = null;
    @property({ type: cc.Node, displayName: "bottom5", tooltip: "点击开始" })
    bottom5: cc.Node = null;
    @property({ type: cc.Node, displayName: "DlgBoxNode", tooltip: "弹框" })
    DlgBoxNode: cc.Node = null;
    
    onLoad () {
        cc.game.setFrameRate(41);
        global.Proxys.ProxyGuJi.esta();
        cc.debug.setDisplayStats(false);
        global.Manager.UIManager.addPersistUI('UIProgress', null);

        global.Instance.MsgPools.register('guideInfo', null);
        global.Instance.MsgPools.register('updateGuide', null);
        global.Instance.MsgPools.register('getGuideReward', null);
        global.Instance.MsgPools.register('realNameAuth', null);//微信登陆下的实名认证
        global.Instance.MsgPools.register('wechatPrePay', null);//请求微信支付订单号
        global.Instance.MsgPools.register('wechatPayQuery', null);//微信支付状态查询
        global.Instance.MsgPools.register('zfbPrePay', null);//请求支付宝支付订单号
        global.Instance.MsgPools.register('zfbPayQuery', null);//支付宝支付状态查询
        global.Instance.MsgPools.register('createCode', null);//短信验证端口
        global.Instance.MsgPools.register('verifyCode', null);//手机号验证码是否正确，忘记密码用
        global.Instance.MsgPools.register('resetPassword', null);//重置密码


        let target: any = global.Module.MainPlayerData;
        global.Instance.MsgPools.register('playerAttrNtf', target.onPlayerAttrNtf.bind(target));
        global.Instance.MsgPools.register('changeName', target.onNameChanged.bind(target));
        global.Instance.MsgPools.register('changeSignature', target.onSignatureChanged.bind(target));
        global.Instance.MsgPools.register('UsePowerBarAddStamina', target.onUsePowerBarAddStamina.bind(target));

        target = global.Module.GameData;
        global.Instance.MsgPools.register('loginEnd', target.onLoginEnd.bind(target));
        global.Instance.MsgPools.register('changeClientData', target.onChangeClientDataRsp.bind(target));
        global.Instance.MsgPools.register('gmCode', target.onGmCommandRsp.bind(target));
        global.Instance.MsgPools.register('monthCard', target.onMonthCarddRsp.bind(target));
        global.Instance.MsgPools.register('monthCardDraw', target.onMonthCardDrawdRsp.bind(target));
        global.Instance.MsgPools.register('heartbeatInfo', target.onHeartbeatInfoRsp.bind(target));
        global.Instance.MsgPools.register('heartbeatCfgNtf', target.onHeartbeatCfgNtf.bind(target));
        global.Instance.MsgPools.register('closebbsNtf', target.onClosebbsNtf.bind(target));
        global.Instance.MsgPools.register('checkWord', target.onCheckWordRsp.bind(target))

        target = global.Proxys.ProxyReLogin;
        global.Instance.MsgPools.register('relogin', target.onReLogin.bind(target));

        target = global.Module.PackageData;
        global.Instance.MsgPools.register('packageItem', target.onItemListRsp.bind(target));
        global.Instance.MsgPools.register('deleteItem', target.onItemDeleteRsp.bind(target));
        global.Instance.MsgPools.register('updateItem', target.onItemUpdata.bind(target));
        global.Instance.MsgPools.register('itemFriend', target.onItemFriend.bind(target));
        global.Instance.MsgPools.register('itemInteract', target.onItemInteract.bind(target));
        global.Instance.MsgPools.register('itemInteractHistory', target.onItemInteractHistory.bind(target));
        global.Instance.MsgPools.register('playerMapItem', target.onplayerMapItem.bind(target));
     

        target = global.Module.MakeGoodsData;
        global.Instance.MsgPools.register('manufactureInfo', target.onManufactureInfoRsp.bind(target));//制作系统信息
        global.Instance.MsgPools.register('manufactureAction', target.onManufactureActionRsp.bind(target));//制作操作请求
        global.Instance.MsgPools.register('manufactureSpeedUp', target.onManufactureSpeedUpRsp.bind(target));//制作加速
        global.Instance.MsgPools.register('manufacturePickup', target.onManufacturePickupRsp.bind(target));//批量拾取制作物品

        target = global.Proxys.ProxyDigGold;
        global.Instance.MsgPools.register('listDigRoom', target.onListSceneRsp.bind(target));
        global.Instance.MsgPools.register('enterDigRoom', target.onJoinSceneRsp.bind(target));
        global.Instance.MsgPools.register('leaveDigRoom', target.onLeaveSceneRsp.bind(target));
        global.Instance.MsgPools.register('sceneMovement', target.onSceneMovementRsp.bind(target));
        global.Instance.MsgPools.register('sceneUseSkill', target.onSceneUseSkillRsp.bind(target));
        global.Instance.MsgPools.register('checkScene', target.onCheckSceneRsp.bind(target));

        global.Instance.MsgPools.register('joinSceneNtf', target.onJoinSceneNtf.bind(target));
        global.Instance.MsgPools.register('leaveSceneNtf', target.onLeaveSceneNtf.bind(target));
        global.Instance.MsgPools.register('sceneMovementNtf', target.onSceneMovementNtf.bind(target));
        global.Instance.MsgPools.register('sceneMapNtf', target.onSceneMapNtf.bind(target));
        global.Instance.MsgPools.register('sceneUseSkillNtf', target.onSceneUseSkillNtf.bind(target));

      

        target = global.Proxys.ProxyGuJi;//古籍
        global.Instance.MsgPools.register('robMap', target.onRobMapRsp.bind(target));//寻宝地图
        global.Instance.MsgPools.register('robMapNtf', target.onRobMapNtf.bind(target));//寻宝地图广播
        global.Instance.MsgPools.register('robUseSkill', target.onRobUseSkillRsp.bind(target));//寻宝使用技能
        global.Instance.MsgPools.register('robDistance', target.onRobDistanceRsp.bind(target));//寻宝距离
        global.Instance.MsgPools.register('robMonsterCollision', target.onRobMonsterCollisionRsp.bind(target));//怪物碰撞
        global.Instance.MsgPools.register('robNewTreasureNtf', target.onRobNewTreasureNtf.bind(target));//新大宝点推送
        global.Instance.MsgPools.register('robBombMonster', target.onRobBombMonsterRsp.bind(target));//消灭毒虫
        global.Instance.MsgPools.register('robLookItem', target.onRobLookItemRsp.bind(target));//挖去地貌表皮，漏出宝物， 开门也用这个协议
        global.Instance.MsgPools.register('robCompleteGuide', target.onRobCompleteGuideRsp.bind(target));//远近任务特殊接口处理
        
        target = global.Module.MainMapData;
        global.Instance.MsgPools.register('scenePosition', target.onScenePosRsp.bind(target));
        global.Instance.MsgPools.register('scenePosUpdate', target.onScenePosUpdateRsp.bind(target));
        global.Instance.MsgPools.register('obstaclesList', target.onObstaclesListRsp.bind(target));
        global.Instance.MsgPools.register('obstaclesOpenup', target.onObstaclesOpenupRsp.bind(target));

        target = global.Module.RankData;
        global.Instance.MsgPools.register('rankTop', target.onRoleRankCommonInfoNtf.bind(target));
        global.Instance.MsgPools.register('rankSelfLst', target.onRankSelfLstRsp.bind(target));
        global.Instance.MsgPools.register('friendSearch', target.onFriendSearchRsp.bind(target));
        global.Instance.MsgPools.register('friendRecommend', target.onfriendRecommend.bind(target));//推荐好友

        target = global.Module.FriendData;
        global.Instance.MsgPools.register('friendList', target.onFriendListRsp.bind(target));
        global.Instance.MsgPools.register('friendApply', target.onFriendApplyRsp.bind(target));
        global.Instance.MsgPools.register('friendRemove', target.onRemoveFriendRsp.bind(target));
        global.Instance.MsgPools.register('friendApprove', target.onFriendApproveRsp.bind(target));
        global.Instance.MsgPools.register('friendApplyNtf', target.onFriendApplyNtfRsp.bind(target));
        global.Instance.MsgPools.register('friendApproveNtf', target.onFriendApproveNtfRsp.bind(target));
        

        target = global.Module.PreciousRoomData;
        global.Instance.MsgPools.register('showTable', target.onShowTableRsp.bind(target));
        global.Instance.MsgPools.register('showTablePutOn', target.onShowTablePutOnRsp.bind(target));
        global.Instance.MsgPools.register('showTablePutDown', target.onShowTablePutDownRsp.bind(target));
        global.Instance.MsgPools.register('showTableMove', target.onShowTableMoveRsp.bind(target));
        global.Instance.MsgPools.register('showTablePrize', target.onShowTablePrize.bind(target));
        global.Instance.MsgPools.register('showTableInfo', target.onShowTableInfo.bind(target));
        global.Instance.MsgPools.register('antiqueCompose', target.onAntiqueCompose.bind(target));
        global.Instance.MsgPools.register('showTableMoney', target.onShowTableMoneyNtf.bind(target));
        global.Instance.MsgPools.register('showTableChangePos', target.onShowTableChangePosRsp.bind(target));
        global.Instance.MsgPools.register('antiqueSuit', target.onAntiqueSuitRsp.bind(target));
        global.Instance.MsgPools.register('showTableSupport', target.onShowTableSupportRsp.bind(target));
        global.Instance.MsgPools.register('showTableAutoPutDown', target.onShowTableAutoPutDownNtf.bind(target));

        global.Instance.MsgPools.register('getshowTableInfo', target.onGetShowTableRsp.bind(target));
        global.Instance.MsgPools.register('saveshowTableInfo', target.onSaveShowTableoRsp.bind(target));

        target = global.Module.IdentifyData;
        global.Instance.MsgPools.register('verifiedQueue', target.onVerifiedQueueRsp.bind(target));//获取自己的鉴定队列
        global.Instance.MsgPools.register('verifyingQueue', target.onVerifyingQueueRsp.bind(target));
        global.Instance.MsgPools.register('verifyDequeue', target.onVerifyDequeueRsp.bind(target));
        global.Instance.MsgPools.register('verifyEnqueue', target.onVerifyEnqueueRsp.bind(target));
        global.Instance.MsgPools.register('verifyItem', target.onVerifyItemRsp.bind(target));
        global.Instance.MsgPools.register('verifyLeave', target.onVerifyLeaveRsp.bind(target));
        global.Instance.MsgPools.register('verifySpeedup', target.onVerifySpeedupRsp.bind(target));

        target = global.Module.FarmData;
        global.Instance.MsgPools.register('farmList', target.onFarmListRsp.bind(target));//农场列表

        // global.Instance.MsgPools.register('ParkPlaceCrops',         target.onFarmPlaintRsp.bind(target));//农场种植
        // global.Instance.MsgPools.register('ParkHarvestCrops',        target.onParkHarvestPlantRsp.bind(target));//农场收获

        target = global.Module.FarmParkData;
        global.Instance.MsgPools.register('parkInfo', target.onParkInfoRsp.bind(target));//获取生态园信息
        global.Instance.MsgPools.register('parkPlacePlant', target.onParkPlacePlantRsp.bind(target));//放置植物
        global.Instance.MsgPools.register('parkPlaceTree', target.onParkPlacePlantRsp.bind(target));//放置树木

        global.Instance.MsgPools.register('ParkPlaceCrops', target.onParkPlacePlantRsp.bind(target));//农场种植
        global.Instance.MsgPools.register('ParkHarvestCrops', target.onParkHarvestPlantRsp.bind(target));//农场收获

        global.Instance.MsgPools.register('parkPlaceAnimal', target.onParkPlaceAnimalRsp.bind(target));//放置动物
        global.Instance.MsgPools.register('zooPlaceAnimal', target.onZooPlaceAnimalRsp.bind(target));//动物园防止珍惜动物

        global.Instance.MsgPools.register('parkPlaceFish', target.onParkPlaceFishRsp.bind(target));//鱼塘放置鱼
        global.Instance.MsgPools.register('parkHarvestPlant', target.onParkHarvestPlantRsp.bind(target));//收获植物
        global.Instance.MsgPools.register('ParkHarvestTree', target.onParkHarvestPlantRsp.bind(target));//收获树木
        global.Instance.MsgPools.register('parkHarvestFish', target.onParkHarvestFishRsp.bind(target));//收获鱼塘


        global.Instance.MsgPools.register('parkHarvestAnimal', target.onParkHarvestAnimalRsp.bind(target));//收获动物
        global.Instance.MsgPools.register('parkCell', target.onParkCellNtf.bind(target));//生态园地图变化
        global.Instance.MsgPools.register('parkFish', target.onParkFishNtf.bind(target));
        global.Instance.MsgPools.register('parkAnimal', target.onParkAnimalNtf.bind(target));//生态园动物变化推送
        global.Instance.MsgPools.register('parkAnimalMature', target.onParkAnimalMatureNtf.bind(target));//生态园动物成熟变化推送
        global.Instance.MsgPools.register('parkClearWitherPlant', target.onParkClearWitherPlantRsp.bind(target));//清除枯萎植物
        global.Instance.MsgPools.register('parkClearWitherAnimal', target.onParkClearWitherAnimalRsp.bind(target));//清除枯萎动物
        global.Instance.MsgPools.register('parkHoney', target.onParkHoneyRsp.bind(target));//领取蜂蜜
        global.Instance.MsgPools.register('parkDrawPrize', target.onParkDrawPrizeRsp.bind(target));//生态园结算
        global.Instance.MsgPools.register('parkAnimalAutoLeave', target.onParkAnimalAutoLeaveNtf.bind(target));//生态园动物自动离开


        global.Instance.MsgPools.register('ParkAnimalSpeedup', target.onSpeedupRsp.bind(target));//加速收获生态园动物
        global.Instance.MsgPools.register('ParkFishSpeedup', target.onSpeedupRsp.bind(target));//加速收获生态园鱼
        global.Instance.MsgPools.register('ParkPlantSpeedup', target.onSpeedupRsp.bind(target));//加速收获生态园庄家/植物/树木






        target = global.Module.TradeData;
        global.Instance.MsgPools.register('tradeTop', target.onTradeTop.bind(target));
        global.Instance.MsgPools.register('tradeEnqueue', target.onTradeEnqueue.bind(target));
        global.Instance.MsgPools.register('tradeDequeue', target.onTradeDequeue.bind(target));
        // global.Instance.MsgPools.register('tradeUse', target.onTradeUse.bind(target));
        global.Instance.MsgPools.register('tradeRole', target.onTradeRole.bind(target));
        global.Instance.MsgPools.register('stockList', target.onStockList.bind(target));
        global.Instance.MsgPools.register('tradeHistory', target.onTradeHistoryRsp.bind(target));
        global.Instance.MsgPools.register('tradeClose', target.onTradeCloseRsp.bind(target));
        global.Instance.MsgPools.register('tradeUseNtf', target.onTradeUseNtf.bind(target));
        global.Instance.MsgPools.register('rankStockChangeLst', target.onStockChangeLstNTF.bind(target));

        target = global.Module.UnionData;
        global.Instance.MsgPools.register('guildList', target.onGuildListRsp.bind(target));
        global.Instance.MsgPools.register('guildSearch', target.onGuildSearchRsp.bind(target));
        global.Instance.MsgPools.register('createGuild', target.onCreateGuildRsp.bind(target));
        global.Instance.MsgPools.register('guildApply', target.onGuildApplyRsp.bind(target));
        global.Instance.MsgPools.register('guildApplyNtf', target.onGuildApplyNtf.bind(target));
        global.Instance.MsgPools.register('guildApplyList', target.onGuildApplyListRsp.bind(target));
        global.Instance.MsgPools.register('guildApprove', target.onGuildApproveRsp.bind(target));
        global.Instance.MsgPools.register('guildApproveNtf', target.onGuildApproveNtf.bind(target));

        global.Instance.MsgPools.register('quitGuild', target.onQuitGuildRsp.bind(target));
        global.Instance.MsgPools.register('quildQuitNtf', target.onQuitGuildNtf.bind(target));
        global.Instance.MsgPools.register('guildAdjustPost', target.onGuildAdjustPostRsp.bind(target));
        global.Instance.MsgPools.register('guildKick', target.onGuildKickRsp.bind(target));
        global.Instance.MsgPools.register('guildModifySummary', target.onGuildModifySummaryRsp.bind(target));
        global.Instance.MsgPools.register('guildMemberList', target.onGuildMemberListRsp.bind(target));
        // global.Instance.MsgPools.register('guildLeaderBoard',   target.onGuildLeaderBoardRsp.bind(target));
        global.Instance.MsgPools.register('rankGuildLst', target.onGuildLstdRsp.bind(target));
        global.Instance.MsgPools.register('guildAttrClientNtf', target.onGuildAttrClientNtf.bind(target));

        target = global.Module.TaskData;
        global.Instance.MsgPools.register('taskList', target.onTaskLstRsp.bind(target));//请求任务列表
        global.Instance.MsgPools.register('taskReward', target.onTaskRewardRsp.bind(target));//领取任务奖励
        global.Instance.MsgPools.register('taskAccept', target.onTaskAcceptRsp.bind(target));//接受任务
        global.Instance.MsgPools.register('taskUpdateNtf', target.onTaskUpdateNtf.bind(target));//推送任务刷新
        global.Instance.MsgPools.register('taskFirst', target.onTaskFirstRsp.bind(target));//首次打开任务
        global.Instance.MsgPools.register('taskRemove', target.onTaskRemoveRsp.bind(target));//删除任务
        global.Instance.MsgPools.register('taskRefresh', target.onTaskRefreshRsp.bind(target));//刷新任务
        global.Instance.MsgPools.register('taskPoint', target.onTaskPointRsp.bind(target));//任务埋点
        global.Instance.MsgPools.register('taskFinish', target.onTaskFinishNtf.bind(target));//成长任务完成
        global.Instance.MsgPools.register('TaskStateList', target.onTaskStateListRsp.bind(target));//成长任务完成
        target = global.Module.UnionTaskData;
        global.Instance.MsgPools.register('guildTaskList', target.onGuildTaskListRsp.bind(target));
        global.Instance.MsgPools.register('guildTaskAccept', target.onGuildTaskAcceptRsp.bind(target));
        global.Instance.MsgPools.register('guildTaskUpdateNtf', target.onGuildTaskUpdateNtf.bind(target));
        global.Instance.MsgPools.register('guildTaskRemove', target.onGuildTaskRemoveRsp.bind(target));
        global.Instance.MsgPools.register('guildTaskSpeedUp', target.onGuildTaskSpeedUpRsp.bind(target));

        target = global.Module.GuildBattleData;
        global.Instance.MsgPools.register('signUpGuildBattle', target.onSignUpGuildBattleRsp.bind(target));
        global.Instance.MsgPools.register('guildBattleMatchSucessNtf', target.onGuildBattleMatchSucessNtf.bind(target));
        global.Instance.MsgPools.register('holdBattleBuild', target.onHoldBattleBuildRsp.bind(target));
        global.Instance.MsgPools.register('captureBattleBuild', target.onCaptureBattleBuildRsp.bind(target));
        global.Instance.MsgPools.register('battleBuildList', target.onBattleBuildListRsp.bind(target));
        global.Instance.MsgPools.register('battleHoldScoreNtf', target.onBattleHoldScoreNtf.bind(target));
        global.Instance.MsgPools.register('captureBattleBuildNtf', target.onCaptureBattleBuildNtf.bind(target));
        global.Instance.MsgPools.register('exitBattleBuildList', target.onExitBattleBuildListRsp.bind(target));
        global.Instance.MsgPools.register('battleOverNtf', target.onBattleOverNtf.bind(target));

        target = global.Module.CatchGoodsNetData;
        global.Instance.MsgPools.register('startBattleMeetEgg', target.onStartBattleMeetEggNtf.bind(target)); // 玩家开始接鸡蛋
        global.Instance.MsgPools.register('battleMeetEggDropNtf', target.onBattleMeetEggDropNtf.bind(target)); //飞行物产生
        global.Instance.MsgPools.register('battleChangeMeetX', target.onBattleChangeMeetXRsp.bind(target));//改变位置
        global.Instance.MsgPools.register('battleMeetDrop', target.onBattleMeetDropRsp.bind(target)); //接到了掉落物
        global.Instance.MsgPools.register('battleMeetScoreNtf', target.onBattleMeetScoreNtf.bind(target));// 积分变化推送
        global.Instance.MsgPools.register('exitBattleMeetEgg', target.onExitBattleMeetEggRsp.bind(target));// 退出接鸡蛋
        global.Instance.MsgPools.register('battleMeetEggStopNtf', target.onBattleMeetEggStopNtf.bind(target)); // 接鸡蛋结束
        global.Instance.MsgPools.register('battleBuildUpdateNtf', target.onBattleBuildUpdateNtf.bind(target)); // 战斗后建筑占领信息更新


        target = global.Module.CatchGoodsData;
        global.Instance.MsgPools.register('startMeetEgg', target.onStartMeetEggRsp.bind(target));  //玩家开始接鸡蛋
        global.Instance.MsgPools.register('meetEggDrop', target.onMeetEggDropNtf.bind(target));    //飞行物产生
        global.Instance.MsgPools.register('changeMeetX', target.onChangeMeetXRsp.bind(target));//改变位置
        global.Instance.MsgPools.register('exitMeetEgg', target.onExitMeetEggRsp.bind(target));  // 退出接鸡蛋
        global.Instance.MsgPools.register('meetDrop', target.onMeetDropRsp.bind(target)); //接到了掉落物
        global.Instance.MsgPools.register('meetEggStop', target.onMeetEggStopNtf.bind(target));// 接鸡蛋结束




        target = global.Module.HandBookData;
        global.Instance.MsgPools.register('bookAllType', target.onBookAllTypetRsp.bind(target));
        global.Instance.MsgPools.register('bookInfo', target.onBookInfoRsp.bind(target));
        global.Instance.MsgPools.register('bookUpdate', target.onBookUpdateNtf.bind(target));
        global.Instance.MsgPools.register('bookReward', target.onBookRewardRsp.bind(target));
        global.Instance.MsgPools.register('BookTurnPages', null);//成长任务图鉴完成翻页
        
        target = global.Module.CollectData;
        global.Instance.MsgPools.register('collectionList', target.onCollectionListRsp.bind(target));
        global.Instance.MsgPools.register('collectionUpdateNtf', target.onCollectionUpdateNtf.bind(target));
        global.Instance.MsgPools.register('collectionReward', target.onCollectionRewardRsp.bind(target));

        target = global.Module.ShopData;
        global.Instance.MsgPools.register('mallList', target.onShopListRsp.bind(target));
        global.Instance.MsgPools.register('mallBuy', target.onShopMallBuyRsp.bind(target));
        global.Instance.MsgPools.register('exchangeGoods', target.onExchangeGoodsyRsp.bind(target));

        target = global.Module.SummonData;
        global.Instance.MsgPools.register('summonInfo', target.onSummonInfoRsp.bind(target));
        global.Instance.MsgPools.register('SummonRetain', target.onSummonRetainRsp.bind(target));//是否保留精灵
        
        global.Instance.MsgPools.register('summon', target.onSummonRsp.bind(target));
        global.Instance.MsgPools.register('summonSend', target.onSummonSendRsp.bind(target));
        global.Instance.MsgPools.register('summonMailNtf', target.onSummonMailNtf.bind(target));
        global.Instance.MsgPools.register('summonMailReward', target.onSummonMailRewardRsp.bind(target));
        global.Instance.MsgPools.register('summonMailFirst', target.onSummonMailFirstRsp.bind(target));
        global.Instance.MsgPools.register('summonInvest', target.onSummonInvestRsp.bind(target));
        global.Instance.MsgPools.register('summonPickupInvestReward', target.onSummonInvestRewardRsp.bind(target));
        global.Instance.MsgPools.register('SummonPickupInvestRewardRsp', target.onSummonInvestRewardRsps.bind(target));
        global.Instance.MsgPools.register('summonFastMail', target.onSummonFastMailRsp.bind(target));//精灵外出一键返回
        global.Instance.MsgPools.register('SummonAllMailRewardReq', target.onSummonAllMailRewardRsp.bind(target));//领取所有精灵投资邮件
        

        target = global.Module.ChatData;
        global.Instance.MsgPools.register('chatSend', target.onChatSendRsp.bind(target));
        global.Instance.MsgPools.register('chatSendNtf', target.onChatSendNtf.bind(target));

        target = global.Module.TownNpcData;
        global.Instance.MsgPools.register('npcList', target.onNpcListRsp.bind(target));
        global.Instance.MsgPools.register('npcVisit', target.onNpcVisitRsp.bind(target));
        global.Instance.MsgPools.register('npcTriggerEvent', target.onNpcTriggerEventRsp.bind(target));
        global.Instance.MsgPools.register('npcOnPoetryInfo', target.onNpcOnPoetryInfoRsp.bind(target));
        global.Instance.MsgPools.register('npcOnPoetry', target.onNpcOnPoetryRsp.bind(target));
        global.Instance.MsgPools.register('npcOnThings', target.onNpcOnThingsRsp.bind(target));
        global.Instance.MsgPools.register('npcRaceHorses', target.onNpcRaceHorses.bind(target));//赌马下注
        global.Instance.MsgPools.register('npcRobbery', target.onNpcRobbery.bind(target));//小混混打劫


       
        



        let animaNum = JSON.parse(cc.sys.localStorage.getItem('animaNum'));
        if (animaNum == null)
            animaNum = 0;
        if (animaNum >= 2) {
            animaNum = 3;
            cc.sys.localStorage.setItem('animaNum', JSON.stringify(animaNum));
            this.btnClose();
        } else {
            animaNum++;
            this.background.active = true
            this.bottom5.active = true;
            cc.sys.localStorage.setItem('animaNum', JSON.stringify(animaNum));
        }
    }

    start () {
        
        
    }
    pause(){
        this.DlgBoxNode.active = true;
        this.videoPlayer.pause();
        
    };
    resume(){
        this.DlgBoxNode.active = false;
        this.videoPlayer.play();
    };
    playVideo() {
        let animaNum = JSON.parse(cc.sys.localStorage.getItem('animaNum'));
        if (animaNum == 2) {
            setTimeout(() => {
                if (this.bottom1)
                    this.bottom1.active = true;
            }, 3000);
        }
        
        this.bottom5.active = false;
        this.videoPlayer.node.active = true;
        this.background.active = false
        this.videoPlayer.play();
    }
    onVideoPlayerEvent(sender, event){
        if (event === cc.VideoPlayer.EventType.CLICKED) {
            if (this.videoPlayer.isPlaying()) {
                this.videoPlayer.pause();
            } else {
                this.videoPlayer.play();
            }
        } else if (event === 3) {
            this.btnClose();
        } 
    };
    btnClose() {
        global.CommonClass.Functions.loadScene("LoginScene", null);
    }
    // update (dt) {}
}
