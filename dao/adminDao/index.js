let db = require('../../DB/db');
/**
 *author:qxx
 *description:获取管理员的密码
 *time:2018/12/3
 */
exports.getAdminPassword = function (username,send) {
    let sql=`SELECT pwd FROM permission WHERE user=${username}`;
    db.query(sql,[],function (results,fields) {
        try {
            send(results[0].pwd);
        }catch(err){
            console.log(err);
            send(false);
        }
    })
}

/**
 *author:qxx
 *description:管理员同意申请寝室长
 *time:2018/12/3
 */
exports.approvedBedRoomChief = function (send,studentId) {
    let sql=`UPDATE bedroomchiefapply SET agree = 1 WHERE studentId=${studentId}`;
    db.query(sql,[],function (results,fields) {
        try {
            send(true);
        }catch (err) {
            console.log(err);
            send(false);
        }
    })
}

/**
 *author:qxx
 *description:管理员不同意申请寝室长
 *time:2018/12/9
 */
exports.notApprovedBedRoomChief = function(send,studentId){
    let sql=`UPDATE bedroomchiefapply SET agree = -1 WHERE studentId=${studentId}`;
    db.query(sql,[],function (results,fields) {
        try {
            send(true);
        }catch (err) {
            console.log(err);
            send(false);
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
    var result;
    db.query(sql,[],function (results,fields) {
        try {
            result = {
                success:true,
                message:'获取学院信息成功',
                data:results
            }
        }catch(err){
            console.log(err);
            result ={
                success:false,
                message:'获取信息失败',
                data:null
            }
        }
        send(result);
    })
}



exports.getAllClass = function (send,collegeId) {
    let sql=`SELECT * FROM class WHERE collegeId=${collegeId}`;
    var result;
    db.query(sql,[],function (results,fields) {
        try {
            result = {
                success:true,
                message:'获取班级信息成功',
                data:results
            }
        }catch(err){
            console.log(err);
            result ={
                success:false,
                message:'获取班级信息失败',
                data:null
            }
        }
        send(result);
    })
}
