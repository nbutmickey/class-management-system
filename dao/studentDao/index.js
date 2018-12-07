let db = require('../../DB/db');
exports.getStudentPassword = function (studentId) {
    let sql=`SELECT pwd FROM student WHERE studentId=${studentId}`;
    db.query(sql,[],function (results,fields) {
        try {
            return results[0];
        }catch(err){
            console.log(err);
        }
    })
}


exports.insertstudentInfo = function (send,info) {
    let sql =`INSERT INTO student(studentId,name,pwd,sex,collegeId,classId) VALUES (${info.studentId},'${info.name}','${info.pwd}','${info.sex}'),${info.collegeId},${info.classId}))`;
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
 *description:更新指定学生信息持久层操作
 *time:2018/12/3
 */
exports.updatestudentInfo = function (send,info) {
    let sql=`UPDATE student SET studentId=${info.studentId},name='${info.name}',pwd='${info.pwd}',classId=${info.classId},collegeId=${info.collegeId} WHERE studentId=${info.studentId}`;
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
 *description:更新指定学生所有信息持久层操作
 *time:2018/12/5
 */
exports.updatestudentAllInfo = function (send,info) {
    let sql=`UPDATE student SET studentId=${info.studentId},name='${info.name}',pwd='${info.pwd}',sex='${info.sex}',classId=${info.classId},collegeId=${info.classId},bedRoomId=${info.bedRoomId},birthplace='${info.birthplace}',birthday='${info.birthday}',partySituation='${info.partySituation}',contact='${info.contact}',position='${info.position}',other='${info.other}' WHERE studentId=${info.studentId}`;
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
 *description:删除指定学生信息持久层操作
 *time:2018/12/3
 */
exports.deletestudentInfo = function(studentId){
    let sql = `DELETE FROM student WHERE studentId=${studentId}`;
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
 *description:获取指定学生持久层操作
 *time:2018/12/3
 */
exports.getSinglestudentInfo = function(send,studentId){
    let sql = `SELECT * FROM student WHERE studentId=${studentId}`;
    db.query(sql,[],function (results,fields) {
            try {
                results = {
                    success:true,
                    message:'获取学生信息成功',
                    data:results[0]
                }

            }catch(err){
                console.log(err);
                results = {
                    success:false,
                    message:'获取学生信息失败',
                    data:null
                }
            }
            send(results);
        }
    )
}
/**
 *author:qxx
 *description:获取所有学生信息持久层操作
 *time:2018/12/3
 */
exports.getAllstudentInfo = function(send){
    let sql = `SELECT * FROM student`;
    db.query(sql,[],function (results,fields) {
            try {
                results = {
                    success:true,
                    message:'获取所有学生信息成功',
                    data:results
                }
            }catch(err){
                console.log(err);
                results = {
                    success:false,
                    message:'获取所有学生信息失败',
                    data:null
                }
            }
        send(results);
        }
    )
}

/**
 *author:qxx
 *description:检索申请寝室长的人数持久层操作
 *time:2018/12/3
 */
exports.queryBedRoomChiefCount = function(send,bedRoomId) {
    let sql = `SELECT count(*)  AS count FROM bedroomchiefapply WHERE bedRoomId=${bedRoomId} AND agree=1`;
    db.query(sql,[],function (results,fields) {
        try {
            send(results[0].count)
        }catch(err){
            console.log(err);
        }
    })
}

/**
 *author:qxx
 *description:寝室长申请添加持久层操作
 *time:2018/12/3
 */
exports.applyForBedRoomChief = function (send,studentId,bedRoomId) {
    let sql=`INSERT INTO bedroomchiefapply(studentId,agree,bedRoomId) VALUES (${studentId},0,${bedRoomId})`;
    db.query(sql,[],function (results,fields) {
        try {
            results = {
                success:true,
                message:'申请已提交，等待管理员处理中。。。',
                data:null
            }
        }catch (err) {
            console.log(err);
            results = {
                success:false,
                message:'发生了不可预知的错误！',
                data:null
            }
        }
        send(results);
    })
}

/**
 *author:qxx
 *description:贫困生申请添加持久层操作
 *time:2018/12/4
 */
exports.applyForPoor = function (send,info) {
    let sql=`INSERT INTO poorstudentapply(studentId,agree,degree,reason) VALUES(${info.studentId},${info.agree},'${info.degree}','${info.reason}')`;
    db.query(sql,[],function (results,fields) {
        try {
            send(true)
        }catch (err) {
            console.log(err);
            send(false);
        }
    })
}

/**
 *author:qxx
 *description:所有贫困生申请信息展示持久层操作
 *time:2018/12/4
 */
exports.getAllPoorInfo = function (send) {
    let sql=`SELECT * FROM poorstudentapply`;
    let result;
    db.query(sql,[],function (results,fields) {
        try {
            result={
                success:true,
                message:'获取贫困生信息成功!',
                data:results
            }
        }catch (err) {
            console.log(err);
            result={
                success:false,
                message:'获取贫困生信息失败!',
                data:null
            }
        }
        send(result);
    })
}

/**
 *author:qxx
 *description:获奖信息添加持久层操作
 *time:2018/12/4
 */
exports.insertAwardInfo = function (send,info) {
    let sql=`INSERT INTO awardinformation(studentId,awardTime,awardName) VALUES(${info.studentId},'${info.awardTime}','${info.awardName}')`;
    db.query(sql,[],function (results,fields) {
        try {
            return true;
        }catch(err){
            send(false);
        }
    })
}

/**
 *author:qxx
 *description:指定学生的获奖信息展示持久层操作
 *time:2018/12/5
 */
exports.getSingleStuAwardInfo = function (send,studentId) {
    let sql=`SELECT * FROM awardinformation WHERE studentId=${studentId}`;
    let result;
    db.query(sql,[],function (results,fields) {
        try {
            result={
                success:true,
                message:'获取全部获奖信息成功!',
                data:results
            }
        }catch (err) {
            console.log(err);
            result={
                success:false,
                message:'获取全部获奖信息失败!',
                data:null
            }
        }
        send(result);
    })
}
/**
 *author:qxx
 *description:所有获奖信息展示持久层操作
 *time:2018/12/4
 */
exports.getAllAwardInfo = function (send) {
    let sql=`SELECT * FROM awardinformation`;
    let result;
    db.query(sql,[],function (results,fields) {
        try {
            result={
                success:true,
                message:'获取全部获奖信息成功!',
                data:results
            }
        }catch (err) {
            console.log(err);
            result={
                success:false,
                message:'获取全部获奖信息失败!',
                data:null
            }
        }
        send(result);
    })
}
/**
 *author:qxx
 *description:党团活动信息添加持久层操作
 *time:2018/12/4
 */

exports.insertActivityInfo = function (send,info) {
    let sql=`INSERT INTO activity(studentId,activityAddr,activityContent,activityTime) VALUES(${info.studentId},${info.activityAddr},${info.activityContent},${info.activityTime})`;
    db.query(sql,[],function (results,fields) {
        try {
            return true;
        }catch(err){
            console.log(true);
            let result ={
                success:false,
                message:'内部出现了一点问题！',
                data:null
            }
            send(result);
        }
    })
}

/**
 *author:qxx
 *description:指定学生的党团活动信息展示持久层操作
 *time:2018/12/5
 */
exports.getSingleStuActivityInfo = function (send,studentId) {
    let sql=`SELECT * FROM activity WHERE studentId=${studentId}`;
    let result;
    db.query(sql,[],function (results,fields) {
        try {
            result={
                success:true,
                message:'获取党团活动信息成功!',
                data:results
            }
        }catch (err) {
            console.log(err);
            result={
                success:false,
                message:'获取党团活动信息失败!',
                data:null
            }
        }
        send(result);
    })
}
/**
 *author:qxx
 *description:所有党团活动信息展示持久层操作
 *time:2018/12/4
 */
exports.getAllActivityInfo = function (send) {
    let sql=`SELECT * FROM activity`;
    let result;
    db.query(sql,[],function (results,fields) {
        try {
            result={
                success:true,
                message:'获取全部党团活动信息成功!',
                data:results
            }
        }catch (err) {
            console.log(err);
            result={
                success:false,
                message:'获取全部党团活动信息失败!',
                data:null
            }
        }
        send(result);
    })
}
