let db = require('../../DB/db');

/**
 *author:qxx
 *description:
 *time:2019/1/27
 */
exports.getCountsByCounselorId=function(send,jobId){
    let sql=`SELECT COUNT(*) AS count FROM counselor WHERE jobId=${jobId}`;
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
/**
 *author:qxx
 *description:
 *time:2019/1/27
 */
exports.getcounselorByAccount = function (jobId,send) {
    let sql = `SELECT name FROM counselor WHERE jobId=${jobId}`;
    db.query(sql, [], function (results, fields) {
        try {
            send(results[0]);
        } catch (err) {
            console.log(err);
            results='error'
            send(results);
        }
    })
}
/**
 *author:qxx
 *description:录入辅导员信息持久层操作
 *time:2018/12/3
 */
exports.insertcounselorInfo = function (send,info) {
    let sql =`INSERT INTO counselor(jobId,name,collegeId) VALUES (${info.jobId},'${info.name}',${info.collegeId})`;
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
    let sql=`UPDATE counselor SET jobId=${info.jobId},name='${info.name}',collegeId=${info.classId} WHERE jobId=${info.jobId}`;
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
 *description:获取指定辅导员信息持久层操作
 *time:2018/12/3
 */
exports.getSinglecounselorInfo = function(send,jobId){
    let sql = `SELECT counselor.jobId,counselor.NAME,college.*,class.* FROM counselor,counselorclasscontact,class,college WHERE
	counselor.jobId = ${jobId} AND counselorclasscontact.classId = class.classId AND counselor.collegeId = college.collegeId`;
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
 *description:获取所有辅导员信息持久层操作
 *time:2018/12/3
 */
exports.getAllcounselorInfo = function(send,currentPage,pageSize){
    let sql = `SELECT counselor.jobId,counselor.NAME,college.*,class.* FROM counselor,counselorclasscontact,class,college LIMIT ${pageSize} OFFSET (${currentPage}-1)*${pageSize} WHERE
	counselor.jobId = counselorclasscontact.jobId AND counselorclasscontact.classId = class.classId AND counselor.collegeId = college.collegeId ORDER BY counselor.jobId`;
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
 *description:插入辅导员和班级关系的持久层操作
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

/**
 *author:qxx
 *description:获取自己管理的班级的学生基本信息的持久层操作
 *time:2018/12/7
 */
exports.getClassAllStuInfo = function (send,jobId,currentPage,pageSize) {
    let sql=`SELECT COUNT(*) FROM (
                    SELECT
                        student.classId
                    FROM
                        student,
                        college,
                        class,
                        bedroomsituation
                    WHERE
                        student.collegeId = college.collegeId
                    AND student.classId = class.classId
                    AND bedroomsituation.studentId=student.studentId
                ) AS stu WHERE
                stu.classId IN (
                    SELECT
                        counselorclasscontact.classId
                    FROM
                        counselorclasscontact
                    WHERE
                        jobId = ${jobId}
                );
               
            SELECT
                *
            FROM
                (
                    SELECT
                        college.collegeName,
                        class.className,
                        student.studentId,
                        student.name,
                        student.sex,
                        student.birthday,
                        student.birthplace,
                        student.contact,
                        student.position,
                        student.partySituation,	
                        student.classId,
                        student.collegeId,
                        bedroomsituation.buildId,
                        bedroomsituation.bedRoomId
                    FROM
                        student,
                        college,
                        class,
                        bedroomsituation
                    WHERE
                        student.collegeId = college.collegeId
                    AND student.classId = class.classId
                    AND bedroomsituation.studentId=student.studentId
                ) AS stu	
            WHERE
                stu.classId IN (
                    SELECT
                        counselorclasscontact.classId
                    FROM
                        counselorclasscontact
                    WHERE
                        jobId = ${jobId}
                )
            LIMIT ${pageSize} OFFSET ${(currentPage-1)*pageSize}`;
    db.query(sql,[],function (results,fields) {
        try {
            var result={};
            result.total= results[0][0]['COUNT(*)'];
            result.data=results[1];
            send(result);
        }catch(err){
            console.log(err);
            results='error'
            send(results)
        }
    })
}

exports.getStudentDetailById=function(send,studentId){
    let sql=``
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
exports.approveApplyForPoorByCounselor = function (send,studentId) {
    let sql=`UPDATE poorstudentapply SET agree = 3 WHERE studentId=${studentId}`;
    db.query(sql,[],function (results,fields) {
        try {
            send(true);
        }catch (err) {
            console.log(err);
            send(false);
        }
    })
}

exports.notApproveApplyForPoorByCounselor=function(send,studentId){
    let sql=`UPDATE poorstudentapply SET agree = -3 WHERE studentId=${studentId}`;
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
    let sql=`SELECT
            student.name,
            class.className,
            poorstudentapply.*
        FROM
            poorstudentapply,
            class,
            student
        WHERE
            poorstudentapply.classId = class.classId
        AND poorstudentapply.studentId = student.studentId
        AND poorstudentapply.agree=3
        AND poorstudentapply.classId IN (
            SELECT
                counselorclasscontact.classId
            FROM
                counselorclasscontact
            WHERE
                counselorclasscontact.jobId = ${jobId}
        )`;
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

exports.getApplyPoorByCounselor=function(send,jobId){
    let sql=`SELECT
            student.name,
            class.className,
            poorstudentapply.*
        FROM
            poorstudentapply,
            class,
            student
        WHERE
            poorstudentapply.classId = class.classId
        AND poorstudentapply.studentId = student.studentId
				AND poorstudentapply.agree=2
        AND poorstudentapply.classId IN (
            SELECT
                counselorclasscontact.classId
            FROM
                counselorclasscontact
            WHERE
                counselorclasscontact.jobId =${jobId}
        )`;
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
 *description:查看自己管理的班级班委信息的持久层操作
 *time:2018/12/7
 */
exports.getClassCommitteeByCounselor = function (send,jobId) {
    let sql=`SELECT
                *
            FROM
                (
                    SELECT
                        college.collegeName,
                        class.className,
                        student.studentId,
                        student.name,
                        student.sex,
                        student.classId,
                        student.collegeId,
                        student.position
                    FROM
                        student,
                        college,
                        class
                    WHERE
                        student.collegeId = college.collegeId
                    AND student.classId = class.classId
                    AND student.position != '无'
                    AND student.position != ''
                    AND student.position != 'undefined'
                ) AS stu 
            WHERE
                stu.classId IN (
                    SELECT
                        counselorclasscontact.classId
                    FROM
                        counselorclasscontact
                    WHERE
                        jobId = ${jobId}
                ) `;
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
 *description:查看自己管理的班级的学生的违纪情况的持久层操作
 *time:2018/12/7
 */
exports.getViolationByCounselor = function (send,jobId) {
    let sql=`SELECT
            vio.studentId,
            student.name,
            vio.violationDegree,
            vio.violationContent,
            vio.violationTime
        FROM
            student,
            (
                SELECT
                    *
                FROM
                    violation
                WHERE
                    classId IN (
                        SELECT
                            counselorclasscontact.classId
                        FROM
                            counselorclasscontact
                        WHERE
                            counselorclasscontact.jobId = ${jobId}
                    )
            ) AS vio
        
        WHERE
            vio.studentId = student.studentId`;
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


let getClassInfo=function(jobId){
    let sql=`SELECT
            counselorclasscontact.classId,
            class.className
        FROM
            counselorclasscontact,
            class
        WHERE	
            class.classId=counselorclasscontact.classId
        AND
            counselorclasscontact.jobId = ?`;
    return new Promise(function(resolve,reject){
        db.query(sql,[jobId],function (results,field) {
            try {
                resolve(results)
            }catch (err) {
                reject(err)
            }
        })
    })
}
let getStuInfo=function(classId){
    let sql=`SELECT
            DISTINCT awardinformation.studentId,
            student.name
        FROM
            student,
            awardinformation
        WHERE	
            awardinformation.classId=?
        AND 
          awardinformation.studentId=student.studentId`;
    return new Promise(function(resolve,reject){
        db.query(sql,[classId],function (results,field) {
            try {
                resolve(results)
            }catch (err) {
                reject(err)
            }
        })
    })
}
let getStuAwardInfo=function(studentId){
    let sql=`SELECT
            awardinformation.awardName,
            awardinformation.awardTime,
            awardinformation.awardAgency
        FROM
            awardinformation
        WHERE	
            awardinformation.studentId=?`;
    return  new Promise(function (resolve,reject) {
            db.query(sql,[studentId],function (results,field) {
                try {
                    resolve(results)
                }catch (err) {
                    reject(err)
                }
            })
        })
}

/**
 *author:qxx
 *description:查看自己管理的班级的学生的获奖情况的的持久层操作
 *time:2018/12/7
 */
exports.getAwardByCounselor = function (send,jobId) {
    let awardInfoList=[];
    //let classResult=await getClassInfo(jobId);
    getClassInfo(jobId).then(function (classResult) {
        for(let i=0;i<classResult.length;i++){
            getStuInfo(classResult[i].classId).then(function (stuResult) {
                let awardInfoByClass={
                    className:'',
                    stuInfo:[]
                };
                awardInfoByClass.className=classResult[i].className;
                if(stuResult.length!==0) {
                    for (let i = 0; i < stuResult.length; i++) {
                        let singleStuInfo = {
                            stuName: '',
                            awardInfo: []
                        }
                        singleStuInfo['stuName'] = stuResult[i].name;
                        getStuAwardInfo(stuResult[i].studentId).then(function (singleAwardInfo) {
                            for (let i = 0; i < singleAwardInfo.length; i++)
                                singleStuInfo['awardInfo'].push(singleAwardInfo[i]);
                            awardInfoByClass['stuInfo'].push(singleStuInfo);
                            //console.log(awardInfoByClass);
                            //send(awardInfoByClass);

                        }, function (error) {
                            console.log(error);
                            let results = 'error'
                            send(results)
                        })
                        //console.log(awardInfoByClass);
                    }

                }
                //console.log(awardInfoByClassz);
                awardInfoList.push(awardInfoByClass);
            },function (error) {
                console.log(error);
                let results='error'
                send(results)
            })

        }
        console.log(awardInfoList);
        send(awardInfoList);
    },function (error) {
        console.log(error);
        let results='error'
        send(results)
    })
}
