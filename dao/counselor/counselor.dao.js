let db = require('../../DB/db');

 let getClassInfo=async (jobId)=>{
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
    return new Promise(async(resolve,reject)=>{
        try {
            let classResult=await db.queryByPromise(sql,jobId);
            let parseReuslt=JSON.parse(JSON.stringify(classResult));
            resolve(parseReuslt);
        }catch (e) {
            reject(e);
        }
    })
}
let getStuInfo=async(classId)=>{
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
    return new Promise(async(resolve,reject)=>{
        //console.log(classId);
        try {
            let stuInfo=await db.queryByPromise(sql,classId);
            let parseReuslt=JSON.parse(JSON.stringify(stuInfo));
            resolve(parseReuslt);
        }catch (e) {
           reject(e);
        }
    })
}


let getStuAwardInfo=async(studentId)=>{
    let sql=`SELECT
            awardinformation.awardName,
            awardinformation.awardTime,
            awardinformation.awardAgency
        FROM
            awardinformation
        WHERE	
            awardinformation.studentId=?`;

    return  new Promise(async(resolve,reject)=> {
        try {
            let stuAwardList=await db.queryByPromise(sql,studentId);
            let parseReuslt=JSON.parse(JSON.stringify(stuAwardList));
            resolve(parseReuslt);
        }catch (e) {
            reject(e);
        }
    })
}

let getVioStuInfo=async(classId)=>{
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
    return new Promise(async(resolve,reject)=>{
        try {
            let stuInfo=await db.queryByPromise(sql,classId);
            let parseResult=JSON.parse(JSON.stringify(stuInfo));
            resolve(parseResult);
        }catch (e) {
            reject(e);
        }
    })
}

let getStuViolationInfo=async(studentId)=>{
    let sql=`SELECT
            violation.violationDegree,
            violation.violationContent,
            violation.violationTime
        FROM
            violation
        WHERE
            studentId = ${studentId}`;
    return  new Promise(async(resolve,reject)=> {
        try {
            let vioInfo=await db.queryByPromise(sql,studentId);
            let parseResult=JSON.parse(JSON.stringify(vioInfo));
            resolve(parseResult);
        }catch (e) {
            reject(e);
        }
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

let geCommitteeInfo=async(classId)=>{
    let sql=`
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
    return new Promise(async(resolve,reject)=>{
        try {
            let committeeInfo=await db.queryByPromise(sql,classId);
            let parseResult=JSON.parse(JSON.stringify(committeeInfo));
            let classCommittee=[];
            if(parseResult.length!==0){
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
                row.collegeName=parseResult[0].collegeName;
                for(let i=0;i<parseResult.length;i++){
                    let position = parseResult[i].position;
                    let stuName = parseResult[i].name;
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
                    classCommittee.push(row);
                }
            }
            resolve(classCommittee);
        }catch (e) {
            reject(e);
        }
    })
}

/**
 *author:qxx
 *description:查看自己管理的班级班委信息的持久层操作
 *time:2018/12/7
 */
exports.getClassCommitteeByCounselor = async (jobId)=> {
    try {
        let classInfo=await getClassInfo(jobId);
        for(let i=0;i<classInfo.length;i++){
            classInfo[i].classCommittee=[];
            let classComiitteeInfo=await geCommitteeInfo(classInfo[i].classId);
            if(classComiitteeInfo.length!==0){
                console.log(classComiitteeInfo);
                classComiitteeInfo.forEach(item=>{
                    classInfo[i].classCommittee.push(item);
                })
            }
        }
        resolve(classInfo);
    }catch (e) {

    }

}

/**
 *author:qxx
 *description:查看自己管理的班级的学生的违纪情况的持久层操作
 *time:2018/12/7
 */
exports.getViolationByCounselor = async(jobId)=>{
    return new Promise(async (resolve,reject)=>{
        try {
            let classInfo=await getClassInfo(jobId);
            for(let i=0;i<classInfo.length;i++){
                classInfo[i].stuInfo=[];
                let stuInfo=await getVioStuInfo(classInfo[i].classId);
                if(stuInfo.length!==0){
                    stuInfo.forEach(item=>{
                        classInfo[i].stuInfo.push(item);
                    })
                }
                if(classInfo[i].stuInfo.length!==0){
                    for(let j=0;j<stuInfo.length;j++){
                        let vioInfo=await getStuViolationInfo(stuInfo[j].studentId);
                        classInfo[i].stuInfo[j].Info=[];
                        for(let k=0;k<vioInfo.length;k++){
                            classInfo[i].stuInfo[j].Info.push(vioInfo[k]);
                        }
                    }
                }
            }
            resolve(classInfo);
        }catch (e) {
            reject(e);
        }
    })
}

/**
 *author:qxx
 *description:查看自己管理的班级的学生的获奖情况的的持久层操作
 *time:2018/12/7
 */
exports.getAwardByCounselor = async(jobId)=> {
    return new Promise(async(resolve,reject)=>{
        try {
            let classInfo=await getClassInfo(jobId);
            for(let i=0;i<classInfo.length;i++){
                classInfo[i].stuInfo=[];
                let stuInfo=await getStuInfo(classInfo[i].classId);
                if(stuInfo.length!==0){
                    stuInfo.forEach(item=>{
                        classInfo[i].stuInfo.push(item);
                    })
                }
                if(classInfo[i].stuInfo.length!==0){
                    console.log(classInfo[i].stuInfo);
                    for(let j=0;j<stuInfo.length;j++){
                        let awardInfo=await getStuAwardInfo(stuInfo[j].studentId);
                        classInfo[i].stuInfo[j].Info=[];
                        for(let k=0;k<awardInfo.length;k++){
                            classInfo[i].stuInfo[j].Info.push(awardInfo[k]);
                        }
                    }
                }
            }
            resolve(classInfo);
        }catch (e) {
            reject(e);
        }
    })

}
