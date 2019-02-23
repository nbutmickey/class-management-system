/**
 *author:qxx
 *description:数据库连接、操作、释放以及相关异常处理
 *time:2018/12/2
 */
let mysql = require('mysql');
let databaseConfig = require('./config');

module.exports = {
    query:function (sql,params,callback) {
        let connection = mysql.createConnection(databaseConfig);
        connection.connect(function (err) {
            if(err){
                console.log("好惨啊，数据库连接失败了！");
                 throw err;
            }
            connection.query(sql,params,function (err,result,field) {
                if(err){
                    console.log("真遗憾，操作又出问题了！");
                    throw err;
                }
                callback&&callback(result,field);
                connection.end(function (err) {
                    if(err){
                        console.log("最后一步也不放过我，真惨，数据库关闭失败！");
                        throw err;
                    }
                })
            })
        })
    },
    queryByPromise:function (sql,params) {
        return new Promise((resolve, reject) =>{
            let connection = mysql.createConnection(databaseConfig);
            try {
            connection.connect(function (err) {
                if(err){
                    console.log("好惨啊，数据库连接失败了！");
                   throw err;
                }
                connection.query(sql,params,function (err,result) {
                    if(err){
                        throw err;
                    }
                    resolve(result);
                    connection.end(function (err) {
                        if(err){
                           throw err;
                        }
                    })
                })
            })
            }catch (e) {
                reject(e);
            }
        })
    }
}
