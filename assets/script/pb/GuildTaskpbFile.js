var _root = require('protobuf').newBuilder({})['import']({
    "package": null,
    "syntax": "proto2",
    "options": {
        "java_package": "com.dj.protobuf"
    },
    "messages": [
        {
            "name": "Protocols",
            "fields": [],
            "syntax": "proto2",
            "options": {
                "java_multiple_files": true,
                "java_package": "com.dj.protobuf.guildTask"
            },
            "messages": [
                {
                    "name": "TaskInfo",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "index",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "taskId",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "ETaskType",
                            "name": "type",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "actionType",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "actionTime",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "actionType1",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "actionTime1",
                            "id": 8
                        },
                        {
                            "rule": "map",
                            "type": "int32",
                            "keytype": "int32",
                            "name": "curItem",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "state",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "first",
                            "id": 11
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "cd",
                            "id": 12
                        }
                    ]
                },
                {
                    "name": "TaskStateInfo",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int64",
                            "name": "id",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "index",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "taskId",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "state",
                            "id": 8
                        }
                    ]
                },
                {
                    "name": "TaskListReq",
                    "syntax": "proto2",
                    "fields": []
                },
                {
                    "name": "TaskListRsp",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ErrorID",
                            "name": "errorID",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "TaskInfo",
                            "name": "tasks",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "TaskUpdateNtf",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ETaskType",
                            "name": "type",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "TaskInfo",
                            "name": "tasks",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "TaskRewardReq",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "taskId",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "ETaskType",
                            "name": "type",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "TaskRewardRsp",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ErrorID",
                            "name": "errorID",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "TaskRewardReq",
                            "name": "req",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "TaskInfo",
                            "name": "task",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "TaskAcceptReq",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "taskId",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "ETaskType",
                            "name": "type",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "TaskAcceptRsp",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ErrorID",
                            "name": "errorID",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "TaskAcceptReq",
                            "name": "req",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "taskId",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "TaskRemoveReq",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "taskId",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "ETaskType",
                            "name": "type",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "TaskRemoveRsp",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ErrorID",
                            "name": "errorID",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "TaskRemoveReq",
                            "name": "req",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "TaskInfo",
                            "name": "task",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "TaskFirstReq",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "taskId",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "ETaskType",
                            "name": "type",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "TaskFirstRsp",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ErrorID",
                            "name": "errorID",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "TaskFirstReq",
                            "name": "req",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "TaskRefreshReq",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ETaskType",
                            "name": "type",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "TaskRefreshRsp",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ErrorID",
                            "name": "errorID",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "TaskRefreshReq",
                            "name": "req",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "TaskInfo",
                            "name": "task",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "TaskPointReq",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ETaskPoint",
                            "name": "point",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "TaskPointRsp",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ErrorID",
                            "name": "errorID",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "TaskPointReq",
                            "name": "req",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "TaskFinishNtf",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "TaskInfo",
                            "name": "task",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "TaskStateListReq",
                    "syntax": "proto2",
                    "fields": []
                },
                {
                    "name": "TaskStateListRsp",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ErrorID",
                            "name": "errorID",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "TaskStateInfo",
                            "name": "taskState",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "GuildTaskListReq",
                    "syntax": "proto2",
                    "fields": []
                },
                {
                    "name": "GuildTaskListRsp",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ErrorID",
                            "name": "errorID",
                            "id": 1
                        },
                        {
                            "rule": "repeated",
                            "type": "TaskInfo",
                            "name": "tasks",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "GuildTaskAcceptReq",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "taskId",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "index",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "GuildTaskAcceptRsp",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ErrorID",
                            "name": "errorID",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "GuildTaskAcceptReq",
                            "name": "req",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "TaskInfo",
                            "name": "task",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "GuildTaskUpdateNtf",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "TaskInfo",
                            "name": "task",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "GuildTaskRemoveReq",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "taskId",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "index",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "GuildTaskRemoveRsp",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ErrorID",
                            "name": "errorID",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "GuildTaskRemoveReq",
                            "name": "req",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "TaskInfo",
                            "name": "task",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "GuildTaskSpeedUpReq",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "taskId",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "index",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "GuildTaskSpeedUpRsp",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ErrorID",
                            "name": "errorID",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "GuildTaskSpeedUpReq",
                            "name": "req",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "TaskInfo",
                            "name": "task",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "GuildTaskRewardReq",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "taskId",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "index",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "GuildTaskRewardRsp",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "ErrorID",
                            "name": "errorID",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "GuildTaskRewardReq",
                            "name": "req",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "TaskInfo",
                            "name": "task",
                            "id": 3
                        }
                    ]
                }
            ],
            "enums": [
                {
                    "name": "ETaskType",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "GrowUp",
                            "id": 1
                        },
                        {
                            "name": "Day",
                            "id": 2
                        },
                        {
                            "name": "Month",
                            "id": 3
                        },
                        {
                            "name": "Special",
                            "id": 4
                        },
                        {
                            "name": "Guild",
                            "id": 5
                        }
                    ]
                },
                {
                    "name": "ETaskPoint",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "Module_Help",
                            "id": 1
                        },
                        {
                            "name": "Factory_Name_Visible",
                            "id": 2
                        }
                    ]
                }
            ],
            "isNamespace": true
        }
    ],
    "enums": [
        {
            "name": "ErrorID",
            "syntax": "proto2",
            "values": [
                {
                    "name": "OK",
                    "id": 0
                },
                {
                    "name": "SYSTEM_ERROR",
                    "id": -1
                },
                {
                    "name": "SYSTEM_PARAM_ERROR",
                    "id": -2
                },
                {
                    "name": "SYSTEM_INTERNAL_ERROR",
                    "id": -3
                },
                {
                    "name": "SYSTEM_REDIS_ERROR",
                    "id": -4
                },
                {
                    "name": "SYSTEM_MYSQL_ERROR",
                    "id": -5
                },
                {
                    "name": "SYSTEM_CONFIG_NOT_EXISTS",
                    "id": -6
                },
                {
                    "name": "SYSTEM_SAVE_ERROR",
                    "id": -7
                },
                {
                    "name": "SYSTEM_AREA_SERVER_NOT_START",
                    "id": -8
                },
                {
                    "name": "SYSTEM_REQUEST_ERROR",
                    "id": -9
                },
                {
                    "name": "SYSTEM_LOCK_FAILED",
                    "id": -10
                },
                {
                    "name": "SYSTEM_GET_MODEL_ERROR",
                    "id": -11
                },
                {
                    "name": "SYSTEM_SERVICE_DOWN",
                    "id": -12
                },
                {
                    "name": "COMMON_DATA_ERROR",
                    "id": 1
                },
                {
                    "name": "COMMON_CONFIG_ERROR",
                    "id": 2
                },
                {
                    "name": "COMMON_OTHER_ERROR",
                    "id": 3
                },
                {
                    "name": "COMMON_PARAM_ERROR",
                    "id": 4
                },
                {
                    "name": "COMMON_COOLING_DOWN",
                    "id": 5
                },
                {
                    "name": "COMMON_PLAYER_NOT_FOUND",
                    "id": 100
                },
                {
                    "name": "COMMON_PLAYER_GOLD_LESS",
                    "id": 101
                },
                {
                    "name": "COMMON_PLAYER_DIAMOND_LESS",
                    "id": 102
                },
                {
                    "name": "COMMON_PLAYER_ITEM_LESS",
                    "id": 103
                },
                {
                    "name": "COMMON_PLAYER_LEVEL_LESS",
                    "id": 104
                },
                {
                    "name": "COMMON_PLAYER_STAMINA_LESS",
                    "id": 105
                },
                {
                    "name": "COMMON_PLAYER_ACTION_LESS",
                    "id": 106
                },
                {
                    "name": "COMMON_PLAYER_ECOLOGY_LESS",
                    "id": 107
                },
                {
                    "name": "COMMON_PLAYER_GUILD_SCORE_LESS",
                    "id": 108
                },
                {
                    "name": "CHANNEL_NOT_EXITS",
                    "id": 10001
                },
                {
                    "name": "ACCOUNT_IS_EXITS",
                    "id": 10002
                },
                {
                    "name": "ACCOUNT_PASS_ERROR",
                    "id": 10003
                },
                {
                    "name": "ACCOUNT_NAME_ILLEGAL",
                    "id": 10004
                },
                {
                    "name": "ACCOUNT_BLOCKED",
                    "id": 10005
                },
                {
                    "name": "PLEASE_RELOGIN",
                    "id": 10006
                },
                {
                    "name": "IDCARD_ERROR",
                    "id": 10007
                },
                {
                    "name": "ADDICTION_LIMIT_TIME",
                    "id": 10008
                },
                {
                    "name": "ADDICTION_LIMIT_WEEK",
                    "id": 10009
                },
                {
                    "name": "ACCOUNT_NAME_ERROR",
                    "id": 10010
                },
                {
                    "name": "IDCARD_IS_EXITS",
                    "id": 10011
                },
                {
                    "name": "IDCARD_IS_TOO_SHORT",
                    "id": 10012
                },
                {
                    "name": "IDCARD_IS_TOO_LONG",
                    "id": 10013
                },
                {
                    "name": "IDCARD_IS_NOT_RIGHT",
                    "id": 10014
                },
                {
                    "name": "NOT_IN_MINE_ROOM",
                    "id": 10020
                },
                {
                    "name": "PLAYER_NAME_LENGTH_SHORT",
                    "id": 10054
                },
                {
                    "name": "PLAYER_NAME_IS_EXITS",
                    "id": 10055
                },
                {
                    "name": "PLAYER_NAME_IS_ILLEGAL",
                    "id": 10056
                },
                {
                    "name": "PLAYER_NAME_IS_TOO_LONG",
                    "id": 10057
                },
                {
                    "name": "PLAYER_SIGNATURE_IS_ILLEGAL",
                    "id": 10060
                },
                {
                    "name": "PLAYER_SIGNATURE_IS_TOO_LONG",
                    "id": 10061
                },
                {
                    "name": "PLAYER_SIGNATURE_IS_TOO_SHORT",
                    "id": 10062
                },
                {
                    "name": "PLAYER_SIGNATURE_IS_NOT_RIGHT",
                    "id": 10063
                },
                {
                    "name": "REWARD_DRAW_NEED_MONTH_CARD",
                    "id": 10070
                },
                {
                    "name": "SEARCH_NOT_SAME_PLAYER",
                    "id": 10071
                },
                {
                    "name": "INPUT_WORD_IS_ILLEGAL",
                    "id": 10072
                },
                {
                    "name": "INPUT_WORD_IS_TOO_LONG",
                    "id": 10073
                },
                {
                    "name": "INPUT_WORD_IS_TOO_SHORT",
                    "id": 10074
                },
                {
                    "name": "INPUT_WORD_IS_NOT_RIGHT",
                    "id": 10075
                },
                {
                    "name": "REWARD_RECEIVED",
                    "id": 10100
                },
                {
                    "name": "TASK_NOT_FINISH",
                    "id": 10101
                },
                {
                    "name": "TASK_NOT_ACCEPT",
                    "id": 10102
                },
                {
                    "name": "TASK_GROWUP_CANNT_TWO_ACCEPT",
                    "id": 10103
                },
                {
                    "name": "TASK_GUILD_CANNT_TWO_ACCEPT",
                    "id": 10104
                },
                {
                    "name": "SUMMON_NOT_EXIT",
                    "id": 10110
                },
                {
                    "name": "SUMMON_SENDING",
                    "id": 10111
                },
                {
                    "name": "SUMMON_NOT",
                    "id": 10112
                },
                {
                    "name": "SUPPORT_LIMIT",
                    "id": 10113
                },
                {
                    "name": "NO_REWARD_CAN_DRAW",
                    "id": 10114
                },
                {
                    "name": "SUPPORT_TODAY_TWICE_LIMIT",
                    "id": 10115
                },
                {
                    "name": "SUMMON_MAIL_LIMIT",
                    "id": 10116
                },
                {
                    "name": "SUMMON_PICKUP_INVEST_REWARD_TIME_LIMIT",
                    "id": 10117
                },
                {
                    "name": "SUMMON_PICKUP_ED_INVEST_REWARD",
                    "id": 10118
                },
                {
                    "name": "SUMMON_EVENT_NOT_HANDLER",
                    "id": 10119
                },
                {
                    "name": "GUILD_NO_JOIN",
                    "id": 10200
                },
                {
                    "name": "GUILD_NAME_HAS_EXIT",
                    "id": 10201
                },
                {
                    "name": "GUILD_HAS_JOIN",
                    "id": 10202
                },
                {
                    "name": "GUILD_NOT_EXIT",
                    "id": 10203
                },
                {
                    "name": "GUILD_POST_NOT_ENOUGH",
                    "id": 10204
                },
                {
                    "name": "GUILD_CANNT_EXIT",
                    "id": 10205
                },
                {
                    "name": "GUILD_BATTLE_ALREADY_SIGNUP",
                    "id": 10206
                },
                {
                    "name": "FARM_NOT_CLEARING",
                    "id": 10300
                },
                {
                    "name": "FARM_NOT_RIPE",
                    "id": 10301
                },
                {
                    "name": "PARK_CELL_HAS_PLANT",
                    "id": 10302
                },
                {
                    "name": "PARK_CELL_NO_PLANT",
                    "id": 10303
                },
                {
                    "name": "PARK_GREEN_NOT_ENOUGH",
                    "id": 10304
                },
                {
                    "name": "PARK_PLACE_LIMIT",
                    "id": 10305
                },
                {
                    "name": "PARK_HONEY_DRAW_CD",
                    "id": 10306
                },
                {
                    "name": "PARK_CANT_PLACE_INVALID",
                    "id": 10307
                },
                {
                    "name": "MEET_EGG_IN_CD",
                    "id": 10350
                },
                {
                    "name": "MEET_ERROR",
                    "id": 10351
                },
                {
                    "name": "BATTLE_ROOM_TIME_STOP",
                    "id": 10352
                },
                {
                    "name": "BATTLE_BUILD_ME_HOLD",
                    "id": 10353
                },
                {
                    "name": "BATTLE_BUILD_IN_GAME",
                    "id": 10354
                },
                {
                    "name": "BATTLE_ROLE_IN_CD",
                    "id": 10355
                },
                {
                    "name": "BATTLE_BUILD_HAS_HOLD",
                    "id": 10356
                },
                {
                    "name": "BATTLE_BUILD_NO_HOLD",
                    "id": 10357
                },
                {
                    "name": "BATTLE_NO_MATCH",
                    "id": 10358
                },
                {
                    "name": "TREASURE_IS_VERIFIED",
                    "id": 10370
                },
                {
                    "name": "VERIFIY_XIAOXUN_TODAY",
                    "id": 10371
                },
                {
                    "name": "VERIFIY_AUTO_TODAY_LIMIT",
                    "id": 10372
                },
                {
                    "name": "VERIFIY_AUTO_LEVEL_LIMIT",
                    "id": 10373
                },
                {
                    "name": "VERIFIY_ONCE_LIMIT",
                    "id": 10374
                },
                {
                    "name": "MINE_QUICK",
                    "id": 10380
                },
                {
                    "name": "COLLECTION_NOT_GATHER_ALL",
                    "id": 10390
                },
                {
                    "name": "BOOK_NO_HAVE",
                    "id": 10400
                },
                {
                    "name": "FRIEND_LEAVE_LITTLE",
                    "id": 10410
                },
                {
                    "name": "PLEASE_COMPLATE_CUR_TASK",
                    "id": 10420
                },
                {
                    "name": "PAY_AMOUNT_OUT_AGE",
                    "id": 10430
                }
            ]
        }
    ],
    "isNamespace": true
});
module.exports = _root;