

const {ccclass, property} = cc._decorator;
let date = new Array(
	{name:'createAccount', 		sendType:'CreateAccountReq',  	sendID:0x430A, 	receiveType:'CreateAccountRsp', 	receiveID:0x430b, 	pbFile:'LoginpbFile', 		package:'Protocols'},
	{name:'loginNtf', 			sendType:'',  					sendID:0, 		receiveType:'RoleLoginNtf', 		receiveID:0x430c, 	pbFile:'LoginpbFile', 		package:'Protocols'},
	{name:'login', 				sendType:'UserLoginReq',  		sendID:0x4301, 	receiveType:'UserLoginRsp', 		receiveID:0x4302, 	pbFile:'LoginpbFile', 		package:'Protocols'},
	{name:'loginEnd', 			sendType:'',  					sendID:0, 		receiveType:'PlayerAttrClientNtfFinish',	receiveID:0x0907, 	pbFile:'LoginpbFile', 		package:'Protocols'},
	{name:'realNameAuth', 		sendType:'RealNameAuthReq',  	sendID:0x4312, 	receiveType:'RealNameAuthRsp', 	receiveID:0x4313, 	pbFile:'LoginpbFile', 		package:'Protocols'},
	{name:'relogin', 			sendType:'ReloginReq',  		sendID:0x430e, 	receiveType:'ReloginRsp', 			receiveID:0x430f, 	pbFile:'LoginpbFile', 		package:'Protocols'},
	//{name:'tickOff', 			sendType:'',  					sendID:0, 		receiveType:'PlayerAttrClientNtf', 	receiveID:0x410b, 	pbFile:'LoginpbFile', 		package:'Protocols'},
	{name:'playerAttrNtf', 		sendType:'',  					sendID:0, 		receiveType:'PlayerAttrClientNtf', 	receiveID:0x903, 	pbFile:'LoginpbFile', 		package:'Protocols'},
	{name:'heartbeatCfgNtf', 	sendType:'',  					sendID:0, 		receiveType:'HeartbeatCfgNtf', 		receiveID:0x4109, 	pbFile:'LoginpbFile', 		package:'Protocols'},
	{name:'heartbeatInfo', 		sendType:'HeartbeatInfo',  		sendID:0x410a, 	receiveType:'HeartbeatInfoRsp', 	receiveID:0x410c, 	pbFile:'LoginpbFile', 		package:'Protocols'},
	{name:'closebbsNtf', 		sendType:'',  					sendID:0, 		receiveType:'ClosebbsNtf', 			receiveID:0x4310, 	pbFile:'LoginpbFile', 		package:'Protocols'},
	{name:'createCode', 		sendType:'CreateSmsCodeReq',  	sendID:0X4303, 	receiveType:'CreateSmsCodeRsp', 	receiveID:0X4304, 	pbFile:'LoginpbFile', 		package:'Protocols'},
	{name:'verifyCode', 		sendType:'VerifySmsCodeReq',  	sendID:0X4305, 	receiveType:'VerifySmsCodeRsp', 	receiveID:0X4306, 	pbFile:'LoginpbFile', 		package:'Protocols'},
	{name:'resetPassword', 		sendType:'ResetPasswordReq',  	sendID:0X4307, 	receiveType:'ResetPasswordRsp', 	receiveID:0X4308, 	pbFile:'LoginpbFile', 		package:'Protocols'},



	{name:'wechatPrePay', 		sendType:'WechatPrePayReq',  	sendID:0x2801, 	receiveType:'WechatPrePayRsp', 	receiveID:0x2802, 	pbFile:'WxpaypbFile', 		package:'Protocols'},
	{name:'wechatPayQuery', 		sendType:'WechatPayQueryReq',  	sendID:0x2803, 	receiveType:'WechatPayQueryRsp', 	receiveID:0x2804, 	pbFile:'WxpaypbFile', 		package:'Protocols'},

	{name:'zfbPrePay', 		sendType:'AliPayPreReq',  	sendID:0x2805, 	receiveType:'AliPayPreRsp', 	receiveID:0x2806, 	pbFile:'AlipaypbFile', 		package:'Protocols'},
	{name:'zfbPayQuery', 		sendType:'AliPayQueryReq',  	sendID:0x2807, 	receiveType:'AliPayQueryRsp', 	receiveID:0x2808, 	pbFile:'AlipaypbFile', 		package:'Protocols'},


	{name:'packageItem', 		sendType:'ItemListReq',  		sendID:0x4701, 	receiveType:'ItemListRsp', 			receiveID:0x4702, 	pbFile:'ItempbFile', 			package:'Protocols'},
	{name:'deleteItem', 		sendType:'ItemRemoveReq',  		sendID:0x4705, 	receiveType:'ItemRemoveRsp', 		receiveID:0x4706, 	pbFile:'ItempbFile', 			package:'Protocols'},
	{name:'updateItem', 		sendType:'',  					sendID:0, 		receiveType:'ItemUpdateNtf', 		receiveID:0x4709, 	pbFile:'ItempbFile', 			package:'Protocols'},
	{name:'itemFriend', 		sendType:'ItemFriendReq',  		sendID:0x4710, 	receiveType:'ItemFriendRsp', 		receiveID:0x4711, 	pbFile:'ItempbFile', 			package:'Protocols'},
	{name:'itemInteract', 		sendType:'ItemInteractReq',  	sendID:0x4707, 	receiveType:'ItemInteractRsp', 		receiveID:0x4708, 	pbFile:'ItempbFile', 			package:'Protocols'},
	{name:'itemInteractHistory', sendType:'ItemInteractHistoryReq',  sendID:0x4712, 	receiveType:'ItemInteractHistoryRsp', receiveID:0x4713, 	pbFile:'ItempbFile', 			package:'Protocols'},

	{name:'playerMapItem', 		sendType:'PlayerMapItemReq',  	sendID:0x4714, 	receiveType:'PlayerMapItemRsp', 		receiveID:0x4715, 	pbFile:'ItempbFile', 			package:'Protocols'},


	{name:'manufactureAction', 	sendType:'ManufactureActionReq',	 sendID:0x5d20, receiveType:'ManufactureActionRsp', 	receiveID:0x5d21, 	pbFile:'ManufacturepbFile', 	package:'Protocols'},
	{name:'manufactureInfo', 	sendType:'ManufactureInfoReq',  	 sendID:0x5d01, receiveType:'ManufactureInfoRsp', 		receiveID:0x5d02, 	pbFile:'ManufacturepbFile', 	package:'Protocols'},
	{name:'manufactureSpeedUp', sendType:'ManufactureSpeedupReq',	 sendID:0x5d26, receiveType:'ManufactureSpeedupRsp',	receiveID:0x5d27, 	pbFile:'ManufacturepbFile', 	package:'Protocols'},
	{name:'manufacturePickup',  sendType:'ManufactureBatchPickupReq',sendID:0x5d28, receiveType:'ManufactureBatchPickupRsp',receiveID:0x5d29, 	pbFile:'ManufacturepbFile', 	package:'Protocols'},

	{name:'listDigRoom', 		sendType:'ListSceneReq',  		sendID:0x4201, 	receiveType:'ListSceneRsp', 		receiveID:0x4202, 	pbFile:'ScenepbFile', 		package:'Protocols'},
	{name:'enterDigRoom', 		sendType:'JoinSceneReq',  		sendID:0x4207, 	receiveType:'JoinSceneRsp', 		receiveID:0x4208, 	pbFile:'ScenepbFile', 		package:'Protocols'},
	{name:'leaveDigRoom', 		sendType:'LeaveSceneReq',  		sendID:0x420a, 	receiveType:'LeaveSceneRsp', 		receiveID:0x420b, 	pbFile:'ScenepbFile', 		package:'Protocols'},
	{name:'sceneMovement', 		sendType:'SceneMovementReq',  	sendID:0x4223, 	receiveType:'SceneMovementRsp', 	receiveID:0x4224, 	pbFile:'ScenepbFile', 		package:'Protocols'},
	{name:'sceneUseSkill', 		sendType:'SceneUseSkillReq',  	sendID:0x4220, 	receiveType:'SceneUseSkillRsp', 	receiveID:0x4221, 	pbFile:'ScenepbFile', 		package:'Protocols'},
	{name:'joinSceneNtf', 		sendType:'',  					sendID:0, 		receiveType:'JoinSceneNtf', 		receiveID:0x4209, 	pbFile:'ScenepbFile', 		package:'Protocols'},
	{name:'leaveSceneNtf', 		sendType:'',  					sendID:0, 		receiveType:'LeaveSceneNtf', 		receiveID:0x420c, 	pbFile:'ScenepbFile', 		package:'Protocols'},
	{name:'sceneMovementNtf', 	sendType:'',  					sendID:0, 		receiveType:'SceneMovementNtf', 	receiveID:0x4225, 	pbFile:'ScenepbFile', 		package:'Protocols'},
	{name:'sceneMapNtf', 		sendType:'',  					sendID:0, 		receiveType:'SceneMapNtf', 			receiveID:0x4267, 	pbFile:'ScenepbFile', 		package:'Protocols'},
	{name:'sceneUseSkillNtf', 	sendType:'',  					sendID:0, 		receiveType:'SceneUseSkillNtf', 	receiveID:0x4222, 	pbFile:'ScenepbFile', 		package:'Protocols'},
	{name:'scenePosition', 		sendType:'ScenePosReq',  		sendID:0x4292, 	receiveType:'ScenePosRsp', 			receiveID:0x4293, 	pbFile:'ScenepbFile', 		package:'Protocols'},
	{name:'scenePosUpdate', 	sendType:'ScenePosUpdateReq',  	sendID:0x4294, 	receiveType:'ScenePosUpdateRsp', 	receiveID:0x4295, 	pbFile:'ScenepbFile', 		package:'Protocols'},
	{name:'checkScene', 		sendType:'CheckSceneReq',  		sendID:0x4232, 	receiveType:'CheckSceneRsp', 		receiveID:0x4233, 	pbFile:'ScenepbFile', 		package:'Protocols'},

	{name:'robMap', 			sendType:'RobMapReq',  			sendID:0x8101, 	receiveType:'RobMapRsp', 			receiveID:0x8102, 	pbFile:'RobpbFile', 			package:'Protocols'},
	{name:'robMapNtf', 			sendType:'',  					sendID:0, 		receiveType:'RobMapNtf', 			receiveID:0x8103, 	pbFile:'RobpbFile', 			package:'Protocols'},
	{name:'robNewTreasureNtf', 	sendType:'',  					sendID:0, 		receiveType:'RobNewTreasureNtf', 	receiveID:0x8109, 	pbFile:'RobpbFile', 			package:'Protocols'},
	{name:'robUseSkill', 		sendType:'RobUseSkillReq',  	sendID:0x8104, 	receiveType:'RobUseSkillRsp', 		receiveID:0x8105, 	pbFile:'RobpbFile', 			package:'Protocols'},
	{name:'robDistance', 		sendType:'',  					sendID:0, 		receiveType:'RobDistanceNtf',		receiveID:0x8106, 	pbFile:'RobpbFile', 			package:'Protocols'},
	{name:'robMonsterCollision',sendType:'RobMonsterOnCollisionReq',sendID:0x8107,receiveType:'RobMonsterOnCollisionRsp',receiveID:0x8108,pbFile:'RobpbFile', 		package:'Protocols'},
	{name:'robBombMonster',		sendType:'RobBombMonsterReq',	sendID:0x8118,	receiveType:'RobBombMonsterRsp',	receiveID:0x8119,	pbFile:'RobpbFile', 			package:'Protocols'},
	{name:'robLookItem',		sendType:'RobLookItemReq',		sendID:0x8127,	receiveType:'RobLookItemRsp',		receiveID:0x8128,	pbFile:'RobpbFile', 			package:'Protocols'},
	{name:'robCompleteGuide',	type:'远近任务特殊接口处理',	sendType:'RobCompleteGuideReq',		sendID:0x8129,	receiveType:'RobCompleteGuideRsp',		receiveID:0x8130,	pbFile:'RobpbFile', 			package:'Protocols'},

	{name:'rankTop', 			sendType:'RankTopNReq',  		sendID:0x7c01, 	receiveType:'RoleRankCommonInfoNtf',receiveID:0x7c05, 	pbFile:'LeaderboardpbFile', 	package:'Protocols'},
	{name:'rankStockChangeLst', sendType:'RankTopNReq',  		sendID:0x7c01, 	receiveType:'RankStockInfoNtf',		receiveID:0x7c0c, 	pbFile:'LeaderboardpbFile', 	package:'Protocols'},
	{name:'friendList', 		sendType:'FriendListReq',  		sendID:0x6801, 	receiveType:'FriendListRsp',		receiveID:0x6802, 	pbFile:'FriendpbFile', 		package:'Protocols'},
	{name:'friendApply', 		sendType:'FriendApplyReq',  	sendID:0x680b, 	receiveType:'FriendApplyRsp',		receiveID:0x680c, 	pbFile:'FriendpbFile', 		package:'Protocols'},
	{name:'friendRemove', 		sendType:'RemoveFriendReq',  	sendID:0x6809, 	receiveType:'RemoveFriendRsp',		receiveID:0x680a, 	pbFile:'FriendpbFile', 		package:'Protocols'},
	{name:'friendApprove', 		sendType:'FriendApproveReq',  	sendID:0x680d, 	receiveType:'FriendApproveRsp',		receiveID:0x680e, 	pbFile:'FriendpbFile', 		package:'Protocols'},
	{name:'friendApplyNtf', 	sendType:'',  					sendID:0, 		receiveType:'FriendApplyNtf',		receiveID:0x6815, 	pbFile:'FriendpbFile', 		package:'Protocols'},
	{name:'friendApproveNtf', 	sendType:'',  					sendID:0, 		receiveType:'FriendApproveNtf',		receiveID:0x6827, 	pbFile:'FriendpbFile', 		package:'Protocols'},
	{name:'friendSearch', 		sendType:'FriendSearchReq',  	sendID:0x6810, 	receiveType:'FriendSearchRsp',		receiveID:0x6811, 	pbFile:'FriendpbFile', 		package:'Protocols'},
	{name:'friendRecommend',    type:'好友推荐',  sendType:'FriendRecommendReq',  		sendID:0x6812, 	receiveType:'FriendRecommendRsp',		receiveID:0x6813, 	pbFile:'FriendpbFile', 		package:'Protocols'},

	{name:'verifiedQueue', 		type:'获取自己的鉴定队列',sendType:'VerifiedQueueReq',  	sendID:0x4296, 	receiveType:'VerifiedQueueRsp',		receiveID:0x4297, 	pbFile:'VerifypbFile', 		package:'Protocols'},
	{name:'verifyingQueue', 	sendType:'VerifyingQueueReq',  	sendID:0x4298, 	receiveType:'VerifyingQueueRsp',	receiveID:0x4299, 	pbFile:'VerifypbFile', 		package:'Protocols'},
	{name:'verifyEnqueue', 		sendType:'VerifyEnqueueReq',  	sendID:0x8116, 	receiveType:'VerifyEnqueueRsp',		receiveID:0x8117, 	pbFile:'VerifypbFile', 		package:'Protocols'},
	{name:'verifyDequeue', 		sendType:'VerifyDequeueReq',  	sendID:0x429a, 	receiveType:'VerifyDequeueRsp',		receiveID:0x429b, 	pbFile:'VerifypbFile', 		package:'Protocols'},
	{name:'verifyItem', 		sendType:'VerifyItemReq',  		sendID:0x429c, 	receiveType:'VerifyItemRsp',		receiveID:0x429e, 	pbFile:'VerifypbFile', 		package:'Protocols'},
	{name:'verifyLeave', 		sendType:'VerifyLeaveReq',  	sendID:0x8112, 	receiveType:'VerifyLeaveRsp',		receiveID:0x8113, 	pbFile:'VerifypbFile', 		package:'Protocols'},
	{name:'verifySpeedup', 		sendType:'VerifySpeedupReq',  	sendID:0x8122, 	receiveType:'VerifySpeedupRsp',		receiveID:0x8123, 	pbFile:'VerifypbFile', 		package:'Protocols'},
	
	{name:'showTable', 			type:'获取展厅',  sendType:'ShowTableReq',  	 sendID:0x8201, 	receiveType:'ShowTableRsp',			receiveID:0x8202, 	pbFile:'ShowTablepbFile', 	package:'Protocols'},
	{name:'showTablePutOn', 	type:'放入展厅',  sendType:'ShowTablePutOnReq',  	sendID:0x8203, 	receiveType:'ShowTablePutOnRsp',	receiveID:0x8204, 	pbFile:'ShowTablepbFile', 	package:'Protocols'},
	{name:'showTablePutDown', 	type:'从展厅拿下来',  sendType:'ShowTablePutDownReq', sendID:0x8205, 	receiveType:'ShowTablePutDownRsp',	receiveID:0x8206, 	pbFile:'ShowTablepbFile', 	package:'Protocols'},
	{name:'showTableMove', 		type:'物品移动位置',  sendType:'ShowTableMoveReq',  	sendID:0x8207, 	receiveType:'ShowTableMoveRsp',		receiveID:0x8208, 	pbFile:'ShowTablepbFile', 	package:'Protocols'},
	{name:'showTablePrize', 	type:'',  sendType:'ShowTableDrawPrizeReq',sendID:0x8209, receiveType:'ShowTableDrawPrizeRsp',receiveID:0x820a, 	pbFile:'ShowTablepbFile', 	package:'Protocols'},
	{name:'showTableInfo', 		type:'',  sendType:'ShowTableDrawInfoReq',sendID:0x820b,  receiveType:'ShowTableDrawInfoRsp', receiveID:0x820c, 	pbFile:'ShowTablepbFile', 	package:'Protocols'},
	{name:'antiqueCompose', 	type:'合成',  sendType:'AntiqueComposeReq',	sendID:0x820d,  receiveType:'AntiqueComposeRsp', 	receiveID:0x820e, 	pbFile:'ShowTablepbFile', 	package:'Protocols'},
	{name:'showTableMoney', 	type:'',  sendType:'ShowTableMoneyReq',	sendID:0x8211,  receiveType:'ShowTableMoneyNtf', 	receiveID:0x8210, 	pbFile:'ShowTablepbFile', 	package:'Protocols'},
	{name:'showTableChangePos', type:'展厅物品交换位置',  sendType:'ShowTableChangePositionReq',sendID:0x8110, receiveType:'ShowTableChangePositionRsp', receiveID:0x8111, pbFile:'ShowTablepbFile', package:'Protocols'},
	{name:'antiqueSuit', 		type:'展厅套装',  sendType:'AntiqueSuitReq',		sendID:0x8114, receiveType:'AntiqueSuitRsp', 		receiveID:0x8115, 	pbFile:'ShowTablepbFile', package:'Protocols'},
	{name:'showTableSupport', 	type:'展厅点赞',  sendType:'ShowTableSupportReq',	sendID:0x8124, receiveType:'ShowTableSupportRsp', 	receiveID:0x8125, 	pbFile:'ShowTablepbFile', package:'Protocols'},
	{name:'showTableAutoPutDown',type:'展厅自动下架', sendType:'',					sendID:0, 	   receiveType:'ShowTableAutoPutDownNtf', receiveID:0x8126, 	pbFile:'ShowTablepbFile', package:'Protocols'},
	{name:'getshowTableInfo', 	type:'获取展厅货架信息',  sendType:'GetShowTableInfoReq',  		sendID:0x8212, 	receiveType:'GetShowTableInfoRsp',			receiveID:0x8213, 	pbFile:'ShowTablepbFile', 	package:'Protocols'},
	{name:'saveshowTableInfo', 	type:'保存展厅货架信息',  sendType:'SaveShowTableInfoReq',  		sendID:0x8214, 	receiveType:'SaveShowTableInfoRsp',			receiveID:0x8215, 	pbFile:'ShowTablepbFile', 	package:'Protocols'},




	{name:'parkInfo',		   type:'获取生态园信息',	sendType:'ParkInfoReq',			sendID:0x2000, 	receiveType:'ParkInfoRsp',			receiveID:0x2001, 	pbFile:'ParkpbFile', 			package:'Protocols'},
	{name:'zooPlaceAnimal',   type:'动物园放置动物',	sendType:'ZooPlaceAnimalReq',	sendID:0x2014, 	receiveType:'ZooPlaceAnimalRsp',	receiveID:0x2015, 	pbFile:'ParkpbFile', 			package:'Protocols'},

	{name: 'parkPlaceFish', type: '生态园放置鱼', sendType: 'ParkPlaceFishReq', sendID: 0x2020, receiveType: 'ParkPlaceFishRsp', receiveID: 0x2021, pbFile: 'ParkpbFile', package: 'Protocols' },
	{name: 'parkHarvestFish', type: '生态园收获鱼', sendType: 'ParkHarvestFishReq', sendID: 0x2022, receiveType: 'ParkHarvestFishRsp', receiveID: 0x2023, pbFile: 'ParkpbFile', package: 'Protocols' },

	{name:'parkPlaceTree',	   type:'生态园放置树木',	sendType:'ParkPlaceTreeReq',	sendID:0x2042, 	receiveType:'ParkPlaceTreeRsp',	receiveID:0x2043, 	pbFile:'ParkpbFile', 			package:'Protocols'},
	{name:'ParkHarvestTree',   type:'生态园收获树木',	sendType:'ParkHarvestTreeReq',	sendID:0x2044, 	receiveType:'ParkHarvestTreeRsp',	receiveID:0x2045, 	pbFile:'ParkpbFile', 			package:'Protocols'},
	{name:'ParkPlaceCrops',    type:'生态园放置庄稼',	sendType:'ParkPlaceCropsReq',   sendID: 0x2046, 	receiveType:'ParkPlaceCropsRsp',	receiveID: 0x2047, 	pbFile:'ParkpbFile', 		package:'Protocols'},
	{name:'ParkHarvestCrops',  type:'生态园收获庄稼',	sendType:'ParkHarvestCropsReq', sendID: 0x2048, 	receiveType:'ParkHarvestCropsRsp',	receiveID: 0x2049, 	pbFile:'ParkpbFile', 		package:'Protocols'},

	{name:'parkPlacePlant',	   type:'生态园放置植物',	sendType:'ParkPlacePlantReq',	sendID:0x2002, 	receiveType:'ParkPlacePlantRsp',	receiveID:0x2003, 	pbFile:'ParkpbFile', 			package:'Protocols'},
	{name: 'parkHarvestPlant', type: '生态园收获植物', sendType: 'ParkHarvestPlantReq', sendID: 0x2006, receiveType: 'ParkHarvestPlantRsp', receiveID: 0x2007, pbFile: 'ParkpbFile', package: 'Protocols' },
	{name:'parkPlaceAnimal',   type:'生态园放置动物',	sendType:'ParkPlaceAnimalReq',	sendID:0x2004, 	receiveType:'ParkPlaceAnimalRsp',	receiveID:0x2005, 	pbFile:'ParkpbFile', 			package:'Protocols'},
	{name: 'parkHarvestAnimal', type: '生态园收获动物', sendType: 'ParkHarvestAnimalReq', sendID: 0x2008, receiveType: 'ParkHarvestAnimalRsp', receiveID: 0x2009, pbFile: 'ParkpbFile', package: 'Protocols' },
	{name: 'parkCell', type: '生态园地图推送', sendType: '', sendID: 0, receiveType: 'ParkCellNtf', receiveID: 0x2010, pbFile: 'ParkpbFile', package: 'Protocols' },
	{name: 'parkAnimal', type: '生态园动物推送', sendType: '', sendID: 0, receiveType: 'ParkAnimalNtf', receiveID: 0x2011, pbFile: 'ParkpbFile', package: 'Protocols' },
	{name: 'parkAnimalMature', type: '动物成熟变化推送', sendType: '', sendID: 0, receiveType: 'ParkAnimalMatureNtf', receiveID: 0x2012, pbFile: 'ParkpbFile', package: 'Protocols' },
	{name: 'parkClearWitherPlant', type: '清除枯萎植物', sendType: 'ParkClearWitherPlantReq', sendID: 0x2025, receiveType: 'ParkClearWitherPlantRsp', receiveID: 0x2026, pbFile: 'ParkpbFile', package: 'Protocols' },
	{name: 'parkClearWitherAnimal', type: '清除枯萎动物', sendType: 'ParkClearWitherAnimalReq', sendID: 0x2027, receiveType: 'ParkClearWitherAnimalRsp', receiveID: 0x2028, pbFile: 'ParkpbFile', package: 'Protocols' },
	
	{name:'ParkAnimalSpeedup',	   type:'加速收获生态园动物',	sendType:'ParkAnimalSpeedupReq',	sendID:0x2050, 	receiveType:'ParkAnimalSpeedupRsp',	receiveID:0x2051, 	pbFile:'ParkpbFile', 			package:'Protocols'},
	{name:'ParkFishSpeedup',	   type:'加速收获生态园鱼',	sendType:'ParkFishSpeedupReq',	sendID:0x2052, 	receiveType:'ParkFishSpeedupRsp',	receiveID:0x2053, 	pbFile:'ParkpbFile', 			package:'Protocols'},
	{name:'ParkPlantSpeedup',	   type:'加速收获庄家/植物/树木',	sendType:'ParkPlantSpeedupReq',	sendID:0x2054, 	receiveType:'ParkPlantSpeedupRsp',	receiveID:0x2055, 	pbFile:'ParkpbFile', 			package:'Protocols'},








	{name: 'parkFish', type: '生态园鱼塘的鱼变化推送', sendType: '', sendID: 0, receiveType: 'ParkFishNtf', receiveID: 0x2024, pbFile: 'ParkpbFile', package: 'Protocols' },
	{name: 'parkHoney', type: ' 领取蜂蜜', sendType: 'ParkDrawHoneyReq', sendID: 0x2029, receiveType: 'ParkDrawHoneyRsp', receiveID: 0x2030, pbFile: 'ParkpbFile', package: 'Protocols' },
	{name: 'parkAnimalAutoLeave', type: '生态园动物自动离开', sendType: '', sendID: 0, receiveType: 'ParkAnimalAutoLeaveNtf', receiveID: 0x2035, pbFile: 'ParkpbFile', package: 'Protocols' },
	{name: 'parkDrawPrize', type: '生态园结算', sendType: 'ParkDrawPrizeReq', sendID: 0x2033, receiveType: 'ParkDrawPrizeRsp', receiveID: 0x2034, pbFile: 'ParkpbFile', package: 'Protocols' },

	{name:'updateGuide', 		sendType:'UpdateGuideProcessReq',sendID:0x5207, 	receiveType:'UpdateGuideProcessRsp',receiveID:0x5208, 	pbFile:'GuidepbFile', 	package:'Protocols'},
	{name:'guideInfo', 			sendType:'GuideInfoReq',  		 sendID:0x5209, 	receiveType:'GuideInfoRsp',			receiveID:0x520a, 	pbFile:'GuidepbFile', 	package:'Protocols'},
	{name:'getGuideReward', 	sendType:'GetGuideRewardReq',  	 sendID:0x520c, 	receiveType:'GetGuideRewardRsp',	receiveID:0x520d, 	pbFile:'GuidepbFile', 	package:'Protocols'},

	{name:'tradeTop', 			sendType:'TradeTopNReq',  		 sendID:0x8301, 	receiveType:'TradeTopNRsp',			receiveID:0x8302, 	pbFile:'TradepbFile', 	package:'Protocols'},
	{name:'tradeEnqueue', 		sendType:'TradeEnqueueReq',  	 sendID:0x8303, 	receiveType:'TradeEnqueueRsp',		receiveID:0x8304, 	pbFile:'TradepbFile', 	package:'Protocols'},
	{name:'tradeDequeue', 		sendType:'TradeDequeueReq',  	 sendID:0x8305, 	receiveType:'TradeDequeueRsp',		receiveID:0x8306, 	pbFile:'TradepbFile', 	package:'Protocols'},
	// {name:'tradeUse', 			sendType:'TradeUseReq',  	 	 sendID:0x8307, 	receiveType:'TradeUseRsp',			receiveID:0x8308, 	pbFile:'TradepbFile', 	package:'Protocols'},
	{name:'tradeRole', 			sendType:'TradeRoleReq',  	 	 sendID:0x8309, 	receiveType:'TradeRoleRsp',			receiveID:0x830a, 	pbFile:'TradepbFile', 	package:'Protocols'},
	{name:'stockList', 			sendType:'StockListReq',  	 	 sendID:0x830b, 	receiveType:'StockListRsp',			receiveID:0x830c, 	pbFile:'TradepbFile', 	package:'Protocols'},
	{name:'tradeHistory', 	    sendType:'TradeHistoryReq',  	 sendID:0x830d, 	receiveType:'TradeHistoryRsp',		receiveID:0x830e, 	pbFile:'TradepbFile', 	package:'Protocols'},
	{name:'tradeClose', 	    sendType:'TradeCloseReq',  	 	 sendID:0x8311, 	receiveType:'TradeCloseRsp',		receiveID:0x8312, 	pbFile:'TradepbFile', 	package:'Protocols'},
	{name:'tradeUseNtf', 	    sendType:'',  	 	 			 sendID:0, 			receiveType:'TradeUseNtf',			receiveID:0x8310, 	pbFile:'TradepbFile', 	package:'Protocols'},

	{name:'guildList', 		    sendType:'GuildListReq',  	 	 sendID:0x6B1c, 	receiveType:'GuildListRsp',			receiveID:0x6B1d, 	pbFile:'GuildpbFile', 	package:'Protocols'},
	{name:'guildSearch', 		sendType:'GuildSearchReq',  	 sendID:0x6B05, 	receiveType:'GuildSearchRsp',		receiveID:0x6B06, 	pbFile:'GuildpbFile', 	package:'Protocols'},
	{name:'createGuild', 		sendType:'CreateGuildReq',  	 sendID:0x6B01, 	receiveType:'CreateGuildRsp',		receiveID:0x6B02, 	pbFile:'GuildpbFile', 	package:'Protocols'},
	{name:'guildApply', 		sendType:'GuildApplyReq',  	 	 sendID:0x6B07, 	receiveType:'GuildApplyRsp',		receiveID:0x6B08, 	pbFile:'GuildpbFile', 	package:'Protocols'},
	{name:'guildApplyNtf', 		sendType:'',  	 		 		 sendID:0, 			receiveType:'GuildApplyNtf',		receiveID:0x6B09, 	pbFile:'GuildpbFile', 	package:'Protocols'},
	{name:'guildApplyList', 	sendType:'GuildApplyListReq',  	 sendID:0x6B1a, 	receiveType:'GuildApplyListRsp',	receiveID:0x6B1b, 	pbFile:'GuildpbFile', 	package:'Protocols'},
	{name:'guildApprove', 		sendType:'GuildApproveReq',  	 sendID:0x6B0a, 	receiveType:'GuildApproveRsp',		receiveID:0x6B0b, 	pbFile:'GuildpbFile', 	package:'Protocols'},
	{name:'guildApproveNtf', 	sendType:'',  	 		 		 sendID:0, 			receiveType:'GuildApproveNtf',		receiveID:0x6B0c, 	pbFile:'GuildpbFile', 	package:'Protocols'},
	{name:'quitGuild', 			sendType:'QuitGuildReq',  	 	 sendID:0x6B15, 	receiveType:'QuitGuildRsp',			receiveID:0x6B16, 	pbFile:'GuildpbFile', 	package:'Protocols'},
	{name:'guildKick', 			sendType:'GuildKickReq',  	 	 sendID:0x6B18, 	receiveType:'GuildKickRsp',			receiveID:0x6B19, 	pbFile:'GuildpbFile', 	package:'Protocols'},
	{name:'quildQuitNtf', 		sendType:'',  	 	 			 sendID:0, 			receiveType:'GuildQuitNtf',			receiveID:0x6B17, 	pbFile:'GuildpbFile', 	package:'Protocols'},
	{name:'guildAdjustPost', 	sendType:'GuildAdjustPostReq', 	 sendID:0x6B0d, 	receiveType:'GuildAdjustPostRsp',	receiveID:0x6B0e, 	pbFile:'GuildpbFile', 	package:'Protocols'},
	{name:'guildModifySummary', sendType:'GuildModifySummaryReq',sendID:0x6B0f, 	receiveType:'GuildModifySummaryRsp',receiveID:0x6B10, 	pbFile:'GuildpbFile', 	package:'Protocols'},
	{name:'guildMemberList', 	sendType:'GuildMemberListReq',	 sendID:0x6B13, 	receiveType:'GuildMemberListRsp',	receiveID:0x6B14, 	pbFile:'GuildpbFile', 	package:'Protocols'},
	{name:'guildAttrClientNtf', sendType:'',	 				 sendID:0, 			receiveType:'GuildAttrClientNtf',	receiveID:0x6B20, 	pbFile:'GuildpbFile', 	package:'Protocols'},
	
	{name:'guildTaskList', 		sendType:'GuildTaskListReq',	 sendID:0x2501, 	receiveType:'GuildTaskListRsp',		receiveID:0x2502, 	pbFile:'GuildTaskpbFile', 	package:'Protocols'},
	{name:'guildTaskAccept', 	sendType:'GuildTaskAcceptReq',	 sendID:0x2503, 	receiveType:'GuildTaskAcceptRsp',	receiveID:0x2504, 	pbFile:'GuildTaskpbFile', 	package:'Protocols'},
	{name:'guildTaskUpdateNtf', sendType:'',	 				 sendID:0, 			receiveType:'GuildTaskUpdateNtf',	receiveID:0x2505, 	pbFile:'GuildTaskpbFile', 	package:'Protocols'},
	{name:'guildTaskRemove', 	sendType:'GuildTaskRemoveReq',	 sendID:0x2506, 	receiveType:'GuildTaskRemoveRsp',	receiveID:0x2507, 	pbFile:'GuildTaskpbFile', 	package:'Protocols'},
	{name:'guildTaskSpeedUp', 	sendType:'GuildTaskSpeedUpReq',	 sendID:0x2508, 	receiveType:'GuildTaskSpeedUpRsp',	receiveID:0x2509, 	pbFile:'GuildTaskpbFile', 	package:'Protocols'},

	{name:'signUpGuildBattle', 	sendType:'SignUpGuildBattleReq', sendID:0x6B23, 	receiveType:'SignUpGuildBattleRsp',	receiveID:0x6B24, 	pbFile:'GuildBattlepbFile', 	package:'Protocols'},
	{name:'guildBattleMatchSucessNtf', 	sendType:'',			 sendID:0, 		    receiveType:'GuildBattleMatchSucessNtf', receiveID:0x2408, 	pbFile:'GuildBattlepbFile', 	package:'Protocols'},
	{name:'battleBuildList', 	sendType:'BattleBuildListReq',	 sendID:0x2401, 	receiveType:'BattleBuildListRsp', 	receiveID:0x2402, 	pbFile:'GuildBattlepbFile', 	package:'Protocols'},
	{name:'holdBattleBuild', 	sendType:'HoldBattleBuildReq',	 sendID:0x2403, 	receiveType:'HoldBattleBuildRsp',	receiveID:0x2404, 	pbFile:'GuildBattlepbFile', 	package:'Protocols'},
	{name:'captureBattleBuild', sendType:'CaptureBattleBuildReq',sendID:0x2405, 	receiveType:'CaptureBattleBuildRsp',receiveID:0x2406, 	pbFile:'GuildBattlepbFile', 	package:'Protocols'},
	{name:'captureBattleBuildNtf', sendType:'',	 				sendID:0, 			receiveType:'CaptureBattleBuildNtf',receiveID:0x2407, 	pbFile:'GuildBattlepbFile', 	package:'Protocols'},
	{name:'startBattleMeetEgg', sendType:'StartBattleMeetEggReq',sendID:0x2421, 	receiveType:'StartBattleMeetEggNtf',receiveID:0x2422, 	pbFile:'GuildBattlepbFile', 	package:'Protocols'},
	{name:'battleMeetEggDropNtf', sendType:'',					 sendID:0, 	    	receiveType:'BattleMeetEggDropNtf', receiveID:0x2423, 	pbFile:'GuildBattlepbFile', 	package:'Protocols'},
	{name:'battleChangeMeetX',  sendType:'BattleChangeMeetXReq', sendID:0x2424, 	receiveType:'BattleChangeMeetXRsp', receiveID:0x2425, 	pbFile:'GuildBattlepbFile', 	package:'Protocols'},
	{name:'battleMeetDrop', 	sendType:'BattleMeetDropReq',	 sendID:0x2426, 	receiveType:'BattleMeetDropRsp', 	receiveID:0x2427, 	pbFile:'GuildBattlepbFile', 	package:'Protocols'},
	{name:'battleMeetScoreNtf', sendType:'',	 				 sendID:0, 			receiveType:'BattleMeetScoreNtf', 	receiveID:0x2428, 	pbFile:'GuildBattlepbFile', 	package:'Protocols'},
	{name:'exitBattleMeetEgg',  sendType:'ExitBattleMeetEggReq', sendID:0x2429, 	receiveType:'ExitBattleMeetEggRsp', receiveID:0x2430, 	pbFile:'GuildBattlepbFile', 	package:'Protocols'},
	{name:'battleMeetEggStopNtf',sendType:'', 					 sendID:0, 			receiveType:'BattleMeetEggStopNtf', receiveID:0x2431, 	pbFile:'GuildBattlepbFile', 	package:'Protocols'},
	{name:'battleBuildUpdateNtf',sendType:'', 					 sendID:0, 			receiveType:'BattleBuildUpdateNtf', receiveID:0x2432, 	pbFile:'GuildBattlepbFile', 	package:'Protocols'},
	{name:'battleHoldScoreNtf',	 sendType:'', 					 sendID:0, 			receiveType:'BattleHoldScoreNtf', 	receiveID:0x2411, 	pbFile:'GuildBattlepbFile', 	package:'Protocols'},
	{name:'exitBattleBuildList', sendType:'ExitBattleBuildListReq',sendID:0x2409, 	receiveType:'ExitBattleBuildListRsp', receiveID:0x2410, 	pbFile:'GuildBattlepbFile', 	package:'Protocols'},
	{name:'battleOverNtf', 		 sendType:'',					 sendID:0, 			receiveType:'BattleOverNtf', 		receiveID:0x2412, 	pbFile:'GuildBattlepbFile', 	package:'Protocols'},
	
	//{name:'guildLeaderBoard', 	sendType:'GuildLeaderBoardReq',  sendID:0x6B20, 	receiveType:'GuildLeaderBoardRsp',	receiveID:0x6B21, 	pbFile:'GuildpbFile', 	package:'Protocols'},
	{name:'rankGuildLst', 		sendType:'RankTopNReq',  		 sendID:0x7c01, 	receiveType:'RankGuildInfoNtf',		receiveID:0x7c08, 	pbFile:'LeaderboardpbFile', 	package:'Protocols'},
	{name:'rankSelfLst', 		sendType:'RankSelfNearbyReq',  	 sendID:0x7c02, 	receiveType:'RankSelfNearbyRsp',	receiveID:0x7c03, 	pbFile:'LeaderboardpbFile', 	package:'Protocols'},

	//{name:'questList', 			sendType:'QuestListReq',		 sendID:0x5c01, 	receiveType:'QuestListRsp',			receiveID:0x5c02, 	pbFile:'QuestpbFile', package:'Protocols'},
	//{name:'questReward', 		sendType:'QuestPutRewardReq',	 sendID:0x5c04, 	receiveType:'QuestPutRewardRsp',	receiveID:0x5c05, 	pbFile:'QuestpbFile', package:'Protocols'},
	//{name:'questRefresh',		sendType:'QuestRefreshReq',		 sendID:0x5c08, 	receiveType:'QuestRefreshRsp',		receiveID:0x5c09,	pbFile:'QuestpbFile', package:'Protocols'},

	{name:'taskList', 			sendType:'TaskListReq',		 	sendID:0x1001, 		receiveType:'TaskListRsp',			receiveID:0x1002, 	pbFile:'TaskpbFile', package:'Protocols'},
	{name:'taskReward', 		sendType:'TaskRewardReq',	 	sendID:0x1004, 		receiveType:'TaskRewardRsp',		receiveID:0x1005, 	pbFile:'TaskpbFile', package:'Protocols'},
	{name:'taskAccept', 		sendType:'TaskAcceptReq',	 	sendID:0x1006, 		receiveType:'TaskAcceptRsp',		receiveID:0x1007, 	pbFile:'TaskpbFile', package:'Protocols'},
	{name:'taskUpdateNtf',		sendType:'',		 			sendID:0, 			receiveType:'TaskUpdateNtf',		receiveID:0x1003,	pbFile:'TaskpbFile', package:'Protocols'},
	{name:'taskFirst',			sendType:'TaskFirstReq',		sendID:0x1010, 		receiveType:'TaskFirstRsp',		    receiveID:0x1011,	pbFile:'TaskpbFile', package:'Protocols'},
	{name:'taskRemove',			sendType:'TaskRemoveReq',		sendID:0x1008, 		receiveType:'TaskRemoveRsp',		receiveID:0x1009,	pbFile:'TaskpbFile', package:'Protocols'},
	{name:'taskRefresh',		sendType:'TaskRefreshReq',		sendID:0x1012, 		receiveType:'TaskRefreshRsp',		receiveID:0x1013,	pbFile:'TaskpbFile', package:'Protocols'},
	{name:'taskPoint',			sendType:'TaskPointReq',		sendID:0x1014, 		receiveType:'TaskPointRsp',			receiveID:0x1015,	pbFile:'TaskpbFile', package:'Protocols'},
	{name:'taskFinish',			sendType:'',					sendID:0, 			receiveType:'TaskFinishNtf',		receiveID:0x1016,	pbFile:'TaskpbFile', package:'Protocols'},
	{name:'TaskStateList',		sendType:'TaskStateListReq',	sendID:0x1017, 		receiveType:'TaskStateListRsp',		receiveID:0x1018,	pbFile:'TaskpbFile', package:'Protocols'},

	{name:'bookAllType',	type:'',	sendType:'BookAllTypeReq',	 	 sendID:0x2601, 	receiveType:'BookAllTypeRsp',		receiveID:0x2602,	pbFile:'BookpbFile', package:'Protocols'},
	{name:'bookInfo',		type:'',	sendType:'BookInfoReq',	 		 sendID:0x2603, 	receiveType:'BookInfoRsp',			receiveID:0x2604,	pbFile:'BookpbFile', package:'Protocols'},
	{name:'bookUpdate',		type:'',	sendType:'',	 		 		 sendID:0, 			receiveType:'BookUpdateNtf',		receiveID:0x2605,	pbFile:'BookpbFile', package:'Protocols'},
	{name:'bookReward',		type:'',	sendType:'BookRewardReq',	 	 sendID:0x2606, 	receiveType:'BookRewardRsp',		receiveID:0x2607,	pbFile:'BookpbFile', package:'Protocols'},
	{name:'BookTurnPages',		type:'成长任务图鉴完成翻页',  sendType:'BookTurnPagesReq',	 	 sendID:0x2608, 	receiveType:'BookTurnPagesRsp',		receiveID:0x2609,	pbFile:'BookpbFile', package:'Protocols'},


	{name:'collectionList',   	sendType:'CollectionListReq',  	 sendID:0x8501, 	receiveType:'CollectionListRsp',	receiveID:0x8502, pbFile:'CollectionpbFile', package:'Protocols'},
	{name:'collectionUpdateNtf',sendType:'',  	 				 sendID:0, 			receiveType:'CollectionUpdateNtf',	receiveID:0x8503, pbFile:'CollectionpbFile', package:'Protocols'},
	{name:'collectionReward',   sendType:'CollectionExchangeRewardReq',  sendID:0x8504, 	receiveType:'CollectionExchangeRewardRsp',receiveID:0x8505, pbFile:'CollectionpbFile', package:'Protocols'},
	
	{name:'mallList',			sendType:'MallListReq',	 	 	 sendID:0x4a30, 	receiveType:'MallListRsp',			receiveID:0x4a31,	pbFile:'MallpbFile', 		 package:'Protocols'},
	{name:'mallBuy',			sendType:'MallBuyReq',	 	 	 sendID:0x4a32, 	receiveType:'MallBuyRsp',			receiveID:0x4a33,	pbFile:'MallpbFile', 		 package:'Protocols'},
	{name:'exchangeGoods',		sendType:'ExchangeGoodsReq',	 sendID:0x4a38, 	receiveType:'ExchangeGoodsRsp',		receiveID:0x4a39,	pbFile:'MallpbFile', 		 package:'Protocols'},

	{name:'obstaclesOpenup',	sendType:'ObstaclesOpenupReq',	 sendID:0x42a5, 	receiveType:'ObstaclesOpenupRsp',	receiveID:0x42a6,	pbFile:'ObstaclepbFile',  package:'Protocols'},
	{name:'obstaclesList',		sendType:'ObstaclesListReq',	 sendID:0x42a3, 	receiveType:'ObstaclesListRsp',		receiveID:0x42a4,	pbFile:'ObstaclepbFile',  package:'Protocols'},

	{name:'changeName',			sendType:'ChangeNameReq',	 	 sendID:0x5201, 	receiveType:'ChangeNameRsp',		receiveID:0x5202,	pbFile:'CharacterpbFile', package:'Protocols'},
	{name:'changeSignature',	sendType:'ChangeSignatureReq',	 sendID:0x5203, 	receiveType:'ChangeSignatureRsp',	receiveID:0x5204,	pbFile:'CharacterpbFile', package:'Protocols'},
	{name:'changeClientData', 	sendType:'ChangeClientDataReq',  sendID:0x5205, 	receiveType:'ChangeClientDataRsp', 	receiveID:0x5206, 	pbFile:'CharacterpbFile', package:'Protocols'},
	{name:'checkWord', 			sendType:'CheckWordReq',  		 sendID:0x5210, 	receiveType:'CheckWordRsp', 		receiveID:0x5211, 	pbFile:'CharacterpbFile', package:'Protocols'},

	{name:'UsePowerBarAddStamina',sendType:'UsePowerBarAddStaminaReq',  sendID:0x520e, 	receiveType:'UsePowerBarAddStaminaRsp',receiveID:0x520f, pbFile:'CharacterpbFile', package:'Protocols'},
	
	{name:'monthCard',			sendType:'MonthCardReq',	 	 sendID:0x7201, 	receiveType:'MonthCardNtf',			receiveID:0x7202,	pbFile:'BufferpbFile', 	package:'Protocols'},
	{name:'monthCardDraw',		sendType:'MonthCardDrawReq',	 sendID:0x7203, 	receiveType:'MonthCardDrawRsp',		receiveID:0x7204,	pbFile:'BufferpbFile', 	package:'Protocols'},
	
	{name:'summonInfo',			sendType:'SummonInfoReq',	 	 sendID:0x1101, 	receiveType:'SummonInfoRsp',		receiveID:0x1102,	pbFile:'SummonpbFile', 	package:'Protocols'},
	{name:'summon',				sendType:'SummonReq',	 	 	 sendID:0x1103, 	receiveType:'SummonRsp',			receiveID:0x1104,	pbFile:'SummonpbFile', 	package:'Protocols'},
	{name:'SummonRetain',		sendType:'SummonRetainReq',	 	 sendID:0x1110, 	receiveType:'SummonRetainRsp',		receiveID:0x1111,	pbFile:'SummonpbFile', 	package:'Protocols'},
	{name:'summonSend',			sendType:'SummonSendReq',	 	 sendID:0x1105, 	receiveType:'SummonSendRsp',		receiveID:0x1106,	pbFile:'SummonpbFile', 	package:'Protocols'},
	{name:'summonMailNtf',		sendType:'',	 	 			 sendID:0, 			receiveType:'SummonMailNtf',		receiveID:0x1107,	pbFile:'SummonpbFile', 	package:'Protocols'},
	{name:'summonMailReward',	sendType:'SummonMailRewardReq',	 sendID:0x1108, 	receiveType:'SummonMailRewardRsp',	receiveID:0x1109,	pbFile:'SummonpbFile', 	package:'Protocols'},
	{name:'summonMailFirst',	sendType:'SummonMailFirstReq',	 sendID:0x1112, 	receiveType:'SummonMailFirstRsp',	receiveID:0x1113,	pbFile:'SummonpbFile', 	package:'Protocols'},
	{name:'summonInvest',		sendType:'SummonInvestReq',	 	sendID:0x1114, 		receiveType:'SummonInvestRsp',		receiveID:0x1115,	pbFile:'SummonpbFile', 	package:'Protocols'},
	{name:'summonPickupInvestReward',		sendType:'SummonPickupInvestRewardReq',	 	sendID:0x1120, 		receiveType:'SummonPickupInvestRewardRsp',		receiveID:0x1121,	pbFile:'SummonpbFile', 	package:'Protocols'},
	{name:'summonFastMail',		sendType:'SummonFastMailReq',	 	sendID:0x1122, 		receiveType:'SummonFastMailRsp',		receiveID:0x1123,	pbFile:'SummonpbFile', 	package:'Protocols'},
	{name:'SummonAllMailRewardReq',		sendType:'SummonAllMailRewardReq',	 	sendID:0x1124, 		receiveType:'SummonAllMailRewardRsp',		receiveID:0x1125,	pbFile:'SummonpbFile', 	package:'Protocols'},

	
	{name:'startMeetEgg',		sendType:'StartMeetEggReq',	 	 sendID:0x2201, 	receiveType:'StartMeetEggRsp',		receiveID:0x2202,	pbFile:'MeetEggpbFile', 	package:'Protocols'},
	{name:'meetEggDrop',		sendType:'',	 	 			 sendID:0, 			receiveType:'MeetEggDropNtf',		receiveID:0x2203,	pbFile:'MeetEggpbFile', 	package:'Protocols'},
	{name:'changeMeetX',		sendType:'ChangeMeetXReq',	 	 sendID:0x2204, 	receiveType:'ChangeMeetXRsp',		receiveID:0x2205,	pbFile:'MeetEggpbFile', 	package:'Protocols'},
	{name:'exitMeetEgg',		sendType:'ExitMeetEggReq',	 	 sendID:0x2208, 	receiveType:'ExitMeetEggRsp',		receiveID:0x2209,	pbFile:'MeetEggpbFile', 	package:'Protocols'},
	{name:'meetDrop',			sendType:'MeetDropReq',	 	 	 sendID:0x2206, 	receiveType:'MeetDropRsp',			receiveID:0x2207,	pbFile:'MeetEggpbFile', 	package:'Protocols'},
	{name:'meetEggStop',		sendType:'',	 	 			 sendID:0, 			receiveType:'MeetEggStopNtf',		receiveID:0x2210,	pbFile:'MeetEggpbFile', 	package:'Protocols'},

	{name:'chatSend',			sendType:'ChatSendReq',	 	 	 sendID:0x2301, 	receiveType:'ChatSendRsp',			receiveID:0x2302,	pbFile:'ChatpbFile', 		 package:'Protocols'},
	{name:'chatSendNtf',		sendType:'',	 	 	 		 sendID:0, 			receiveType:'ChatSendNtf',			receiveID:0x2303,	pbFile:'ChatpbFile', 		 package:'Protocols'},

	{name:'npcList',			sendType:'NpcListReq',	 	 	 sendID:0x2701, 	receiveType:'NpcListRsp',			receiveID:0x2702,	pbFile:'CitypbFile', 		 package:'Protocols'},
	{name:'npcVisit',			sendType:'NpcVisitReq',	 	 	 sendID:0x2703, 	receiveType:'NpcVisitRsp',			receiveID:0x2704,	pbFile:'CitypbFile', 		 package:'Protocols'},
	{name:'npcTriggerEvent',	sendType:'NpcTriggerEventReq',	 sendID:0x2705, 	receiveType:'NpcTriggerEventRsp',	receiveID:0x2706,	pbFile:'CitypbFile', 		 package:'Protocols'},
	{name:'npcOnPoetryInfo',	sendType:'NpcOnPoetryInfoReq',	 sendID:0x2707, 	receiveType:'NpcOnPoetryInfoRsp',	receiveID:0x2708,	pbFile:'CitypbFile', 		 package:'Protocols'},
	{name:'npcOnPoetry',		sendType:'NpcOnPoetryReq',	 	 sendID:0x2709, 	receiveType:'NpcOnPoetryRsp',		receiveID:0x2710,	pbFile:'CitypbFile', 		 package:'Protocols'},
	{name:'npcOnThings',		sendType:'NpcWantThingReq',	 	 sendID:0x2711, 	receiveType:'NpcWantThingRsp',		receiveID:0x2712,	pbFile:'CitypbFile', 		 package:'Protocols'},
	{name:'npcRaceHorses',      type:'赌马下注',	sendType:'NpcRaceHorsesReq',	 sendID:0x2713, 	receiveType:'NpcRaceHorsesRsp',		receiveID:0x2714,	pbFile:'CitypbFile', 		 package:'Protocols'},
	{name:'npcRobbery',      type:'抢劫',	sendType:'NpcRobberyReq',	 sendID:0x2715, 	receiveType:'NpcRobberyRsp',		receiveID:0x2716,	pbFile:'CitypbFile', 		 package:'Protocols'},

	
	{name:'gmCode',				sendType:'GmCommandReq',	 	 sendID:0x4603, 	receiveType:'GmCommandRsp',			receiveID:0x4604,	pbFile:'GMpbFile', 		 package:'Protocols'},
);
@ccclass
export default class Messages {
    private Messages: any = date;
    getMessages(){
     return this.Messages;
    }
}