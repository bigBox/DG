var _root = require('protobuf').newBuilder({})['import']({
    "package": "Protocols",
    "syntax": "proto2",
    "options": {
        "java_multiple_files": true,
        "java_package": "com.dj.protobuf.server"
    },
    "messages": [
        {
            "name": "ReadPlayerItemReq",
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
                    "type": "int32",
                    "name": "itemID",
                    "id": 2
                }
            ]
        },
        {
            "name": "ReadPlayerItemRsp",
            "syntax": "proto2",
            "fields": [
                {
                    "rule": "optional",
                    "type": "ReadPlayerItemReq",
                    "name": "req",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "data",
                    "id": 2
                }
            ]
        },
        {
            "name": "UpdateConfigReq",
            "syntax": "proto2",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "jsonConfigName",
                    "id": 1
                }
            ]
        },
        {
            "name": "UpdateConfigRsp",
            "syntax": "proto2",
            "fields": []
        },
        {
            "name": "UpdateConnectLogicReq",
            "syntax": "proto2",
            "fields": []
        },
        {
            "name": "UpdateConnectLogicRsp",
            "syntax": "proto2",
            "fields": []
        },
        {
            "name": "RegisterGate2PlayerReq",
            "syntax": "proto2",
            "fields": [
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "serverId",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "serverName",
                    "id": 2
                }
            ]
        },
        {
            "name": "RegisterGate2PlayerRsp",
            "syntax": "proto2",
            "fields": [
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "serverId",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "serverName",
                    "id": 2
                }
            ]
        },
        {
            "name": "KeepAlive4PlayerReq",
            "syntax": "proto2",
            "fields": []
        },
        {
            "name": "KeepAlive4PlayerRsp",
            "syntax": "proto2",
            "fields": []
        },
        {
            "name": "UpdateConfig4PlayerReq",
            "syntax": "proto2",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "jsonConfigName",
                    "id": 1
                }
            ]
        },
        {
            "name": "UpdateConfig4PlayerRsp",
            "syntax": "proto2",
            "fields": []
        },
        {
            "name": "RegisterGate2GameReq",
            "syntax": "proto2",
            "fields": [
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "serverId",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "serverName",
                    "id": 2
                }
            ]
        },
        {
            "name": "RegisterGate2GameRsp",
            "syntax": "proto2",
            "fields": [
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "serverId",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "serverName",
                    "id": 2
                }
            ]
        },
        {
            "name": "KeepAlive4GameReq",
            "syntax": "proto2",
            "fields": []
        },
        {
            "name": "KeepAlive4GameRsp",
            "syntax": "proto2",
            "fields": []
        },
        {
            "name": "UpdateConfig4GameReq",
            "syntax": "proto2",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "jsonConfigName",
                    "id": 1
                }
            ]
        },
        {
            "name": "UpdateConfig4GameRsp",
            "syntax": "proto2",
            "fields": []
        },
        {
            "name": "RegisterGate2GlobalReq",
            "syntax": "proto2",
            "fields": [
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "serverId",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "serverName",
                    "id": 2
                }
            ]
        },
        {
            "name": "RegisterGate2GlobalRsp",
            "syntax": "proto2",
            "fields": [
                {
                    "rule": "optional",
                    "type": "int32",
                    "name": "serverId",
                    "id": 1
                },
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "serverName",
                    "id": 2
                }
            ]
        },
        {
            "name": "KeepAlive4GlobalReq",
            "syntax": "proto2",
            "fields": []
        },
        {
            "name": "KeepAlive4GlobalRsp",
            "syntax": "proto2",
            "fields": []
        },
        {
            "name": "UpdateConfig4GlobalReq",
            "syntax": "proto2",
            "fields": [
                {
                    "rule": "optional",
                    "type": "string",
                    "name": "jsonConfigName",
                    "id": 1
                }
            ]
        },
        {
            "name": "UpdateConfig4GlobalRsp",
            "syntax": "proto2",
            "fields": []
        }
    ],
    "isNamespace": true
});
module.exports = _root;