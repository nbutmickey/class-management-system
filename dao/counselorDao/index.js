let db = require('../../DB/db');
/**
 *author:qxx
 *description:获取指定辅导员登录密码
 *time:2018/12/3
 */
exports.getcounselorPassword = function (jobId) {
    let sql = `SELECT pwd FROM counselor WHERE jobId=${jobId}`;
    db.query(sql, [], function (results, fields) {
        try {
            return results[0];
        } catch (err) {
            console.log(err);
        }
    })
}
/**
 *author:qxx
 *description:录入辅导员信息持久层操作
 *time:2018/12/3
 */
exports.insertcounselorInfo = function (info) {
    let sql =`INSERT INTO counselor(jobId,name,pwd,collegeId) VALUES (${info.jobId},'${info.name}','${info.pwd}',${info.collegeId})`;
    db.query(sql,[],function (results,fields) {
        try{
            // results= {
            //     success:true,
            //     message:'录入辅导员信息成功',
            //     data:null
            // }
            return true;
        }catch(err){
            console.log(err);
            // results = {
            //     success:false,
            //     message:'录入辅导员信息失败！',
            //     data:null
            // }
            return false;
        }
    })
}
/**
 *author:qxx
 *description:更新指定辅导员信息持久层操作
 *time:2018/12/3
 */
exports.updatecounselorInfo = function (send,info) {
    let sql=`UPDATE counselor SET jobId=${info.jobId},name='${info.name}',pwd='${info.pwd}',collegeId=${info.classId} WHERE jobId=${info.jobId}`;
    db.query(sql,[],function (results,fields) {
        try {
            send(true);
        }catch(err){
            console.log(err);
            send(false);
        }
    })
}
/**
 *author:qxx
 *description:删除指定辅导员信息持久层操作
 *time:2018/12/3
 */
exports.deleteclassteacherInfo = function(send,jobId){
    let sql = `DELETE FROM counselor WHERE jobId=${jobId}`;
    db.query(sql,[],function (results,fields) {
            try {
                return true;
            }catch(err){
                console.log(err);
                return false;
            }
        }
    )
}
/**
 *author:qxx
 *description:获取指定辅导员信息持久层操作
 *time:2018/12/3
 */
exports.getSinglecounselorInfo = function(send,jobId){
    let sql = `SELECT counselor.jobId,counselor.NAME,college.*,class.* FROM counselor,counselorclasscontact,class,college WHERE
	counselor.jobId = ${jobId} AND counselorclasscontact.classId = class.classId AND counselor.collegeId = college.collegeId`;
    db.query(sql,[],function (results,fields) {
            try {
                results = {
                    success:true,
                    message:'获取辅导员信息成功',
                    data:results
                }

            }catch(err){
                console.log(err);
                results = {
                    success:false,
                    message:'获取辅导员信息失败',
                    data:null
                }
            }
            send(results);
        }
    )
}

/**
 *author:qxx
 *description:获取所有辅导员信息持久层操作
 *time:2018/12/3
 */
exports.getAllcounselorInfo = function(send){
    let sql = `SELECT counselor.jobId,counselor.NAME,college.*,class.* FROM counselor,counselorclasscontact,class,college WHERE
	counselor.jobId = counselorclasscontact.jobId AND counselorclasscontact.classId = class.classId AND counselor.collegeId = college.collegeId ORDER BY counselor.jobId`;
    db.query(sql,[],function (results,fields) {
            try {
                results = {
                    success:true,
                    message:'获取所有辅导员信息成功',
                    data:results
                }

            }catch(err){
                console.log(err);
                results = {
                    success:false,
                    message:'获取所有辅导员信息失败',
                    data:null
                }
            }
            send(results);
        }
    )
}

/**
 *author:qxx
 *description:插入辅导员和班级关系的持久化操作
 *time:2018/12/4
 */
exports.insertContact = function (send,jobId,classId) {
    let sql=`INSERT INTO counselorclasscontact(classId,jobId) VALUES (${classId},${jobId})`;
    db.query(sql,[],function (results,fields) {
        try {
            send(true);
        }catch (err) {
            console.log(err);
            send(false);
        }
    })
}