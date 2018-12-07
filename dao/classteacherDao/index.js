let db = require('../../DB/db');
/**
 *author:qxx
 *description:获取指定班主任登陆密码
 *time:2018/12/3
 */
exports.getclassTeacherPassword = function (jobId) {
    let sql = `SELECT pwd FROM classteacher WHERE jobId=${jobId}`;
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
 *description:录入班主任信息持久层操作
 *time:2018/12/3
 */
exports.insertclassteacherInfo = function (send,info) {
    let sql =`INSERT INTO classteacher(jobId,name,pwd,collegeId,classId) VALUES (${info.jobId},'${info.name}','${info.pwd}',${info.collegeId},${info.classId})`;
    db.query(sql,[],function (results,fields) {
        try{
            send(true);
        }catch(err){
            console.log(err);
            send(false);
        }
    })
}

/**
 *author:qxx
 *description:更新指定班主任信息持久层操作
 *time:2018/12/3
 */
exports.updateclasstecacherInfo = function (send,info) {
    let sql=`UPDATE counselor SET jobId=${info.jobId},name='${info.name}',pwd='${info.pwd}',collegeId=${info.collegeId},classId=${info.classId} WHERE jobId=${info.jobId}`;
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
 *description:删除指定班主任信息持久层操作
 *time:2018/12/3
 */
exports.deleteclassteacherInfo = function(send,jobId){
    let sql = `DELETE FROM classteacher WHERE jobId=${jobId}`;
    db.query(sql,[],function (results,fields) {
        try {
            send(true);
        }catch(err){
            console.log(err);
            send(false);
        }
    }
    )
}

/**
 *author:qxx
 *description:获取指定班主任信息持久化操作
 *time:2018/12/3
 */
exports.getSingleclassteacherInfo = function(send,jobId){
    let sql = `SELECT classteacher.*,class.* FROM classteacher,class WHERE classteacher.classId=class.classId AND classteacher.jobId=${jobId}`;
    db.query(sql,[],function (results,fields) {
            try {
                results = {
                    success:true,
                    message:'获取班主任信息成功',
                    data:results[0]
                }
            }catch(err){
                console.log(err);
                results = {
                    success:false,
                    message:'获取班主任信息失败',
                    data:null
                }
            }
            send(results);
        }
    )
}
/**
 *author:qxx
 *description:获取所有班主任信息持久层操作
 *time:2018/12/3
 */
exports.getAllclassteacherInfo = function(send){
    let sql = `SELECT classteacher.*,class.* FROM classteacher,class WHERE classteacher.classId=class.classId`;
    db.query(sql,[],function (results,fields) {
            try {
                results = {
                    success:true,
                    message:'获取所有班主任信息成功',
                    data:results
                }
            }catch(err){
                console.log(err);
                results = {
                    success:false,
                    message:'获取所有班主任信息失败',
                    data:null
                }
            }
            send(results);
        }
    )
}
