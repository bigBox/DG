const Database = {
    getData (tableName) {
        let dataModel = require(tableName);
        return dataModel;
    }

};

// module.default = new Database();
export default Database;


