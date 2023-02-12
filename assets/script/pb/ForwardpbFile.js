var _root = require('protobuf').newBuilder({})['import']({
    "package": "Protocols",
    "syntax": "proto2",
    "options": {
        "java_multiple_files": true,
        "java_package": "com.dj.protobuf.forward"
    },
    "messages": [
        {
            "name": "ForwardPlayerInitReq",
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
                    "type": "string",
                    "name": "reqClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "req",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "ps",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "channelID",
                    "id": 5
                }
            ]
        },
        {
            "name": "ForwardPlayerInitRsp",
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
                    "type": "string",
                    "name": "rspClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "rsp",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "ps",
                    "id": 4
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "channelID",
                    "id": 5
                }
            ]
        },
        {
            "name": "ForwardPlayerBasicReq",
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
                    "type": "string",
                    "name": "reqClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "req",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "ps",
                    "id": 4
                }
            ]
        },
        {
            "name": "ForwardPlayerBasicRsp",
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
                    "type": "string",
                    "name": "rspClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "rsp",
                    "id": 3
                }
            ]
        },
        {
            "name": "LogoutReq",
            "syntax": "proto2",
            "fields": [
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "roleID",
                    "id": 1
                }
            ]
        },
        {
            "name": "GameLogoutReq",
            "syntax": "proto2",
            "fields": [
                {
                    "rule": "optional",
                    "type": "uint64",
                    "name": "roleID",
                    "id": 1
                }
            ]
        },
        {
            "name": "ForwardPlayerFriendReq",
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
                    "type": "string",
                    "name": "reqClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "req",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "ps",
                    "id": 4
                }
            ]
        },
        {
            "name": "ForwardPlayerFriendRsp",
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
                    "type": "string",
                    "name": "rspClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "rsp",
                    "id": 3
                }
            ]
        },
        {
            "name": "ForwardPlayerHomeReq",
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
                    "type": "string",
                    "name": "reqClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "req",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "ps",
                    "id": 4
                }
            ]
        },
        {
            "name": "ForwardPlayerHomeRsp",
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
                    "type": "string",
                    "name": "rspClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "rsp",
                    "id": 3
                }
            ]
        },
        {
            "name": "ForwardPlayerSingleReq",
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
                    "type": "string",
                    "name": "reqClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "req",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "ps",
                    "id": 4
                }
            ]
        },
        {
            "name": "ForwardPlayerSingleRsp",
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
                    "type": "string",
                    "name": "rspClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "rsp",
                    "id": 3
                }
            ]
        },
        {
            "name": "ForwardPlayerGmReq",
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
                    "type": "string",
                    "name": "reqClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "req",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "ps",
                    "id": 4
                }
            ]
        },
        {
            "name": "ForwardPlayerGmRsp",
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
                    "type": "string",
                    "name": "rspClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "rsp",
                    "id": 3
                }
            ]
        },
        {
            "name": "ForwardGameHomeReq",
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
                    "type": "string",
                    "name": "reqClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "req",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "ps",
                    "id": 4
                }
            ]
        },
        {
            "name": "ForwardGameHomeRsp",
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
                    "type": "string",
                    "name": "rspClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "rsp",
                    "id": 3
                }
            ]
        },
        {
            "name": "ForwardGameMultiReq",
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
                    "type": "string",
                    "name": "reqClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "req",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "ps",
                    "id": 4
                }
            ]
        },
        {
            "name": "ForwardGameMultiRsp",
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
                    "type": "string",
                    "name": "rspClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "rsp",
                    "id": 3
                }
            ]
        },
        {
            "name": "ForwardGameParkReq",
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
                    "type": "string",
                    "name": "reqClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "req",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "ps",
                    "id": 4
                }
            ]
        },
        {
            "name": "ForwardGameParkRsp",
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
                    "type": "string",
                    "name": "rspClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "rsp",
                    "id": 3
                }
            ]
        },
        {
            "name": "ForwardGameMiniReq",
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
                    "type": "string",
                    "name": "reqClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "req",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "ps",
                    "id": 4
                }
            ]
        },
        {
            "name": "ForwardGameMiniRsp",
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
                    "type": "string",
                    "name": "rspClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "rsp",
                    "id": 3
                }
            ]
        },
        {
            "name": "ForwardGlobalRankReq",
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
                    "type": "string",
                    "name": "reqClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "req",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "ps",
                    "id": 4
                }
            ]
        },
        {
            "name": "ForwardGlobalRankRsp",
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
                    "type": "string",
                    "name": "rspClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "rsp",
                    "id": 3
                }
            ]
        },
        {
            "name": "ForwardGlobalGuildReq",
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
                    "type": "string",
                    "name": "reqClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "req",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "ps",
                    "id": 4
                }
            ]
        },
        {
            "name": "ForwardGlobalGuildRsp",
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
                    "type": "string",
                    "name": "rspClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "rsp",
                    "id": 3
                }
            ]
        },
        {
            "name": "ForwardGlobalGuildBattleReq",
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
                    "type": "string",
                    "name": "reqClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "req",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "ps",
                    "id": 4
                }
            ]
        },
        {
            "name": "ForwardGlobalGuildBattleRsp",
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
                    "type": "string",
                    "name": "rspClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "rsp",
                    "id": 3
                }
            ]
        },
        {
            "name": "ForwardChatSendNtf",
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
                    "type": "string",
                    "name": "rspClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "rsp",
                    "id": 3
                }
            ]
        },
        {
            "name": "ForwardPlayerWechatPayReq",
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
                    "type": "string",
                    "name": "reqClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "req",
                    "id": 3
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "ps",
                    "id": 4
                }
            ]
        },
        {
            "name": "ForwardPlayerWechatPayRsp",
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
                    "type": "string",
                    "name": "rspClz",
                    "id": 2
                },
                {
                    "rule": "optional",
                    "type": "bytes",
                    "name": "rsp",
                    "id": 3
                }
            ]
        }
    ],
    "isNamespace": true
});
module.exports = _root;