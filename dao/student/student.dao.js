let db = require('../../DB/db');
exports.getStudentPassword = function (studentId,send) {
    let sql=`SELECT pwd FROM student WHERE studentId=${studentId}`;
    db.query(sql,[],function (results,fields) {
        try {
            send(results[0].pwd);
        }catch(err){
            console.log(err);
            send(false);
        }
    })
}

exports.getStudentByAccount = function(studentId,send){
    let sql=`SELECT studentId,name,role FROM student WHERE studentId=${studentId}`;
    db.query(sql,[],function (results) {
        try {
            send(results[0]);
        }catch (err) {
            console.log(err);
            send(results);
        }
    })
}

exports.getCountsByStudentId=function(send,studentId){
    let sql=`SELECT COUNT(*) AS count FROM student WHERE studentid=${studentId}`;
    db.query(sql,[],function (results) {
        try {
            if(results[0].count>=1){
                send(false);
            }else{
                send(true);
            }
        }catch(err){
            console.log(err);
            send(false);
        }
    })
}

exports.insertstudentInfo = function (send,info) {
    let sql =`INSERT INTO student(studentId,name,pwd,sex,collegeId,classId,birthplace,birthday,partySituation,contact,position,other,role) VALUES (${info.studentId},'${info.name}','${info.pwd}','${info.sex}',${info.collegeId},${info.classId},'${info.birthplace}','${info.birthday}','${info.partySituation}','${info.contact}','${info.position}','${info.other}','${info.role}')`;
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
exports.deletestudentInfo = function(send,studentId){
    let sql = `DELETE FROM student WHERE studentId=${studentId}`;
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
 *description:获取指定学生信息持久层操作
 *time:2018/12/3
 */
exports.getSinglestudentInfo = function(send,studentId){
    let sql = `SELECT * FROM student WHERE studentId=${studentId}`;
    db.query(sql,[],function (results,fields) {
            try {
                send(results);
            }catch(err){
                send(results=='error')
            }
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
            send(results);
        }catch(err){
            console.log(err);
            results='error'
            send(results)
        }
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
            results='error'
            send(results);
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
            send(true);
        }catch(err){
            console.log(err);
            send(false);
        }
    })
}

/**
 *author:qxx
 *description:贫困生申请添加持久层操作
 *time:2018/12/4
 */
exports.applyForPoor = function (send,info) {
    let sql=`INSERT INTO poorstudentapply(studentId,agree,degree,reason) VALUES(${info.studentId},1,'${info.degree}','${info.reason}')`;
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
    db.query(sql,[],function (results,fields) {
        try {
            send(true);
        }catch (err) {
            console.log(err);
            send(false)
        }
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
            send(true);
        }catch(err){
            console.log(err);
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
    let sql=`SELECT awardName,awardTime,awardAgency FROM awardinformation WHERE studentId=${studentId}`;
    db.query(sql,[],function (results,fields) {
        try {
            send(results);
        }catch(err){
            console.log(err);
            results='error'
            send(results)
        }
    })
}
/**
 *author:qxx
 *description:所有获奖信息展示持久层操作
 *time:2018/12/4
 */
exports.getAllAwardInfo = function (send) {
    let sql=`SELECT * FROM awardinformation`;
    db.query(sql,[],function (results,fields) {
        try {
            send(results);
        }catch(err){
            console.log(err);
            results='error'
            send(results)
        }
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
            send(true);
        }catch(err){
            console.log(err);
            send(false)
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
    db.query(sql,[],function (results,fields) {
        try {
            send(results);
        }catch(err){
            console.log(err);
            results='error'
            send(results)
        }
    })
}
/**
 *author:qxx
 *description:所有党团活动信息展示持久层操作
 *time:2018/12/4
 */
exports.getAllActivityInfo = function (send) {
    let sql=`SELECT * FROM activity`;
    db.query(sql,[],function (results,fields) {
        try {
            send(results);
        }catch(err){
            console.log(err);
            results='error'
            send(results)
        }
    })
}

/**
 *author:qxx
 *description:贫困生申请进度
 *time:2019/1/22
 */

exports.getPoorStudentStepById=function (send,studentId) {
    let sql=`SELECT agree FROM poorstudentapply WHERE studentId=${studentId}`;
    db.query(sql,[],function (results) {
        try {
            send(results[0].agree);
        }catch (e) {
            console.log(e);
            results='error';
            send(results);
        }
    })
}