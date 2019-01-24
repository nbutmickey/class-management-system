let db = require('../../DB/db');

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

exports.getAllApplyForBedRoomChief = function(send){
    let sql=`SELECT * FROM bedroomchiefapply WHERE agree=0`;
    db.query(sql,[],function (results,fields) {
        try {
            send(results);
        }catch(err){
            console.log(err);
            results='error'
            send(results);
        }
    })
}

exports.getAllCollege = function (send) {
    let sql=`SELECT * FROM college`;
    db.query(sql,[],function (results,fields) {
        try {
            send(results);
        }catch(err){
            console.log(err);
            results='error'
            send(results);
        }
    })
}


exports.getAllClassById = function (send,collegeId) {
    let sql=`SELECT classId,className FROM class WHERE collegeId=${collegeId}`;
    db.query(sql,[],function (results,fields) {
        try {
            send(results);
        }catch(err){
            console.log(err);
            results='error'
            send(results);
        }
    })
}

exports.getAllBuildInfo=function (send) {
    let sql='SELECT build,bedRoomId,addr,hygieneSituation FROM dormitory ORDER BY build';
    db.query(sql,[],function (results) {
        try {
            send(results);
        }catch(err){
            console.log(err);
            results='error'
            send(results);
        }
    })
}

/**
 *author:qxx
 *description:根据楼号、宿舍号获取宿舍信息
 *time:2019/1/17
 */

exports.getBedroomDetailById=function (send,buildId,bedroomId) {
 let sql=`SELECT
        bedroomsituation.buildId,
        dormitory.addr,
        bedroomsituation.bedRoomId,
        bedroomsituation.studentId,
        bedroomsituation.bedRoomChief,
        student.name,
		class.className
    FROM
        student,
        bedroomsituation,
        dormitory,
		class
    WHERE
        bedroomsituation.studentId = student.studentId
    AND bedroomsituation.buildId=dormitory.build
    AND bedroomsituation.bedRoomId=dormitory.bedRoomId
		AND student.classId=class.classId
    AND bedroomsituation.bedRoomId = ${bedroomId}
    AND bedroomsituation.buildId = ${buildId};`;

    db.query(sql,[],function (results) {
         try {
             send(results);
         }catch(err){
             console.log(err);
             results='error'
             send(results);
         }
     })

}

exports.changeBedroomById=function (send,studentId,buildId,bedroomId) {
    let sql=`UPDATE bedroomsituation SET buildId=${buildId},bedRoomId=${bedroomId},bedRoomChief=0 WHERE studentId=${studentId};`;
    db.query(sql,[],function (results,fields) {
        try {
            send(true);
        }catch (err) {
            console.log(err);
            send(false);
        }
    })
}