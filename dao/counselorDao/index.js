let db = require('../../DB/db');
/**
 *author:qxx
 *description:获取指定辅导员登录密码
 *time:2018/12/3
 */
exports.getcounselorPassword = function (jobId,send) {
    let sql = `SELECT pwd FROM counselor WHERE jobId=${jobId}`;
    db.query(sql, [], function (results, fields) {
        try {
            send(results[0].pwd);
        } catch (err) {
            console.log(err);
            send(false);
        }
    })
}

exports.getcounselorByAccount = function (jobId,send) {
    let sql = `SELECT jobId,name,role FROM counselor WHERE jobId=${jobId}`;
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
 *description:录入辅导员信息持久层操作
 *time:2018/12/3
 */
exports.insertcounselorInfo = function (send,info) {
    let sql =`INSERT INTO counselor(jobId,name,pwd,collegeId) VALUES (${info.jobId},'${info.name}','${info.pwd}',${info.collegeId})`;
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
exports.deletecounselorInfo = function(send,jobId){
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
 *description:插入辅导员和班级关系的持久层操作
 *time:2018/12/4
 */
exports.insertContact = function (jobId,classId) {
    let sql=`INSERT INTO counselorclasscontact(classId,jobId) VALUES (${classId},${jobId})`;
    db.query(sql,[],function (results,fields) {
        try {
            return true;
        }catch (err) {
            console.log(err);
            return false;
        }
    })
}

/**
 *author:qxx
 *description:获取自己管理的班级的学生基本信息的持久层操作
 *time:2018/12/7
 */
exports.getClassAllStuInfo = function (send,jobId) {
    let sql=`SELECT * FROM (SELECT college.collegeName,class.className,student.studentId,student.name,student.sex,student.classId,student.collegeId FROM student,college,class WHERE student.collegeId=college.collegeId AND student.classId=class.classId) AS stu  WHERE stu.classId IN (SELECT counselorclasscontact.classId FROM counselorclasscontact WHERE jobId=${jobId}) `
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
    })
}

/**
 *author:qxx
 *description:审批不通过贫困生申请的持久层操作
 *time:2018/12/7
 */
exports.changeNotAgreePoorByCounselor = function (send,studentId) {
    let sql=`UPDATE poorstudentapply SET agree = -1 WHERE studentId=${studentId}`;
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
 *description:审批通过贫困生申请的持久层操作
 *time:2018/12/7
 */
exports.changeApplyForPoorByCounselor = function (send,studentId) {
    let sql=`UPDATE poorstudentapply SET agree = 1 WHERE studentId=${studentId}`;
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
 *description:查看自己管理的班级家庭经济困难学生的基本信息的持久层操作
 *time:2018/12/7
 */
exports.getPoorByCounselor = function (send,jobId) {
    let sql=`SELECT * FROM poorstudentapply WHERE classId IN (SELECT counselorclasscontact.classId FROM counselorclasscontact WHERE counselorclasscontact.jobId=${jobId})`;
    db.query(sql,[],function (results,fields) {
        try {
            results = {
                success:true,
                message:'获取所有贫困生信息成功',
                data:results
            }

        }catch(err){
            console.log(err);
            results = {
                success:false,
                message:'获取所有贫困生信息失败',
                data:null
            }
        }
        send(results);
    })
}

/**
 *author:qxx
 *description:查看自己管理的班级班委信息的持久层操作
 *time:2018/12/7
 */
exports.getClassCommitteeByCounselor = function (send,jobId) {
    let sql=`SELECT * FROM (SELECT college.collegeName,class.className,student.studentId,student.name,student.sex,student.classId,student.collegeId,student.position FROM student,college,class WHERE student.collegeId=college.collegeId AND student.classId=class.classId AND student.position!='') AS stu  WHERE stu.classId IN (SELECT counselorclasscontact.classId FROM counselorclasscontact WHERE jobId=${jobId}) `;
    db.query(sql,[],function (results,fields) {
        try {
            results = {
                success:true,
                message:'获取所有班委信息成功',
                data:results
            }

        }catch(err){
            console.log(err);
            results = {
                success:false,
                message:'获取所有班委信息失败',
                data:null
            }
        }
        send(results);
    })
}

/**
 *author:qxx
 *description:查看自己管理的班级的学生的违纪情况的持久层操作
 *time:2018/12/7
 */
exports.getViolationByCounselor = function (send,jobId) {
    let sql=`SELECT student.name,vio.* FROM student,(SELECT * FROM violation WHERE classId IN (SELECT counselorclasscontact.classId FROM counselorclasscontact WHERE counselorclasscontact.jobId=${jobId})) AS vio WHERE vio.studentId=student.studentId`
    db.query(sql,[],function (results,fields) {
        try {
            results = {
                success:true,
                message:'获取所有违纪信息成功',
                data:results
            }

        }catch(err){
            console.log(err);
            results = {
                success:false,
                message:'获取所有违纪信息失败',
                data:null
            }
        }
        send(results);
    })
}
/**
 *author:qxx
 *description:查看自己管理的班级的学生的获奖情况的的持久层操作
 *time:2018/12/7
 */
exports.getAwardByCounselor = function (send,jobId) {
    let sql=`SELECT student.name,award.* FROM student,(SELECT * FROM awardinformation WHERE classId IN (SELECT counselorclasscontact.classId FROM counselorclasscontact WHERE counselorclasscontact.jobId=${jobId})) AS award WHERE award.studentId=student.studentId`;
    db.query(sql,[],function (results,fields) {
        try {
            results = {
                success:true,
                message:'获取所有获奖信息成功',
                data:results
            }

        }catch(err){
            console.log(err);
            results = {
                success:false,
                message:'获取所有获奖信息失败',
                data:null
            }
        }
        send(results);
    })
}
