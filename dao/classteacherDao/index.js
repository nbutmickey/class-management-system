let db = require('../../DB/db');
/**
 *author:qxx
 *description:获取指定班主任登陆密码
 *time:2018/12/3
 */
exports.getclassTeacherPassword = function (jobId,send) {
    let sql = `SELECT pwd FROM classteacher WHERE jobId=${jobId}`;
    db.query(sql, [], function (results, fields) {
        try {
            send(results[0].pwd);
        } catch (err) {
            console.log(err);
            send(false);
        }
    })
}

exports.getclassteacherByAccount = function (jobId,send) {
    let sql = `SELECT jobId,name,role FROM classteacher WHERE jobId=${jobId}`;
    db.query(sql, [], function (results, fields) {
        try {
            send(results[0]);
        } catch (err) {
            console.log(err);
            send(false);
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

/**
 *author:qxx
 *description:查看本班学生基本信息持久层操作
 *time:2018/12/9
 */
exports.getBasicClassInfo = function (send,jobId) {
    let sql=`SELECT student.studentId,student.name,student.sex,student.collegeId,student.classId,student.position,student.bedRoomId FROM student WHERE student.classId=(SELECT classteacher.classId FROM classteacher WHERE classteacher.jobId=${jobId})`;
    db.query(sql,[],function (results,fields) {
        try {
            results={
                success:true,
                message:'获取班级所有学生信息成功',
                data:results
            }
        }catch(err){
            console.log(err);
            results={
                success:false,
                message:'获取班级所有学生信息失败',
                data:results
            }
        }
        send(results);
    })
}

/**
 *author:qxx
 *description:设置班级团委头衔信息持久层操作
 *time:2018/12/9
 */
exports.setClassPosition = function (send,info) {
    let sql=`UPDATE student SET position='${info.position}' WHERE studentId=${info.studentId}`;
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
 *
 *description:查看本班家庭经济困难学生持久层操作
 *time:2018/12/9
 */
exports.getClassPoor = function (send,jobId) {
    let sql=`SELECT * FROM poorstudentapply WHERE poorstudentapply.agree=2 AND poorstudentapply.classId=(SELECT classteacher.classId FROM classteacher WHERE classteacher.jobId=${jobId})`;
    db.query(sql,[],function (results,fields) {
        try {
            results={
                success:true,
                message:'获取班级所有贫困生信息成功',
                data:results
            }
        }catch(err){
            console.log(err);
            results={
                success:false,
                message:'获取班级所有贫困生信息失败',
                data:results
            }
        }
        send(results)
    })
}
/**
 *author:qxx
 *description:查看本班学生住宿情况持久层操作
 *time:2018/12/9
 */

exports.getClassAccommodation = function (send,jobId) {
    let sql=`SELECT student.studentId,student.name,dormitory.*,dormitoryrecord.time,dormitoryrecord.mainContent FROM student,dormitoryrecord,dormitory WHERE student.classId=(SELECT classteacher.classId FROM classteacher WHERE classteacher.jobId=${jobId}) AND student.bedRoomId=dormitory.bedRoomId  AND dormitory.bedRoomId=dormitoryrecord.bedRoomId`;
    db.query(sql,[],function (results,fields) {
        try {
            results={
                success:true,
                message:'获取班级所有住宿信息成功',
                data:results
            }
        }catch(err){
            console.log(err);
            results={
                success:false,
                message:'获取班级所有住宿信息失败',
                data:results
            }
        }
        send(results)
    })
}

/**
 *author:qxx
 *description:填写本学期班主任工作计划持久层操作
 *time:2018/12/10
 */
exports.fillWorkPlan = function (send,info) {
    let sql=`INSERT INTO classteacherscheme(jobId,semester,content) VALUES(${info.jobId},'${info.semester}','${info.content}')`;
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
 *description:填写召开班会记录持久层操作
 *time:2018/12/10
 */
exports.fillMeetingRecord = function (send,info) {
    let sql=`INSERT INTO classmeetingrecord(jobId,time,addr,participateNumber,theme,mainContent) VALUES(${info.jobId},'${info.time}','${info.addr}','${info.participateNumber}','${info.theme}','${info.mainContent}')`;
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
 *description:填写下寝室记录持久层操作
 *time:2018/12/10
 */
exports.fillDormitoryRecord = function (send,info) {
    let sql=`INSERT INTO dormitoryrecord(jobId,time,bedRoomId,mainContent) VALUES(${info.jobId},'${info.time}',${info.bedRoomId},'${info.mainContent}')`;
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
 *description:填写学生谈话记录表持久层操作
 *time:2018/12/10
 */
exports.fillTalkRecord = function (send,info) {
    let sql=`INSERT INTO studenttalkrecord(jobId,studentId,time,addr,mainProblem,kpOfCounseling) VALUES(${info.jobId},${info.studentId},'${info.time}',${info.addr},'${info.mainProblem}','${info.kpOfCounseling}')`;
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
 *description:对突发事件进行记录持久层操作
 *time:2018/12/10
 */
exports.fillEmergenciesRecord = function (send,info) {
    let sql=`INSERT INTO emergencyrecord(jobId,time,mainContent,solve,result,studentName,addr) VALUES(${info.jobId},'${info.time}','${info.mainContent}',${info.solve},'${info.result}','${info.studentName}','${info.addr}')`;
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
 *description:查看本班学生获奖情况持久层操作
 *time:2018/12/10
 */
exports.getClassAwardInfo = function (send,jobId) {
    let sql=`SELECT student.name,awar.studentId,awar.awardTime,awar.awardName,awar.awardAgency FROM student,awardinformation AS awar WHERE awar.studentId=student.studentId AND awar.classId=(SELECT classteacher.classId FROM classteacher WHERE classteacher.jobId=${jobId})`;
    db.query(sql,[],function (results,fields) {
        try {
             results={
                 success:true,
                 message:'获取本班学生获奖信息成功！',
                 data:results
             }
        }catch(err){
            results={
                success:false,
                message:'获取本班学生获奖信息失败！',
                data:null
            }
        }
        send(results);
    })
}
/**
 *author:qxx
 *description:查看本班学生违纪情况持久层操作
 *time:2018/12/10
 */
exports.getClassViolationInfo = function (send,jobId) {
    let sql=`SELECT student.name,vio.studentId,vio.awardTime,vio.awardName FROM student,violation AS vio WHERE vio.studentId=student.studentId AND vio.classId=(SELECT classteacher.classId FROM classteacher WHERE classteacher.jobId=${jobId})`;
    db.query(sql,[],function (results,fields) {
        try {
            results={
                success:true,
                message:'获取本班学生违纪情况成功！',
                data:results
            }
        }catch (err) {
            results={
                success:false,
                message:'获取本班学生违纪情况失败！',
                data:results
            }
        }
        send(results);
    })
}

/**
 *author:qxx
 *description:填写寝室卫生情况持久层操作
 *time:2018/12/10
 */
exports.fillBedRoomHygieneInfo = function (send,info) {
    let sql=`INSERT INTO dormitory(hygieneSituation) VALUES('${info.hygieneinfo}') WHERE bedRoomId=${info.bedRoomId}`;
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
 *description:生成班主任手册持久层操作
 *time:2018/12/10
 */