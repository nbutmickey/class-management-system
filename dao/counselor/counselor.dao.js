let db = require('../../DB/db');



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
let getVioStuInfo=function(classId){
    let sql=`SELECT
            DISTINCT violation.studentId,
            student.name
        FROM
            student,
            violation
        WHERE	
            violation.classId=?
        AND 
          violation.studentId=student.studentId`;
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


let getStuViolationInfo=function(studentId){
    let sql=`SELECT
            violation.violationDegree,
            violation.violationContent,
            violation.violationTime
        FROM
            violation
        WHERE
            studentId = ${studentId}`;
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
    let classListSql=`SELECT
                        counselorclasscontact.classId,
                        class.className
                    FROM
                        counselorclasscontact,
                        class
                    WHERE	
                        class.classId=counselorclasscontact.classId
                    AND
                        counselorclasscontact.jobId = 2007010901`;
    let committeeInfoSql=`
                        SELECT
                                    *
                                FROM
                                    (
                                        SELECT
                                            college.collegeName,
                                            class.className,
                                            student.name,       
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
                                    stu.classId =?`;
    db.query(classListSql,[],function (classResults,fields) {
        let classCommitteeInfo=[];
        let row={
            collegeName:'',
            classId:'',
            className:'',
            monitor:'',
            communistParty:'',
            associateMonitor:'',
            study:'',
            life:'',
            discipline:'',
            propaganda:'',
            sport:'',
            organize:'',
            security:''
        }
        try {
            for(let i=0;i<classResults.length;i++){
                row.className=classResults[i].className;
                //console.log(classResults[i]);
                db.query(committeeInfoSql,[classResults[i].classId],function (committeeResult) {
                    if(committeeResult.length!==0) {
                        row.collegeName = committeeResult[0].collegeName;
                        for (let i = 0; i < committeeResult.length; i++) {
                            let position = committeeResult[i].position;
                            let stuName = committeeResult[i].name;
                            if (position === '班长') {
                                row.monitor = stuName;
                            } else if (position === '副班长') {
                                row.associateMonitor = stuName;
                            } else if (position === '团支书') {
                                row.communistParty = stuName;
                            } else if (position === '学习委员') {
                                row.study = stuName;
                            } else if (position === '生活委员') {
                                row.life = stuName;
                            } else if (position === '纪律委员') {
                                row.discipline = stuName;
                            } else if (position === '宣传委员') {
                                row.propaganda = stuName;
                            } else if (position === '组织委员') {
                                row.organize = stuName;
                            } else if (position === '体育委员') {
                                row.sport = stuName;
                            } else if (position === '治保委员') {
                                row.security = stuName;
                            }
                        }
                        classCommitteeInfo.push(row);
                    }
                })
                //console.log(classCommitteeInfo);
            }
            console.log(classCommitteeInfo);
            setTimeout(()=>{
                //console.log(classCommitteeInfo);
                send(classCommitteeInfo);
            },1000)
        }catch(err){
            console.log(err);
            let results='error'
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
    let vioInfoList=[];
    getClassInfo(jobId).then((classResult)=>{
        for(let i=0;i<classResult.length;i++){
            let vioInfoByClass={
                className:'',
                classId:'',
                stuInfo:[]
            }
            vioInfoByClass.classId=classResult[i].classId;
            vioInfoByClass.className=classResult[i].className;
            vioInfoList.push(vioInfoByClass);
        }

        //console.log(awardInfoList);
        for(let j=0;j<vioInfoList.length;j++){
            getVioStuInfo(vioInfoList[j].classId).then((stuResult)=>{
                //console.log(stuResult);
                for(let i=0;i<stuResult.length;i++){
                    vioInfoList[j].stuInfo.push({stuName:stuResult[i].name,stuId:stuResult[i].studentId,Info:[]})
                }
                for(let k=0;k<vioInfoList[j].stuInfo.length;k++){
                    getStuViolationInfo(vioInfoList[j].stuInfo[k].stuId).then((awardInfo)=>{
                        for(let i=0;i<awardInfo.length;i++){
                            vioInfoList[j].stuInfo[k].Info.push(awardInfo[i]);
                        }
                        //console.log(awardInfoList);
                        //allAwardInfo=awardInfoList
                    })
                }

            })
        }
        setTimeout(()=>{
            //console.log(awardInfoList)
            send(vioInfoList)
        },1000);
    },(err)=>{

    })
}

/**
 *author:qxx
 *description:查看自己管理的班级的学生的获奖情况的的持久层操作
 *time:2018/12/7
 */
exports.getAwardByCounselor = function (send,jobId) {
    //var allAwardInfo=[];
    let awardInfoList=[];
    getClassInfo(jobId).then((classResult)=>{
        for(let i=0;i<classResult.length;i++){
            let awardInfoByClass={
                className:'',
                classId:'',
                stuInfo:[]
            }
            awardInfoByClass.classId=classResult[i].classId;
            awardInfoByClass.className=classResult[i].className;
            awardInfoList.push(awardInfoByClass);
        }

        //console.log(awardInfoList);
        for(let j=0;j<awardInfoList.length;j++){
            getStuInfo(awardInfoList[j].classId).then((stuResult)=>{
                for(let i=0;i<stuResult.length;i++){
                    awardInfoList[j].stuInfo.push({stuName:stuResult[i].name,stuId:stuResult[i].studentId,Info:[]})
                }
                for(let k=0;k<awardInfoList[j].stuInfo.length;k++){
                    getStuAwardInfo(awardInfoList[j].stuInfo[k].stuId).then((awardInfo)=>{
                        for(let i=0;i<awardInfo.length;i++){
                            awardInfoList[j].stuInfo[k].Info.push(awardInfo[i]);
                        }
                        //console.log(awardInfoList);
                        //allAwardInfo=awardInfoList
                    })
                }

            })
        }
        setTimeout(()=>{
            //console.log(awardInfoList)
            send(awardInfoList)
        },1000);
    },(err)=>{

    })
    //console.log(awardInfoList);
}
