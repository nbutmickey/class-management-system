let db = require('../../DB/db');
/**
 *author:qxx
 *description:获取管理员的密码
 *time:2018/12/3
 */
exports.getAdminPassword = function (username) {
    let sql=`SELECT pwd FROM permission WHERE user=${username}`;
    db.query(sql,[],function (results,fields) {
        try {
            return results[0];
        }catch(err){
            console.log(err);
        }
    })
}


/**
 *author:qxx
 *description:管理员确认寝室申请
 *time:2018/12/3
 */
exports.changeApplyForBedRoomChief = function (studentId) {
    let sql=`UPDATE bedroomchiefapply SET agree = 1 WHERE studentId=${studentId}`;
    db.query(sql,[],function (results,fields) {
        try {
            // results = {
            //     success:true,
            //     message:'申请已处理！',
            //     data:null
            // }
            return true;
        }catch (err) {
            console.log(err);
            // results = {
            //     success:false,
            //     message:'申请处理发生了不可预知的错误！',
            //     data:null
            // }
            return false;
        }
    })
}

/**
 *author:qxx
 *description:获取所有申请寝室长的信息
 *time:2018/12/4
 */
exports.getAllApplyForBedRoomChief = function(send){
    let sql=`SELECT * FROM bedroomchiefapply WHERE agree=0`;
    let result;
    db.query(sql,[],function (results,fields) {
        try {
            result = {
                success:true,
                message:'拉取数据成功',
                data:results
            }
        }catch(err){
            console.log(err);
            result={
                success:false,
                message:'拉取数据出现了点问题',
                data:null
            }
        }
        send(result);
    })
}

/**
 *author:qxx
 *description:获取本校所有学院的信息
 *time:2018/12/3
 */
exports.getAllCollege = function (send) {
    let sql=`SELECT * FROM college`;
    db.query(sql,[],function (results,fields) {
        try {
            results = {
                success:true,
                message:'获取学院信息成功',
                data:results
            }
        }catch(err){
            console.log(err);
            results ={
                success:false,
                message:'获取信息失败',
                data:null
            }
            send(results);
        }
    })
}

