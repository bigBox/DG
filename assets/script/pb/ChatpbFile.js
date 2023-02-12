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
                "java_package": "com.dj.protobuf.chat"
            },
            "messages": [
                {
                    "name": "DateTime",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "sint64",
                            "name": "value",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "TimeSpanScale",
                            "name": "scale",
                            "id": 2,
                            "options": {
                                "default": "DAYS"
                            }
                        }
                    ],
                    "enums": [
                        {
                            "name": "TimeSpanScale",
                            "syntax": "proto2",
                            "values": [
                                {
                                    "name": "DAYS",
                                    "id": 0
                                },
                                {
                                    "name": "HOURS",
                                    "id": 1
                                },
                                {
                                    "name": "MINUTES",
                                    "id": 2
                                },
                                {
                                    "name": "SECONDS",
                                    "id": 3
                                },
                                {
                                    "name": "MILLISECONDS",
                                    "id": 4
                                },
                                {
                                    "name": "TICKS",
                                    "id": 5
                                },
                                {
                                    "name": "MINMAX",
                                    "id": 15
                                }
                            ]
                        }
                    ]
                },
                {
                    "name": "BaseRoleInfo",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "roleId",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "roleName",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "level",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "experience",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "guildId",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "signature",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "reputation",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "reputationLevel",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "showTable",
                            "id": 9
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "showTableLevel",
                            "id": 10
                        },
                        {
                            "rule": "optional",
                            "type": "ERoleFiveEle",
                            "name": "fiveEle",
                            "id": 11
                        }
                    ]
                },
                {
                    "name": "RoleInfo",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "roleId",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "roleName",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "level",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "gold",
                            "id": 4
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "diamond",
                            "id": 5
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "ecology",
                            "id": 6
                        },
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "guildId",
                            "id": 7
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "signature",
                            "id": 8
                        },
                        {
                            "rule": "optional",
                            "type": "int32",
                            "name": "experience",
                            "id": 9
                        }
                    ]
                },
                {
                    "name": "ChatSendReq",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "uint64",
                            "name": "roleID",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "EChatChannel",
                            "name": "channel",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "content",
                            "id": 3
                        }
                    ]
                },
                {
                    "name": "ChatSendRsp",
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
                            "type": "ChatSendReq",
                            "name": "req",
                            "id": 2
                        }
                    ]
                },
                {
                    "name": "ChatSendNtf",
                    "syntax": "proto2",
                    "fields": [
                        {
                            "rule": "optional",
                            "type": "BaseRoleInfo",
                            "name": "roleInfo",
                            "id": 1
                        },
                        {
                            "rule": "optional",
                            "type": "DateTime",
                            "name": "sendTime",
                            "id": 2
                        },
                        {
                            "rule": "optional",
                            "type": "EChatChannel",
                            "name": "channel",
                            "id": 3
                        },
                        {
                            "rule": "optional",
                            "type": "string",
                            "name": "content",
                            "id": 4
                        }
                    ]
                }
            ],
            "enums": [
                {
                    "name": "FortuneType",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "Coin",
                            "id": 1
                        },
                        {
                            "name": "Diamond",
                            "id": 2
                        },
                        {
                            "name": "Stamina",
                            "id": 3
                        },
                        {
                            "name": "Experience",
                            "id": 4
                        },
                        {
                            "name": "VipExp",
                            "id": 32
                        }
                    ]
                },
                {
                    "name": "ItemType",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "Plant",
                            "id": 1
                        },
                        {
                            "name": "Animal",
                            "id": 2
                        },
                        {
                            "name": "Food",
                            "id": 3
                        },
                        {
                            "name": "Industry",
                            "id": 4
                        },
                        {
                            "name": "Treasure",
                            "id": 5
                        },
                        {
                            "name": "Item",
                            "id": 6
                        },
                        {
                            "name": "Baby",
                            "id": 7
                        },
                        {
                            "name": "Not_Into_Store",
                            "id": 100
                        }
                    ]
                },
                {
                    "name": "ERoleFiveEle",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "Gold",
                            "id": 1
                        },
                        {
                            "name": "wood",
                            "id": 2
                        },
                        {
                            "name": "water",
                            "id": 3
                        },
                        {
                            "name": "fire",
                            "id": 4
                        },
                        {
                            "name": "earth",
                            "id": 5
                        }
                    ]
                },
                {
                    "name": "SceneUpdateType",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "Total",
                            "id": 0
                        },
                        {
                            "name": "Update",
                            "id": 1
                        }
                    ]
                },
                {
                    "name": "EChatChannel",
                    "syntax": "proto2",
                    "values": [
                        {
                            "name": "Guild",
                            "id": 1
                        },
                        {
                            "name": "Mine",
                            "id": 2
                        },
                        {
                            "name": "Verify",
                            "id": 3
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